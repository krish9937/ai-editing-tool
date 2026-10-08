"""Temporally-stable matting with Robust Video Matting (ONNX, CPU) + clean outline layer.
usage: python rvm_matte.py in.mp4 out_prefix [--w 1080 --h 1920 --outline 12 --glow 0]
writes out_prefix_cut.webm (VP9 RGBA cut-out) and out_prefix_outline.webm (white stroke only, RGBA)."""
import sys, subprocess, numpy as np, onnxruntime as ort, cv2, argparse, os
p=argparse.ArgumentParser(); p.add_argument('inp'); p.add_argument('out'); p.add_argument('--w',type=int,default=1080); p.add_argument('--h',type=int,default=1920)
p.add_argument('--outline',type=int,default=12); p.add_argument('--fps',default='30'); p.add_argument('--ffmpeg',default='ffmpeg')
a=p.parse_args(); W,H=a.w,a.h
sess=ort.InferenceSession(os.path.join(os.path.dirname(__file__),'rvm_mobilenetv3_fp32.onnx'),providers=['CPUExecutionProvider'])
rd=subprocess.Popen([a.ffmpeg,'-v','error','-i',a.inp,'-vf',f'scale={W}:{H}','-r',a.fps,'-f','rawvideo','-pix_fmt','rgb24','-'],stdout=subprocess.PIPE)
def wr(path): return subprocess.Popen([a.ffmpeg,'-v','error','-y','-f','rawvideo','-pix_fmt','rgba','-s',f'{W}x{H}','-r',a.fps,'-i','-',
  '-c:v','libvpx-vp9','-pix_fmt','yuva420p','-b:v','0','-crf','22','-deadline','realtime','-cpu-used','8','-row-mt','1',path],stdin=subprocess.PIPE)
wc=wr(a.out+'_cut.webm'); wo=wr(a.out+'_outline.webm')
rec=[np.zeros([1,1,1,1],np.float32)]*4; dr=np.array([0.25],np.float32)
k=cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(2*a.outline+1,2*a.outline+1)); prev=None; n=0
while True:
    buf=rd.stdout.read(W*H*3)
    if len(buf)<W*H*3: break
    img=np.frombuffer(buf,np.uint8).reshape(H,W,3)
    src=(img.astype(np.float32)/255).transpose(2,0,1)[None]
    fgr,pha,*rec=sess.run(None,{'src':src,'r1i':rec[0],'r2i':rec[1],'r3i':rec[2],'r4i':rec[3],'downsample_ratio':dr})
    al=pha[0,0]
    al=np.where(al<0.06,0,al)                       # kill faint ghosts (seatbelt/pillar haze)
    if prev is not None: al=0.65*al+0.35*prev        # extra temporal smoothing
    prev=al
    a8=(np.clip(al,0,1)*255).astype(np.uint8)
    # keep only the largest blob (the person) so stray patches don't get outlined
    _,bw=cv2.threshold(a8,128,255,cv2.THRESH_BINARY); nl,lab,st,_=cv2.connectedComponentsWithStats(bw)
    if nl>1:
        big=1+np.argmax(st[1:,cv2.CC_STAT_AREA]); keep=cv2.dilate((lab==big).astype(np.uint8)*255,np.ones((25,25),np.uint8)); a8=np.minimum(a8,keep)
    cut=np.dstack([img,a8]); wc.stdin.write(cut.tobytes())
    hard=cv2.GaussianBlur(a8,(5,5),0); dil=cv2.dilate(hard,k); dil=cv2.GaussianBlur(dil,(3,3),0)
    ring=np.clip(dil.astype(np.int16),0,255).astype(np.uint8)
    ol=np.dstack([np.full((H,W),255,np.uint8)]*3+[ring]); wo.stdin.write(ol.tobytes()); n+=1
for w in (wc,wo): w.stdin.close(); w.wait()
print('frames',n)

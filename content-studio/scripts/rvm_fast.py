"""Fast stable alpha matte: RVM at low res (pw x ph), alpha upscaled to W x H, grey H.264 out. Parallel-chunk friendly.
usage: python rvm_fast.py in.mp4 out_alpha.mp4 W H pw ph start_frame n_frames ffmpeg"""
import sys,subprocess,numpy as np,onnxruntime as ort,cv2,os,time
inp,out=sys.argv[1],sys.argv[2];W,H,pw,ph,st,nf=map(int,sys.argv[3:9]);ff=sys.argv[9]
s=ort.InferenceSession(os.path.join(os.path.dirname(__file__),'rvm_mobilenetv3_fp32.onnx'),providers=['CPUExecutionProvider'])
rd=subprocess.Popen([ff,'-v','error','-i',inp,'-vf',f"select='between(n,{st},{st+nf-1})',scale={pw}:{ph}",'-vsync','0','-f','rawvideo','-pix_fmt','rgb24','-'],stdout=subprocess.PIPE)
wr=subprocess.Popen([ff,'-v','error','-y','-f','rawvideo','-pix_fmt','gray','-s',f'{W}x{H}','-r','30','-i','-','-c:v','libx264','-preset','ultrafast','-crf','6','-pix_fmt','yuv420p',out],stdin=subprocess.PIPE)
rec=[np.zeros([1,1,1,1],np.float32)]*4;dr=np.array([0.4],np.float32);prev=None;n=0;t0=time.time()
while True:
    b=rd.stdout.read(pw*ph*3)
    if len(b)<pw*ph*3: break
    x=np.ascontiguousarray((np.frombuffer(b,np.uint8).reshape(ph,pw,3).astype(np.float32)/255).transpose(2,0,1)[None])
    o=s.run(None,{'src':x,'r1i':rec[0],'r2i':rec[1],'r3i':rec[2],'r4i':rec[3],'downsample_ratio':dr});rec=o[2:]
    al=o[1][0,0];al=np.where(al<0.05,0,al)
    if prev is not None: al=0.7*al+0.3*prev
    prev=al;a8=(np.clip(al,0,1)*255).astype(np.uint8)
    _,bw=cv2.threshold(a8,128,255,cv2.THRESH_BINARY);nl,lab,stt,_=cv2.connectedComponentsWithStats(bw)
    if nl>1:
        big=1+np.argmax(stt[1:,cv2.CC_STAT_AREA]);keep=cv2.dilate((lab==big).astype(np.uint8)*255,np.ones((7,7),np.uint8));a8=np.minimum(a8,keep)
    up=cv2.resize(a8,(W,H),interpolation=cv2.INTER_CUBIC)
    wr.stdin.write(up.tobytes());n+=1
wr.stdin.close();wr.wait();print('done',n,round((time.time()-t0)/max(n,1),3),'s/f')

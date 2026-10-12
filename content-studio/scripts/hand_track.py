"""Per-frame index-fingertip tracking + pointing-gesture detection (MediaPipe HandLandmarker, CPU).
usage: python hand_track.py in.mp4 out.json ffmpeg  -> [{t, hands:[{tip:[x,y], point:bool, dir:[dx,dy]}]}] in 1080x1920 coords"""
import sys,subprocess,json,numpy as np,mediapipe as mp
from mediapipe.tasks.python import vision, BaseOptions
inp,out,ff=sys.argv[1:4]; W,H=540,960; S=1080/W
det=vision.HandLandmarker.create_from_options(vision.HandLandmarkerOptions(base_options=BaseOptions(model_asset_path='D:/codes/work/_library/matting/hand_landmarker.task'),
    running_mode=vision.RunningMode.VIDEO,num_hands=2,min_hand_detection_confidence=0.4,min_tracking_confidence=0.4))
rd=subprocess.Popen([ff,'-v','error','-i',inp,'-vf',f'fps=30,scale={W}:{H}','-f','rawvideo','-pix_fmt','rgb24','-'],stdout=subprocess.PIPE)
res=[];i=0
def ext(lm,a,b):  # finger extended if tip farther from wrist than pip
    w=np.array([lm[0].x,lm[0].y]);return np.linalg.norm(np.array([lm[a].x,lm[a].y])-w)>np.linalg.norm(np.array([lm[b].x,lm[b].y])-w)*1.12
while True:
    buf=rd.stdout.read(W*H*3)
    if len(buf)<W*H*3: break
    img=np.frombuffer(buf,np.uint8).reshape(H,W,3)
    r=det.detect_for_video(mp.Image(image_format=mp.ImageFormat.SRGB,data=np.ascontiguousarray(img)),int(i*1000/30))
    hs=[]
    for lm in (r.hand_landmarks or []):
        idx=ext(lm,8,6); mid=ext(lm,12,10); ring=ext(lm,16,14)
        tip=[lm[8].x*W*S,lm[8].y*H*S]; d=[lm[8].x-lm[5].x,lm[8].y-lm[5].y]
        hs.append({'tip':[round(tip[0],1),round(tip[1],1)],'point':bool(idx and not mid and not ring),'dir':[round(d[0],3),round(d[1],3)]})
    res.append({'t':round(i/30,3),'h':hs});i+=1
json.dump(res,open(out,'w'));print('frames',i,'pointing frames',sum(any(h['point'] for h in f['h']) for f in res))

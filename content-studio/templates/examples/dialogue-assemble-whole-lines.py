# Dialogue track: every line placed WHOLE (no internal cuts, no tempo change). Line edges are found from the
# audio energy (so laughs/gasps/breaths around words stay), with soft 40 ms fades only at the edges.
import json,subprocess,numpy as np
F='D:/codes/work/bin/ffmpeg';SR=48000;V='vo/'
def load(f):
    return np.frombuffer(subprocess.run([F,'-v','error','-i',V+f+'.mp3','-af','highpass=f=70,acompressor=threshold=-20dB:ratio=2.5:attack=5:release=80,loudnorm=I=-16:TP=-1.5:LRA=11','-ac','1','-ar',str(SR),'-f','f32le','-'],capture_output=True).stdout,np.float32)
def words(f): return [[a,b,c.strip()] for a,b,c in json.load(open(V+f+'.json'))]
src={k:(load(f),words(f)) for k,f in {'narr':'narr','santa':'santa_c','mrs':'mrs_a','elf':'elf_a'}.items()}
def rms(x): h=int(0.01*SR); n=len(x)//h; return np.sqrt((x[:n*h].reshape(n,h)**2).mean(1))
def edges(x,a,b,lo,hi):
    r=rms(x); thr=0.012; run=15   # 150 ms of quiet = a real gap
    i=int(a*100)
    while i>max(0,int(lo*100)) and not (r[max(0,i-run):i]<thr).all(): i-=1
    j=int(b*100)
    while j<min(len(r)-run,int(hi*100)) and not (r[j:j+run]<thr).all(): j+=1
    return max(lo,i/100-0.03), min(hi,j/100+0.08)
def line(who,first,last,nth=0):
    W=src[who][1]; i=[k for k,w in enumerate(W) if w[2].startswith(first)][nth]; j=next(k for k in range(i,len(W)) if W[k][2].startswith(last))
    lo=W[i-1][1] if i>0 else 0; hi=W[j+1][0] if j+1<len(W) else len(src[who][0])/SR
    return who,W[i:j+1],lo,hi
L=[(0.1,line('narr','Every','gifts.')),(0.25,line('santa','Where','PlayStation')),(0.3,line('narr','And','Literally')),
   (0.35,line('narr','He','blimp')),(0.45,line('mrs','So','worked')),(1.0,line('santa','Yes','Yes')),(1.5,line('narr',"Don't",'Santa.')),
   (0.35,line('narr','With','reprinting')),(0.3,line('santa','The','clicks')),(0.25,line('elf','Two','Claus')),(0.45,line('narr','Know','linkutm.')),(0.35,line('santa','Ho','No.'))]
out=np.zeros(int(90*SR),np.float32);t=0;T=[]
for gap,(who,W,lo,hi) in L:
    x=src[who][0]; a,b=edges(x,W[0][0],W[-1][1],lo,hi)
    seg=x[int(a*SR):int(b*SR)].copy(); X=int(0.04*SR); seg[:X]*=np.linspace(0,1,X); seg[-X:]*=np.linspace(1,0,X)
    t+=gap; o=int(t*SR); out[o:o+len(seg)]+=seg
    for w in W: T.append([round(t+w[0]-a,2),round(t+w[1]-a,2),w[2],who])
    print(f'{who:6s} {t:6.2f}-{t+b-a:6.2f}  {" ".join(w[2] for w in W)[:60]}'); t+=b-a
t+=1.6; out=out[:int(t*SR)]
subprocess.run([F,'-v','error','-y','-f','f32le','-ar',str(SR),'-ac','1','-i','-','-c:a','pcm_s16le','vo.wav'],input=out.tobytes(),check=True)
json.dump({'dur':round(t,2),'words':T},open('timeline.json','w')); print('DUR',round(t,2))

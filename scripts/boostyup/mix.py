import json,subprocess,numpy as np,sys
S=sys.argv[1]; TL=json.load(open(f'{S}/proj/tl.json')); SR=48000
def rd(p):
    raw=subprocess.check_output(['ffmpeg','-v','error','-i',p,'-f','s16le','-ac','2','-ar',str(SR),'-'])
    return np.frombuffer(raw,np.int16).reshape(-1,2).astype(float)/32768
T=TL['total']; N=int(T*SR)
out=np.zeros((N,2)); voice=np.zeros(N)
def place(x,t0,g=1.0,track=None):
    i=int(t0*SR); j=min(N,i+len(x))
    if j<=i: return
    out[i:j]+=x[:j-i]*g
    if track is not None: track[i:j]+=np.abs(x[:j-i,0])*g
starts={l['i']:l['start'] for l in TL['lines']}
for i in (0,1,4,5): place(rd(f'{S}/vo/p{i}.wav'),starts[i],1.0,voice)
ban=rd(f'{S}/src/banner.mp4'); ban/=np.abs(ban).max(); place(ban,TL['B0'],0.95,voice)
# music ducked under voice
mus=rd(f'{S}/music.wav')[:N]
env=np.convolve(voice,np.ones(int(.12*SR))/(.12*SR),'same'); env=np.convolve((env>0.01).astype(float),np.ones(int(.25*SR))/(.25*SR),'same')
g=1-0.62*np.clip(env,0,1)
out[:len(mus)]+=mus*(0.62*g[:len(mus)])[:,None]
X=lambda n:rd(f'{S}/sfx/{n}.mp3')
sfx=[('impact',0.0,.55),('sparkle',0.03,.45)]
sfx+=[('pop',p,.42) for p in [0.318,0.553,0.787,1.021,1.256,1.49]]
sfx+=[('whoosh',3.22,.55),('impact',3.58,.5),('sparkle',3.62,.3)]
sfx+=[('whoosh',TL['C0']-0.22,.45)]
for k,c in enumerate(TL['cards']): sfx+=[('swoosh2',c-0.03,.5),('sparkle',c+0.04,.32)]
sfx+=[('whoosh',TL['CH0']-0.2,.45),('tap',TL['TAP']-0.02,.7),('coin',TL['TAP']+0.02,.35)]
sfx+=[('whoosh',TL['F0']-0.3,.5),('impact',TL['F0']-0.02,.65),('sparkle',TL['F0']+0.1,.4),('coin',TL['F0']+0.6,.3)]
for n,t0,gn in sfx: place(X(n),t0,gn)
fade=np.clip((T-np.arange(N)/SR)/0.4,0,1); out*=fade[:,None]
out/=np.abs(out).max()/0.95
import wave
w=wave.open(f'{S}/mix.wav','wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((out*32767).astype(np.int16).tobytes());w.close()
print('mixed',T)

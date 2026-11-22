"""Composite 3D renders (12fps 540x960) into final 1080x1920 30fps with overlays + audio."""
import json,math,subprocess,os,wave
import numpy as np
from PIL import Image,ImageDraw,ImageFont,ImageFilter
D='trou'; W,H,FPS=1080,1920,30; SR=48000
TL=json.load(open(f'{D}/tl.json')); S=TL['S']; T=TL['T']; st=TL['starts']; FR=TL['frames']
FONT='/usr/share/fonts/opentype/inter/'
def F(sz,w='Black'): return ImageFont.truetype(FONT+f'Inter-{w}.otf',sz)
def ease(x): x=min(max(x,0),1); return x*x*(3-2*x)
FILES={i:sorted(os.listdir(f'{D}/r{i}')) for i in range(8)}
CACHE={}
def src(i,lt):
    p=lt*12; a=int(p); b=min(a+1,len(FILES[i])-1); a=min(a,len(FILES[i])-1); w=p-int(p)
    def ld(k):
        key=(i,k)
        if key not in CACHE:
            if len(CACHE)>40: CACHE.clear()
            CACHE[key]=np.asarray(Image.open(f'{D}/r{i}/{FILES[i][k]}').convert('RGB').resize((W,H),Image.BICUBIC),np.float32)
        return CACHE[key]
    return ld(a)*(1-w)+ld(b)*w if b!=a else ld(a)
def txt(d,xy,s,size,fill,stroke=7,w='Black'):
    d.text(xy,s,font=F(size,w),fill=fill,anchor='mm',stroke_width=stroke,stroke_fill=(0,0,0))
def frame(t):
    i=0
    for k in range(8):
        if t>=S[k]: i=k
    lt=t-S[i]
    a=src(i,lt)
    yy,xx=np.mgrid[0:H,0:W]
    img=Image.fromarray(a.clip(0,255).astype(np.uint8)).convert('RGBA'); d=ImageDraw.Draw(img)
    if i in (0,1):
        sc=min(1,0.6+t*3)
        txt(d,(540,250),'ET SI TU SAUTAIS',int(92*sc),(255,255,255)); txt(d,(540,370),'DANS CE TROU ?',int(110*sc),(255,214,90))
    if i==1:
        s=ease(lt/0.15)*(1+0.05*math.sin(lt*14))
        if s>0.05:
            w,h=600*s,140*s; y=1520
            d.rounded_rectangle((540-w/2,y-h/2,540+w/2,y+h/2),radius=int(70*s),fill=(254,44,85)); d.text((540,y),'+ Abonne-toi',font=F(max(1,int(70*s))),fill=(255,255,255),anchor='mm')
    badge={3:('+5 000 °C','LE NOYAU'),4:('38 MIN','DE CHUTE'),5:('OCÉAN','PACIFIQUE')}
    if i in badge:
        s=min(1,0.6+lt*3); a1,a2=badge[i]
        txt(d,(540,300),a1,int(150*s),(255,214,90),8); txt(d,(540,440),a2,int(64*s),(255,255,255),5,'ExtraBold')
    if i==6: txt(d,(540,330),'POUR TOUJOURS',int(min(1,0.6+lt*3)*100),(255,255,255),7)
    if i==7:
        txt(d,(540,330),'TOI,',100,(255,255,255)); txt(d,(540,460),'TU SAUTERAIS ?',100,(255,214,90))
        if lt>0.6:
            y=1550+8*math.sin(lt*7); d.rounded_rectangle((240,y-65,840,y+65),radius=65,fill=(254,44,85)); d.text((540,y),'Commente !',font=F(66),fill=(255,255,255),anchor='mm')
    if t<T-3:
        d.rounded_rectangle((40,60,260,130),radius=20,fill=(0,0,0,150)); d.text((150,95),'ET SI…',font=F(40),fill=(255,214,90),anchor='mm')
    out=np.asarray(img.convert('RGB'),np.float32)
    for k in range(1,8):
        dt=t-S[k]
        if -0.06<dt<0.06: out=out*(0.6+0.4*abs(dt)/0.06)
    if t<0.1: out=out*(t/0.1)
    if t>T-0.4: out=out*max(0,(T-t)/0.4)
    return out.clip(0,255).astype(np.uint8)
# audio: voice + light sfx
N=int(T*SR); mix=np.zeros(N)
for i,s in enumerate(st):
    raw=subprocess.run(['ffmpeg','-v','error','-i',f'{D}/vo/l{i:02d}.mp3','-ac','1','-ar',str(SR),'-f','f32le','-'],capture_output=True).stdout
    x=np.frombuffer(raw,np.float32); j=int(s*SR); k=min(N,j+len(x)); mix[j:k]+=x[:k-j]
rng=np.random.default_rng(2); fx=np.zeros(N)
def place(x,t0,g=1):
    i=max(0,int(t0*SR)); j=min(N,i+len(x)); fx[i:j]+=x[:j-i]*g
wind=np.convolve(rng.normal(0,1,int((S[4]-S[2])*SR)),np.ones(200)/200,'same')
wind*=np.linspace(0.3,1,len(wind)); place(wind,S[2],1.5)
n=int(1.5*SR); tn=np.arange(n)/SR
place(np.sin(2*np.pi*np.cumsum(60+300*np.exp(-tn*3))/SR)*np.exp(-tn*2)*0.8,S[2])
rum=np.convolve(rng.normal(0,1,int((S[4]-S[3])*SR)),np.ones(800)/800,'same')*3; place(rum,S[3])
sp=np.convolve(rng.normal(0,1,int(1.2*SR)),np.ones(20)/20,'same')*np.exp(-np.arange(int(1.2*SR))/SR*3); place(sp,S[5]+0.3,1.2)
mix=mix/np.max(np.abs(mix))*0.95; fx=fx/max(1e-6,np.max(np.abs(fx)))*0.3
o=mix+fx; o=o/np.max(np.abs(o))*0.9; stt=np.stack([o,o],1)
with wave.open(f'{D}/final.wav','wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((stt*32767).astype(np.int16).tobytes())
ff=subprocess.Popen(['ffmpeg','-y','-v','error','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-','-i',f'{D}/final.wav','-af','loudnorm=I=-14:TP=-1',
  '-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-movflags','+faststart','-shortest','/home/user/Cars/et_si_trou_terre_3d.mp4'],stdin=subprocess.PIPE)
for n_ in range(int(T*FPS)):
    ff.stdin.write(frame(n_/FPS).tobytes())
ff.stdin.close(); ff.wait(); print('COMP DONE')

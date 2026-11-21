"""Animate AI stills into an episode. usage: anim_ep.py <dir> [preview t,...]"""
import json,sys,math,subprocess
import numpy as np
from PIL import Image,ImageDraw,ImageFilter,ImageFont
D=sys.argv[1]; W,H,FPS=1080,1920,30
TL=json.load(open(f'{D}/tl.json')); L=TL['lines']; T=TL['total']
S=[l['start'] for l in L]+[T]
FONT='/usr/share/fonts/opentype/inter/'
def F(sz,w='Black'): return ImageFont.truetype(FONT+f'Inter-{w}.otf',sz)
def ease(x): x=min(max(x,0),1); return x*x*(3-2*x)
IM={k:Image.open(f'{D}/img/{k}.png').convert('RGB').resize((int(W*1.25),int(H*1.25)),Image.LANCZOS) for k in range(1,7)}
import os
CLIP={0:(1,0.2),1:(2,3.0),2:(3,0.6)}   # scene -> (clip folder, start offset s)
CF={c:sorted(os.listdir(f'{D}/cf{c}')) for c,_ in CLIP.values()}
def clipframe(i,lt):
    c,off=CLIP[i]; fs=CF[c]; n=min(len(fs)-1,int((off+lt)*30))
    return Image.open(f'{D}/cf{c}/{fs[n]}').convert('RGB')
rng=np.random.default_rng(3)
EMB=[(rng.uniform(0,W),rng.uniform(0,H),rng.uniform(2,6),rng.uniform(80,220)) for _ in range(70)]
# scene -> (image, zoom0, zoom1, cx0,cy0, cx1,cy1)  (centers in 0..1 of image)
SC={0:(1,1.0,1.06,0.5,0.5,0.5,0.52), 1:(2,1.0,1.15,0.5,0.6,0.5,0.62), 2:(3,1.12,1.0,0.35,0.45,0.45,0.5),
    3:(4,1.0,1.14,0.55,0.55,0.6,0.5), 4:(5,1.15,1.0,0.5,0.62,0.5,0.6), 5:(6,1.0,1.08,0.5,0.5,0.48,0.47), 6:(6,1.08,1.12,0.48,0.47,0.48,0.45)}
def view(k,p,z0,z1,c0,c1,shake=(0,0)):
    im=IM[k]; Wi,Hi=im.size; e=p*p*(3-2*p)*0.6+p*0.4
    z=z0+(z1-z0)*e; cw=Wi/1.25/z*1.0; ch=Hi/1.25/z
    cx=(c0[0]+(c1[0]-c0[0])*e)*Wi+shake[0]; cy=(c0[1]+(c1[1]-c0[1])*e)*Hi+shake[1]
    cx=min(max(cx,cw/2),Wi-cw/2); cy=min(max(cy,ch/2),Hi-ch/2)
    return im.resize((W,H),Image.BICUBIC,box=(cx-cw/2,cy-ch/2,cx+cw/2,cy+ch/2))
def sparkle(d,x,y,r,a):
    d.line((x-r,y,x+r,y),fill=(255,255,255,a),width=4); d.line((x,y-r,x,y+r),fill=(255,255,255,a),width=4)
    d.line((x-r*0.5,y-r*0.5,x+r*0.5,y+r*0.5),fill=(255,255,255,a//2),width=2); d.line((x-r*0.5,y+r*0.5,x+r*0.5,y-r*0.5),fill=(255,255,255,a//2),width=2)
def frame(t):
    i=0
    for k in range(len(L)):
        if t>=S[k]-0.1: i=k
    lt=t-S[i]; dur=S[i+1]-S[i]; p=min(1,max(0,lt/max(dur,0.1)))
    k,z0,z1,cx0,cy0,cx1,cy1=SC[i]
    sh=(0,0)
    if i>=5: sh=(math.sin(t*37)*6,math.cos(t*29)*6)
    img=clipframe(i,lt) if i in CLIP else view(k,p,z0,z1,(cx0,cy0),(cx1,cy1),sh)
    a=np.asarray(img,np.float32)
    if i==3:   # fire flicker
        fl=0.92+0.08*math.sin(t*23)+0.05*math.sin(t*41); a=a*np.array([fl*1.04,fl,fl*0.94])
    if i==2 or i>=5:
        yy,xx=np.mgrid[0:H,0:W]; r=np.sqrt(((xx-W/2)/(W*0.62))**2+((yy-H/2)/(H*0.6))**2)
        a=a*np.clip(1-0.6*np.clip(r-0.5,0,1),0,1)[...,None]
    img=Image.fromarray(a.clip(0,255).astype(np.uint8)).convert('RGBA'); d=ImageDraw.Draw(img)
    if i==1 and False:
        for j in range(5):
            ph=(t*1.6+j*0.37)%1; sparkle(d,520+math.cos(j*2.1)*90,880+math.sin(j*1.7)*70,10+40*math.sin(ph*math.pi),int(255*math.sin(ph*math.pi)))
    if i==1:
        s=ease(lt/0.15)*(1+0.05*math.sin(lt*14))
        if s>0.05:
            w,h=600*s,140*s; y=1540
            d.rounded_rectangle((540-w/2,y-h/2,540+w/2,y+h/2),radius=int(70*s),fill=(254,44,85))
            d.text((540,y),'+ Abonne-toi',font=F(max(1,int(70*s))),fill=(255,255,255),anchor='mm')
    if i==0 and False:
        ph=(t*1.3)%1; sparkle(d,485,940,8+30*math.sin(ph*math.pi),int(230*math.sin(ph*math.pi)))
    if i in (3,4):
        for (ex,ey,er,es) in EMB:
            y=(ey-t*es)%H; x=ex+math.sin(t*2+ex)*20
            d.ellipse((x-er,y-er,x+er,y+er),fill=(255,170,60,170))
    if i==6:
        sc=ease(lt/0.3)
        if sc>0.05:
            d.text((540,260),'PARTIE 2',font=F(int(160*sc)),fill=(255,214,90),anchor='mm',stroke_width=8,stroke_fill=(0,0,0))
            d.text((540,390),'bientôt…',font=F(int(64*sc),'ExtraBold'),fill=(255,255,255),anchor='mm',stroke_width=5,stroke_fill=(0,0,0))
    if t<T-2.5:
        d.rounded_rectangle((40,60,330,130),radius=20,fill=(0,0,0,150)); d.text((185,95),'ÉPISODE 1',font=F(40),fill=(255,214,90),anchor='mm')
    a=np.asarray(img.convert('RGB'),np.float32)
    if i in (3,5):   # white flash on dramatic cuts
        if lt<0.12: a=a*(1-(1-lt/0.12)*0.7)+255*(1-lt/0.12)*0.7
    for kk in range(1,len(L)):
        dt=t-S[kk]
        if -0.07<dt<0.07 and kk not in (3,5): a=a*(0.55+0.45*abs(dt)/0.07)
    if t<0.1: a=a*(t/0.1)
    if t>T-0.5: a=a*max(0,(T-t)/0.5)
    return a.clip(0,255).astype(np.uint8)
if len(sys.argv)>2 and sys.argv[2]=='preview':
    ts=[float(x) for x in sys.argv[3].split(',')]
    tiles=[Image.fromarray(frame(t)).resize((270,480)) for t in ts]
    sh=Image.new('RGB',(270*min(8,len(tiles)),480*math.ceil(len(tiles)/8)))
    for k,tl in enumerate(tiles): sh.paste(tl,((k%8)*270,(k//8)*480))
    sh.save(f'{D}/preview.jpg',quality=88); sys.exit()
N=int(T*FPS)
ff=subprocess.Popen(['ffmpeg','-y','-v','error','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-','-c:v','libx264','-preset','medium','-crf','16','-pix_fmt','yuv420p',f'{D}/video.mp4'],stdin=subprocess.PIPE)
for n in range(N):
    ff.stdin.write(frame(n/FPS).tobytes())
    if n%150==0: print(n,N,flush=True)
ff.stdin.close(); ff.wait()

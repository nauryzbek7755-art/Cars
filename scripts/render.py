import json,sys,os,glob,math,subprocess
import numpy as np
from PIL import Image, ImageFilter
S=sys.argv[1]; MODE=sys.argv[2] if len(sys.argv)>2 else 'full'
W,H,FPS=1080,1920,30
TL=json.load(open(f'{S}/timeline.json'))
# per-image camera: cx0,cx1 (0..1 of image width), cy, z0,z1 (zoom: 1 = full image height)
CAM={
'070':(0.50,0.52,0.52,1.00,1.18),'082':(0.47,0.53,0.55,1.15,1.00),'164':(0.50,0.50,0.50,1.00,1.25),
'008':(0.50,0.50,0.50,1.10,1.00),'037':(0.50,0.56,0.55,1.05,1.20),'040':(0.47,0.52,0.55,1.10,1.25),
'083':(0.45,0.52,0.60,1.00,1.15),'006':(0.22,0.62,0.64,1.65,1.65),'019':(0.47,0.53,0.50,1.00,1.20),
'013':(0.50,0.50,0.50,1.20,1.00),'024':(0.42,0.50,0.50,1.00,1.15),'014':(0.50,0.50,0.55,1.00,1.25),
'056':(0.30,0.52,0.60,1.45,1.45),'149':(0.48,0.66,0.62,1.35,1.35),'071':(0.55,0.68,0.55,1.05,1.20),
'069':(0.38,0.46,0.58,1.70,1.90),'085':(0.48,0.53,0.55,1.00,1.20),'051':(0.45,0.58,0.62,1.20,1.30),
'050':(0.55,0.48,0.55,1.15,1.05),'089':(0.50,0.52,0.52,1.00,1.15),'101':(0.40,0.48,0.50,1.00,1.15),
'043':(0.45,0.55,0.50,1.10,1.00),'133':(0.50,0.50,0.55,1.00,1.15),'148':(0.42,0.50,0.52,1.10,1.25),
'134':(0.50,0.50,0.55,1.20,1.05),
'V:mul':(0.50,0.50,0.50,1.05,1.12),'V:gsfront':(0.52,0.52,0.50,1.00,1.08),'V:gseng':(0.50,0.50,0.45,1.00,1.10),
'V:gsrad':(0.48,0.48,0.50,1.00,1.08),'V:gsside':(0.50,0.50,0.50,1.00,1.06),'108':(0.42,0.50,0.52,1.00,1.20),
}
def grade(a):
    a=a.astype(np.float32)/255.0
    L=(0.2126*a[...,0]+0.7152*a[...,1]+0.0722*a[...,2])[...,None]
    a=L+(a-L)*0.88                                   # slight desaturation
    a=np.clip(a,0,1); a=a*(1-0.35)+0.35*(a*a*(3-2*a))  # S-curve
    L=(0.2126*a[...,0]+0.7152*a[...,1]+0.0722*a[...,2])[...,None]
    sh=(1-L)**2; hi=L**2
    a=a+sh*np.array([-0.035,0.005,0.03],np.float32)+hi*np.array([0.035,0.012,-0.03],np.float32)  # teal shadows / warm highlights
    a=0.018+a*0.972                                   # filmic matte blacks
    return np.clip(a,0,1)
cache={}
def src(img,fi=0):
    if img.startswith('V:'):
        fs=sorted(glob.glob(f'{S}/vf/{img[2:]}/*.jpg')); f=fs[min(max(fi,0),len(fs)-1)]
        if f not in cache:
            if len(cache)>400: cache.clear()
            im=Image.open(f).convert('RGB'); sc=1600/im.height
            im=im.resize((int(im.width*sc),1600),Image.LANCZOS)
            cache[f]=Image.fromarray((grade(np.asarray(im))*255+0.5).astype(np.uint8))
        return cache[f]
    if img not in cache:
        f=f'{S}/hi/{img}.jpg'
        im=Image.open(f).convert('RGB')
        try:
            from PIL import ImageOps; im=ImageOps.exif_transpose(im)
        except Exception: pass
        sc=2600/im.height; im=im.resize((max(1,int(im.width*sc)),2600),Image.LANCZOS)
        cache[img]=Image.fromarray((grade(np.asarray(im))*255+0.5).astype(np.uint8))
    return cache[img]
def ease(x): return x*x*(3-2*x)
def frame_of(img,p,shake=(0,0),fi=0):
    im=src(img,fi); Ws,Hs=im.size
    cx0,cx1,cy,z0,z1=CAM[img]; e=ease(p)*0.7+p*0.3
    z=z0+(z1-z0)*e; h=Hs/z; w=h*W/H
    if w>Ws: w=Ws; h=w*H/W
    cx=(cx0+(cx1-cx0)*e)*Ws; cyy=cy*Hs
    cx=min(max(cx,w/2),Ws-w/2); cyy=min(max(cyy,h/2),Hs-h/2)
    cx+=shake[0]*w/W; cyy+=shake[1]*h/H
    box=(cx-w/2,cyy-h/2,cx+w/2,cyy+h/2)
    return np.asarray(im.transform((W,H),Image.EXTENT,box,Image.BICUBIC),dtype=np.float32)/255.0
shots=TL['shots']
if MODE=='preview':
    tiles=[]
    for s in shots[:-1]:
        for p in (0.0,1.0):
            fr=frame_of(s['img'],p,fi=int(p*(s['end']-s['start'])*30)); tiles.append(Image.fromarray((fr*255).astype(np.uint8)).resize((216,384)))
    sheet=Image.new('RGB',(216*10,384*math.ceil(len(tiles)/10)))
    for k,t in enumerate(tiles): sheet.paste(t,((k%10)*216,(k//10)*384))
    sheet.save(f'{S}/preview.jpg',quality=80); sys.exit()
# ---------- full render ----------
yy,xx=np.mgrid[0:H,0:W].astype(np.float32)
r=np.sqrt(((xx-W/2)/(W*0.62))**2+((yy-H/2)/(H*0.60))**2)
vig=np.clip(1-0.55*np.clip(r-0.55,0,1)**1.6,0,1)[...,None].astype(np.float32)
rng=np.random.default_rng(7)
grains=[]
for k in range(6):
    g=rng.normal(0,1,(H//2,W//2)).astype(np.float32)
    g=np.asarray(Image.fromarray(((g*40)+128).clip(0,255).astype(np.uint8)).resize((W,H),Image.BILINEAR),np.float32)/255-0.5
    grains.append(g[...,None]*0.07)
# transitions into shot k: type and duration
TR={}
for k,s in enumerate(shots):
    if k==0: continue
    prev=shots[k-1]
    if s['img']=='085': TR[k]=('flash',0.30)
    elif s['img']=='END': TR[k]=('fade',0.9)
    elif s['line']!=prev['line']: TR[k]=('whip',0.24) if k%2 else ('xfade',0.35)
    else: TR[k]=('cut',0)
impacts=[shots[k]['start'] for k in range(len(shots)) if shots[k]['img'] in ('085','089','019')]
def shot_frame(k,t):
    s=shots[k]
    if s['img']=='END':
        base=frame_of('082',1.0)*0.18
        return base
    d=s['end']-s['start']; p=min(max((t-s['start'])/d,0),1)
    sh=(0,0)
    for it in impacts:
        if 0<=t-it<0.35:
            a=(1-(t-it)/0.35)**2*14; sh=(a*math.sin(t*90),a*math.cos(t*77))
    return frame_of(s['img'],p,sh,fi=int((t-s['start'])*30)+6)
def whipblur(a,amt):
    if amt<1: return a
    n=6; acc=np.zeros_like(a)
    for i in range(n): acc+=np.roll(a,int(amt*i/n),axis=1)
    return acc/n
out=f'{S}/video_noaudio.mp4'
N=int(TL['total']*FPS)
ff=subprocess.Popen(['ffmpeg','-y','-v','error','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-',
    '-c:v','libx264','-preset','medium','-crf','16','-pix_fmt','yuv420p',out],stdin=subprocess.PIPE)
k=0
for n in range(N):
    t=n/FPS
    while k+1<len(shots) and t>=shots[k+1]['start']: k+=1
    fr=shot_frame(k,t)
    # transition in/out
    if k+1<len(shots):
        typ,d=TR[k+1]; t1=shots[k+1]['start']
        if typ in ('xfade','fade') and t>t1-d/2:
            a=ease((t-(t1-d/2))/d); fr=fr*(1-a)+shot_frame(k+1,t)*a
        elif typ=='whip' and t>t1-d/2:
            a=(t-(t1-d/2))/d; fr=whipblur(fr,a*260)
        elif typ=='flash' and t>t1-0.12:
            a=(t-(t1-0.12))/0.12; fr=fr*(1-a)+a
    if k>0:
        typ,d=TR[k]; t0=shots[k]['start']
        if typ in ('xfade','fade') and t<t0+d/2:
            a=ease(0.5+(t-t0)/d); fr=shot_frame(k-1,t)*(1-a)+fr*a
        elif typ=='whip' and t<t0+d/2:
            a=1-(t-t0)/(d/2); fr=whipblur(fr,a*260)
        elif typ=='flash' and t<t0+d:
            a=1-(t-t0)/d; fr=fr*(1-a*0.9)+a*0.9
    if n<12: fr=fr*(n/12)
    fr=fr*vig+grains[n%6]
    ff.stdin.write((np.clip(fr,0,1)*255).astype(np.uint8).tobytes())
    if n%150==0: print(n,N,flush=True)
ff.stdin.close(); ff.wait()

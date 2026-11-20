import json,sys,os,math,subprocess
import numpy as np
from PIL import Image,ImageDraw,ImageFont,ImageFilter,ImageOps
S=sys.argv[1]; MODE=sys.argv[2] if len(sys.argv)>2 else 'full'
W,H,FPS=1080,1920,30
TL=json.load(open(f'{S}/fv/tl.json')); L=TL['lines']; T=TL['total']
def ws(i,k): return L[i]['words'][k]['s']
FONT='/usr/share/fonts/opentype/inter/'
def F(sz,w='Black'): return ImageFont.truetype(FONT+f'InterDisplay-{w}.otf',sz)
RED=(255,42,31); ICE=(196,220,255); GOLD=(255,200,69); WHITE=(255,255,255)
# ---------------- images ----------------
def grade(a):
    a=a.astype(np.float32)/255.0*0.86
    Lm=(0.2126*a[...,0]+0.7152*a[...,1]+0.0722*a[...,2])[...,None]
    a=Lm+(a-Lm)*0.92
    a=np.clip(a,0,1); a=a*(1-0.6)+0.6*(a*a*(3-2*a)); a=a**1.1
    Lm=(0.2126*a[...,0]+0.7152*a[...,1]+0.0722*a[...,2])[...,None]
    a=a+(1-Lm)**2*np.array([-0.04,0.0,0.05],np.float32)+Lm**2*np.array([0.04,0.015,-0.03],np.float32)
    return np.clip(0.01+a*0.98,0,1)
cache={}
def src(img):
    if img not in cache:
        im=Image.open(f'{S}/fv/hi/{img}.jpg'); im=ImageOps.exif_transpose(im).convert('RGB')
        sc=2400/max(im.size) if max(im.size)>2400 else 1
        if sc!=1: im=im.resize((int(im.width*sc),int(im.height*sc)),Image.LANCZOS)
        cache[img]=Image.fromarray((grade(np.asarray(im))*255+0.5).astype(np.uint8))
    return cache[img]
# camera per image: cx,cy (0..1 focus), extra
CAM={'003':(0.5,0.55),'048':(0.45,0.55),'059':(0.40,0.55),'019':(0.5,0.5),'023':(0.35,0.6),'026':(0.5,0.45),
'031':(0.40,0.70),'010':(0.5,0.6),'016':(0.42,0.55),'039':(0.5,0.55),'038':(0.5,0.55),'000':(0.5,0.6),'060':(0.45,0.6),
'066':(0.48,0.6),'069':(0.48,0.6),'071':(0.5,0.6),'072':(0.5,0.6),'110':(0.5,0.4),'121':(0.48,0.62),'125':(0.5,0.6),
'127':(0.40,0.62),'128':(0.40,0.62),'132':(0.5,0.6),'101':(0.5,0.6),'067':(0.5,0.6)}
def view(img,w,h,p,z0=1.0,z1=1.18,dx=0.06,rot=1.5,shake=(0,0),punch=0.0):
    """render img into w x h with moving camera; p 0..1"""
    im=src(img); Ws,Hs=im.size; cx,cy=CAM.get(img,(0.5,0.5))
    e=p*p*(3-2*p)*0.6+p*0.4
    z=(z0+(z1-z0)*e)*(1+punch)
    ar=w/h
    ch=Hs/z; cw=ch*ar
    if cw>Ws/z: cw=Ws/z; ch=cw/ar
    x=cx*Ws+(e-0.5)*dx*Ws; y=cy*Hs
    x=min(max(x,cw/2),Ws-cw/2); y=min(max(y,ch/2),Hs-ch/2)
    x+=shake[0]*cw/w; y+=shake[1]*ch/h
    a=math.radians(rot*(e-0.5))
    ca,sa=math.cos(a),math.sin(a)
    def P(u,v): return (x+u*ca-v*sa, y+u*sa+v*ca)
    hw,hh=cw/2*1.04,ch/2*1.04
    quad=(*P(-hw,-hh),*P(-hw,hh),*P(hw,hh),*P(hw,-hh))
    return np.asarray(im.transform((w,h),Image.QUAD,quad,Image.BICUBIC),np.float32)/255.0
# ---------------- edit decision list ----------------
t1,t2,t3,t4,t5,t6,t7,t8,t9=[L[i]['start'] for i in range(1,10)]
EDL=[]  # (start,end,kind,args)
hook=['125','048','110','026','072','059']
hc=[0.0,0.42,0.80,1.12,1.42,1.72]
for k,img in enumerate(hook): EDL.append((hc[k],hc[k+1] if k+1<len(hc) else 1.95,'single',dict(img=img,z0=1.25,z1=1.05)))
EDL.append((1.95,t1,'split',dict(top='069',bot='010')))
EDL.append((t1,t2,'round',dict(n=1,title='LA PUISSANCE',top='071',bot='038')))
EDL.append((t2,t3,'split',dict(top='069',bot='016',bars=('ch',450,478,ws(2,0),ws(2,2)),point=('F',ws(2,3)))))
EDL.append((t3,t4,'round',dict(n=2,title='LA VITESSE',top='121',bot='059')))
EDL.append((t4,t5,'split',dict(top='072',bot='048',bars=('km/h',317,324,ws(4,0),ws(4,1)),point=('F',ws(4,2)),streaks=True)))
EDL.append((t5,t6,'round',dict(n=3,title='LA TECHNOLOGIE',top='125',bot='019')))
EDL.append((t6,ws(6,5)-0.1,'single',dict(img='066',label=('4 ROUES MOTRICES','PORSCHE 959'),z0=1.0,z1=1.2)))
EDL.append((ws(6,5)-0.1,ws(6,10)-0.1,'single',dict(img='031',label=('SANS ABS','FERRARI F40'),z0=1.1,z1=1.25,red=True)))
EDL.append((ws(6,10)-0.1,t7,'single',dict(img='110',point=('P',ws(6,10)),z0=1.0,z1=1.15)))
EDL.append((t7,t8,'round',dict(n=4,title='LA LÉGENDE',top='127',bot='003')))
EDL.append((t8,ws(8,4)-0.05,'single',dict(img='127',label=('PARIS-DAKAR 1986','VICTOIRE · DOUBLÉ PORSCHE'),z0=1.05,z1=1.25)))
EDL.append((ws(8,4)-0.05,ws(8,6)-0.1,'single',dict(img='132',z0=1.0,z1=1.08,point=('P',ws(8,6)))))
EDL.append((ws(8,6)-0.1,t9,'split',dict(top='067',bot='039',big22=True)))
EDL.append((t9,T,'split',dict(top='125',bot='059',final=True)))
# score timeline
SCORE=[(0,0,0)]
pts=[('F',ws(2,3)),('F',ws(4,2)),('P',ws(6,10)),('P',ws(8,6))]
p=f=0
for who,tt in pts:
    if who=='P': p+=1
    else: f+=1
    SCORE.append((tt,p,f))
def score_at(t):
    s=SCORE[0]
    for x in SCORE:
        if t>=x[0]: s=x
    return s
# ---------------- overlay helpers ----------------
def text_img(txt,font,fill,stroke=0,sc=(0,0,0,255)):
    b=font.getbbox(txt,stroke_width=stroke); w,h=b[2]-b[0]+8,b[3]-b[1]+8
    im=Image.new('RGBA',(w,h),(0,0,0,0)); d=ImageDraw.Draw(im)
    d.text((4-b[0],4-b[1]),txt,font=font,fill=fill,stroke_width=stroke,stroke_fill=sc)
    return im
def paste_center(base,im,cx,cy,scale=1.0,alpha=1.0):
    if scale!=1.0: im=im.resize((max(1,int(im.width*scale)),max(1,int(im.height*scale))),Image.BICUBIC)
    if alpha<1: a=im.split()[3].point(lambda v:int(v*alpha)); im.putalpha(a)
    base.alpha_composite(im,(int(cx-im.width/2),int(cy-im.height/2)))
def shadow_text(base,txt,font,fill,cx,cy,scale=1.0,alpha=1.0,glow=None,stroke=0):
    sh=text_img(txt,font,(0,0,0,200)); sh=sh.filter(ImageFilter.GaussianBlur(10))
    paste_center(base,sh,cx+4,cy+6,scale,alpha*0.9)
    if glow:
        g=text_img(txt,font,glow+(255,)).filter(ImageFilter.GaussianBlur(18)); paste_center(base,g,cx,cy,scale,alpha*0.8)
    paste_center(base,text_img(txt,font,fill+(255,),stroke,(0,0,0,255)),cx,cy,scale,alpha)
def popscale(dt,dur=0.18,over=1.25):
    if dt<0: return 0
    if dt<dur: x=dt/dur; return over*math.sin(x*math.pi/2)
    if dt<dur*2: x=(dt-dur)/dur; return over+(1-over)*x
    return 1.0
TCACHE={}
WIN_T=[0]
def cached_text(key,fn):
    if key not in TCACHE: TCACHE[key]=fn()
    return TCACHE[key]
def scoreboard(ov,t):
    if t<t1: return
    tt,p,f=score_at(t); dt=t-tt if tt>0 else 9
    a=min(1,(t-t1)/0.25)
    d=ImageDraw.Draw(ov)
    x0,y0,x1,y1=250,150,830,250
    d.rounded_rectangle((x0,y0,x1,y1),radius=26,fill=(8,10,14,int(190*a)),outline=(255,255,255,int(40*a)),width=2)
    d.rectangle((x0+18,y1-6,540-10,y1-2),fill=ICE+(int(220*a),)); d.rectangle((550,y1-6,x1-18,y1-2),fill=RED+(int(220*a),))
    shadow_text(ov,'959',F(46,'ExtraBold'),ICE,345,200,1,a)
    shadow_text(ov,'F40',F(46,'ExtraBold'),RED,735,200,1,a)
    sp=popscale(dt) if dt<0.4 else 1
    shadow_text(ov,str(p),F(72),WHITE,478,198,sp if (tt>0 and SCORE[[x[0] for x in SCORE].index(tt)][1]!=SCORE[[x[0] for x in SCORE].index(tt)-1][1]) else 1,a)
    shadow_text(ov,'–',F(60,'Bold'),(200,200,200),540,196,1,a)
    shadow_text(ov,str(f),F(72),WHITE,602,198,sp if (tt>0 and SCORE[[x[0] for x in SCORE].index(tt)][2]!=SCORE[[x[0] for x in SCORE].index(tt)-1][2]) else 1,a)
def bar(ov,t,y,start,val,maxv,unit,color,name,winner):
    if t<start-0.05: return
    dt=t-start; prog=min(1,dt/0.7); prog=1-(1-prog)**3
    d=ImageDraw.Draw(ov)
    x0,x1=90,990; h=26
    d.rounded_rectangle((x0,y,x1,y+h),radius=13,fill=(0,0,0,150))
    wv=int((x1-x0)*(val/maxv)*prog)
    if wv>4: d.rounded_rectangle((x0,y,x0+wv,y+h),radius=13,fill=color+(255,))
    num=int(val*prog)
    shadow_text(ov,f'{num} {unit.upper()}',F(96),GOLD if winner else WHITE,540,y-64,stroke=5,glow=(255,150,0) if winner else None)
    shadow_text(ov,name,F(36,'ExtraBold'),WHITE,540,y+h+36,stroke=4)
    if winner:
        shadow_text(ov,'+1',F(110),GOLD,930,y-64,popscale(t-WIN_T[0],0.13,1.4),stroke=5,glow=(255,150,0))
def vs_badge(ov,t,t0):
    dt=t-t0; s=popscale(dt,0.15,1.35)
    if s<=0: return
    d=ImageDraw.Draw(ov)
    shadow_text(ov,'VS',F(150),GOLD,540,960,s,1,glow=(255,140,0))
def round_card(ov,t,t0,n,title):
    dt=t-t0
    s=popscale(dt,0.12,1.4)
    shadow_text(ov,f'ROUND {n}',F(170),WHITE,540,860,s,1,glow=(255,255,255))
    s2=popscale(dt-0.18,0.12,1.2)
    if s2>0: shadow_text(ov,title,F(82,'ExtraBold'),GOLD,540,1010,s2)
def label(ov,t,t0,big,small,col):
    dt=t-t0; s=popscale(dt-0.1,0.14,1.25)
    if s<=0: return
    shadow_text(ov,big,F(104),col,540,1150,s,glow=col if dt<0.6 else None,stroke=5)
    shadow_text(ov,small,F(42,'ExtraBold'),WHITE,540,1252,min(1,s),stroke=4)
def point_fx(ov,t,tt,who):
    dt=t-tt
    if dt<0: return
    col=RED if who=='F' else ICE; txt='POINT FERRARI' if who=='F' else 'POINT PORSCHE'
    s=popscale(dt,0.13,1.3)
    shadow_text(ov,'+1',F(200),col,540,1150,s,glow=col,stroke=6)
    shadow_text(ov,txt,F(64),WHITE,540,1330,min(1,s),stroke=5)
# ---------------- frame compositing ----------------
yy,xx=np.mgrid[0:H,0:W].astype(np.float32)
r=np.sqrt(((xx-W/2)/(W*0.6))**2+((yy-H/2)/(H*0.58))**2)
VIG=np.clip(1-0.8*np.clip(r-0.42,0,1)**1.3,0,1)[...,None]
rng=np.random.default_rng(5)
GR=[(np.asarray(Image.fromarray((rng.normal(128,40,(H//2,W//2))).clip(0,255).astype(np.uint8)).resize((W,H)),np.float32)/255-0.5)[...,None]*0.06 for _ in range(5)]
STREAK=[(rng.uniform(0,W),rng.uniform(0,H),rng.uniform(80,380),rng.uniform(900,2600)) for _ in range(40)]
def impacts_shake(t):
    sx=sy=0
    for tt in [x[1] for x in pts]+[t1,t3,t5,t7,1.95]:
        d=t-tt
        if 0<=d<0.3: a=(1-d/0.3)**2*18; sx+=a*math.sin(t*97); sy+=a*math.cos(t*71)
    return (sx,sy)
def seg_frame(seg,t):
    s0,s1,kind,a=seg; p=min(max((t-s0)/max(s1-s0,1e-3),0),1)
    punch=max(0,0.12*(1-(t-s0)/0.22)) if t-s0<0.22 else 0
    sh=impacts_shake(t)
    if kind=='single':
        return view(a['img'],W,H,p,a.get('z0',1.0),a.get('z1',1.18),shake=sh,punch=punch)
    if kind in ('split','round'):
        top=view(a['top'],W,H//2,p,1.05,1.2,dx=0.08,shake=sh,punch=punch)
        bot=view(a['bot'],W,H//2,p,1.2,1.05,dx=-0.08,shake=sh,punch=punch)
        fr=np.concatenate([top,bot],0)
        if kind=='round':
            fr=np.asarray(Image.fromarray((fr*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(14)),np.float32)/255*0.42
        return fr
def overlays(seg,t):
    s0,s1,kind,a=seg
    ov=Image.new('RGBA',(W,H),(0,0,0,0))
    if kind in ('split',) :
        d=ImageDraw.Draw(ov)
        d.rectangle((0,955,W,965),fill=(0,0,0,255)); d.rectangle((0,957,int(W*min(1,(t-s0)/0.3)),963),fill=GOLD+(255,))
        if not a.get('bars') and not a.get('big22') and not a.get('final'): vs_badge(ov,t,s0)
    if kind=='round': round_card(ov,t,s0,a['n'],a['title'])
    if 'bars' in a:
        unit,v1,v2,ta,tb=a['bars']; mx=max(v1,v2)*1.08
        w=a.get('point',(None,99))[1]; WIN_T[0]=w
        bar(ov,t,700,ta,v1,mx,unit,ICE,'PORSCHE 959',False)
        bar(ov,t,1180,tb,v2,mx,unit,RED,'FERRARI F40',t>=w)
    if 'label' in a: label(ov,t,s0,a['label'][0],a['label'][1],RED if a.get('red') else ICE)
    if 'point' in a and t>=a['point'][1]:
        if kind=='split':
            pass
        else: point_fx(ov,t,a['point'][1],a['point'][0])
    if a.get('big22'):
        s=popscale(t-ws(8,6),0.14,1.4)
        if s>0:
            shadow_text(ov,'2 – 2',F(230),GOLD,540,960,s,glow=(255,150,0),stroke=7)
    if a.get('final'):
        s=popscale(t-s0-0.05,0.14,1.25)
        shadow_text(ov,'PORSCHE',F(130),ICE,540,800,s,glow=ICE if t>=ws(9,4) and t<ws(9,6) else None,stroke=6)
        shadow_text(ov,'OU',F(70,'ExtraBold'),GOLD,540,960,s,stroke=5)
        shadow_text(ov,'FERRARI ?',F(130),RED,540,1120,s,glow=RED if t>=ws(9,6) else None,stroke=6)
        if t>=ws(9,7)-0.15:
            k=0.85+0.15*abs(math.sin((t-ws(9,7))*6))
            shadow_text(ov,'COMMENTE ▼',F(64),WHITE,540,1290,k*popscale(t-ws(9,7)+0.15,0.12,1.2),glow=GOLD,stroke=5)
    scoreboard(ov,t)
    return ov
def point_flash(t):
    for who,tt in pts:
        d=t-tt
        if 0<=d<0.18: return (1-d/0.18)*0.55,(RED if who=='F' else ICE)
    for tt in [t1,t3,t5,t7]:
        d=t-tt
        if 0<=d<0.12: return (1-d/0.12)*0.8,WHITE
    return 0,None
def streaks(fr,t):
    ov=Image.new('L',(W,H),0); d=ImageDraw.Draw(ov)
    for (x,y,ln,sp) in STREAK:
        xx_=(x-t*sp)%(W+ln)-ln
        d.line((xx_,y,xx_+ln,y),fill=90,width=3)
    m=np.asarray(ov.filter(ImageFilter.GaussianBlur(1.5)),np.float32)[...,None]/255
    return fr*(1-m*0.4)+m*0.9
def rgb_split(fr,amt):
    if amt<1: return fr
    o=fr.copy(); k=int(amt); o[...,0]=np.roll(fr[...,0],k,1); o[...,2]=np.roll(fr[...,2],-k,1); return o
def seg_at(t):
    for s in EDL:
        if s[0]<=t<s[1]: return s
    return EDL[-1]
def render(t):
    seg=seg_at(t); fr=seg_frame(seg,t)
    if seg[3].get('streaks') and t>=seg[3]['bars'][4]-0.2: fr=streaks(fr,t)
    # highlight winning half on point in splits
    if seg[2]=='split' and 'point' in seg[3] and t>=seg[3]['point'][1]:
        fr[:H//2]*=0.45
    dt=t-seg[0]
    if dt<0.1 and seg[0]>0: fr=rgb_split(fr,(1-dt/0.1)*24)
    fr=fr*VIG
    ov=overlays(seg,t); o=np.asarray(ov,np.float32)/255
    fr=fr*(1-o[...,3:])+o[...,:3]*o[...,3:]
    a,c=point_flash(t)
    if a>0: fr=fr*(1-a)+np.array(c,np.float32)/255*a
    if seg[0]>0 and dt<0.05: fr=fr*0.5+0.5
    if t<0.15: fr=fr*(t/0.15)
    return fr
if MODE=='preview':
    ts=[float(x) for x in sys.argv[3].split(',')]
    tiles=[Image.fromarray((np.clip(render(t)+GR[0],0,1)*255).astype(np.uint8)).resize((270,480)) for t in ts]
    sh=Image.new('RGB',(270*min(8,len(tiles)),480*math.ceil(len(tiles)/8)))
    for k,tl in enumerate(tiles): sh.paste(tl,((k%8)*270,(k//8)*480))
    sh.save(f'{S}/fv/preview.jpg',quality=85); sys.exit()
N=int(T*FPS)
ff=subprocess.Popen(['ffmpeg','-y','-v','error','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-',
  '-c:v','libx264','-preset','medium','-crf','16','-pix_fmt','yuv420p',f'{S}/fv/video.mp4'],stdin=subprocess.PIPE)
for n in range(N):
    t=n/FPS; fr=render(t)+GR[n%5]
    ff.stdin.write((np.clip(fr,0,1)*255).astype(np.uint8).tobytes())
    if n%60==0: print(n,N,flush=True)
ff.stdin.close(); ff.wait()

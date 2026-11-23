"""2D: 'Et si tu devenais 100 fois plus grand ? Partie 1'"""
import json,sys,math,subprocess,os
import numpy as np
from PIL import Image,ImageDraw,ImageFilter,ImageFont
HERE=os.path.dirname(os.path.abspath(__file__))
_t=open(os.path.join(HERE,'anim_tiny.py')).read(); exec(_t[:_t.index('def frame(')])
_p=open(os.path.join(HERE,'anim_tiny2.py')).read(); exec(_p[_p.index('\ndef txt('):_p.index('\ndef frame(')])
HX,GY=760,1700           # hero screen x, ground screen y
CARS=[(-60,(220,60,60)),(-35,(40,120,200)),(-12,(240,200,60)),(25,(60,160,90)),(48,(240,240,245)),(80,(30,30,40)),(115,(200,90,40)),(150,(90,60,140))]
BLDX=[(-260+k*17.5,k%3,19+(k*7)%5) for k in range(32)]
def world(t,p,hm,mood=0,look=0,shake=0.0,dark=0.0,crack=0.0,dust=0.0,cam_dy=0.0):
    """p = screen px per metre, hm = hero height in metres"""
    sx=math.sin(t*60)*shake*14; sy=math.cos(t*47)*shake*10
    ox,oy=HX+sx,GY+sy+cam_dy
    im=vgrad((105,165,235),(225,236,250),0,1700); base=canvas((225,236,250)); base.paste(im,(0,0)); im=base.convert('RGBA')
    dsky=Dr(im)
    for (cx,cy,cw) in ((170,230,170),(870,150,210),(620,430,110)):
        for dx in (-0.5,0,0.5): dsky.ellipse((cx+dx*cw-cw*0.45+t*5,cy-cw*0.25,cx+dx*cw+cw*0.45+t*5,cy+cw*0.25),fill=(255,255,255))
    th=330*p
    if th<5200:
        tx=ox-115*p
        if tx+70*p>-50: eiffel(Dr(im),tx,oy-0.5,max(60,int(th//4)*4))
    db=Dr(im,p/32.5,(0,1400),(ox,oy))
    for (xm,var,hb) in BLDX:
        sxp=ox+xm*p
        if -20*p<sxp<1100: facade(db,xm*32.5,16.5*32.5,hb*32.5,var,1400)
    dw=Dr(im,p/PX,(0,0),(ox,oy))
    dw.rect((-400*PX,0,400*PX,2.0*PX),fill=(190,186,180))
    dw.rect((-400*PX,2.0*PX,400*PX,2.25*PX),fill=(150,146,140))
    dw.rect((-400*PX,2.25*PX,400*PX,60*PX),fill=(72,74,84))
    for xm in range(-300,300,12): dw.rect((xm*PX,6*PX,(xm+6)*PX,6.25*PX),fill=(230,230,230))
    for k,(xm,col) in enumerate(CARS):
        jump=max(0,math.sin(t*20+k))*shake*1.2
        car(dw,xm*PX,(4.5-jump)*PX if k%2 else (8.5-jump)*PX,col)
    for xm in (-140,-90,-40,40,100):
        sxp=ox+xm*p
        if -400<sxp<1500: tree(dw,xm*PX,1.6*PX,min(1600,10*PX),seed=abs(xm)%7+1)
    if dust>0:
        r_=np.random.default_rng(int(t*10))
        for k in range(30):
            a=r_.uniform(0,math.pi); rr=dust*r_.uniform(0.3,1)*hm*0.35
            x=math.cos(a)*rr; y=-abs(math.sin(a))*rr*0.4; s_=hm*0.06*r_.uniform(0.6,1.4)
            dw.ellipse(((x-s_)*PX,(y-s_*0.7)*PX,(x+s_)*PX,(y+s_*0.7)*PX),fill=(200,190,170,170))
    s=hm/1.7
    hero_layer(im,(p/PX,(0,4.0*PX),(ox,oy)),0,4.0*PX,1.0,mood=mood,look=look,s=s,t=t,glow=False)
    if crack>0:
        dc=Dr(im,p/PX,(0,0),(ox,oy)); k=PX*s
        for sd in (-0.08,0.08):
            x0=sd*k; y0=4*PX-0.45*k
            pts=[(x0,y0)]
            for j in range(5): pts.append((x0+((-1)**j)*0.03*k,y0-0.04*k*(j+1)*crack*1.5))
            dc.line([v for pp in pts for v in pp],fill=(255,60,60),width=5/(p/PX))
        r_=np.random.default_rng(3)
        for j in range(8):
            a=r_.uniform(0,math.pi); L_=r_.uniform(0.3,0.8)*k*crack
            dc.line((0,4.1*PX,math.cos(a)*L_,4.1*PX+abs(math.sin(a))*L_*0.15),fill=(30,30,30),width=4/(p/PX))
    img=im.convert('RGB')
    if dark>0: img=Image.fromarray((np.asarray(img,np.float32)*(1-dark)).astype(np.uint8))
    return img
def headline2(img,t,a,b):
    im=img.convert('RGBA'); dr=Dr(im); sc=min(1.0,0.6+t*3)
    dr.text((540,230),a,F(int(84*sc)),fill=(255,255,255),stroke=7); dr.text((540,345),b,F(int(96*sc)),fill=(255,214,90),stroke=7)
    return im.convert('RGB')
def bone(dr,cx,cy,L_,crack=0.0):
    c=(245,240,225)
    dr.rrect((cx-L_/2,cy-28,cx+L_/2,cy+28),20,fill=c,outline=OUT,width=4)
    for sd in (-1,1):
        for dy in (-1,1): dr.ellipse((cx+sd*L_/2-50,cy+dy*30-50,cx+sd*L_/2+50,cy+dy*30+50),fill=c,outline=OUT,width=4)
    dr.rect((cx-L_/2+20,cy-26,cx+L_/2-20,cy+26),fill=c)
    if crack>0:
        pts=[(cx,cy-30),(cx-14,cy-10),(cx+10,cy+4),(cx-8,cy+30)]
        n=max(2,int(len(pts)*min(1,crack))); dr.line([v for p_ in pts[:n] for v in p_],fill=(200,40,40),width=6)
def frame(t):
    i=0
    for k in range(len(L)):
        if t>=S[k]-0.15: i=k
    lt=t-S[i]
    HPX=620
    if i==0:
        g=ease((t-0.5)/2.0); hm=math.exp(lerp(math.log(1.7),math.log(170),g)); p=HPX/hm*lerp(0.95,1,g)
        img=world(t,p,hm,mood=1,look=0.2,shake=0.3*g*(1-g)*4)
        if 0.4<t<2.4:
            im=img.convert('RGBA'); dr=Dr(im)
            for k in range(12):
                a=k*0.52+t*4; rr=260+80*math.sin(t*9+k); dr.text((HX-60+math.cos(a)*rr*0.6,1200+math.sin(a)*rr),'✦',F(44),fill=(255,240,150))
            img=im.convert('RGB')
        img=headline2(img,t,'ET SI TU DEVENAIS','100× PLUS GRAND ?')
    elif i==1:
        img=world(t,HPX/170,170,mood=1,look=0.3); img=headline2(img,9,'ET SI TU DEVENAIS','100× PLUS GRAND ?'); img=sub_button(img,lt)
    elif i==2:
        p=lerp(HPX/170,3.4,ease(lt/1.5)); img=world(t,p,170,mood=1,look=-0.6)
        im=img.convert('RGBA'); dr=Dr(im)
        tx=HX-115*p; a=min(1,max(0,(lt-1.0)*2))
        if a>0:
            for (x,hm,lbl,col) in ((HX+150,170,'170 m',(255,214,90)),(tx+60*p+40,330,'330 m',(255,255,255))):
                y0=GY; y1=GY-hm*p; dr.line((x,y0,x,y1),fill=col,width=6); dr.line((x-20,y1,x+20,y1),fill=col,width=6)
                dr.text((x,y1-50),lbl,F(64),fill=col,stroke=5)
        img=im.convert('RGB')
    elif i==3:
        st=(lt*1.6)%1.0; shake=max(0,1-st*3)
        img=world(t,12,170,mood=1,look=0.5,shake=shake,dust=1-st,cam_dy=-0)
        img=txt(img,[("BOUM !",120,(255,214,90))],300) if st<0.35 else img
    elif i==4:
        img=world(t,HPX/170,170,mood=0,look=0,dark=0.55)
        s_=min(1,0.6+lt*2)
        img=txt(img,[("TON POIDS",90,(255,255,255)),("× 1 000 000",int(130*s_),(255,90,90))],330)
    elif i==5:
        im=canvas((24,26,40)).convert('RGBA'); dr=Dr(im)
        bone(dr,540,1050,560,crack=0)
        img=txt(im.convert('RGB'),[("TES OS",90,(255,255,255)),("× 10 000",int(min(1,0.6+lt*2)*130),(120,220,140))],330)
        im=img.convert('RGBA'); dr=Dr(im)
        dr.text((540,1450),'100× moins que ton poids',F(54,'ExtraBold'),fill=(255,214,90),stroke=4)
        img=im.convert('RGB')
    elif i==6:
        c=ease((lt-0.6)/1.2)
        img=world(t,5.0,170,mood=-1,look=0,shake=0.6*c,crack=c,dust=0.5*c)
        if c>0.3: img=Image.fromarray((np.asarray(img,np.float32)*np.array([1.15,0.85,0.85])).clip(0,255).astype(np.uint8))
        img=txt(img,[("CRAC !",130,(255,90,90))],300) if lt>1.0 else img
    else:
        img=world(t,HPX/170,170,mood=-1,look=math.sin(lt*3)*0.5,dark=0.6)
        im=img.convert('RGBA'); dr=Dr(im); s=1+0.06*math.sin(lt*6)
        dr.text((540,240),'PARTIE 2',F(int(150*s)),fill=(255,214,90),stroke=6); dr.text((540,370),'bientôt…',F(64,'ExtraBold'),fill=(255,255,255),stroke=4)
        if lt>0.6:
            y=560+10*math.sin(lt*8); dr.rrect((260,y-60,820,y+60),60,fill=(254,44,85)); dr.text((540,y),'+ Abonne-toi',F(64),fill=(255,255,255))
        img=im.convert('RGB')
    img=img.resize((W,H),Image.LANCZOS); a=np.asarray(img,np.float32)
    for k in range(1,len(L)):
        dt=t-S[k]
        if -0.08<dt<0.08: a=a*(0.6+0.4*abs(dt)/0.08)
    if t<0.1: a=a*(t/0.1)
    if t>T-0.4: a=a*max(0,(T-t)/0.4)
    return a.clip(0,255).astype(np.uint8)
_b=_t[_t.index('def with_badge('):]
if len(sys.argv)>2 and sys.argv[2]=='still':
    exec(_b[:_b.index('if len(sys.argv)')])
    Image.fromarray(with_badge(frame(float(sys.argv[3])),float(sys.argv[3]))).save(f'{D}/still.png'); sys.exit()
exec(_b)

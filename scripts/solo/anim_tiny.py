"""2D: 'Et si tu devenais 100 fois plus petit ? Partie 1' (same hero + French flag)"""
import json,sys,math,subprocess,os
import numpy as np
from PIL import Image,ImageDraw,ImageFilter,ImageFont
HERE=os.path.dirname(os.path.abspath(__file__))
_l=open(os.path.join(HERE,'anim_lune.py')).read(); exec(_l[:_l.index('def house(')])
_i=open(os.path.join(HERE,'anim_inv.py')).read(); exec(_i[_i.index('HA=0.38'):_i.index('def eye_diagram(')]); exec(_i[_i.index('def sub_button('):_i.index('def headline(')])
HS=2.6   # hero on-screen scale in macro scenes
def hero(im,x,y,s=HS,mood=0,look=0,t=0.0,alpha=1.0):
    hero_layer(im,(1.0,(540,960),(540,960)),x,y,alpha,mood=mood,look=look,s=s,t=t,glow=False)
def table_bg(t,edge=False,dark=0.0):
    im=vgrad((250,236,214),(228,206,176),0,1150); base=canvas((228,206,176)); base.paste(im,(0,0)); im=base.convert('RGBA'); dr=Dr(im)
    # kitchen wall tiles (blurred far)
    for y in range(0,1150,140):
        for x in range(-70*((y//140)%2),W,140): dr.rect((x,y,x+136,y+136),fill=(240,232,220),outline=(220,210,196),width=2)
    dr.rect((620,120,1080,760),fill=(150,200,235),outline=(200,190,180),width=10)   # window
    dr.line((850,120,850,760),fill=(200,190,180),width=8); dr.line((620,440,1080,440),fill=(200,190,180),width=8)
    # table top
    top=1150 if not edge else 900
    dr.rect((0,top,W,H),fill=(168,112,66))
    for k in range(26):
        yy=top+14+k*k*1.3; dr.arc((-200+((k*137)%300),yy,W+200,yy+40),190,350,fill=(140,90,50),width=3)
    for (cx,cy,r) in ((120,1600,10),(860,1700,14),(980,1450,8),(400,1820,9)): dr.ellipse((cx-r,cy-r*0.7,cx+r,cy+r*0.7),fill=(214,170,110),outline=OUT,width=1)  # crumbs
    # giant sugar cube + cup in background
    sugar(dr,60,830,330,1180)
    dr.rrect((700,640,1180,1180),60,fill=(220,70,60),outline=OUT,width=4); dr.rect((700,640,1180,700),fill=(240,100,90))
    img=im.convert('RGB')
    if dark>0: img=Image.fromarray((np.asarray(img,np.float32)*(1-dark)).astype(np.uint8))
    return img
def ant(dr,x,y,s=1.0,ph=0.0):
    k=s; c=(40,22,18)
    for j in range(3):
        lx=x-60*k+j*60*k; a=math.sin(ph+j*2)*14*k
        dr.line((lx,y-40*k,lx-30*k+a,y),fill=c,width=7*k); dr.line((lx,y-40*k,lx+30*k-a,y),fill=c,width=7*k)
    dr.ellipse((x-150*k,y-110*k,x-30*k,y-20*k),fill=c,outline=OUT,width=2)       # abdomen
    dr.ellipse((x-40*k,y-90*k,x+40*k,y-40*k),fill=c)                               # thorax
    dr.ellipse((x+30*k,y-120*k,x+110*k,y-50*k),fill=c,outline=OUT,width=2)         # head
    dr.ellipse((x+70*k,y-104*k,x+90*k,y-84*k),fill=(255,255,255)); dr.ellipse((x+76*k,y-98*k,x+86*k,y-88*k),fill=(10,10,10))
    dr.line((x+80*k,y-118*k,x+120*k,y-190*k),fill=c,width=5*k); dr.line((x+95*k,y-115*k,x+160*k,y-170*k),fill=c,width=5*k)
def ruler(dr,x,ytop,ybot):
    dr.rect((x,ytop,x+60,ybot),fill=(250,220,90),outline=OUT,width=2)
    n=17
    for k in range(n+1):
        yy=ybot-(ybot-ytop)*k/n; dr.line((x,yy,x+(30 if k%5==0 else 16),yy),fill=OUT,width=2)
    dr.text((x+30,ytop-50),'1,7 cm',F(52),fill=(255,255,255),stroke=4)
def drop(dr,cx,cy,r,a=170):
    dr.ellipse((cx-r,cy-r*0.85,cx+r,cy+r*0.85),fill=(120,190,255,a),outline=(70,140,220,230),width=5)
    dr.ellipse((cx-r*0.55,cy-r*0.65,cx-r*0.15,cy-r*0.35),fill=(255,255,255,200))
def cat_eye(dr,cx,cy,r,open_):
    h=r*0.62*open_
    dr.ellipse((cx-r*1.4,cy-r*0.9,cx+r*1.4,cy+r*0.9),fill=(50,40,36))
    if open_>0.02:
        dr.ellipse((cx-r,cy-h,cx+r,cy+h),fill=(220,190,40),outline=OUT,width=4)
        dr.ellipse((cx-r*0.12,cy-h*0.95,cx+r*0.12,cy+h*0.95),fill=(10,10,10))
        dr.ellipse((cx-r*0.45,cy-h*0.6,cx-r*0.25,cy-h*0.3),fill=(255,255,255))
def headline2(img,t,a,b):
    im=img.convert('RGBA'); dr=Dr(im); sc=min(1.0,0.6+t*3)
    dr.text((540,230),a,F(int(92*sc)),fill=(255,255,255),stroke=7); dr.text((540,350),b,F(int(110*sc)),fill=(255,214,90),stroke=7)
    return im.convert('RGB')
def frame(t):
    i=0
    for k in range(len(L)):
        if t>=S[k]-0.15: i=k
    lt=t-S[i]
    if i==0:
        sh=1.0 if t<0.8 else lerp(1.0,0.12,ease((t-0.8)/0.7))
        z=2.4*(1+ (1/sh-1)*0.35)
        img=street(t,(z,(300,1505-0.9*PX*sh),(430,1300)),hero=None,peds=True).convert('RGBA')
        hero_layer(img,(z,(300,1505-0.9*PX*sh),(430,1300)),300,1505,1.0,mood=1 if t<0.8 else -1,look=0.3,s=sh,t=t,glow=False)
        if 0.8<t<1.6:
            dr=Dr(img);
            for k in range(10):
                a=k*0.63+t*4; rr=120+60*math.sin(t*9+k); dr.text((540+math.cos(a)*rr,1100+math.sin(a)*rr),'✦',F(40),fill=(255,240,150))
        img=headline2(img.convert('RGB'),t,'ET SI TU DEVENAIS','100× PLUS PETIT ?')
    elif i==1:
        img=table_bg(t).convert('RGBA'); hero(img,420,1640,mood=1,look=0.4,t=t)
        img=headline2(img.convert('RGB'),9,'ET SI TU DEVENAIS','100× PLUS PETIT ?'); img=sub_button(img,lt)
    elif i==2:
        img=table_bg(t).convert('RGBA'); dr=Dr(img)
        ax=lerp(1400,860,ease(lt/1.6)); ant(dr,ax,1660,2.3,t*10)
        hero(img,380,1660,mood=-1 if lt>1.5 else 0,look=0.8,t=t)
        dr=Dr(img); ruler(dr,120,1660-1.75*PX*HS,1660)
        img=img.convert('RGB')
    elif i==3:
        prog=ease(lt/3.6); img=table_bg(t,edge=True).convert('RGBA'); dr=Dr(img)
        dr.rect((0,1500,W,H),fill=(205,190,170)); dr.rect((0,1500,W,1520),fill=(180,165,145))     # floor far below
        y=lerp(820,1760,prog)
        for k in range(6): dr.line((380+k*40-100,y-700-k*30,380+k*40-100,y-560-k*30),fill=(255,255,255,150),width=4)
        hero(img,500,y,mood=1 if prog>0.95 else 0,look=0,t=t)
        if prog>0.97: dr=Dr(img); dr.text((780,1450),'OK !',F(90),fill=(120,220,120),stroke=5)
        img=img.convert('RGB')
    elif i==4:
        img=canvas((40,30,24)).convert('RGBA'); k=6.0; person_front(Dr(img),620,860+1.63*PX*k,mood=lerp(0,-1,ease(lt/0.6)),look=math.sin(lt*6)*0.9,s=k,t=t); img=img.convert('RGB')
    elif i==5:
        img=table_bg(t).convert('RGBA'); hero(img,540,1660,mood=-1,look=0,t=t)
        dr=Dr(img); dy=lerp(-300,1280,ease(lt/0.7)); r=lerp(140,420,ease((lt-0.6)/0.5))
        drop(dr,540,dy,r,160)
        img=img.convert('RGB')
        if lt>0.7: img=Image.fromarray((np.asarray(img,np.float32)*np.array([0.85,0.95,1.1])).clip(0,255).astype(np.uint8))
    elif i==6:
        img=table_bg(t).convert('RGBA'); dr=Dr(img)
        dr.ellipse((300,1480,1500,2300),fill=(120,190,255,200),outline=(70,140,220),width=6)
        hero(img,240,1640,mood=-1,look=1.0,t=t)
        dr=Dr(img); s=min(1,0.7+lt*2)
        dr.text((540,520),'BOIRE',F(int(120*s)),fill=(255,255,255),stroke=6); dr.text((540,660),'=',F(int(90*s)),fill=(255,214,90),stroke=5); dr.text((540,800),'PRÉCIPICE',F(int(120*s)),fill=(255,90,90),stroke=6)
        img=img.convert('RGB')
    elif i==7:
        img=table_bg(t,dark=0.35).convert('RGBA'); dr=Dr(img)
        cat_eye(dr,330,620,190,ease((lt-0.3)/0.4)); cat_eye(dr,800,620,190,ease((lt-0.3)/0.4))
        hero(img,540,1660,mood=-1,look=math.sin(lt*3),t=t)
        img=img.convert('RGB')
    else:
        img=table_bg(t,dark=0.55).convert('RGBA'); dr=Dr(img)
        cat_eye(dr,330,700,190,1); cat_eye(dr,800,700,190,1)
        hero(img,540,1680,mood=-1,look=0,t=t,s=1.8)
        dr=Dr(img); s=1+0.06*math.sin(lt*6)
        dr.text((540,240),'PARTIE 2',F(int(150*s)),fill=(255,214,90),stroke=6); dr.text((540,370),'bientôt…',F(64,'ExtraBold'),fill=(255,255,255),stroke=4)
        if lt>0.6:
            y=1250+10*math.sin(lt*8); dr.rrect((260,y-60,820,y+60),60,fill=(254,44,85)); dr.text((540,y),'+ Abonne-toi',F(64),fill=(255,255,255))
        img=img.convert('RGB')
    img=img.resize((W,H),Image.LANCZOS); a=np.asarray(img,np.float32)
    for k in range(1,len(L)):
        dt=t-S[k]
        if -0.08<dt<0.08: a=a*(0.6+0.4*abs(dt)/0.08)
    if t<0.1: a=a*(t/0.1)
    if t>T-0.4: a=a*max(0,(T-t)/0.4)
    return a.clip(0,255).astype(np.uint8)
def with_badge(arr,t):
    if t>T-3.0: return arr
    im=Image.fromarray(arr).convert('RGBA'); d=ImageDraw.Draw(im)
    d.rounded_rectangle((40,60,300,130),radius=20,fill=(0,0,0,150)); d.text((170,95),'PARTIE 1',font=ImageFont.truetype(FONT+'Inter-Black.otf',40),fill=(255,214,90),anchor='mm')
    return np.asarray(im.convert('RGB'))
if len(sys.argv)>2 and sys.argv[2]=='preview':
    ts=[float(x) for x in sys.argv[3].split(',')]
    tiles=[Image.fromarray(with_badge(frame(t),t)).resize((270,480)) for t in ts]
    sh=Image.new('RGB',(270*min(8,len(tiles)),480*math.ceil(len(tiles)/8)))
    for k,tl in enumerate(tiles): sh.paste(tl,((k%8)*270,(k//8)*480))
    sh.save(f'{D}/preview.jpg',quality=88); sys.exit()
N=int(T*FPS)
ff=subprocess.Popen(['ffmpeg','-y','-v','error','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-','-c:v','libx264','-preset','medium','-crf','17','-pix_fmt','yuv420p',f'{D}/video.mp4'],stdin=subprocess.PIPE)
for n in range(N):
    t=n/FPS; ff.stdin.write(with_badge(frame(t),t).tobytes())
    if n%150==0: print(n,N,flush=True)
ff.stdin.close(); ff.wait()

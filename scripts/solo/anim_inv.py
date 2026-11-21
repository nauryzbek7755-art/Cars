"""2D: 'Et si tu devenais invisible ? Partie 1' — semi-transparent hero, French flag always in hand"""
import json,sys,math,subprocess
import numpy as np
from PIL import Image,ImageDraw,ImageFilter,ImageFont
SRC=open(__file__.replace('anim_inv.py','anim_lune.py')).read()
exec(SRC[:SRC.index('def house(')])          # Dr, canvas, vgrad, person_front, car, F, ease, lerp, PX, OUT, STARS ...
TV=ws(0,4)-0.1 if len(L[0]['words'])>4 else S[0]+0.9   # moment of turning invisible ("invisible")
HA=0.38   # hero opacity when invisible
# ---------------- hero with transparency ----------------
def hero_layer(im,dr_args,x,y,alpha,mood=0,look=0,s=1.0,t=0.0,glow=True,arm_up=False):
    """draws hero body with given alpha (flag stays opaque)"""
    z,f,o=dr_args
    body=Image.new('RGBA',im.size,(0,0,0,0)); db=Dr(body,z,f,o)
    person_front(db,x,y,mood=mood,look=look,s=s,t=t)
    if alpha<1:
        a=np.asarray(body,np.float32); a[...,3]*=alpha
        body=Image.fromarray(a.astype(np.uint8))
        if glow:
            edge=Image.fromarray((np.asarray(body)[...,3]>5).astype(np.uint8)*255).filter(ImageFilter.FIND_EDGES).filter(ImageFilter.GaussianBlur(3*SS))
            gl=Image.new('RGBA',im.size,(140,220,255,0)); gl.putalpha(edge.point(lambda v:min(255,v*3)))
            im.alpha_composite(gl)
    im.alpha_composite(body)
    if alpha<1:   # redraw flag fully opaque on top
        fl=Image.new('RGBA',im.size,(0,0,0,0)); df=Dr(fl,z,f,o); k=PX*s
        hx,hy=x-0.29*k,y-0.86*k
        df.line((hx,hy+0.04*k,hx,hy-0.62*k),fill=(120,90,60),width=0.025*k)
        fw,fh=0.33*k,0.22*k; wv=math.sin(t*5)*0.03*k
        for j,colf in enumerate(((0,85,164),(255,255,255),(239,65,53))):
            x0=hx-fw+j*fw/3; x1=x0+fw/3
            df.poly([(x0,hy-0.62*k+wv*(j/3)),(x1,hy-0.62*k+wv*((j+1)/3)),(x1,hy-0.62*k+fh+wv*((j+1)/3)),(x0,hy-0.62*k+fh+wv*(j/3))],fill=colf)
        df.rect((hx-fw,hy-0.62*k,hx,hy-0.62*k+fh),outline=OUT,width=1.2)
        im.alpha_composite(fl)
def friend(dr,x,y,scare=0.0,t=0.0):
    """pedestrian friend: red cap, yellow jacket; scare 0..1 jump"""
    k=PX; jy=-math.sin(min(1,scare)*math.pi)*0.35*k if scare>0 else 0; y=y+jy
    jacket=(240,190,60); pants=(60,70,110); skin=(200,150,110)
    dr.rrect((x-0.15*k,y-0.85*k,x-0.01*k,y),5,fill=pants,outline=OUT,width=1.5); dr.rrect((x+0.01*k,y-0.85*k,x+0.15*k,y),5,fill=pants,outline=OUT,width=1.5)
    dr.rrect((x-0.25*k,y-1.45*k,x+0.25*k,y-0.8*k),int(0.1*k),fill=jacket,outline=OUT,width=2)
    if scare>0.1:
        dr.rrect((x-0.42*k,y-1.9*k,x-0.28*k,y-1.3*k),int(0.07*k),fill=jacket,outline=OUT,width=1.5); dr.rrect((x+0.28*k,y-1.9*k,x+0.42*k,y-1.3*k),int(0.07*k),fill=jacket,outline=OUT,width=1.5)
    else:
        dr.rrect((x-0.35*k,y-1.4*k,x-0.21*k,y-0.86*k),int(0.07*k),fill=jacket,outline=OUT,width=1.5); dr.rrect((x+0.21*k,y-1.4*k,x+0.35*k,y-0.86*k),int(0.07*k),fill=jacket,outline=OUT,width=1.5)
    dr.ellipse((x-0.15*k,y-1.8*k,x+0.15*k,y-1.45*k),fill=skin,outline=OUT,width=1.5)
    dr.chord((x-0.17*k,y-1.86*k,x+0.17*k,y-1.62*k),180,360,fill=(200,40,50)); dr.rect((x,y-1.68*k,x+0.24*k,y-1.64*k),fill=(200,40,50))
    for sx in (-1,1):
        r_=0.035*k if scare>0.1 else 0.025*k
        dr.ellipse((x+sx*0.06*k-r_,y-1.66*k-r_,x+sx*0.06*k+r_,y-1.66*k+r_),fill=(255,255,255),outline=OUT,width=1); dr.ellipse((x+sx*0.06*k-0.012*k,y-1.67*k,x+sx*0.06*k+0.012*k,y-1.645*k),fill=(20,20,28))
    if scare>0.1:
        dr.ellipse((x-0.035*k,y-1.57*k,x+0.035*k,y-1.5*k),fill=(90,30,30))
        dr.text((x+0.35*k,y-2.1*k),'!',F(70),fill=(255,60,60),stroke=3)
    else: dr.arc((x-0.05*k,y-1.58*k,x+0.05*k,y-1.52*k),20,160,fill=(110,40,40),width=1.5)
# ---------------- Paris street (daytime) ----------------
BLD=[]
r_=np.random.default_rng(8); x_=-900
while x_<2400:
    w_=r_.uniform(330,460); BLD.append((x_,w_,r_.uniform(560,700),r_.integers(0,3))); x_+=w_+6
def facade(dr,x,w,h,var,ground):
    cream=[(236,224,198),(228,214,186),(240,230,208)][var]
    top=ground-h
    dr.rect((x,top,x+w,ground),fill=cream,outline=OUT,width=2)
    dr.poly([(x-8,top),(x+w+8,top),(x+w-30,top-110),(x+30,top-110)],fill=(96,104,124),outline=OUT,width=2)   # mansard
    for wx in np.arange(x+40,x+w-60,90):
        dr.rrect((wx,top-90,wx+44,top-20),10,fill=(70,80,110),outline=OUT,width=1.5)
    rows=int((h-150)//120)
    for rw in range(rows):
        wy=top+40+rw*120
        for wx in np.arange(x+30,x+w-60,90):
            dr.rect((wx,wy,wx+52,wy+82),fill=(90,110,150),outline=OUT,width=1.5); dr.line((wx+26,wy,wx+26,wy+82),fill=OUT,width=1)
            dr.rect((wx-6,wy+70,wx+58,wy+78),fill=(30,30,36))
            for bx in np.arange(wx-4,wx+58,10): dr.line((bx,wy+70,bx,wy+86),fill=(30,30,36),width=1.2)
    dr.rect((x,ground-110,x+w,ground),fill=(180,80,70),outline=OUT,width=2)       # shop front
    dr.rect((x+20,ground-96,x+w-20,ground-10),fill=(150,190,220),outline=OUT,width=1.5)
    for sx in np.arange(x+10,x+w-10,40): dr.poly([(sx,ground-110),(sx+40,ground-110),(sx+20,ground-130)],fill=(200,60,60) if int(sx/40)%2 else (245,245,245))
def eiffel(dr,cx,base,h):
    col=(120,110,140)
    dr.poly([(cx-h*0.22,base),(cx-h*0.04,base-h*0.55),(cx+h*0.04,base-h*0.55),(cx+h*0.22,base)],fill=None,outline=col,width=3)
    dr.poly([(cx-h*0.12,base),(cx,base-h*0.25),(cx+h*0.12,base)],fill=(170,200,235))
    dr.poly([(cx-h*0.05,base-h*0.55),(cx-h*0.012,base-h),(cx+h*0.012,base-h),(cx+h*0.05,base-h*0.55)],fill=col)
    dr.rect((cx-h*0.13,base-h*0.3,cx+h*0.13,base-h*0.27),fill=col); dr.rect((cx-h*0.07,base-h*0.57,cx+h*0.07,base-h*0.54),fill=col)
    dr.poly([(cx-h*0.22,base),(cx-h*0.13,base-h*0.28),(cx-h*0.09,base-h*0.28),(cx-h*0.16,base)],fill=col)
    dr.poly([(cx+h*0.22,base),(cx+h*0.13,base-h*0.28),(cx+h*0.09,base-h*0.28),(cx+h*0.16,base)],fill=col)
PEDS=[(-500,1,(90,60,120)),(-150,-1,(60,120,110)),(900,-1,(120,70,60)),(1300,1,(70,80,140)),(1800,-1,(130,100,60))]
def walker(dr,x,y,col,ph):
    k=PX; lg=math.sin(ph)*0.18*k; ar=math.sin(ph)*0.14*k; skin=(210,160,120)
    dr.line((x,y-0.85*k,x-lg,y),fill=(50,50,70),width=0.13*k); dr.line((x,y-0.85*k,x+lg,y),fill=(50,50,70),width=0.13*k)
    dr.rrect((x-0.24*k,y-1.45*k,x+0.24*k,y-0.8*k),int(0.1*k),fill=col,outline=OUT,width=2)
    dr.line((x-0.2*k,y-1.35*k,x-0.2*k-ar,y-0.9*k),fill=col,width=0.12*k); dr.line((x+0.2*k,y-1.35*k,x+0.2*k+ar,y-0.9*k),fill=col,width=0.12*k)
    dr.ellipse((x-0.15*k,y-1.8*k,x+0.15*k,y-1.45*k),fill=skin,outline=OUT,width=1.5)
    dr.chord((x-0.16*k,y-1.84*k,x+0.16*k,y-1.62*k),180,360,fill=(60,40,30))
def street(t,cam,hero=None,friend_s=None,peds=True,pan=0.0,blur=0.0,dark=0.0,sandwich=False):
    z,f,o=cam; f=(f[0]+pan,f[1])
    im=vgrad((120,180,240),(210,230,250),0,1100); base=canvas((210,230,250)); base.paste(im,(0,0)); im=base.convert('RGBA')
    dsky=Dr(im)
    for (cx,cy,cw) in ((200,260,160),(760,180,200),(980,380,130)):
        for dx in (-0.5,0,0.5): dsky.ellipse((cx+dx*cw-cw*0.45,cy-cw*0.25,cx+dx*cw+cw*0.45,cy+cw*0.25),fill=(255,255,255))
    dsky.ellipse((880,90,980,190),fill=(255,236,150))
    eiffel(dsky,300-pan*0.1,1040,620)
    dw=Dr(im,z,f,o)
    zb=z*0.42; gy=dw.Y(1400)/SS; db=Dr(im,zb,(f[0]*0.6+200,1400),(o[0],gy))
    for (bx,bw,bh,var) in BLD: facade(db,bx,bw,bh,var,1400)
    dw.rect((-3000,1400,3000,1520),fill=(190,186,180),outline=OUT,width=1.5)            # sidewalk
    for x in range(-900,2400,80): dw.line((x,1400,x-20,1520),fill=(170,166,160),width=1.2)
    dw.rect((-3000,1520,3000,1536),fill=(150,146,140))
    dw.rect((-3000,1536,3000,3000),fill=(72,74,84))
    for x in range(-900,2400,260): dw.rect((x,1700,x+140,1712),fill=(230,230,230))
    car(dw,860,1700,(40,120,200))
    if peds:
        for (px,d,col) in PEDS: walker(dw,px+d*t*45,1505,col,t*6+px)
    if friend_s is not None: friend(dw,friend_s[0],1505,friend_s[1],t)
    if hero is not None:
        hx,alpha,mood,look=hero
        hero_layer(im,(z,f,o),hx,1505,alpha,mood=mood,look=look,t=t)
        if sandwich:
            dsw=Dr(im,z,f,o); k=PX; sx,sy=hx+0.32*k,1505-1.2*k
            dsw.rrect((sx-0.2*k,sy-0.07*k,sx+0.2*k,sy+0.07*k),int(0.05*k),fill=(222,180,110),outline=OUT,width=1.5)
            dsw.rect((sx-0.18*k,sy-0.02*k,sx+0.18*k,sy+0.02*k),fill=(90,170,80)); dsw.rect((sx-0.18*k,sy+0.02*k,sx+0.18*k,sy+0.04*k),fill=(220,80,80))
    img=im.convert('RGB')
    if blur>0: img=img.filter(ImageFilter.GaussianBlur(blur*SS))
    if dark>0: img=Image.fromarray((np.asarray(img,np.float32)*(1-dark)).astype(np.uint8))
    return img
def eye_diagram(t,lt):
    im=canvas((14,16,30)).convert('RGBA'); dr=Dr(im)
    def eye(cy,inv,lbl,col):
        cx=600; r=210
        a=110 if inv else 255
        dr.ellipse((cx-r,cy-r,cx+r,cy+r),fill=(245,245,250,int(a*0.9)),outline=(200,200,220,a),width=4)
        dr.chord((cx+r*0.55,cy-r*0.55,cx+r*1.05,cy+r*0.55),270-80,270+260,fill=(90,150,220,a)) if False else None
        dr.ellipse((cx-r-30,cy-90,cx-r+60,cy+90),fill=(110,170,230,a))                       # cornea/iris
        dr.ellipse((cx-r-10,cy-40,cx-r+40,cy+40),fill=(20,20,30,a))                          # pupil
        if not inv: dr.arc((cx-r+12,cy-r+12,cx+r-12,cy+r-12),300,60,fill=(230,80,90),width=14) # retina
        else: dr.arc((cx-r+12,cy-r+12,cx+r-12,cy+r-12),300,60,fill=(230,80,90,60),width=14)
        # light ray
        prog=ease((lt-0.2)/1.2)
        x_end=lerp(40,1080 if inv else cx+r-14,prog)
        dr.line((40,cy,x_end,cy),fill=(255,230,120),width=10)
        for k in range(5):
            px=lerp(40,x_end,(k+((lt*2)%1))/5); dr.ellipse((px-12,cy-12,px+12,cy+12),fill=(255,240,160))
        if not inv and prog>0.95:
            dr.ellipse((cx+r-44,cy-30,cx+r+16,cy+30),fill=(255,230,120,200))
            dr.text((cx,cy+r+70),'IMAGE OK',F(54),fill=(120,230,120),stroke=3)
        if inv and prog>0.95: dr.text((cx,cy+r+70),'AUCUNE IMAGE',F(54),fill=(255,90,90),stroke=3)
        dr.text((cx,cy-r-60),lbl,F(52),fill=col,stroke=3)
    eye(620,False,'ŒIL NORMAL',(255,255,255)); eye(1360,True,'ŒIL INVISIBLE',(150,220,255))
    return im.convert('RGB')
def black_text(t,lt,l1,l2):
    im=canvas((4,4,8)).convert('RGBA'); dr=Dr(im); s=min(1,0.7+lt*2)
    dr.text((540,860),l1,F(int(120*s)),fill=(255,255,255),stroke=5)
    dr.text((540,1010),'=',F(int(90*s)),fill=(255,214,90),stroke=4)
    dr.text((540,1160),l2,F(int(120*s)),fill=(255,90,90),stroke=5)
    return im.convert('RGB')
def outro(t,lt):
    img=street(t,(1.9,(300,1400),(540,1500)),hero=(300,HA,0,math.sin(lt*2)),peds=False).convert('RGBA')
    a=np.asarray(img.convert('RGB'),np.float32)*0.45; im=Image.fromarray(a.astype(np.uint8)).convert('RGBA'); dr=Dr(im)
    s=1+0.06*math.sin(lt*6)
    dr.text((540,420),'PARTIE 2',F(int(150*s)),fill=(255,214,90),stroke=6)
    dr.text((540,560),'bientôt…',F(64,'ExtraBold'),fill=(255,255,255),stroke=4)
    if lt>0.8:
        y=1500+10*math.sin(lt*8); dr.rrect((260,y-60,820,y+60),60,fill=(254,44,85)); dr.text((540,y),'+ Abonne-toi',F(64),fill=(255,255,255))
    return im.convert('RGB')
def sub_button(img,lt):
    im=img.convert('RGBA'); dr=Dr(im); s=ease(lt/0.15)*(1+0.05*math.sin(lt*14))
    if s<0.05: return img
    w,h=560*s,130*s; y=1000
    dr.rrect((540-w/2,y-h/2,540+w/2,y+h/2),int(65*s),fill=(254,44,85)); dr.text((540,y),'+ Abonne-toi',F(int(66*s)),fill=(255,255,255))
    hx=600+40*math.sin(lt*6); dr.ellipse((hx,y+30,hx+70,y+100),fill=(255,220,180),outline=OUT,width=3)   # tapping finger
    return im.convert('RGB')
def headline(img,t,txt1,txt2):
    im=img.convert('RGBA'); dr=Dr(im); sc=min(1.0,0.6+t*3)
    dr.text((540,240),txt1,F(int(100*sc)),fill=(255,255,255),stroke=7)
    dr.text((540,370),txt2,F(int(110*sc)),fill=(255,214,90),stroke=7)
    return im.convert('RGB')
CAM_MED=(2.4,(300,1340),(430,1330))
def frame(t):
    i=0
    for k in range(len(L)):
        if t>=S[k]-0.15: i=k
    lt=t-S[i]
    if i==0:
        alpha=1.0 if t<1.0 else lerp(1.0,HA,ease((t-1.0)/0.5))
        img=street(t,(CAM_MED[0]+0.04*t,CAM_MED[1],CAM_MED[2]),hero=(300,alpha,1 if t>1.3 else 0,0.3),peds=True)
        img=headline(img,t,'ET SI TU DEVENAIS','INVISIBLE ?')
    elif i==1:
        img=street(t,CAM_MED,hero=(300,HA,1,0.5),peds=True); img=headline(img,9,'ET SI TU DEVENAIS','INVISIBLE ?'); img=sub_button(img,lt)
    elif i==2:
        pan=lt*120; img=street(t,(2.0,(300,1340),(480,1330)),hero=(300+lt*120,HA,1,0.6),peds=True,pan=pan)
    elif i==3:
        sc=ease((lt-0.5)/0.4) if lt>0.5 else 0
        img=street(t,(2.2,(450,1340),(540,1330)),hero=(300,HA,1,1.0),friend_s=(560,sc),peds=False)
    elif i==4:
        img=street(t,(3.3,(300,1340),(540,1250)),hero=(300,HA,-1,math.sin(lt*4)),peds=False)
        im=img.convert('RGBA'); dr=Dr(im)
        for k,(qx,qy) in enumerate(((760,520),(860,420),(700,380))):
            if lt>0.4+k*0.3: dr.text((qx,qy+math.sin(lt*5+k)*10),'?',F(110),fill=(255,214,90),stroke=5)
        img=im.convert('RGB')
    elif i==5:
        b=ease(lt/1.2)*30; d=ease((lt-0.9)/0.9)
        img=street(t,(2.0,(300,1340),(480,1330)),hero=None,peds=True,blur=b,dark=d)
    elif i==6: img=eye_diagram(t,lt)
    elif i==7: img=black_text(t,lt,'INVISIBLE','AVEUGLE')
    elif i==8:
        img=street(t,(2.8,(300,1340),(500,1290)),hero=(300,HA,1,0.0),peds=False,sandwich=True)
        if lt>2.8: img=Image.fromarray((np.asarray(img,np.float32)*0.5).astype(np.uint8))
    else: img=outro(t,lt)
    img=img.resize((W,H),Image.LANCZOS); a=np.asarray(img,np.float32)
    for k in range(1,len(L)):
        dt=t-S[k]
        if -0.08<dt<0.08: a=a*(0.6+0.4*abs(dt)/0.08)
    if t<0.1: a=a*(t/0.1)
    if t>T-0.4: a=a*max(0,(T-t)/0.4)
    return a.clip(0,255).astype(np.uint8)
def with_badge(arr,t):
    if t>T-4.0: return arr
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

"""2D: 'Et si tu devenais 100 fois plus petit ? Partie 2 (FIN)'"""
import json,sys,math,subprocess,os
import numpy as np
from PIL import Image,ImageDraw,ImageFilter,ImageFont
HERE=os.path.dirname(os.path.abspath(__file__))
_t=open(os.path.join(HERE,'anim_tiny.py')).read(); exec(_t[:_t.index('def frame(')])
def cat_face(dr,cx,cy,r,ex=0.0,ey=0.0,open_=1.0):
    fur=(150,110,80); dk=(110,78,56)
    for sd in (-1,1):   # ears
        dr.poly([(cx+sd*r*0.95,cy-r*0.35),(cx+sd*r*0.85,cy-r*1.35),(cx+sd*r*0.25,cy-r*0.85)],fill=fur,outline=OUT,width=3)
        dr.poly([(cx+sd*r*0.82,cy-r*0.5),(cx+sd*r*0.78,cy-r*1.1),(cx+sd*r*0.42,cy-r*0.82)],fill=(230,160,160))
    dr.ellipse((cx-r*1.15,cy-r,cx+r*1.15,cy+r*0.95),fill=fur,outline=OUT,width=3)
    for k in range(3): dr.poly([(cx-r*0.18+k*r*0.18,cy-r*0.98),(cx-r*0.1+k*r*0.18,cy-r*0.98),(cx-r*0.14+k*r*0.18,cy-r*0.6)],fill=dk)  # stripes
    dr.ellipse((cx-r*0.55,cy+r*0.05,cx+r*0.55,cy+r*0.85),fill=(235,220,200))   # muzzle
    for sd in (-1,1):
        ox=cx+sd*r*0.45; oy=cy-r*0.2; rr=r*0.27; h=rr*0.8*open_
        dr.ellipse((ox-rr,oy-h,ox+rr,oy+h),fill=(200,210,60),outline=OUT,width=3)
        if open_>0.1:
            px=ox+ex*rr*0.5; py=oy+ey*h*0.4
            dr.ellipse((px-rr*0.14,py-h*0.9,px+rr*0.14,py+h*0.9),fill=(10,10,10))
            dr.ellipse((px-rr*0.45,py-h*0.55,px-rr*0.25,py-h*0.25),fill=(255,255,255))
        for k in (-1,0,1):   # whiskers
            dr.line((cx+sd*r*0.3,cy+r*0.45+k*r*0.08,cx+sd*r*1.35,cy+r*0.35+k*r*0.2),fill=(250,250,250),width=4)
    dr.poly([(cx-r*0.12,cy+r*0.22),(cx+r*0.12,cy+r*0.22),(cx,cy+r*0.36)],fill=(220,110,120),outline=OUT,width=2)
    dr.line((cx,cy+r*0.36,cx,cy+r*0.5),fill=OUT,width=3)
    dr.arc((cx-r*0.2,cy+r*0.4,cx,cy+r*0.6),0,180,fill=OUT,width=3); dr.arc((cx,cy+r*0.4,cx+r*0.2,cy+r*0.6),0,180,fill=OUT,width=3)
def paw(dr,cx,cy,r):
    fur=(150,110,80)
    dr.rrect((cx-r*0.7,cy-2000,cx+r*0.7,cy),int(r*0.6),fill=fur,outline=OUT,width=3)
    dr.ellipse((cx-r,cy-r*0.9,cx+r,cy+r*0.4),fill=fur,outline=OUT,width=3)
    for k in (-1,0,1): dr.ellipse((cx+k*r*0.5-r*0.2,cy-r*0.1,cx+k*r*0.5+r*0.2,cy+r*0.3),fill=(230,160,160))
def crumb(dr,cx,cy,r,rot=0):
    pts=[(cx+math.cos(a+rot)*r*(0.8+0.25*math.sin(a*3)),cy+math.sin(a+rot)*r*0.8*(0.8+0.25*math.cos(a*2))) for a in np.linspace(0,2*math.pi,14)[:-1]]
    dr.poly(pts,fill=(214,160,90),outline=OUT,width=3)
    for k in range(6): dr.ellipse((cx-r*0.5+(k*37)%int(r),cy-r*0.4+(k*23)%int(r*0.8),cx-r*0.5+(k*37)%int(r)+10,cy-r*0.4+(k*23)%int(r*0.8)+10),fill=(240,200,140))
def door_scene(t,lt):
    im=canvas((60,46,40)).convert('RGBA'); dr=Dr(im)
    dr.rect((0,0,W,1350),fill=(120,78,48),outline=OUT,width=4)                 # door
    for (a,b,c_,d_) in ((80,80,500,620),(580,80,1000,620),(80,700,500,1240),(580,700,1000,1240)): dr.rect((a,b,c_,d_),fill=(132,88,56),outline=(90,58,36),width=8)
    dr.rect((0,1350,W,1470),fill=(255,236,170))                               # light gap
    for k in range(12): dr.line((k*100,1470,k*100-60,1920),fill=(255,236,170,90),width=30)
    dr.rect((0,1470,W,H),fill=(150,120,96))
    for k in range(8): dr.line((0,1520+k*k*8,W,1520+k*k*8),fill=(130,100,80),width=3)
    return im
def daisy(dr,cx,cy,r,stem_y):
    dr.line((cx,cy,cx+r*0.3,stem_y),fill=(70,130,50),width=r*0.12)
    for k in range(14):
        a=k*2*math.pi/14; dr.ellipse((cx+math.cos(a)*r*0.75-r*0.28,cy+math.sin(a)*r*0.45-r*0.16,cx+math.cos(a)*r*0.75+r*0.28,cy+math.sin(a)*r*0.45+r*0.16),fill=(255,255,255),outline=(200,200,210),width=2)
    dr.ellipse((cx-r*0.3,cy-r*0.2,cx+r*0.3,cy+r*0.2),fill=(250,200,40),outline=(200,140,20),width=2)
def ladybug(dr,x,y,r):
    dr.ellipse((x-r,y-r*0.8,x+r,y+r*0.8),fill=(220,40,40),outline=OUT,width=2); dr.line((x,y-r*0.8,x,y+r*0.8),fill=OUT,width=2)
    dr.ellipse((x+r*0.6,y-r*0.45,x+r*1.3,y+r*0.45),fill=(20,20,20))
    for (a,b) in ((-0.5,-0.3),(0.3,0.3),(-0.4,0.4),(0.2,-0.4)): dr.ellipse((x+a*r-r*0.15,y+b*r-r*0.15,x+a*r+r*0.15,y+b*r+r*0.15),fill=(20,20,20))
def paris(t,dark=0.0):
    im=vgrad((105,165,235),(225,236,250),0,1460); base=canvas((225,236,250)); base.paste(im,(0,0)); im=base.convert('RGBA'); dsky=Dr(im)
    for (cx,cy,cw) in ((170,230,170),(870,150,210),(620,430,110)):
        for dx in (-0.5,0,0.5): dsky.ellipse((cx+dx*cw-cw*0.45+t*6,cy-cw*0.25,cx+dx*cw+cw*0.45+t*6,cy+cw*0.25),fill=(255,255,255))
    eiffel(dsky,540,1440,1330)
    db=Dr(im,0.62,(0,1400),(0,1470))
    facade(db,-420,700,1050,0,1400); facade(db,1400,700,1100,2,1400)
    dr=Dr(im)
    dr.rect((0,1440,W,H),fill=(200,186,150))          # ground everywhere (no floating)
    dr.rect((0,1440,W,1452),fill=(180,166,132))
    for (x,y,sz,sd) in ((110,1500,300,3),(975,1500,300,8)):
        dr.ellipse((x-120,y-14,x+120,y+14),fill=(150,136,104)); tree(dr,x,y,sz,seed=sd)
    # lawn with mowing stripes + gravel paths
    dr.poly([(420,1440),(660,1440),(1500,H),(-420,H)],fill=(212,196,160))
    dr.poly([(470,1440),(610,1440),(1100,H),(-20,H)],fill=(96,166,70))
    for k in range(6):
        xa=lerp(470,610,k/6); xb=lerp(470,610,(k+0.5)/6); xc=lerp(-20,1100,(k+0.5)/6); xd=lerp(-20,1100,k/6)
        dr.poly([(xa,1440),(xb,1440),(xc,H),(xd,H)],fill=(110,182,80))
    for sd in (-1,1):   # flower border
        for k in range(26):
            p=k/26; x=lerp(540+sd*70,540+sd*560,p**1.6); y=lerp(1442,1920,p**1.6); r=lerp(3,16,p)
            dr.ellipse((x-r,y-r,x+r,y+r),fill=[(230,70,90),(250,200,60),(240,240,255)][k%3])
    # small far people + lamps
    for (x,y,c_) in ((470,1470,(60,60,110)),(620,1480,(150,60,60)),(380,1520,(60,110,90))):
        dr.ellipse((x-4,y-30,x+4,y-22),fill=(230,190,160)); dr.rect((x-5,y-22,x+5,y-4),fill=c_); dr.line((x-2,y-4,x-2,y),fill=(40,40,50),width=2); dr.line((x+2,y-4,x+2,y),fill=(40,40,50),width=2)
    for (x,y,hh) in ((300,1560,150),(800,1560,150)):
        dr.rect((x-3,y-hh,x+3,y),fill=(40,44,40)); dr.rect((x-9,y-hh-18,x+9,y-hh),fill=(255,236,170),outline=(40,44,40),width=2)
    # macro foreground: hero's ground (gravel = rocks for him)
    dr.rect((0,1700,W,H),fill=(205,190,156))
    r_=np.random.default_rng(9)
    for k in range(60):
        x=r_.uniform(-20,1100); y=r_.uniform(1700,1940); s_=r_.uniform(8,26)*(0.6+(y-1700)/240)
        dr.ellipse((x-s_,y-s_*0.6,x+s_,y+s_*0.6),fill=[(180,166,136),(225,212,180),(160,148,122)][k%3],outline=(130,118,96),width=1)
    # giant grass blades + daisy + ladybug (right foreground)
    for k in range(16):
        bx=760+k*24+math.sin(k*3)*12; sway=math.sin(t*2+k)*10; hh=380+(k*53)%260
        dr.poly([(bx-12,1930),(bx+12,1930),(bx+sway+30*math.sin(k),1930-hh)],fill=[(70,140,50),(90,165,60),(60,120,45)][k%3])
    daisy(dr,880+math.sin(t*1.5)*6,1380,120,1930)
    ladybug(dr,900+math.sin(t*1.5)*3,1650,24)
    dr.poly([(40,1880),(130,1740),(280,1700),(320,1790),(220,1890)],fill=(220,140,50),outline=OUT,width=3); dr.line((40,1880,310,1750),fill=(170,90,30),width=4)
    img=im.convert('RGB')
    if dark>0: img=Image.fromarray((np.asarray(img,np.float32)*(1-dark)).astype(np.uint8))
    return img
def txt(img,lines,y0=240):
    im=img.convert('RGBA'); dr=Dr(im)
    for k,(s_,sz,col) in enumerate(lines): dr.text((540,y0+k*int(sz*1.15)),s_,F(sz),fill=col,stroke=7)
    return im.convert('RGB')
def frame(t):
    i=0
    for k in range(len(L)):
        if t>=S[k]-0.15: i=k
    lt=t-S[i]
    if i in (0,1):
        img=table_bg(t,dark=0.3).convert('RGBA'); dr=Dr(img)
        zz=1+0.08*ease(t/3)
        cat_face(dr,540,700,360*zz,ex=0,ey=0.6,open_=min(1,0.2+t*1.5))
        hero(img,540,1690,mood=-1,look=math.sin(t*4)*0.5,t=t)
        img=img.convert('RGB')
        img=txt(img,[("3 SECONDES",100,(255,255,255)),(["3…","2…","1…"][min(2,int(t))],120,(255,90,90))],210) if i==0 else sub_button(img,lt)
    elif i==2:
        img=table_bg(t).convert('RGBA'); dr=Dr(img)
        hx=lerp(260,820,ease(lt/3.0)); hy=1690-abs(math.sin(lt*12))*22
        py=lerp(-200,1520,ease((lt-0.8)/0.5)) if lt<1.8 else lerp(1520,-200,ease((lt-1.8)/0.5))
        paw(dr,lerp(330,420,ease(lt/2)),py,170)
        if 1.2<lt<1.9: dr.text((380,1600),'BAM !',F(80),fill=(255,90,90),stroke=5)
        hero(img,hx,hy,mood=-1,look=0.9,t=t*3)
        img=txt(img.convert('RGB'),[("1 PAS = 1 CM",100,(255,214,90))])
    elif i==3:
        img=table_bg(t).convert('RGBA'); dr=Dr(img)
        lift=ease(lt/1.0); cy=lerp(1700,1690-1.95*PX*HS,lift)
        hero(img,540,1690,mood=1,look=0,t=t)
        dr=Dr(img); crumb(dr,540,cy-90,130)
        img=txt(img.convert('RGB'),[("SUPER FORT",104,(255,255,255)),("POUR TON POIDS",76,(255,214,90))])
    elif i==4:
        img=table_bg(t,dark=0.25).convert('RGBA'); dr=Dr(img)
        p=ease(lt/1.3); cx=lerp(540,1200,p); cy=lerp(1050,700,p)-math.sin(p*math.pi)*500
        cat_face(dr,540,560,300,ex=lerp(0,1,p),ey=lerp(0.6,-0.2,p))
        crumb(dr,cx,cy,90,rot=lt*8)
        hero(img,380,1690,mood=1,look=0.6,t=t)
        img=img.convert('RGB')
    elif i==5:
        img=door_scene(t,lt); hx=lerp(140,620,ease(lt/2.2)); hy=1700-abs(math.sin(lt*12))*20
        hero(img,hx,hy,mood=0,look=0.9,t=t*3,s=HS*lerp(1,0.55,ease((lt-1.2)/1.2)))
        img=img.convert('RGB')
        if lt>2.2: img=Image.fromarray((np.asarray(img,np.float32)*0+255*min(1,(lt-2.2)/0.4)+np.asarray(img,np.float32)*(1-min(1,(lt-2.2)/0.4))).clip(0,255).astype(np.uint8))
    else:
        zoom=1.0+0.05*ease((t-S[6])/4)
        img=paris(t).convert('RGBA')
        hero(img,470,1800,mood=1 if i==6 else 0,look=0.3,t=t,s=HS*0.75)
        img=img.convert('RGB')
        if zoom>1: w2,h2=int(W*SS/zoom),int(H*SS/zoom); img=img.crop(((W*SS-w2)//2,(H*SS-h2)//4,(W*SS-w2)//2+w2,(H*SS-h2)//4+h2)).resize((W*SS,H*SS))
        if i==6:
            img=txt(img,[("330 m",110,(255,255,255)),("= 33 KM",120,(255,214,90))],300) if lt>0.8 else img
        else:
            img=txt(img,[("ET TOI,",96,(255,255,255)),("TU FERAIS QUOI ?",96,(255,214,90))],260)
            im=img.convert('RGBA'); dr=Dr(im)
            if lt>0.5:
                y=1250+10*math.sin(lt*7); dr.rrect((250,y-62,830,y+62),62,fill=(254,44,85)); dr.text((540,y),'Commente !',F(66),fill=(255,255,255))
            if lt>1.6: dr.text((540,560),'Chaque jour un nouveau « Et si… »',F(50,'ExtraBold'),fill=(255,255,255),stroke=4)
            img=im.convert('RGB')
    img=img.resize((W,H),Image.LANCZOS); a=np.asarray(img,np.float32)
    for k in range(1,len(L)):
        dt=t-S[k]
        if -0.08<dt<0.08 and k!=6: a=a*(0.6+0.4*abs(dt)/0.08)
    if t<0.1: a=a*(t/0.1)
    if t>T-0.4: a=a*max(0,(T-t)/0.4)
    return a.clip(0,255).astype(np.uint8)
_b=_t[_t.index('def with_badge('):].replace("'PARTIE 1'","'PARTIE 2'")
if len(sys.argv)>2 and sys.argv[2]=='still':
    exec(_b[:_b.index('if len(sys.argv)')])
    Image.fromarray(with_badge(frame(float(sys.argv[3])),float(sys.argv[3]))).save(f'{D}/still.png'); sys.exit()
exec(_b)

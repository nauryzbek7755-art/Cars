"""2D flat animation: 'Et si le temps s'arrêtait ?'  usage: anim2d.py <dir> [preview t1,t2,...]"""
import json,sys,math,subprocess
import numpy as np
from PIL import Image,ImageDraw,ImageFilter,ImageFont
D=sys.argv[1]; W,H,FPS=1080,1920,30
TL=json.load(open(f'{D}/tl.json')); L=TL['lines']; T=TL['total']
S=[l['start'] for l in L]+[T]
TF=2.3   # moment time freezes
rng=np.random.default_rng(7)
SKY_T=(10,14,38); SKY_B=(46,26,78); PINK=(255,61,127); CYAN=(61,224,255); WARM=(255,204,102)
FONT='/usr/share/fonts/opentype/inter/'
def F(sz,w='ExtraBold'): return ImageFont.truetype(FONT+f'Inter-{w}.otf',sz)
def ease(x): x=min(max(x,0),1); return x*x*(3-2*x)
def lerp(a,b,x): return a+(b-a)*x
# ---------------- static layers ----------------
def sky():
    g=np.linspace(0,1,H)[:,None]
    a=np.array(SKY_T,np.float32)*(1-g)+np.array(SKY_B,np.float32)*g
    a=np.repeat(a[:,None,:],W,1)
    return Image.fromarray(a.astype(np.uint8))
SKY=sky()
STARS=[(rng.uniform(0,W),rng.uniform(0,700),rng.uniform(1,2.6)) for _ in range(90)]
def city_layer(width,base,hmin,hmax,col,win,seed,lit=0.35):
    r=np.random.default_rng(seed); im=Image.new('RGBA',(width,H),(0,0,0,0)); d=ImageDraw.Draw(im); x=0
    while x<width:
        w=int(r.uniform(90,200)); h=int(r.uniform(hmin,hmax)); top=base-h
        d.rectangle((x,top,x+w,base),fill=col)
        if r.random()<0.3: d.rectangle((x+w*0.4,top-40,x+w*0.48,top),fill=col)
        for wy in range(top+20,base-30,34):
            for wx in range(x+14,x+w-20,26):
                if r.random()<lit: d.rectangle((wx,wy,wx+12,wy+18),fill=win)
        x+=w+int(r.uniform(0,12))
    return im
CITY_FAR=city_layer(2600,1250,300,700,(28,22,58,255),(120,110,180,255),1,0.25)
CITY_NEAR=city_layer(2600,1330,200,520,(18,14,38,255),WARM+(255,),2,0.32)
def street():
    im=Image.new('RGBA',(2600,H),(0,0,0,0)); d=ImageDraw.Draw(im)
    d.rectangle((0,1330,2600,1380),fill=(40,36,60,255))        # sidewalk
    d.rectangle((0,1380,2600,H),fill=(22,20,34,255))           # road
    for x in range(0,2600,140): d.rectangle((x,1620,x+80,1636),fill=(200,200,210,255))
    for x in range(820,1220,60): d.rectangle((x,1400,x+34,1600),fill=(70,68,90,255))  # crosswalk
    for x in range(160,2600,520):                               # lamp posts
        d.rectangle((x,980,x+10,1340),fill=(50,46,70,255)); d.rectangle((x-30,970,x+40,985),fill=(50,46,70,255))
    return im
STREET=street()
LAMPS=[x+5 for x in range(160,2600,520)]
GLOW=Image.new('RGBA',(400,400),(0,0,0,0)); ImageDraw.Draw(GLOW).ellipse((100,100,300,300),fill=WARM+(150,)); GLOW=GLOW.filter(ImageFilter.GaussianBlur(50))
RAIN=[(rng.uniform(-200,2800),rng.uniform(0,H),rng.uniform(26,60),rng.uniform(900,1500)) for _ in range(420)]
PEOPLE=[(rng.uniform(200,2400),int(rng.choice([-1,1])),rng.uniform(0.85,1.1),[(60,50,90),(80,40,70),(40,60,90),(90,70,60)][int(rng.integers(4))]) for _ in range(9)]
# ---------------- characters ----------------
def person(d,x,y,s,phase,col,face=(30,26,44)):
    """flat walking silhouette, feet at (x,y), scale s"""
    lg=math.sin(phase)*28*s; ar=math.sin(phase)*22*s
    d.line((x,y-150*s,x-lg,y),fill=col,width=int(16*s)); d.line((x,y-150*s,x+lg,y),fill=col,width=int(16*s))
    d.rounded_rectangle((x-30*s,y-290*s,x+30*s,y-140*s),radius=int(22*s),fill=col)
    d.line((x,y-270*s,x-ar,y-170*s),fill=col,width=int(13*s)); d.line((x,y-270*s,x+ar,y-170*s),fill=col,width=int(13*s))
    d.ellipse((x-26*s,y-350*s,x+26*s,y-296*s),fill=col)
def hero(d,x,y,s=1.0,mood=0.0,look=0.0,arms=0.0,dark=0.0):
    """front-facing hero, feet at (x,y). mood: 1 smile, 0 neutral, -1 worried. arms: 0 down, 1 pushing forward/up."""
    def c(rgb): return tuple(int(v*(1-dark)) for v in rgb)
    hood=c((28,28,40)); skin=c((226,182,146)); hair=c((24,18,16)); shoe=c((235,235,240)); pants=c((40,44,66))
    d.rounded_rectangle((x-70*s,y-30*s,x-12*s,y),radius=int(12*s),fill=shoe); d.rounded_rectangle((x+12*s,y-30*s,x+70*s,y),radius=int(12*s),fill=shoe)
    d.rounded_rectangle((x-62*s,y-250*s,x-8*s,y-22*s),radius=int(14*s),fill=pants); d.rounded_rectangle((x+8*s,y-250*s,x+62*s,y-22*s),radius=int(14*s),fill=pants)
    d.rounded_rectangle((x-110*s,y-520*s,x+110*s,y-230*s),radius=int(60*s),fill=hood)   # torso
    d.rounded_rectangle((x-40*s,y-330*s,x+40*s,y-290*s),radius=int(14*s),fill=c((40,40,56)))  # pocket
    if arms<0.5:
        d.rounded_rectangle((x-150*s,y-500*s,x-96*s,y-260*s),radius=int(26*s),fill=hood); d.rounded_rectangle((x+96*s,y-500*s,x+150*s,y-260*s),radius=int(26*s),fill=hood)
        d.ellipse((x-150*s,y-285*s,x-100*s,y-235*s),fill=skin); d.ellipse((x+100*s,y-285*s,x+150*s,y-235*s),fill=skin)
    else:
        d.rounded_rectangle((x-170*s,y-640*s,x-100*s,y-430*s),radius=int(30*s),fill=hood); d.rounded_rectangle((x+100*s,y-640*s,x+170*s,y-430*s),radius=int(30*s),fill=hood)
        d.ellipse((x-180*s,y-700*s,x-100*s,y-620*s),fill=skin); d.ellipse((x+100*s,y-700*s,x+180*s,y-620*s),fill=skin)
    d.ellipse((x-118*s,y-760*s,x+118*s,y-500*s),fill=hood)                                 # hood
    d.ellipse((x-86*s,y-730*s,x+86*s,y-540*s),fill=skin)                                    # face
    d.chord((x-90*s,y-748*s,x+90*s,y-600*s),180,360,fill=hair)                             # hair
    ex=look*14*s
    for sx in (-1,1):
        d.ellipse((x+sx*38*s-15*s+ex,y-650*s,x+sx*38*s+15*s+ex,y-618*s),fill=c((255,255,255)))
        d.ellipse((x+sx*38*s-8*s+ex*1.4,y-643*s,x+sx*38*s+8*s+ex*1.4,y-625*s),fill=c((20,20,30)))
        if mood<-0.3: d.line((x+sx*38*s-20*s,y-672*s+sx*-6*s,x+sx*38*s+20*s,y-672*s-sx*-6*s),fill=hair,width=int(6*s))
    my=y-588*s
    if mood>0.3: d.arc((x-36*s,my-30*s,x+36*s,my+18*s),20,160,fill=c((120,40,40)),width=int(7*s))
    elif mood<-0.3: d.arc((x-30*s,my,x+30*s,my+40*s),200,340,fill=c((120,40,40)),width=int(7*s))
    else: d.line((x-24*s,my,x+24*s,my),fill=c((120,40,40)),width=int(6*s))
def clock(d,cx,cy,r,hh,mm,col=(230,230,245),alpha=255,glow=None):
    d.ellipse((cx-r,cy-r,cx+r,cy+r),outline=col+(alpha,),width=max(4,int(r*0.06)))
    for k in range(12):
        a=k*math.pi/6; d.line((cx+math.sin(a)*r*0.82,cy-math.cos(a)*r*0.82,cx+math.sin(a)*r*0.94,cy-math.cos(a)*r*0.94),fill=col+(alpha,),width=max(3,int(r*0.035)))
    for ang,ln,wd in ((hh,0.5,0.06),(mm,0.75,0.04)):
        d.line((cx,cy,cx+math.sin(ang)*r*ln,cy-math.cos(ang)*r*ln),fill=col+(alpha,),width=max(3,int(r*wd)))
    d.ellipse((cx-r*0.05,cy-r*0.05,cx+r*0.05,cy+r*0.05),fill=col+(alpha,))
# ---------------- scenes ----------------
def street_scene(t,off,frozen_t,hero_x=540,hero_mood=0,hero_look=0,walk=False,zoom=1.0,show_hero=True,people=True):
    fr=t>=frozen_t; tt=min(t,frozen_t)
    im=SKY.copy().convert('RGBA'); d=ImageDraw.Draw(im)
    for (sx,sy,sr) in STARS: d.ellipse((sx-sr,sy-sr,sx+sr,sy+sr),fill=(255,255,255,int(120+100*math.sin(sx+tt*2))))
    d.ellipse((780,160,900,280),fill=(240,236,220,255))
    im.alpha_composite(CITY_FAR,(-int(off*0.3)%600-600 if False else -int(off*0.3),0))
    im.alpha_composite(CITY_NEAR,(-int(off*0.6),0))
    im.alpha_composite(STREET,(-int(off),0))
    for lx in LAMPS: im.alpha_composite(GLOW,(int(lx-off-200),780))
    d=ImageDraw.Draw(im)
    # car
    cx=(tt*260+200)%2900-400-off
    d.rounded_rectangle((cx,1440,cx+330,1530),radius=30,fill=(150,30,60,255)); d.rounded_rectangle((cx+60,1385,cx+250,1450),radius=26,fill=(150,30,60,255))
    d.rectangle((cx+80,1395,cx+235,1442),fill=(80,120,170,255))
    for wx in (cx+70,cx+260): d.ellipse((wx-34,1500,wx+34,1568),fill=(16,16,20,255))
    beam=Image.new('RGBA',(360,120),(0,0,0,0)); ImageDraw.Draw(beam).polygon([(0,50),(360,0),(360,120),(0,70)],fill=WARM+(70,)); im.alpha_composite(beam,(int(cx+330),1430))
    if people:
        for (px,dirn,sc,col) in PEOPLE:
            x=(px+dirn*tt*90)%2600-off
            person(d,x,1370,sc,tt*6+px,col+(255,))
    # pigeon
    bx=(tt*300+300)%2600-off; by=800+math.sin(tt*3)*30; wing=math.sin(tt*18)*30
    d.polygon([(bx-30,by),(bx+30,by),(bx,by+16)],fill=(170,170,190,255)); d.polygon([(bx-10,by),(bx-50,by-wing),(bx+5,by)],fill=(150,150,170,255))
    if show_hero: hero(d,hero_x,1560,0.85,hero_mood,hero_look)
    # rain
    for (rx,ry,rl,rs) in RAIN:
        y=(ry+tt*rs)%(H+100)-100; x=rx-off*0.9
        if -20<x<W+20:
            if fr: d.ellipse((x-3,y-3,x+3,y+5),fill=(190,220,255,200))
            else: d.line((x,y,x-6,y+rl),fill=(170,200,240,150),width=3)
    if zoom!=1.0:
        w2,h2=int(W/zoom),int(H/zoom); x0=(W-w2)//2; y0=int((H-h2)*0.82)
        im=im.crop((x0,y0,x0+w2,y0+h2)).resize((W,H),Image.BICUBIC)
    return im.convert('RGB')
def frozen_grade(a,amt):
    if amt<=0: return a
    l=a.mean(2,keepdims=True); b=a*(1-0.45*amt)+l*0.45*amt; b=b*(1-0.15*amt)+np.array([60,90,140],np.float32)*0.15*amt
    return b
def shop(t,lt):
    im=SKY.copy().convert('RGBA'); im.alpha_composite(CITY_NEAR,(-300,0)); d=ImageDraw.Draw(im)
    d.rectangle((90,560,990,1400),fill=(36,30,62,255)); d.rectangle((90,1400,990,1430),fill=(60,54,90,255))
    sign=Image.new('RGBA',(W,200),(0,0,0,0)); sd=ImageDraw.Draw(sign); f=F(96)
    tw=sd.textlength('BIJOUTERIE',font=f); sd.text(((W-tw)/2,40),'BIJOUTERIE',font=f,fill=PINK+(255,))
    im.alpha_composite(sign.filter(ImageFilter.GaussianBlur(14)),(0,590)); im.alpha_composite(sign,(0,590))
    d.rectangle((160,830,620,1300),fill=(70,90,140,255)); d.rectangle((680,880,920,1400),fill=(20,18,34,255))
    for k in range(6):
        gx=200+k*68; d.polygon([(gx,1250),(gx+50,1250),(gx+40,1220),(gx+10,1220)],fill=(255,200,60,255))
        d.polygon([(gx+25,1100),(gx+45,1130),(gx+25,1170),(gx+5,1130)],fill=(160,230,255,255))
        sp=0.5+0.5*math.sin(t*5+k); d.ellipse((gx+20-6*sp,1080-6*sp,gx+30+6*sp,1090+6*sp),fill=(255,255,255,int(200*sp)))
    person(d,560,1400,1.0,1.3,(40,50,80,255))        # frozen guard
    d.rectangle((530,1060,590,1080),fill=(20,20,30,255))
    d.rectangle((0,1430,W,H),fill=(22,20,34,255))
    hx=lerp(980,760,ease(lt/3.0))
    hero(d,hx,1620,0.95,mood=1.0,look=-0.6)
    return frozen_grade(np.asarray(im.convert('RGB'),np.float32),1.0)
def closeup(t,lt,dur):
    im=Image.new('RGB',(W,H),(14,12,26)); d=ImageDraw.Draw(im)
    m=lerp(1.0,-1.0,ease((lt-0.2)/0.8))
    hero(d,540,2900,2.6,mood=m,look=math.sin(lt*6)*0.8*ease(lt/0.8))
    a=np.asarray(im,np.float32)
    pulse=max(0,math.sin(lt*7))**6
    yy,xx=np.mgrid[0:H,0:W]; r=np.sqrt(((xx-540)/700.)**2+((yy-960)/1100.)**2)
    a=a+np.clip(r-0.6,0,1)[...,None]*np.array([180,20,40])*(0.4+0.6*pulse)
    return a
def photons(t,lt,dur):
    dark=ease((lt-1.0)/4.5)
    base=street_scene(t,600,TF,hero_x=540,hero_mood=-1,hero_look=0.2,show_hero=True,people=False,zoom=1.3)
    im=base.convert('RGBA'); d=ImageDraw.Draw(im)
    lx=LAMPS[1]-600;
    for k in range(18):          # photons frozen half-way to the eye
        fx=lerp(lx,540,k/26); fy=lerp(990,920,k/26)
        d.ellipse((fx-7,fy-7,fx+7,fy+7),fill=WARM+(230,))
    d.line((lx,990,540,920),fill=WARM+(40,),width=2)
    a=np.asarray(im.convert('RGB'),np.float32); a=frozen_grade(a,1.0)
    return a*(1-dark)
def molecules(t,lt,dur,wall=False):
    im=Image.new('RGBA',(W,H),(6,8,18,255)); d=ImageDraw.Draw(im)
    z=1+0.08*lt
    hero(d,540,1560,0.85,mood=-1,look=0,arms=1.0 if wall else 0.0,dark=0.55)
    lay=Image.new('RGBA',(W,H),(0,0,0,0)); ld=ImageDraw.Draw(lay)
    rr=np.random.default_rng(3)
    for k in range(520):
        x=rr.uniform(0,W); y=rr.uniform(150,1800)
        x=540+(x-540)*z; y=960+(y-960)*z; s=rr.uniform(4,9)
        ld.ellipse((x-s,y-s,x+s,y+s),fill=CYAN+(220,))
    if wall:
        for k in range(4):
            ph=((lt*0.9+k*0.35)%1.4)/1.4; rad=60+ph*420
            ld.ellipse((540-rad,860-rad*0.6,540+rad,860+rad*0.6),outline=CYAN+(int(200*(1-ph)),),width=6)
    glow=lay.filter(ImageFilter.GaussianBlur(10)); im.alpha_composite(glow); im.alpha_composite(lay)
    a=np.asarray(im.convert('RGB'),np.float32)
    if wall:
        sh=int(math.sin(lt*40)*6); a=np.roll(a,sh,1)
    return a
def silence(t,lt,dur):
    base=street_scene(t,900,TF,show_hero=False,zoom=1.15+0.06*lt)
    a=frozen_grade(np.asarray(base,np.float32),1.0)*0.75
    im=Image.fromarray(a.clip(0,255).astype(np.uint8)).convert('RGBA'); d=ImageDraw.Draw(im)
    d.rounded_rectangle((140,560,940,800),radius=30,fill=(0,0,0,150))
    pts=[];
    for k in range(120):
        x=180+k*6; tt=k/120
        amp=0 if tt<min(1,lt/1.5) else 60*math.exp(-((tt*8)%1)*8)*math.sin(k*1.7)
        pts.append((x,680-amp))
    d.line(pts,fill=(80,255,140,255),width=6)
    return np.asarray(im.convert('RGB'),np.float32)
def prison(t,lt,dur):
    im=Image.new('RGBA',(W,H),(10,10,24,255)); d=ImageDraw.Draw(im)
    clock(d,540,700,330,math.radians(300),math.radians(60),alpha=200)
    hero(d,540,1560,0.85,mood=-1,look=0)
    drop=ease(lt/0.8)
    for k in range(9):
        x=100+k*110; d.rounded_rectangle((x,-1600+drop*1600,x+26,1700*drop+20),radius=12,fill=(150,150,170,255))
    d.rectangle((60,1680*drop,1020,1680*drop+30),fill=(150,150,170,255)) if drop>0.95 else None
    return frozen_grade(np.asarray(im.convert('RGB'),np.float32),0.6)
def outro(t,lt,dur):
    im=Image.new('RGBA',(W,H),(10,10,24,255)); d=ImageDraw.Draw(im)
    for (sx,sy,sr) in STARS: d.ellipse((sx-sr,sy-sr+300,sx+sr,sy+sr+300),fill=(255,255,255,140))
    r=360+20*ease(lt/3)
    clock(d,540,760,r,math.radians(300),math.radians(60))
    hero(d,540,1500,0.6,mood=0,look=math.sin(lt)*0.5)
    f=F(110); tw=d.textlength('ET TOI ?',font=f)
    a=int(255*ease((lt-0.5)/0.5)); d.text(((W-tw)/2,190),'ET TOI ?',font=f,fill=WARM+(a,))
    return np.asarray(im.convert('RGB'),np.float32)
def frame(t):
    i=max(k for k in range(10) if t>=S[k]-0.25) if t>=S[0]-0.25 else 0
    lt=t-S[i]; dur=S[i+1]-S[i]
    if i==0:
        off=0; look=math.sin(max(0,t-TF)*4)*0.9 if t>TF else 0
        a=np.asarray(street_scene(t,off,TF,hero_mood=0,hero_look=look,zoom=1.32+0.04*t),np.float32)
        a=frozen_grade(a,ease((t-TF)/0.4))
    elif i in (1,2) and False: pass
    elif i==1:
        off=ease(lt/dur)*900; hx=lerp(380,700,lt/dur)
        a=frozen_grade(np.asarray(street_scene(t,off,TF,hero_x=hx,hero_mood=1,hero_look=0.4,zoom=1.32),np.float32),1.0)
    elif i==2: a=shop(t,lt)
    elif i==3: a=closeup(t,lt,dur)
    elif i==4: a=photons(t,lt,dur)
    elif i==5: a=molecules(t,lt,dur,wall=False)
    elif i==6: a=molecules(t,lt,dur,wall=True)
    elif i==7: a=silence(t,lt,dur)
    elif i==8: a=prison(t,lt,dur)
    else: a=outro(t,lt,dur)
    # freeze flash + transitions
    if 0<=t-TF<0.25: k=(1-(t-TF)/0.25); a=a*(1-k*0.8)+255*k*0.8
    for k in range(1,10):
        dt=t-S[k]
        if -0.12<dt<0.12: a=a*(0.55+0.45*abs(dt)/0.12)
    if t<0.15: a=a*(t/0.15)
    if t>T-0.6: a=a*max(0,(T-t)/0.6)
    return np.clip(a,0,255).astype(np.uint8)
if len(sys.argv)>2 and sys.argv[2]=='preview':
    ts=[float(x) for x in sys.argv[3].split(',')]
    tiles=[Image.fromarray(frame(t)).resize((270,480)) for t in ts]
    sh=Image.new('RGB',(270*min(8,len(tiles)),480*math.ceil(len(tiles)/8)))
    for k,tl in enumerate(tiles): sh.paste(tl,((k%8)*270,(k//8)*480))
    sh.save(f'{D}/preview.jpg',quality=85); sys.exit()
N=int(T*FPS)
ff=subprocess.Popen(['ffmpeg','-y','-v','error','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-','-c:v','libx264','-preset','medium','-crf','17','-pix_fmt','yuv420p',f'{D}/video.mp4'],stdin=subprocess.PIPE)
for n in range(N):
    ff.stdin.write(frame(n/FPS).tobytes())
    if n%150==0: print(n,N,flush=True)
ff.stdin.close(); ff.wait()

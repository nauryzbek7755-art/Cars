"""2D flat animation v2 (supersampled, realistic proportions): 'Et si la Lune disparaissait ? Partie 1'"""
import json,sys,math,subprocess
import numpy as np
from PIL import Image,ImageDraw,ImageFilter,ImageFont
D=sys.argv[1]; W,H,FPS=1080,1920,30; SS=2
TL=json.load(open(f'{D}/tl.json')); L=TL['lines']; T=TL['total']
S=[l['start'] for l in L]+[T]
def ws(i,k): return L[i]['words'][k]['s']
TV=ws(0,4)-0.05            # moon vanishes on "disparaît"
FONT='/usr/share/fonts/opentype/inter/'
def F(sz,w='Black'): return ImageFont.truetype(FONT+f'Inter-{w}.otf',sz*SS)
def ease(x): x=min(max(x,0),1); return x*x*(3-2*x)
def lerp(a,b,x): return a+(b-a)*x
OUT=(14,14,26)
class Dr:
    """ImageDraw wrapper: world coords -> screen via camera (z, focus fx,fy -> screen ox,oy), then supersampled"""
    def __init__(s,im,z=1.0,f=(540,960),o=(540,960)): s.d=ImageDraw.Draw(im); s.im=im; s.z=z; s.f=f; s.o=o
    def X(s,x): return (s.o[0]+(x-s.f[0])*s.z)*SS
    def Y(s,y): return (s.o[1]+(y-s.f[1])*s.z)*SS
    def _p(s,xy): return [s.X(v) if i%2==0 else s.Y(v) for i,v in enumerate(xy)]
    def _w(s,w): return max(1,int(w*s.z*SS)) if w else 0
    def ellipse(s,xy,fill=None,outline=None,width=0): s.d.ellipse(s._p(xy),fill=fill,outline=outline,width=s._w(width))
    def rect(s,xy,fill=None,outline=None,width=0): s.d.rectangle(s._p(xy),fill=fill,outline=outline,width=s._w(width))
    def rrect(s,xy,r,fill=None,outline=None,width=0): s.d.rounded_rectangle(s._p(xy),radius=r*s.z*SS,fill=fill,outline=outline,width=s._w(width))
    def line(s,xy,fill,width=1): s.d.line(s._p(xy),fill=fill,width=s._w(width),joint='curve')
    def poly(s,pts,fill=None,outline=None,width=0): s.d.polygon([(s.X(x),s.Y(y)) for x,y in pts],fill=fill,outline=outline,width=s._w(width))
    def arc(s,xy,a0,a1,fill,width=1): s.d.arc(s._p(xy),a0,a1,fill=fill,width=s._w(width))
    def chord(s,xy,a0,a1,fill): s.d.chord(s._p(xy),a0,a1,fill=fill)
    def text(s,xy,txt,font,fill,anchor='mm',stroke=0,sfill=(0,0,0)): s.d.text((s.X(xy[0]),s.Y(xy[1])),txt,font=font,fill=fill,anchor=anchor,stroke_width=stroke*SS,stroke_fill=sfill)
def canvas(col=(0,0,0)): return Image.new('RGB',(W*SS,H*SS),col)
def vgrad(top,bot,h0=0,h1=H):
    g=np.linspace(0,1,(h1-h0)*SS)[:,None]
    a=np.array(top,np.float32)*(1-g)+np.array(bot,np.float32)*g
    return Image.fromarray(np.repeat(a[:,None,:],W*SS,1).astype(np.uint8))
rng=np.random.default_rng(11)
STARS=[(rng.uniform(0,W),rng.uniform(0,1100),rng.uniform(1.2,3.2),rng.uniform(0,6)) for _ in range(170)]
# ---------------- objects (real-world scale: 1 m = PX px) ----------------
PX=120  # person 1.75 m ≈ 100 px ; car 4.5 m ≈ 260 px ; house 7 m ≈ 400 px
def person_front(dr,x,y,mood=0,look=0,dark=0.0,s=1.0,lamp=False,t=0.0):
    k=PX*s; c=lambda rgb:tuple(int(v*(1-dark)) for v in rgb)
    hood=c((52,56,86)); hood_d=c((38,40,64)); skin=c((232,186,150)); hair=c((40,28,22)); pants=c((34,38,58)); shoe=c((238,238,242))
    h=1.75*k
    dr.rrect((x-0.17*k,y-0.08*k,x-0.02*k,y),4,fill=shoe,outline=OUT,width=1.5); dr.rrect((x+0.02*k,y-0.08*k,x+0.17*k,y),4,fill=shoe,outline=OUT,width=1.5)
    dr.rrect((x-0.15*k,y-0.85*k,x-0.01*k,y-0.06*k),5,fill=pants,outline=OUT,width=1.5); dr.rrect((x+0.01*k,y-0.85*k,x+0.15*k,y-0.06*k),5,fill=pants,outline=OUT,width=1.5)
    dr.rrect((x-0.26*k,y-1.45*k,x+0.26*k,y-0.78*k),int(0.12*k),fill=hood,outline=OUT,width=2)
    dr.rect((x-0.04*k,y-1.42*k,x+0.04*k,y-0.85*k),fill=hood_d)
    dr.rrect((x-0.36*k,y-1.4*k,x-0.22*k,y-0.86*k),int(0.07*k),fill=hood_d,outline=OUT,width=1.5)
    hx,hy=x-0.29*k,y-0.86*k
    dr.line((hx,hy+0.04*k,hx,hy-0.62*k),fill=(120,90,60),width=0.025*k)
    fw,fh=0.33*k,0.22*k; wv=math.sin(t*5)*0.03*k
    for j,colf in enumerate(((0,85,164),(255,255,255),(239,65,53))):
        x0=hx-fw+j*fw/3; x1=x0+fw/3
        dr.poly([(x0,hy-0.62*k+wv*((3-j)/3)),(x1,hy-0.62*k+wv*((2-j)/3)),(x1,hy-0.62*k+fh+wv*((2-j)/3)),(x0,hy-0.62*k+fh+wv*((3-j)/3))],fill=c(colf))
    dr.ellipse((hx-0.045*k,hy-0.03*k,hx+0.045*k,hy+0.06*k),fill=skin,outline=OUT,width=1)
    if lamp:
        dr.rrect((x+0.2*k,y-1.55*k,x+0.36*k,y-1.0*k),int(0.07*k),fill=hood_d,outline=OUT,width=1.5); dr.rrect((x+0.24*k,y-1.7*k,x+0.34*k,y-1.52*k),3,fill=(30,30,34),outline=OUT,width=1)
    else: dr.rrect((x+0.22*k,y-1.4*k,x+0.36*k,y-0.86*k),int(0.07*k),fill=hood_d,outline=OUT,width=1.5)
    dr.ellipse((x-0.21*k,y-1.86*k,x+0.21*k,y-1.4*k),fill=hood,outline=OUT,width=2)
    dr.ellipse((x-0.15*k,y-1.8*k,x+0.15*k,y-1.45*k),fill=skin,outline=OUT,width=1.5)
    dr.chord((x-0.16*k,y-1.84*k,x+0.16*k,y-1.6*k),180,360,fill=hair)
    ex=look*0.03*k
    for sx in (-1,1):
        dr.ellipse((x+sx*0.065*k-0.03*k+ex,y-1.66*k,x+sx*0.065*k+0.03*k+ex,y-1.6*k),fill=(255,255,255))
        dr.ellipse((x+sx*0.065*k-0.016*k+ex*1.3,y-1.65*k,x+sx*0.065*k+0.016*k+ex*1.3,y-1.61*k),fill=(20,20,28))
    my=y-1.54*k
    if mood>0.3: dr.arc((x-0.06*k,my-0.05*k,x+0.06*k,my+0.03*k),20,160,fill=(130,50,50),width=2)
    elif mood<-0.3: dr.arc((x-0.05*k,my,x+0.05*k,my+0.06*k),200,340,fill=(130,50,50),width=2)
    else: dr.line((x-0.04*k,my,x+0.04*k,my),fill=(130,50,50),width=2)
def car(dr,x,y,col=(200,60,70),lights=True):
    k=PX; L_=4.5*k; hb=0.75*k; hr=1.4*k
    dr.rrect((x,y-hb-0.35*k,x+L_,y-0.28*k),int(0.25*k),fill=col,outline=OUT,width=2)
    dr.poly([(x+1.1*k,y-hb-0.3*k),(x+1.7*k,y-hr),(x+3.0*k,y-hr),(x+3.6*k,y-hb-0.3*k)],fill=col,outline=OUT,width=2)
    dr.poly([(x+1.35*k,y-hb-0.32*k),(x+1.8*k,y-hr+0.08*k),(x+2.3*k,y-hr+0.08*k),(x+2.3*k,y-hb-0.32*k)],fill=(110,160,210))
    dr.poly([(x+2.4*k,y-hb-0.32*k),(x+2.4*k,y-hr+0.08*k),(x+2.95*k,y-hr+0.08*k),(x+3.35*k,y-hb-0.32*k)],fill=(110,160,210))
    for wx in (x+0.95*k,x+3.55*k):
        dr.ellipse((wx-0.36*k,y-0.72*k,wx+0.36*k,y),fill=(22,22,26),outline=OUT,width=2); dr.ellipse((wx-0.17*k,y-0.53*k,wx+0.17*k,y-0.19*k),fill=(170,170,180))
    if lights: dr.ellipse((x+L_-0.25*k,y-0.95*k,x+L_-0.02*k,y-0.75*k),fill=(255,236,170))
def house(dr,x,y,w,h,col,roof,wins_lit,seed):
    r=np.random.default_rng(seed)
    dr.rect((x,y-h,x+w,y),fill=col,outline=OUT,width=2)
    dr.poly([(x-14,y-h),(x+w/2,y-h-w*0.45),(x+w+14,y-h)],fill=roof,outline=OUT,width=2)
    for wy in np.arange(y-h+30,y-90,90):
        for wx in np.arange(x+26,x+w-60,80):
            lit=r.random()<wins_lit
            dr.rect((wx,wy,wx+44,wy+56),fill=(255,214,120) if lit else (40,44,70),outline=OUT,width=2)
            dr.line((wx+22,wy,wx+22,wy+56),fill=OUT,width=1.5)
    dr.rect((x+w/2-28,y-90,x+w/2+28,y),fill=(70,50,40),outline=OUT,width=2)
def moon(dr,cx,cy,r,alpha=255):
    dr.ellipse((cx-r,cy-r,cx+r,cy+r),fill=(238,234,214),outline=(200,196,176),width=3)
    for (dx,dy,rr) in ((-0.35,-0.2,0.18),(0.25,0.3,0.14),(0.1,-0.45,0.09),(-0.1,0.4,0.11),(0.42,-0.1,0.08)):
        dr.ellipse((cx+dx*r-rr*r,cy+dy*r-rr*r,cx+dx*r+rr*r,cy+dy*r+rr*r),fill=(214,208,188))
def glow_layer(cx,cy,r,col,a=120,blur=60):
    g=Image.new('RGBA',(W*SS,H*SS),(0,0,0,0)); ImageDraw.Draw(g).ellipse(((cx-r)*SS,(cy-r)*SS,(cx+r)*SS,(cy+r)*SS),fill=col+(a,))
    return g.filter(ImageFilter.GaussianBlur(blur*SS))
GLOW_MOON=glow_layer(760,430,260,(220,220,255),110,70)
def town(t,moon_on,dark=0.0,flash=0.0,tide=0.0,cam=(2.4,(300,1500),(420,1330)),hero_look=0,hero_mood=0,lamp=False):
    sky=vgrad((8,12,36),(40,34,86),0,1120); im=canvas((20,30,60)); im.paste(sky,(0,0)); im=im.convert('RGBA'); dr=Dr(im)
    for (sx,sy,sr,ph) in STARS:
        a=int((150+100*math.sin(ph+t*2))*(1-0.4*moon_on))
        if sy<1050: dr.ellipse((sx-sr,sy-sr,sx+sr,sy+sr),fill=(255,255,255,max(0,a)))
    if moon_on>0:
        im.alpha_composite(Image.blend(Image.new('RGBA',im.size,(0,0,0,0)),GLOW_MOON,moon_on)); dr=Dr(im)
        moon(dr,760,430,120*moon_on)
    sea_top=1120
    sea=vgrad((24,46,96),(10,20,48),0,H-sea_top); im.paste(sea,(0,sea_top*SS)); dr=Dr(im)
    for k in range(18):
        y=sea_top+10+k*k*1.4; ph=t*1.4+k
        for x in range(-40,W+40,70): dr.arc((x+math.sin(ph)*16,y,x+46+math.sin(ph)*16,y+10),200,340,fill=(70,110,170),width=2)
    if moon_on>0:
        for k in range(10):
            y=sea_top+14+k*20; wv=40+k*12+math.sin(t*3+k)*8
            dr.rrect((760-wv/2,y,760+wv/2,y+7),3,fill=(230,230,250,int(200*moon_on*(1-k/12))))
    r=np.random.default_rng(5); x=0
    while x<W:
        bw=r.uniform(36,90); bh=r.uniform(30,110)
        dr.rect((x,sea_top-bh,x+bw,sea_top),fill=(26,24,52),outline=OUT,width=1)
        for wy in np.arange(sea_top-bh+8,sea_top-10,16):
            for wx in np.arange(x+6,x+bw-8,14):
                if r.random()<0.4: dr.rect((wx,wy,wx+6,wy+8),fill=(255,210,120))
        x+=bw+r.uniform(2,10)
    dr.rect((60,sea_top-180,82,sea_top),fill=(220,220,230),outline=OUT,width=1.5)
    for yy in (sea_top-160,sea_top-110,sea_top-60): dr.rect((60,yy,82,yy+14),fill=(200,50,60))
    dr.rect((55,sea_top-196,87,sea_top-178),fill=(255,230,150),outline=OUT,width=1.5)
    # ---- foreground (world coords, camera) ----
    z,f,o=cam; dw=Dr(im,z,f,o)
    wl=f[1]+(1230-o[1])/z+tide*25
    dw.poly([(-3000,wl),(3000,wl-20),(3000,1600),(-3000,1600)],fill=(214,190,140))
    dw.poly([(-3000,wl),(3000,wl-20),(3000,wl-10),(-3000,wl+10)],fill=(240,240,250))
    for k in range(60):
        bx=-600+(k*97)%2000; by=1450+(k*53)%140; dw.ellipse((bx,by,bx+4,by+2.5),fill=(190,168,120))
    dw.rect((-3000,1600,3000,1640),fill=(150,150,160),outline=OUT,width=1.5)
    for x in range(-600,2000,60): dw.line((x,1600,x,1640),fill=(120,120,130),width=1.5)
    dw.rect((-3000,1640,3000,3000),fill=(58,58,70))
    # rail of promenade (behind person)
    dw.line((-3000,1555,3000,1555),fill=(170,170,185),width=4)
    for x in range(-600,2000,90): dw.line((x,1555,x,1600),fill=(150,150,165),width=3)
    dw.rect((640,1230,652,1600),fill=(60,60,74),outline=OUT,width=1); dw.rect((610,1222,690,1236),fill=(60,60,74),outline=OUT,width=1)
    dw.ellipse((620,1232,646,1248),fill=(255,230,160))
    car(dw,360,1600,(210,60,70))
    person_front(dw,300,1600,mood=hero_mood,look=hero_look,lamp=lamp,t=t)
    if lamp:
        beam=Image.new('RGBA',im.size,(0,0,0,0)); bd=ImageDraw.Draw(beam)
        lx,ly=dw.X(300+0.29*PX),dw.Y(1600-1.65*PX)
        bd.polygon([(lx,ly),(W*SS,ly-900*SS),(W*SS,ly+300*SS)],fill=(255,240,180,70)); im.alpha_composite(beam.filter(ImageFilter.GaussianBlur(10*SS)))
    a=np.asarray(im.convert('RGB'),np.float32)
    if dark>0: a=a*(1-0.62*dark)
    if flash>0: a=a*(1-flash)+255*flash
    return Image.fromarray(a.clip(0,255).astype(np.uint8))
def earth_diagram(t,lt,moon_on,bulge,sun=False,label=None,axis=None,red=0.0):
    im=canvas((6,8,20)).convert('RGBA'); dr=Dr(im)
    for (sx,sy,sr,ph) in STARS: dr.ellipse((sx-sr*0.7,sy*1.6-sr,sx+sr*0.7,sy*1.6+sr),fill=(255,255,255,120))
    cx,cy,R=540,980,280
    if sun:
        g=glow_layer(-60,980,260,(255,200,80),160,60); im.alpha_composite(g); dr=Dr(im)
        dr.ellipse((-200,820,80,1140),fill=(255,214,90))
    ang=lt*0.25
    # water envelope
    ex=R+bulge*130; ey=R+18
    env=Image.new('RGBA',im.size,(0,0,0,0)); ed=ImageDraw.Draw(env)
    ed.ellipse(((cx-ex)*SS,(cy-ey)*SS,(cx+ex)*SS,(cy+ey)*SS),fill=(80,150,255,150))
    if bulge>0: env=env.rotate(math.degrees(-ang*0) ,center=(cx*SS,cy*SS))
    im.alpha_composite(env); dr=Dr(im)
    dr.ellipse((cx-R,cy-R,cx+R,cy+R),fill=(40,110,210),outline=OUT,width=3)
    for (dx,dy,w,h) in ((-90,-80,140,110),(40,20,120,150),(-40,100,90,60),(70,-150,80,50)):
        dr.ellipse((cx+dx-w/2,cy+dy-h/2,cx+dx+w/2,cy+dy+h/2),fill=(70,170,90))
    if axis is not None:
        a=math.radians(axis); L2=360
        dr.line((cx-math.sin(a)*L2,cy-math.cos(a)*L2*1.0,cx+math.sin(a)*L2,cy+math.cos(a)*L2),fill=(255,90,90) if red>0 else (255,255,255),width=5)
    if moon_on>0:
        mx=cx+560*math.cos(0.0); my=cy
        dr.ellipse((cx-560,cy-80,cx+560,cy+80),outline=(255,255,255,60),width=2)
        moon(dr,cx+430,cy,70*moon_on)
    if label: dr.text((540,1460),label,F(80),fill=(255,214,90),stroke=4,sfill=(0,0,0))
    a=np.asarray(im.convert('RGB'),np.float32)
    if red>0:
        yy,xx=np.mgrid[0:H*SS,0:W*SS]; r=np.sqrt(((xx-W)/ (W*1.3))**2+((yy-H)/(H*1.2))**2)
    return Image.fromarray(a.clip(0,255).astype(np.uint8))
def closeup(t,lt):
    im=vgrad((20,18,40),(8,8,20),0,H).convert('RGBA'); dr=Dr(im)
    m=lerp(0.0,-1.0,ease((lt-0.3)/0.8))
    person_front(dr,540,4100,mood=m,look=math.sin(lt*5)*0.9,s=2.6*0+1.0) if False else None
    k=6.2; person_front(dr,620,860+1.63*PX*k,mood=m,look=math.sin(lt*5)*0.9,s=k,t=t)
    return im.convert('RGB')
def outro(t,lt):
    im=canvas((6,8,20)).convert('RGBA'); dr=Dr(im)
    for (sx,sy,sr,ph) in STARS: dr.ellipse((sx-sr,sy*1.6-sr,sx+sr,sy*1.6+sr),fill=(255,255,255,150))
    cx,cy,R=540,1050,250
    dr.ellipse((cx-R,cy-R,cx+R,cy+R),fill=(40,110,210),outline=OUT,width=3)
    for (dx,dy,w,h) in ((-90,-80,140,110),(40,20,120,150),(-40,100,90,60)):
        dr.ellipse((cx+dx-w/2,cy+dy-h/2,cx+dx+w/2,cy+dy+h/2),fill=(70,170,90))
    wob=math.sin(lt*3)*18
    a=math.radians(23+wob); dr.line((cx-math.sin(a)*380,cy-math.cos(a)*380,cx+math.sin(a)*380,cy+math.cos(a)*380),fill=(255,80,80),width=6)
    s=1+0.06*math.sin(lt*6)
    dr.text((540,420),'PARTIE 2',F(int(150*s)),fill=(255,214,90),stroke=6,sfill=(0,0,0))
    dr.text((540,560),'bientôt…',F(64,'ExtraBold'),fill=(255,255,255),stroke=4,sfill=(0,0,0))
    if lt>1.0:
        y=1560+10*math.sin(lt*8)
        dr.rrect((260,y-60,820,y+60),60,fill=(254,44,85))
        dr.text((540,y),'+ Abonne-toi',F(64),fill=(255,255,255))
    return im.convert('RGB')
def headline(img,t):
    if t<0.35 or t>S[1]: return img
    im=img.convert('RGBA'); dr=Dr(im)
    sc=min(1.0,0.6+(t-0.35)*3); a=255
    dr.text((540,250),'LA LUNE',F(int(130*sc)),fill=(255,255,255,a),stroke=7,sfill=(0,0,0))
    dr.text((540,400),'A DISPARU',F(int(130*sc)),fill=(255,214,90,a),stroke=7,sfill=(0,0,0))
    return im.convert('RGB')
def badge(img,t):
    if t>T-4.5: return img
    im=img.convert('RGBA'); dr=Dr(im)
    dr.rrect((40,90,300,160),20,fill=(0,0,0,150)); dr.text((170,125),'PARTIE 1',F(40),fill=(255,214,90))
    return im.convert('RGB')
def frame(t):
    i=0
    for k in range(len(L)):
        if t>=S[k]-0.2: i=k
    lt=t-S[i]
    if i==0:
        mo=1.0 if t<TV else max(0,1-(t-TV)/0.25)
        fl=max(0,1-(t-TV)/0.3)*0.7 if t>=TV else 0
        img=town(t,mo,flash=fl,cam=(2.3+0.05*t,(300,1500),(420,1330)),hero_look=0.5 if t>TV else 0,hero_mood=0 if t<TV else -1)
        img=headline(img,t)
    elif i==1: img=town(t,0,dark=ease(lt/1.5),cam=(2.6+0.06*lt,(300,1490),(430,1330)),hero_mood=-1,lamp=lt>1.6)
    elif i==2: img=town(t,0,dark=0.4,cam=(1.6+0.2*ease(lt/1.5),(420,1480),(540,1330)),tide=math.sin(t)*0.5,hero_look=0.8)
    elif i==3: img=earth_diagram(t,lt,1.0,1.0,label='LA LUNE TIRE LA MER')
    elif i==4:
        b=lerp(1.0,0.35,ease(lt/1.5)); img=earth_diagram(t,lt,max(0,1-lt/0.3),b,sun=True,label='MARÉES ÷2 À ÷3')
    elif i==5: img=town(t,0,dark=0.35,cam=(1.9,(360,1480),(480,1330)),tide=-1.0+0.3*math.sin(t*2),hero_mood=-1,hero_look=0.6)
    elif i==6: img=closeup(t,lt)
    elif i==7: img=earth_diagram(t,lt,0,0.35,axis=23+math.sin(lt*4)*12*ease(lt/2),red=1.0,label='???')
    else: img=outro(t,lt)
    img=img.resize((W,H),Image.LANCZOS)
    a=np.asarray(img,np.float32)
    for k in range(1,len(L)):
        dt=t-S[k]
        if -0.1<dt<0.1: a=a*(0.6+0.4*abs(dt)/0.1)
    if t>T-0.4: a=a*max(0,(T-t)/0.4)
    img=Image.fromarray(a.clip(0,255).astype(np.uint8))
    return np.asarray(badge(img.resize((W*SS,H*SS)),t).resize((W,H),Image.LANCZOS)) if False else np.asarray(img)
def with_badge(arr,t):
    if t>T-4.5: return arr
    im=Image.fromarray(arr).convert('RGBA'); d=ImageDraw.Draw(im)
    d.rounded_rectangle((40,90,300,160),radius=20,fill=(0,0,0,150)); d.text((170,125),'PARTIE 1',font=ImageFont.truetype(FONT+'Inter-Black.otf',40),fill=(255,214,90),anchor='mm')
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

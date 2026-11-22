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
            df.poly([(x0,hy-0.62*k+wv*((3-j)/3)),(x1,hy-0.62*k+wv*((2-j)/3)),(x1,hy-0.62*k+fh+wv*((2-j)/3)),(x0,hy-0.62*k+fh+wv*((3-j)/3))],fill=colf)
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
    sh=tuple(int(c*0.86) for c in cream)
    top=ground-h
    dr.rect((x,top,x+w,ground),fill=cream,outline=OUT,width=2)
    for yy in np.arange(top+30,ground-150,24): dr.line((x+2,yy,x+w-2,yy),fill=sh,width=1)     # stone courses
    dr.rect((x,top,x+14,ground),fill=sh); dr.rect((x+w-14,top,x+w,ground),fill=sh)          # pilasters
    # chimneys
    for cxp in (x+w*0.22,x+w*0.7):
        dr.rect((cxp,top-150,cxp+34,top-60),fill=(170,96,80),outline=OUT,width=1.5)
        for k in range(3): dr.rect((cxp+4+k*10,top-162,cxp+12+k*10,top-150),fill=(150,80,66),outline=OUT,width=1)
    dr.poly([(x-8,top),(x+w+8,top),(x+w-30,top-110),(x+30,top-110)],fill=(96,104,124),outline=OUT,width=2)   # mansard
    for yy in np.arange(top-100,top,14): dr.line((x+30-(yy-top+110)*0.0,yy,x+w-30,yy),fill=(84,92,112),width=1)
    dr.rect((x-12,top-6,x+w+12,top+10),fill=(210,198,172),outline=OUT,width=1.5)            # cornice
    for wx in np.arange(x+40,x+w-60,90):
        dr.poly([(wx-6,top-92),(wx+50,top-92),(wx+22,top-112)],fill=(200,190,165),outline=OUT,width=1)
        dr.rrect((wx,top-90,wx+44,top-20),10,fill=(70,80,110),outline=OUT,width=1.5)
    rows=int((h-190)//120)
    for rw in range(rows):
        wy=top+40+rw*120
        for wx in np.arange(x+30,x+w-60,90):
            dr.rect((wx-6,wy-12,wx+58,wy-4),fill=(214,202,176),outline=OUT,width=1)        # lintel
            dr.rect((wx,wy,wx+52,wy+82),fill=(90,110,150),outline=OUT,width=1.5)
            dr.rect((wx+4,wy+4,wx+24,wy+30),fill=(150,180,215)); dr.line((wx+26,wy,wx+26,wy+82),fill=OUT,width=1); dr.line((wx,wy+40,wx+52,wy+40),fill=OUT,width=1)
            dr.rect((wx-14,wy,wx-3,wy+82),fill=(60,90,80),outline=OUT,width=1); dr.rect((wx+55,wy,wx+66,wy+82),fill=(60,90,80),outline=OUT,width=1)  # shutters
            dr.rect((wx-6,wy+70,wx+58,wy+78),fill=(30,30,36))
            for bx in np.arange(wx-4,wx+58,10): dr.line((bx,wy+70,bx,wy+86),fill=(30,30,36),width=1.2)
            if (rw+int(wx))%3==0: dr.ellipse((wx+2,wy+60,wx+20,wy+74),fill=(220,70,90)); dr.ellipse((wx+30,wy+62,wx+46,wy+74),fill=(240,180,60))  # flowers
    # ground floor: stone base, dark shop glass, door, awning — sits ON the sidewalk
    g0=ground-150
    dr.rect((x,g0,x+w,ground),fill=(200,190,170),outline=OUT,width=2)
    shop=[(160,60,60),(40,70,110),(50,100,70)][var]
    dr.rect((x+16,g0+40,x+w-16,ground),fill=shop,outline=OUT,width=2)
    dr.rect((x+30,g0+54,x+w*0.62,ground-14),fill=(46,58,72),outline=OUT,width=1.5)        # vitrine (dark glass)
    dr.poly([(x+40,g0+60),(x+80,g0+60),(x+50,ground-20),(x+30,ground-20)],fill=(80,96,112))   # reflection
    for k in range(4): dr.rrect((x+46+k*34,ground-50,x+70+k*34,ground-24),6,fill=(230,190,110))  # goods
    dx0=x+w*0.68; dr.rect((dx0,g0+60,dx0+70,ground),fill=(60,40,34),outline=OUT,width=1.5)   # door
    dr.rect((dx0+8,g0+70,dx0+62,g0+130),fill=(46,58,72)); dr.ellipse((dx0+54,ground-50,dx0+62,ground-42),fill=(220,190,90))
    dr.rect((x+w*0.18,g0+8,x+w*0.82,g0+36),fill=(30,30,36)); 
    dr.text(((x+w*0.5),g0+22),['BOULANGERIE','CAFÉ','FLEURS'][var],font=F(max(6,int(22*dr.z*SS))),fill=(240,220,150))
    for sx in np.arange(x+16,x+w-16,40): dr.poly([(sx,g0+40),(sx+40,g0+40),(sx+40,g0+70),(sx+20,g0+78),(sx,g0+70)],fill=(200,60,60) if int(sx/40)%2 else (245,245,245),outline=OUT,width=1)
    dr.rect((x-4,ground-8,x+w+4,ground),fill=(120,114,106))                                 # plinth
_TOWER={}
def _tower_sprite(h):
    h=int(h)
    if h in _TOWER: return _TOWER[h]
    S_=SS; Hh=h*S_; wsp=int(0.5*Hh)+40; hsp=int(1.06*Hh)+40
    cx=wsp/2; base=hsp-10
    col=(118,94,82,255); dk=(78,60,52,255); lt_=(150,122,104,255)
    def wout(y): return max(0.011,0.19*math.exp(-3.25*y)-0.004*y)
    def P(xn,y): return (cx+xn*Hh,base-y*Hh)
    mask=Image.new('L',(wsp,hsp),0); md=ImageDraw.Draw(mask)
    ys=np.linspace(0,0.9,120)
    md.polygon([P(-wout(y),y) for y in ys]+[P(wout(y),y) for y in ys[::-1]],fill=255)
    # arch between legs (y<0.17)
    arch=[P(0.112*math.cos(a),0.125*math.sin(a)) for a in np.linspace(0,math.pi,40)]
    md.polygon([P(0.125,-0.01)]+arch+[P(-0.125,-0.01)],fill=0)
    # opening between 1st and 2nd level
    md.polygon([P(-0.042,0.205),P(0.042,0.205),P(0.012,0.335),P(-0.012,0.335)],fill=0)
    # small openings above 2nd level
    md.polygon([P(-0.017,0.375),P(0.017,0.375),P(0.004,0.80),P(-0.004,0.80)],fill=0)
    lay=Image.new('RGBA',(wsp,hsp),col); ld=ImageDraw.Draw(lay)
    # shading: right half slightly darker
    ld.rectangle((cx,0,wsp,hsp),fill=(104,82,72,255))
    sp=max(5,int(Hh/110)); lw=max(1,int(Hh/900))
    for k in range(-hsp,wsp+hsp,sp):
        ld.line((k,0,k+hsp*0.55,hsp),fill=dk,width=lw); ld.line((k,0,k-hsp*0.55,hsp),fill=dk,width=lw)
    for y in np.arange(0,0.9,0.012): ld.line((0,base-y*Hh,wsp,base-y*Hh),fill=dk,width=lw+1)
    spr=Image.new('RGBA',(wsp,hsp),(0,0,0,0)); spr.paste(lay,(0,0),mask)
    d=ImageDraw.Draw(spr); ew=max(2,int(Hh/280))
    # edge girders
    for sd in (-1,1):
        d.line([P(sd*wout(y),y) for y in ys],fill=dk,width=ew*2)
        d.line([P(sd*(wout(y)-0.045*(1-y/0.2)),y) for y in np.linspace(0,0.17,20)],fill=dk,width=ew)
    d.line(arch,fill=dk,width=ew*2)
    arch2=[P(0.105*math.cos(a),0.115*math.sin(a)) for a in np.linspace(0,math.pi,40)]; d.line(arch2,fill=lt_,width=ew)
    # platforms with frieze + railings
    for (y,ext,th) in ((0.17,0.012,0.022),(0.345,0.008,0.014),(0.835,0.004,0.012)):
        w=wout(y)+ext; x0,y0=P(-w,y+th); x1,y1=P(w,y)
        d.rectangle((x0,y0,x1,y1),fill=(92,72,62,255))
        n=int((x1-x0)/(Hh*0.012))+1
        for k in range(n):   # small arches on frieze
            ax=x0+(x1-x0)*(k+0.5)/n; r=(x1-x0)/n*0.35
            d.arc((ax-r,y0+(y1-y0)*0.25,ax+r,y0+(y1-y0)*0.25+2*r),180,360,fill=lt_,width=lw+1)
        d.line((x0,y0,x1,y0),fill=dk,width=ew)
        for k in range(n*2+1): xx=x0+(x1-x0)*k/(n*2); d.line((xx,y0,xx,y0-Hh*0.008),fill=dk,width=lw)
        d.line((x0,y0-Hh*0.008,x1,y0-Hh*0.008),fill=dk,width=lw)
    # top cabin + antenna
    x0,y0=P(-0.016,0.9); x1,y1=P(0.016,0.855); d.rectangle((x0,y0,x1,y1),fill=dk)
    x0,y0=P(-0.008,0.93); x1,y1=P(0.008,0.9); d.rectangle((x0,y0,x1,y1),fill=dk)
    d.line((P(0,0.93),P(0,1.03)),fill=dk,width=ew); d.ellipse((cx-ew*2,base-1.03*Hh-ew*2,cx+ew*2,base-1.03*Hh+ew*2),fill=(230,60,60))
    _TOWER[h]=(spr,cx,base); return _TOWER[h]
def eiffel(dr,cx,base,h):
    spr,ox,oy=_tower_sprite(h)
    dr.im.paste(spr,(int(dr.X(cx)-ox),int(dr.Y(base)-oy)),spr)
_TREES={}
def _tree_sprite(sz,seed):
    key=(int(sz),seed)
    if key in _TREES: return _TREES[key]
    r=np.random.default_rng(seed); S_=SS; Wt=int(sz*S_); Ht=int(sz*1.35*S_)
    im=Image.new('RGBA',(Wt,Ht),(0,0,0,0)); d=ImageDraw.Draw(im)
    bx,by=Wt/2,Ht-2
    bark=(110,84,64,255); bark2=(150,124,96,255)
    # trunk (plane tree: mottled)
    tw=sz*0.07*S_
    d.polygon([(bx-tw,by),(bx+tw,by),(bx+tw*0.6,by-Ht*0.45),(bx-tw*0.6,by-Ht*0.45)],fill=bark)
    for k in range(10):
        yy=by-r.uniform(0,Ht*0.45); xx=bx+r.uniform(-tw*0.5,tw*0.5); s_=r.uniform(3,8)*S_
        d.ellipse((xx-s_,yy-s_*1.5,xx+s_,yy+s_*1.5),fill=bark2)
    def branch(x,y,a,l,w,dep):
        x2=x+math.cos(a)*l; y2=y-math.sin(a)*l
        d.line((x,y,x2,y2),fill=bark,width=max(1,int(w)))
        if dep>0:
            for da in (-0.5,0.45): branch(x2,y2,a+da+r.uniform(-0.15,0.15),l*0.72,w*0.65,dep-1)
    branch(bx,by-Ht*0.42,math.pi/2,Ht*0.18,tw*1.1,4)
    # foliage clusters with 3 tones
    cy=Ht*0.38; R=Wt*0.46
    pts=[]
    for k in range(260):
        a=r.uniform(0,2*math.pi); rr=R*math.sqrt(r.uniform(0,1))
        pts.append((bx+math.cos(a)*rr,cy+math.sin(a)*rr*0.75))
    pts.sort(key=lambda p:p[1])
    for (x,y) in pts:
        light=(bx+R-x)/(2*R)*0.4+(cy+R-y)/(2*R)*0.6   # light from top-left
        light=1-light
        tone=[(48,96,48),(70,128,58),(98,156,72),(132,184,90)][min(3,int((1-light)*4))]
        s_=r.uniform(0.07,0.12)*Wt
        d.ellipse((x-s_,y-s_*0.8,x+s_,y+s_*0.8),fill=tone+(255,))
    for k in range(70):   # leaf highlights
        x,y=pts[r.integers(0,len(pts))]; s_=r.uniform(0.015,0.03)*Wt
        if y<cy: d.ellipse((x-s_,y-s_,x+s_,y+s_),fill=(170,210,110,255))
    for k in range(6):    # sky holes
        x,y=pts[r.integers(0,len(pts))]; s_=r.uniform(0.012,0.022)*Wt
        d.ellipse((x-s_,y-s_,x+s_,y+s_),fill=(170,205,235,255))
    _TREES[key]=(im,Wt/2,Ht-2); return _TREES[key]
def tree(dr,x,base,sz,seed=1):
    spr,ox,oy=_tree_sprite(sz*dr.z,seed)
    dr.im.paste(spr,(int(dr.X(x)-ox),int(dr.Y(base)-oy)),spr)
def sugar(dr,x0,y0,x1,y1,dep=60,seed=5):
    r=np.random.default_rng(seed)
    dr.poly([(x0,y0),(x0+dep,y0-dep*0.8),(x1+dep,y0-dep*0.8),(x1,y0)],fill=(255,255,255),outline=OUT,width=3)
    dr.poly([(x1,y0),(x1+dep,y0-dep*0.8),(x1+dep,y1-dep*0.8),(x1,y1)],fill=(214,216,226),outline=OUT,width=3)
    dr.rect((x0,y0,x1,y1),fill=(242,243,248),outline=OUT,width=3)
    for k in range(260):   # sugar crystals
        u,v=r.uniform(0,1),r.uniform(0,1); s_=r.uniform(4,10); c_=[(225,227,236),(255,255,255),(205,208,220)][k%3]
        xx=lerp(x0+6,x1-6,u); yy=lerp(y0+6,y1-6,v); dr.poly([(xx,yy-s_),(xx+s_,yy),(xx,yy+s_),(xx-s_,yy)],fill=c_)
    for k in range(80):
        u,v=r.uniform(0,1),r.uniform(0,1); s_=r.uniform(3,7); xx=x0+u*(x1-x0)+v*dep; yy=y0-v*dep*0.8
        dr.poly([(xx,yy-s_*0.6),(xx+s_,yy),(xx,yy+s_*0.6),(xx-s_,yy)],fill=(232,234,242))
    for k in range(14):
        u,v=r.uniform(0,1),r.uniform(0,1); xx=lerp(x0,x1,u); yy=lerp(y0,y1,v)
        dr.line((xx-8,yy,xx+8,yy),fill=(255,255,255),width=2); dr.line((xx,yy-8,xx,yy+8),fill=(255,255,255),width=2)
    for k in range(5): dr.ellipse((x0+40+k*70,y1+4,x0+52+k*70,y1+12),fill=(250,250,252))   # grains on table
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
    eiffel(dsky,320-pan*0.1,1180,1050)
    dw=Dr(im,z,f,o)
    zb=z*0.42; gy=dw.Y(1400)/SS; db=Dr(im,zb,(f[0]*0.6+200,1400),(o[0],gy))
    for (bx,bw,bh,var) in BLD: facade(db,bx,bw,bh,var,1400)
    dw.rect((-3000,1400,3000,1520),fill=(190,186,180),outline=OUT,width=1.5)            # sidewalk
    for x in range(-900,2400,80): dw.line((x,1400,x-20,1520),fill=(170,166,160),width=1.2)
    dw.rect((-3000,1520,3000,1536),fill=(150,146,140))
    dw.rect((-3000,1536,3000,3000),fill=(72,74,84))
    for x in range(-900,2400,260): dw.rect((x,1700,x+140,1712),fill=(230,230,230))
    for lx in range(-600,2400,620):
        dw.rect((lx-6,1180,lx+6,1470),fill=(40,44,40)); dw.rect((lx-14,1460,lx+14,1476),fill=(40,44,40))
        dw.poly([(lx-22,1180),(lx+22,1180),(lx+14,1150),(lx-14,1150)],fill=(40,44,40)); dw.rect((lx-14,1180,lx+14,1210),fill=(255,236,170),outline=(40,44,40),width=2)
    for tx in range(-820,2400,900): tree(dw,tx,1472,440,seed=abs(tx)%7+1)
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

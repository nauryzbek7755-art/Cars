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

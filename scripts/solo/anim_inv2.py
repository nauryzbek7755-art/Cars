"""2D: 'Et si tu devenais invisible ? Partie 2' — food visible in stomach"""
import os,sys
HERE=os.path.dirname(os.path.abspath(__file__))
_src=open(os.path.join(HERE,'anim_inv.py')).read()
__file__=os.path.join(HERE,'anim_inv.py'); exec(_src[:_src.index('CAM_MED=')])
CAM_MED=(2.4,(300,1340),(430,1330))
def sandwich(dr,x,y,k,bite=0):
    dr.rrect((x-0.24*k,y-0.08*k,x+0.24*k,y+0.08*k),int(0.06*k),fill=(222,180,110),outline=OUT,width=1.5)
    dr.rect((x-0.22*k,y-0.025*k,x+0.22*k,y+0.015*k),fill=(90,170,80)); dr.rect((x-0.22*k,y+0.015*k,x+0.22*k,y+0.045*k),fill=(220,80,80))
    if bite: dr.ellipse((x+0.14*k,y-0.12*k,x+0.32*k,y+0.06*k),fill=(0,0,0,0))
def belly_food(im,cam,x,y,t,amt=1.0):
    z,f,o=cam; dr=Dr(im,z,f,o); k=PX
    cx,cy=x,y-1.1*k
    dr.ellipse((cx-0.2*k,cy-0.16*k,cx+0.2*k,cy+0.16*k),fill=(255,150,120,int(110*amt)),outline=(255,120,90,int(200*amt)),width=1.2)
    for j in range(7):
        a=j*0.9+t*1.2; r=0.08*k
        px=cx+math.cos(a)*r; py=cy+math.sin(a*1.3)*r*0.7
        col=[(222,180,110),(90,170,80),(220,80,80)][j%3]
        dr.ellipse((px-0.05*k,py-0.04*k,px+0.05*k,py+0.04*k),fill=col+(int(255*amt),))
def crowd_point(dr,t,lt,xs):
    for j,x in enumerate(xs):
        friend(dr,x,1505,0.0 if lt<0.4+j*0.2 else 1.0 if lt<0.9+j*0.2 else 0.3,t)
def frame(t):
    i=0
    for k in range(len(L)):
        if t>=S[k]-0.15: i=k
    lt=t-S[i]
    if i==0:
        img=street(t,(CAM_MED[0]+0.04*t,CAM_MED[1],CAM_MED[2]),hero=(300,HA,-1,0.4),peds=True).convert('RGBA')
        dr=Dr(img);
        for k_ in range(3):
            if t>0.6+k_*0.3: dr.text((620+k_*60,700-k_*40),'GRR',F(40+k_*8),fill=(255,214,90),stroke=3)
        img=headline(img.convert('RGB'),t,'INVISIBLE…','MAIS AFFAMÉ 🍔'.replace(' 🍔',''))
    elif i==1:
        img=street(t,CAM_MED,hero=(300,HA,0,0.4),peds=True); img=headline(img,9,'INVISIBLE…','MAIS AFFAMÉ'); img=sub_button(img,lt)
    elif i==2:
        cam=(2.0,(450,1340),(540,1330)); hx=330
        img=street(t,cam,hero=(hx,HA,1,0.5),peds=False,sandwich=True).convert('RGBA')
        dr=Dr(img,*cam); crowd_point(dr,t,lt-1.5,[560,640])
        img=img.convert('RGB')
    elif i==3:
        img=street(t,(3.2,(300,1300),(540,1250)),hero=(300,HA,1 if lt<1.2 else -1,0),peds=False,sandwich=lt<1.0)
        if 1.0<lt<1.25: img=Image.fromarray((np.asarray(img,np.float32)*0.6+100).clip(0,255).astype(np.uint8))
    elif i==4 or i==5:
        cam=(3.6,(300,1290),(540,1150)) if i==4 else (2.0,(420,1340),(540,1330))
        img=street(t,cam,hero=(300,HA,-1,0.3),peds=False).convert('RGBA')
        belly_food(img,cam,300,1505,t)
        if i==5:
            dr=Dr(img,*cam); crowd_point(dr,t,lt,[510,590])
            dr2=Dr(img); s=min(1,0.6+lt*2)
            dr2.text((540,300),'TA NOURRITURE',F(int(90*s)),fill=(255,255,255),stroke=6); dr2.text((540,410),'RESTE VISIBLE',F(int(100*s)),fill=(255,214,90),stroke=6)
        else:
            dr=Dr(img,*cam); k=PX
            r=0.3*k*(1+0.08*math.sin(lt*6)); dr.ellipse((300-r,1505-1.1*k-r,300+r,1505-1.1*k+r),outline=(255,90,90),width=3)
        img=img.convert('RGB')
    elif i==6:
        im=canvas((4,4,8)).convert('RGBA'); dr=Dr(im); s=min(1,0.7+lt*2)
        for j,(w,c) in enumerate((('INVISIBLE',(255,255,255)),('AVEUGLE',(255,90,90)),('TRAHI PAR UN SANDWICH',(255,214,90)))):
            if lt>j*0.8: dr.text((540,760+j*170),w,F(int((110 if j<2 else 72)*s)),fill=c,stroke=5)
        img=im.convert('RGB')
    else:
        img=street(t,(1.9,(300,1400),(540,1500)),hero=(300,HA,0,math.sin(lt*2)),peds=False).convert('RGBA')
        a=np.asarray(img.convert('RGB'),np.float32)*0.45; im=Image.fromarray(a.astype(np.uint8)).convert('RGBA'); dr=Dr(im)
        s=1+0.05*math.sin(lt*6)
        dr.text((540,360),'TON',F(int(110*s)),fill=(255,255,255),stroke=6); dr.text((540,490),'SUPER-POUVOIR ?',F(int(100*s)),fill=(255,214,90),stroke=6)
        if lt>0.8:
            y=1500+10*math.sin(lt*8); dr.rrect((240,y-60,840,y+60),60,fill=(254,44,85)); dr.text((540,y),'💬 Commente !'.replace('💬 ',''),F(64),fill=(255,255,255))
        img=im.convert('RGB')
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
    d.rounded_rectangle((40,60,300,130),radius=20,fill=(0,0,0,150)); d.text((170,95),'PARTIE 2',font=ImageFont.truetype(FONT+'Inter-Black.otf',40),fill=(255,214,90),anchor='mm')
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

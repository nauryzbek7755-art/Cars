"""2D: 'Que faire si ta voiture tombe dans l'eau ?'"""
import os,sys,json,math,subprocess
import numpy as np
from PIL import Image,ImageDraw,ImageFilter,ImageFont
HERE=os.path.dirname(os.path.abspath(__file__))
D=sys.argv[1]; W,H,FPS=1080,1920,30; SS=2
SR=48000
def dur(f): return float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f],capture_output=True,text=True).stdout)
NL=9; st=[]; t=0.25
for i in range(NL):
    st.append(t); t+=dur(f'{D}/vo/l{i:02d}.mp3')+(0.15 if i==0 else 0.35)
T=t+0.8; S=st+[T]
_l=open(os.path.join(HERE,'anim_lune.py')).read()
_pre=_l[:_l.index('def house(')]
_pre=_pre[_pre.index('FONT='):]
L=[{'start':s} for s in st]
def ws(i,k): return st[i]
exec(_pre)
OUT=(14,14,26)
NL=9
st=[]; t=0.25
for i in range(NL):
    st.append(t); t+=dur(f'{D}/vo/l{i:02d}.mp3')+(0.15 if i==0 else 0.35)
T=t+0.8; S=st+[T]
def speed_at(t):
    if t<S[2]: return 130
    return max(0,130-(t-S[2])/(S[7]-S[2])*130)
def timer(dr,t): pass
def gauge(dr,cx,cy,r,v):
    dr.ellipse((cx-r,cy-r,cx+r,cy+r),fill=(20,22,34,230),outline=(200,200,210),width=6)
    for kk in range(0,141,20):
        a=math.radians(220-kk/140*260); dr.line((cx+math.cos(a)*r*0.78,cy-math.sin(a)*r*0.78,cx+math.cos(a)*r*0.92,cy-math.sin(a)*r*0.92),fill=(220,220,230),width=4)
    a=math.radians(220-v/140*260); dr.line((cx,cy,cx+math.cos(a)*r*0.8,cy-math.sin(a)*r*0.8),fill=(255,70,70),width=8)
    dr.ellipse((cx-14,cy-14,cx+14,cy+14),fill=(255,70,70)); dr.text((cx,cy+r*0.45),f'{int(v)} km/h',F(44),fill=(255,255,255))
def step_badge(dr,n,txt,lt,col=(255,214,90)):
    s=min(1,0.6+lt*3)
    dr.rrect((90,330,990,500),40,fill=(0,0,0,180)); dr.ellipse((120,355,240,475),fill=col)
    dr.text((180,415),str(n),F(int(80*s)),fill=(20,20,30)); dr.text((615,415),txt,F(int((48 if len(txt)>18 else 60)*s)),fill=(255,255,255))
def road(dr,t,off,shoulder=0.0):
    dr.rect((0,1300,W,H),fill=(70,72,82))
    dr.rect((0,1290,W,1310),fill=(230,230,230)); dr.rect((0,1880,W,1900),fill=(230,230,230))
    for x in range(-200,W+200,260): xx=(x-off)%(W+260)-200; dr.rect((xx,1590,xx+150,1606),fill=(240,240,240))
    for x in range(-300,W+300,380):
        xx=(x-off*0.5)%(W+380)-300; dr.rect((xx+40,1030,xx+56,1290),fill=(110,80,50)); dr.ellipse((xx-20,900,xx+116,1080),fill=(70,150,80),outline=OUT,width=2)
def car_side_f(dr,x,y,k,haz=False,t=0.0):
    dr.rrect((x,y-1.35*k,x+4.6*k,y-0.25*k),int(0.3*k),fill=(40,110,200),outline=OUT,width=3)
    dr.poly([(x+1.0*k,y-1.3*k),(x+1.6*k,y-2.15*k),(x+3.3*k,y-2.15*k),(x+3.9*k,y-1.3*k)],fill=(40,110,200),outline=OUT,width=3)
    # windows follow the cabin slope (front pillar 1.0->1.6, rear 3.9->3.3)
    dr.poly([(x+1.25*k,y-1.36*k),(x+1.7*k,y-2.03*k),(x+2.32*k,y-2.03*k),(x+2.32*k,y-1.36*k)],fill=(170,210,240),outline=OUT,width=2)
    dr.poly([(x+2.48*k,y-1.36*k),(x+2.48*k,y-2.03*k),(x+3.2*k,y-2.03*k),(x+3.65*k,y-1.36*k)],fill=(170,210,240),outline=OUT,width=2)
    person_front(dr,x+1.8*k,y-0.55*k+0.2*k,mood=-1,look=0.6,s=0.95*k/PX,t=t)
    dr.rect((x+0.3*k,y-1.32*k,x+4.3*k,y-0.3*k),fill=(40,110,200)); dr.line((x+1.2*k,y-1.3*k,x+1.2*k,y-0.32*k),fill=OUT,width=2); dr.line((x+2.4*k,y-1.3*k,x+2.4*k,y-0.32*k),fill=OUT,width=2); dr.line((x+3.7*k,y-1.3*k,x+3.7*k,y-0.32*k),fill=OUT,width=2)
    for wx in (x+0.95*k,x+3.65*k):
        dr.ellipse((wx-0.42*k,y-0.8*k,wx+0.42*k,y+0.04*k),fill=(22,22,26),outline=OUT,width=3); dr.ellipse((wx-0.2*k,y-0.58*k,wx+0.2*k,y-0.18*k),fill=(170,170,180))
    on=haz and int(t*3)%2==0
    dr.ellipse((x+4.4*k,y-1.2*k,x+4.62*k,y-0.95*k),fill=(255,170,0) if on else (120,90,40))
    dr.ellipse((x-0.02*k,y-1.2*k,x+0.2*k,y-0.95*k),fill=(255,170,0) if on else (120,40,40))
def icon(dr,i,lt,t):
    cx,cy=540,760
    dr.rrect((300,580,780,940),40,fill=(255,255,255,235),outline=OUT,width=3)
    if i==0 or i==3:
        py=cy+40+ (math.sin(lt*14)*30 if i==3 else min(1,lt*3)*40)
        dr.rrect((470,py-90,610,py+30),20,fill=(60,60,70)); dr.text((540,py-30),'FREIN',F(32),fill=(255,255,255))
        if i==0 and lt>1.2: dr.text((700,650),'?!',F(90),fill=(255,60,60))
    elif i==2:
        dr.rrect((470,cy-40,610,cy+90),20,fill=(60,60,70)); dr.text((540,cy+25),'GAZ',F(36),fill=(255,255,255))
        dr.line((420,cy-100,660,cy+140),fill=(255,60,60),width=14)
    elif i==4:
        g=5-min(2,int(lt*1.2)); dr.rect((530,cy-60,550,cy+120),fill=(40,40,50)); dr.ellipse((480,cy-130,600,cy-10),fill=(30,30,40))
        dr.text((540,cy-70),str(g),F(70),fill=(255,214,90))
    elif i==5:
        a=min(1,lt/1.5)*0.7; dr.line((420,cy+100,420+math.cos(a)*300,cy+100-math.sin(a)*300),fill=(40,40,50),width=40)
        dr.text((540,cy+150),'DOUCEMENT',F(40),fill=(40,40,50))
    elif i==6:
        on=int(t*3)%2==0; dr.poly([(540,cy-120),(660,cy+90),(420,cy+90)],fill=(255,60,60) if on else (150,60,60),outline=OUT,width=4)
        dr.poly([(540,cy-50),(600,cy+55),(480,cy+55)],fill=(255,255,255))
    elif i==7:
        dr.ellipse((440,cy-90,560,cy+30),outline=(40,40,50),width=16); dr.rect((540,cy-40,680,cy-10),fill=(40,40,50))
        dr.text((540,cy+100),'MOTEUR ON',F(44),fill=(40,160,60))
def scene(t,i,lt):
    im=vgrad((140,195,235),(205,228,245),0,1300); base=canvas((70,72,82)); base.paste(im,(0,0)); im=base.convert('RGBA'); dr=Dr(im)
    v=speed_at(t); off=t*0  # accumulate distance
    dist=sum(speed_at(x/10)*0.6 for x in range(int(t*10)))
    road(dr,t,dist)
    shift=min(1,max(0,(t-S[6])/(S[7]-S[6]))) if t>S[6] else 0
    k=200; y=1840-shift*0  ; x=40
    car_side_f(dr,x,1560+shift*290,k,haz=t>S[6],t=t)
    if i<8:
        gauge(dr,860,180,140,v)
        if i==0:
            dr.text((540,420),'TES FREINS',F(110),fill=(255,255,255),stroke=7); dr.text((540,540),'NE RÉPONDENT PLUS',F(76),fill=(255,214,90),stroke=7)
            if lt>1.3: icon(dr,0,lt,t)
        elif i==1:
            s=ease(lt/0.15)*(1+0.05*math.sin(lt*14))
            if s>0.05:
                w,h=600*s,140*s; yy=700; dr.rrect((540-w/2,yy-h/2,540+w/2,yy+h/2),int(70*s),fill=(254,44,85)); dr.text((540,yy),'+ Abonne-toi',F(max(1,int(70*s))),fill=(255,255,255))
        else:
            B={2:(1,'LÂCHE LE GAZ'),3:(2,'FREIN : FORT / POMPE'),4:(3,'RÉTROGRADE'),5:(4,'FREIN À MAIN'),6:('!','WARNINGS + ZONE SÛRE'),7:('!','NE COUPE PAS LE MOTEUR')}
            n,txt=B[i]; step_badge(dr,n,txt,lt,(255,90,90) if n=='!' else (255,214,90)); icon(dr,i,lt,t)
    else:
        im=canvas((10,14,30)).convert('RGBA'); d2=Dr(im)
        d2.text((540,300),'FREINS LÂCHÉS ?',F(90),fill=(255,90,90),stroke=5)
        for j,txt in enumerate(('GAZ LÂCHÉ','FREIN : FORT / POMPE','RÉTROGRADE','FREIN À MAIN DOUX','WARNINGS','MOTEUR ALLUMÉ')):
            if lt>j*0.35:
                yy=480+j*170; d2.rrect((100,yy-70,980,yy+70),35,fill=(30,40,70)); d2.ellipse((125,yy-50,225,yy+50),fill=(255,214,90)); d2.text((175,yy),str(j+1),F(60),fill=(20,20,30)); d2.text((600,yy),txt,F(58),fill=(255,255,255))
        if lt>2.2:
            yy=1650+8*math.sin(lt*7); d2.rrect((200,yy-65,880,yy+65),65,fill=(254,44,85)); d2.text((540,yy),'ENREGISTRE ↓',F(66),fill=(255,255,255))
    return im.convert('RGB')
def frame(t):
    i=0
    for k in range(NL):
        if t>=S[k]-0.1: i=k
    lt=t-S[i]
    img=scene(t,i,lt).resize((W,H),Image.LANCZOS); a=np.asarray(img,np.float32)
    for k in range(1,NL):
        dt=t-S[k]
        if -0.07<dt<0.07: a=a*(0.6+0.4*abs(dt)/0.07)
    if t<0.1: a=a*(t/0.1)
    if t>T-0.4: a=a*max(0,(T-t)/0.4)
    return a.clip(0,255).astype(np.uint8)
if len(sys.argv)>2 and sys.argv[2]=='preview':
    ts=[float(x) for x in sys.argv[3].split(',')]
    tiles=[Image.fromarray(frame(t)).resize((270,480)) for t in ts]
    sh=Image.new('RGB',(270*min(8,len(tiles)),480*math.ceil(len(tiles)/8)))
    for k,tl in enumerate(tiles): sh.paste(tl,((k%8)*270,(k//8)*480))
    sh.save(f'{D}/preview.jpg',quality=88); print('starts',[round(x,2) for x in S]); sys.exit()
# audio
N=int(T*SR); mix=np.zeros(N)
for i,s in enumerate(st):
    raw=subprocess.run(['ffmpeg','-v','error','-i',f'{D}/vo/l{i:02d}.mp3','-ac','1','-ar',str(SR),'-f','f32le','-'],capture_output=True).stdout
    a=np.frombuffer(raw,np.float32); j=int(s*SR); k=min(N,j+len(a)); mix[j:k]+=a[:k-j]
rng=np.random.default_rng(1); fx=np.zeros(N)
def place(x,t0,g=1):
    i=max(0,int(t0*SR)); j=min(N,i+len(x)); fx[i:j]+=x[:j-i]*g
tt=np.arange(N)/SR
sp=np.array([speed_at(x) for x in tt[::480]]); sp=np.interp(tt,tt[::480],sp)
eng=np.sin(2*np.pi*np.cumsum(30+sp*0.9)/SR)*0.25+np.convolve(rng.normal(0,1,N),np.ones(30)/30,'same')*0.15*(sp/130)
fx+=eng*np.interp(tt,[0,S[8],S[8]+0.3,T],[1,1,0,0])
hz=np.sin(2*np.pi*1000*np.arange(int(0.05*SR))/SR)*np.exp(-np.arange(int(0.05*SR))/SR*60)
for x in np.arange(S[6],S[8],1/3): place(hz,x,0.4)
mix=mix/np.max(np.abs(mix))*0.95; fx=fx/max(1e-6,np.max(np.abs(fx)))*0.3
out=mix+fx; out=out/np.max(np.abs(out))*0.9; stt=np.stack([out,out],1)
import wave
with wave.open(f'{D}/final.wav','wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((stt*32767).astype(np.int16).tobytes())
Nf=int(T*FPS)
ff=subprocess.Popen(['ffmpeg','-y','-v','error','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-','-c:v','libx264','-preset','medium','-crf','17','-pix_fmt','yuv420p',f'{D}/video.mp4'],stdin=subprocess.PIPE)
for n_ in range(Nf):
    ff.stdin.write(frame(n_/FPS).tobytes())
    if n_%150==0: print(n_,Nf,flush=True)
ff.stdin.close(); ff.wait()

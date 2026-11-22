"""2D: 'Que faire si ta voiture tombe dans l'eau ?'"""
import os,sys,json,math,subprocess
import numpy as np
from PIL import Image,ImageDraw,ImageFilter,ImageFont
HERE=os.path.dirname(os.path.abspath(__file__))
D=sys.argv[1]; W,H,FPS=1080,1920,30; SS=2
SR=48000
def dur(f): return float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f],capture_output=True,text=True).stdout)
NL=8; st=[]; t=0.25
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
WATER=(40,120,190)
def timer(dr,t):
    left=max(0,60-(t-0.9)*1.6) if t>0.9 else 60
    col=(255,255,255) if left>25 else (255,90,90)
    dr.rrect((380,150,700,290),40,fill=(0,0,0,170))
    dr.text((540,220),f'0:{int(left):02d}',F(110),fill=col)
def step_badge(dr,n,txt,lt,col=(255,214,90)):
    s=min(1,0.6+lt*3)
    dr.rrect((90,330,990,500),40,fill=(0,0,0,180))
    dr.ellipse((120,355,240,475),fill=col)
    dr.text((180,415),str(n),F(int(80*s)),fill=(20,20,30))
    dr.text((610,415),txt,F(int(66*s)),fill=(255,255,255))
def car_side_big(dr,x,y,k,water_y,win_open=0.0,belt=True,hero=True,kid=True,hero_out=0.0,kid_out=0.0,door_x=False,t=0.0):
    # body
    dr.rrect((x,y-1.35*k,x+4.6*k,y-0.25*k),int(0.3*k),fill=(210,60,70),outline=OUT,width=3)
    dr.poly([(x+1.0*k,y-1.3*k),(x+1.6*k,y-2.15*k),(x+3.3*k,y-2.15*k),(x+3.9*k,y-1.3*k)],fill=(210,60,70),outline=OUT,width=3)
    # windows (glass with interior visible)
    wl=(x+1.25*k,y-1.32*k,x+2.35*k,y-2.05*k); wr=(x+2.45*k,y-1.32*k,x+3.65*k,y-2.05*k)
    for wx0,wy1,wx1,wy0 in (wl,wr): dr.rect((wx0,wy0,wx1,wy1),fill=(170,210,240),outline=OUT,width=2)
    # people inside
    if hero and hero_out<1:
        hx=x+1.85*k; hy=y-0.55*k-hero_out*1.9*k
        person_front(dr,hx,hy+0.2*k,mood=-1,look=0.3,s=0.95*k/PX,t=t)
        if belt: dr.line((hx-0.25*k,y-1.95*k,hx+0.2*k,y-1.05*k),fill=(30,30,40),width=0.08*k)
    if kid and kid_out<1:
        kx=x+3.05*k; ky=y-0.55*k-kid_out*1.9*k
        person_front(dr,kx,ky+0.2*k,mood=-1,look=-0.3,s=0.62*k/PX,t=t)
    # window glass rolled down
    for (wx0,wy1,wx1,wy0) in (wl,wr):
        gh=(wy1-wy0)*(1-win_open)
        if gh>2: dr.rect((wx0,wy1-gh,wx1,wy1),fill=(170,210,240,80),outline=OUT,width=2)
    dr.rect((x+2.37*k,y-2.1*k,x+2.43*k,y-0.3*k),fill=OUT)
    # doors
    dr.line((x+1.2*k,y-1.3*k,x+1.2*k,y-0.3*k),fill=OUT,width=2); dr.line((x+3.7*k,y-1.3*k,x+3.7*k,y-0.3*k),fill=OUT,width=2)
    for wx in (x+0.95*k,x+3.65*k):
        dr.ellipse((wx-0.42*k,y-0.8*k,wx+0.42*k,y+0.04*k),fill=(22,22,26),outline=OUT,width=3); dr.ellipse((wx-0.2*k,y-0.58*k,wx+0.2*k,y-0.18*k),fill=(170,170,180))
    if door_x:
        cx,cy=x+1.75*k,y-0.8*k
        dr.line((cx-0.5*k,cy-0.5*k,cx+0.5*k,cy+0.5*k),fill=(255,60,60),width=0.12*k); dr.line((cx-0.5*k,cy+0.5*k,cx+0.5*k,cy-0.5*k),fill=(255,60,60),width=0.12*k)
        for j in range(4):
            ax=x-0.8*k-((t*2+j*0.25)%1)*0.4*k; ay=cy-0.6*k+j*0.4*k
            dr.line((ax-0.5*k,ay,ax,ay),fill=(255,255,255),width=0.07*k); dr.poly([(ax,ay-0.12*k),(ax+0.18*k,ay),(ax,ay+0.12*k)],fill=(255,255,255))
def scene(t,i,lt):
    im=vgrad((150,200,235),(200,225,240),0,1000); base=canvas((60,120,180)); base.paste(im,(0,0)); im=base.convert('RGBA'); dr=Dr(im)
    k=230
    if i==0:   # falling in
        p=min(1,lt/1.0); cx=lerp(-500,10,ease(p)); cy=lerp(1000,1720,p*p) if p<1 else 1720+10*math.sin(lt*3)
        sink=0
        wl=1620
        dr.rect((0,wl,W,H),fill=WATER+(255,))
        dr.rect((0,1000,160,1620),fill=(110,110,120),outline=OUT,width=2)       # road / quay
        car_side_big(dr,cx,cy+sink*120,k,wl,t=t)
        dr.rect((0,wl,W,H),fill=WATER+(150,))
        if 1.0<lt<1.8:
            for j in range(14):
                a=j/14*math.pi; r=(lt-1.0)*500
                dr.ellipse((cx+2.3*k+math.cos(a)*r-14,wl-math.sin(a)*r*0.6-14,cx+2.3*k+math.cos(a)*r+14,wl-math.sin(a)*r*0.6+14),fill=(230,245,255))
    else:
        wl=lerp(1600,1150,min(1,(t-S[2])/(S[7]-S[2])))
        cx=10; cy=1720
        car_side_big(dr,cx,cy,k,wl,win_open=0 if i<3 else ease(lt/1.2) if i==3 else 1,belt=(i<2 or (i==2 and lt<1.0)),
            kid_out=0 if i<5 else ease(lt/1.5) if i==5 else 1,hero_out=0 if i<6 else ease(lt/1.8) if i==6 else 1,door_x=(i==4),t=t)
        wat=Image.new('RGBA',im.size,(0,0,0,0)); ImageDraw.Draw(wat).rectangle((0,wl*SS,W*SS,H*SS),fill=WATER+(150,)); im.alpha_composite(wat); dr=Dr(im)
        for j in range(12):
            x=(j*97+t*60)%W; dr.arc((x,wl-8,x+60,wl+8),200,340,fill=(220,240,255),width=3)
        if i==2 and 0.9<lt<1.4: dr.text((560,1150),'CLIC !',F(70),fill=(255,255,255),stroke=4)
        if i==6 and lt>1.5:
            hx=cx+1.85*k; person_front(dr,hx,cy-2.15*k,mood=1,look=0,s=0.95*k/PX,t=t)
            person_front(dr,hx+0.8*k,cy-2.15*k,mood=1,look=0,s=0.62*k/PX,t=t)
        if i==1:
            s=ease(lt/0.15)*(1+0.05*math.sin(lt*14))
            if s>0.05:
                w,h=600*s,140*s; y=640
                dr.rrect((540-w/2,y-h/2,540+w/2,y+h/2),int(70*s),fill=(254,44,85)); dr.text((540,y),'+ Abonne-toi',F(max(1,int(70*s))),fill=(255,255,255))
        badges={2:(1,'CEINTURE'),3:(2,'FENÊTRE'),4:('✕','PAS LA PORTE'),5:(3,'ENFANTS'),6:(4,'DEHORS')}
        if i in badges:
            n,txt=badges[i]; step_badge(dr,n if n!='✕' else '!',txt,lt,(255,90,90) if n=='✕' else (255,214,90))
    if i==0:
        dr.text((540,380),'TA VOITURE',F(100),fill=(255,255,255),stroke=7); dr.text((540,500),'TOMBE DANS L\'EAU',F(90),fill=(255,214,90),stroke=7)
    if i<7: timer(dr,t)
    if i==7:
        im2=canvas((10,14,30)).convert('RGBA'); d2=Dr(im2)
        for j,(n,txt) in enumerate(((1,'CEINTURE'),(2,'FENÊTRE'),(3,'ENFANTS'),(4,'DEHORS'))):
            if lt>j*0.6:
                y=520+j*230; d2.rrect((120,y-85,960,y+85),40,fill=(30,40,70)); d2.ellipse((150,y-60,270,y+60),fill=(255,214,90)); d2.text((210,y),str(n),F(76),fill=(20,20,30)); d2.text((610,y),txt,F(76),fill=(255,255,255))
        d2.text((540,300),'EN 60 SECONDES',F(90),fill=(255,90,90),stroke=5)
        if lt>3.5:
            y=1580+8*math.sin(lt*7); d2.rrect((200,y-65,880,y+65),65,fill=(254,44,85)); d2.text((540,y),'ENREGISTRE ↓',F(66),fill=(255,255,255))
        im=im2
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
n=int(1.4*SR); tn=np.arange(n)/SR
place(np.convolve(rng.normal(0,1,n),np.ones(60)/60,'same')*np.exp(-tn*2.5)*1.2,S[0]+1.0)
tick=np.sin(2*np.pi*1500*np.arange(int(0.03*SR))/SR)*np.exp(-np.arange(int(0.03*SR))/SR*120)
for tt in np.arange(1.0,S[7],1/1.6): place(tick,tt,0.25)
place(np.sin(2*np.pi*900*np.arange(int(0.08*SR))/SR)*0.8,S[2]+1.0)
bub=np.zeros(int((S[7]-S[2])*SR))
for _ in range(60):
    p=rng.integers(0,len(bub)-3000); f=rng.uniform(300,900); tb=np.arange(3000)/SR; bub[p:p+3000]+=np.sin(2*np.pi*f*(1+tb*8)*tb)*np.exp(-tb*60)*0.3
place(bub,S[2])
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

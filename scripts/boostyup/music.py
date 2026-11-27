import json,numpy as np,wave,sys
S=sys.argv[1]; TL=json.load(open(f'{S}/proj/tl.json'))
SR=48000; T=TL['total']+0.4; N=int(T*SR)
rng=np.random.default_rng(7)
BEAT=60/128; O=-0.15            # grid origin: downbeat lands on banner start 3.60
B0,C0,CH0,F0=TL['B0'],TL['C0'],TL['CH0'],TL['F0']
def fft_filt(x,fn):
    X=np.fft.rfft(x); f=np.fft.rfftfreq(len(x),1/SR); return np.fft.irfft(X*fn(f),len(x))
lp=lambda x,fc,o=4: fft_filt(x,lambda f:1/np.sqrt(1+(f/fc)**(2*o)))
hp=lambda x,fc,o=4: fft_filt(x,lambda f:1/np.sqrt(1+(fc/np.maximum(f,1))**(2*o)))
def place(buf,x,t0,g=1.0):
    i=int(round(t0*SR))
    if i<0: x=x[-i:]; i=0
    j=min(len(buf),i+len(x));
    if j>i: buf[i:j]+=x[:j-i]*g
nf=lambda m:440*2**((m-69)/12)
tt=lambda d:np.arange(int(d*SR))/SR
def kick():
    t=tt(.45); f=48+110*np.exp(-t*38); ph=2*np.pi*np.cumsum(f)/SR
    x=np.sin(ph)*np.exp(-t*7.5); x+= .5*rng.normal(0,1,len(t))*np.exp(-t*300)
    return np.tanh(x*1.8)*.9
def clap():
    t=tt(.35); n=rng.normal(0,1,len(t)); e=np.zeros(len(t))
    for d in (0,.009,.018,.027): e+=np.exp(-np.maximum(t-d,0)*(70 if d<.027 else 18))*(t>=d)
    x=hp(lp(n*e,6500),900)+.4*np.sin(2*np.pi*190*t)*np.exp(-t*30); return x/np.abs(x).max()*.8
def hat(open_=False):
    t=tt(.25 if open_ else .06); n=hp(rng.normal(0,1,len(t)),7000); return n*np.exp(-t*(14 if open_ else 80))*.35
def bell(m,d=1.1,amp=.22):
    t=tt(d); f=nf(m); I=2.2*np.exp(-t*5)
    x=np.sin(2*np.pi*f*t+I*np.sin(2*np.pi*f*3.5*t))*np.exp(-t*3.2)+.3*np.sin(2*np.pi*2*f*t)*np.exp(-t*6)
    return x*amp
def pluck(m,d=.3,amp=.18):
    t=tt(d); f=nf(m); x=sum(np.sin(2*np.pi*f*h*t)/h*np.exp(-t*(10+h*4)) for h in range(1,7)); return x*amp
def saw(m,d,amp=.07):
    t=tt(d); out=np.zeros(len(t))
    for dc in (-9,0,9):
        f=nf(m)*2**(dc/1200); ph=rng.uniform(0,6.28)
        for h in range(1,18):
            if f*h>12000: break
            out+=np.sin(2*np.pi*f*h*t+ph*h)/h
    a=np.minimum(1,t/.25)*np.minimum(1,(d-t)/.3); return out*a*amp/3
def bass808(m,d):
    t=tt(d); f=nf(m)*(1+0.6*np.exp(-t*40)); ph=2*np.pi*np.cumsum(f)/SR
    x=np.sin(ph)*np.minimum(1,t/.005)*np.exp(-t*1.4)*np.minimum(1,(d-t)/.04); return np.tanh(x*2.2)*.55
def riser(d):
    t=tt(d); n=rng.normal(0,1,len(t)); out=np.zeros(len(t)); seg=2048
    for i in range(0,len(t),seg):
        fc=300+9000*(i/len(t))**2; out[i:i+seg]=lp(n[i:i+seg+256],fc)[:len(out[i:i+seg])]
    return hp(out,200)*(t/d)**2*.5
# chords per bar: Am F C G  (A minor)
PROG=[(57,[57,60,64,69]),(53,[53,57,60,65]),(48,[55,60,64,67]),(55,[55,59,62,67])]
drums=np.zeros(N); bass=np.zeros(N); syn=np.zeros(N); pad=np.zeros(N); fx=np.zeros(N)
K,CL=kick(),clap(); HC,HO=hat(),hat(True)
bar=0
t0=O
while t0<T:
    root,ch=PROG[bar%4]
    sec='intro' if t0<B0-0.01 else 'drop' if t0<CH0-0.01 else 'break' if t0<F0-0.4 else 'final'
    # pad
    place(pad,sum(saw(m,4*BEAT+.4) for m in ch),t0, .55 if sec=='intro' else .8)
    for b in range(4):
        tb=t0+b*BEAT
        if tb>=T: break
        if sec in('drop','final','break'):
            if sec!='break' or b in (0,2):
                if b in(0,) or (b==2 and sec!='break'): place(drums,K,tb)
                if b==1 or b==3: place(drums,CL,tb, .9 if sec!='break' else .5)
            if sec!='break' and b==2: place(drums,K,tb+BEAT/2,.8)
        # hats
        if t0>=O+4*BEAT or sec!='intro':
            for s in range(2): place(drums,HC,tb+s*BEAT/2,.9 if s==0 else .6)
            if b==3 and bar%2==1 and sec!='intro':
                for s in range(6): place(drums,HC,tb+BEAT/2+s*BEAT/12,.5+.07*s)
        # bells arpeggio (8ths)
        arp=[ch[0]+12,ch[2]+12,ch[1]+12,ch[3]+12]
        for s in range(2):
            m=arp[(b*2+s)%4]
            place(syn,bell(m,.8,.16 if sec=='intro' else .12),tb+s*BEAT/2)
        # 808
        if sec in('drop','final'):
            if b==0: place(bass,bass808(root-24,BEAT*1.5),tb)
            if b==2: place(bass,bass808(root-24+(7 if bar%2 else 0),BEAT*1.4),tb+BEAT/2)
    bar+=1; t0+=4*BEAT
# hook: card pop plucks are SFX; intro starts with impact; riser into drop
place(fx,riser(1.15),B0-1.2,1.0)
# cut everything just before drop (stop-time) 3.45-3.6
t=np.arange(N)/SR
gap=1-0.92*((t>B0-0.16)&(t<B0))
# sidechain from kick positions
sc=np.ones(N)
for k_t in np.arange(O,T,BEAT/2):
    pass
env=np.convolve(np.abs(drums[:]),np.ones(400)/400,'same'); env=env/ (env.max()+1e-9)
sc=1-0.55*np.clip(env*3,0,1)
pad=lp(pad,lambda_:=2600) if False else lp(pad,2600)
# section filters: intro lowpassed pad; break (channel) filtered
cut=np.interp(t,[0,B0-.3,B0,CH0,CH0+.2,F0-.4,F0],[0.45,0.8,1,1,.55,.75,1])
mix=drums*1.0+bass*0.9*sc+syn*0.8+pad*0.9*sc+fx
mix_lo=lp(mix,900)
mix=mix*cut+mix_lo*(1-cut)
mix*=gap
# outro: after last downbeat let ring, fade at end
end=TL['total']
mix*=np.interp(t,[0,end-0.9,end+0.1],[1,1,0])
# final stinger: big chord + kick at F0
place(mix,K,F0,1.2); place(mix,sum(bell(m,2.5,.15) for m in [69,72,76,81]),F0)
mix=np.tanh(mix*1.1)/1.1
mix/=np.abs(mix).max()+1e-9; mix*=0.8
# stereo widen: delay bells copy
L=mix.copy(); R=mix.copy()
d=int(.011*SR); R[d:]=0.85*mix[d:]+0.15*mix[:-d]
st=np.stack([L,R],1)
w=wave.open(f'{S}/music.wav','wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st*32767).astype(np.int16).tobytes()); w.close()
print('ok',T)

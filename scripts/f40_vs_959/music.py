import json,sys,numpy as np,wave
S=sys.argv[1]; TL=json.load(open(f'{S}/fv/tl.json'))
SR=48000; T=TL['total']; N=int((T+2)*SR); L=TL['lines']
rng=np.random.default_rng(11); t=np.arange(N)/SR
def lp(x,fc):
    X=np.fft.rfft(x); f=np.fft.rfftfreq(len(x),1/SR); X*=1/(1+(f/fc)**4); return np.fft.irfft(X,len(x))
def hp(x,fc):
    X=np.fft.rfft(x); f=np.fft.rfftfreq(len(x),1/SR); X*=1/(1+(fc/np.maximum(f,1e-3))**4); return np.fft.irfft(X,len(x))
def place(buf,x,t0,g=1.0):
    i=int(t0*SR); 
    if i<0: x=x[-i:]; i=0
    j=min(len(buf),i+len(x)); buf[i:j]+=x[:j-i]*g
nf=lambda m:440*2**((m-69)/12)
def reverb(x,dur=2.0,wet=0.3):
    n=int(dur*SR); ir=rng.normal(0,1,n)*np.exp(-np.arange(n)/SR*3.5); ir=lp(ir,6000); ir/=np.sqrt((ir**2).sum())
    F=1<<int(np.ceil(np.log2(len(x)+n))); y=np.fft.irfft(np.fft.rfft(x,F)*np.fft.rfft(ir,F),F)[:len(x)]
    return x*(1-wet)+y*wet
BPM=140; B=60/BPM
rounds=[L[i]['start'] for i in (1,3,5,7)]
points=[L[2]['words'][3]['s'],L[4]['words'][2]['s'],L[6]['words'][-2]['s'],L[8]['words'][-2]['s']]
drop=L[1]['start']  # beat starts at round 1
# instruments
def kick():
    n=int(0.45*SR); tn=np.arange(n)/SR; f=45+140*np.exp(-tn*30)
    return np.tanh(2.2*np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-tn*7))
def e808(m,dur):
    n=int(dur*SR); tn=np.arange(n)/SR; f=nf(m)*(1+0.6*np.exp(-tn*35))
    return np.tanh(2.5*np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-tn*2.2))*0.8
def snare():
    n=int(0.3*SR); tn=np.arange(n)/SR
    x=hp(rng.normal(0,1,n),1500)*np.exp(-tn*16)*0.7+np.sin(2*np.pi*190*tn)*np.exp(-tn*25)*0.6
    return np.tanh(x*1.5)
def hat(o=False):
    n=int((0.18 if o else 0.04)*SR); tn=np.arange(n)/SR
    return hp(rng.normal(0,1,n),7000)*np.exp(-tn*(14 if o else 120))*0.35
def braam(dur=1.6):
    n=int(dur*SR); tn=np.arange(n)/SR; x=np.zeros(n)
    for m in (26,38,45,50):
        for dc in (-8,0,8):
            f=nf(m)*2**(dc/1200)
            for h in range(1,10): x+=np.sin(2*np.pi*f*h*tn)/h
    x=(lp(x,2200)*np.exp(-tn*2)+lp(x,800)*(1-np.exp(-tn*2)))*np.exp(-tn*1.6)*np.minimum(1,tn*40)
    return np.tanh(x*0.12)*0.9
def boom(g=1.0,dur=2.5):
    n=int(dur*SR); tn=np.arange(n)/SR; f=30+60*np.exp(-tn*7)
    x=np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-tn*2)+lp(rng.normal(0,1,n),300)*np.exp(-tn*4)*0.5
    return np.tanh(x*1.8)*g
def riser(dur):
    n=int(dur*SR); tn=np.arange(n)/SR; r=(tn/dur)**2
    nz=rng.normal(0,1,n); x=(lp(nz,900)*(1-r)+hp(nz,3000)*r)*r*0.5
    f=200*2**(2.5*r); x+=0.25*np.sin(2*np.pi*np.cumsum(f)/SR)*r
    return x
def whoosh(dur=0.4,g=0.4):
    n=int(dur*SR); tn=np.arange(n)/SR; e=np.sin(np.pi*tn/dur)**2; m=tn/dur
    nz=rng.normal(0,1,n); return (lp(nz,800)*(1-m)+hp(nz,2500)*m)*e*g
def stab(m,dur=0.35):
    n=int(dur*SR); tn=np.arange(n)/SR; x=np.zeros(n)
    for k in (0,3,7):
        for dc in (-10,10):
            f=nf(m+k)*2**(dc/1200)
            for h in range(1,8): x+=np.sin(2*np.pi*f*h*tn)/h
    return lp(x,2500)*np.exp(-tn*7)*0.05
drums=np.zeros(N); bass=np.zeros(N); syn=np.zeros(N); fx=np.zeros(N)
# hook: tension pulse + impacts before beat
place(fx,boom(0.9),0.0); place(fx,braam(2.6),0.05,0.8)
tb=0.0
while tb<drop-0.05:
    place(drums,kick(),tb,0.55); tb+=B*2
place(fx,riser(drop-0.2-0.6),0.6,0.7)
# main groove
chords=[38,38,41,36]   # D, D, F, C (minor feel)
beat=0; tb=drop
while tb<T+0.5:
    bar=beat//4; pos=beat%4
    # cut groove briefly at each round card (except first) for impact
    mute=any(r-0.02<=tb<r+0.45 for r in rounds[1:])
    if not mute:
        if pos in (0,) or (pos==2 and bar%2==1): place(drums,kick(),tb,0.9)
        if pos==2 or (pos==0 and False): place(drums,snare(),tb,0.55)
        for h in range(2):
            th=tb+h*B/2
            roll = (bar%4==3 and pos==3)
            if roll:
                for k in range(6): place(drums,hat(),th+k*B/12,0.6)
            else: place(drums,hat(h==1 and pos==3),th,0.7)
        if pos==0: place(bass,e808(chords[bar%4],B*3.6),tb,0.75)
        if pos in (0,2): place(syn,stab(chords[bar%4]+24),tb+B*0.5,1.0)
    beat+=1; tb+=B
# round cards: braam + boom ; points: impact + whoosh
for r in rounds: place(fx,braam(1.4),r-0.02,0.85); place(fx,boom(0.7,1.5),r-0.02)
for p in points: place(fx,boom(0.6,1.2),p-0.03); place(fx,whoosh(0.35,0.5),p-0.3)
# big drop at "deux partout"
place(fx,riser(1.6),points[3]-1.6,0.6)
# transitions whooshes at every line start
for l in L[1:]: place(fx,whoosh(0.35,0.35),l['start']-0.25)
mus=reverb(drums,0.8,0.12)+bass+reverb(syn,1.5,0.35)
mus*=np.interp(t,[0,T-0.8,T+0.3],[1,1,0])
fxm=reverb(fx,1.8,0.25)*np.interp(t,[0,T,T+0.5],[1,1,0])
def wr(x,f):
    x=x[:int((T+0.3)*SR)]; x=x/np.max(np.abs(x))*0.89
    st=np.stack([x,np.roll(x,int(0.009*SR))*0.98],1)
    with wave.open(f,'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st*32767).astype(np.int16).tobytes())
wr(mus,f'{S}/fv/music.wav'); wr(fxm,f'{S}/fv/sfx.wav'); print('ok',rounds,points)

import json,sys,numpy as np,wave
S=sys.argv[1]; TL=json.load(open(f'{S}/timeline.json'))
SR=48000; T=TL['total']; N=int(T*SR)+SR
rng=np.random.default_rng(3)
t=np.arange(N)/SR
def lp(x,fc):  # FFT brickwall-ish smooth lowpass
    X=np.fft.rfft(x); f=np.fft.rfftfreq(len(x),1/SR); X*=1/(1+(f/fc)**4); return np.fft.irfft(X,len(x))
def hp(x,fc):
    X=np.fft.rfft(x); f=np.fft.rfftfreq(len(x),1/SR); X*=1/(1+(fc/np.maximum(f,1e-3))**4); return np.fft.irfft(X,len(x))
def bp(x,lo,hi): return hp(lp(x,hi),lo)
def env(n,a,d): 
    e=np.ones(n); a=int(a*SR); d=int(d*SR)
    if a: e[:a]=np.linspace(0,1,a)
    if d: e[-d:]*=np.linspace(1,0,d)
    return e
def place(buf,x,t0,g=1.0):
    i=int(t0*SR); j=min(len(buf),i+len(x))
    if i<0: x=x[-i:]; i=0
    buf[i:j]+=x[:j-i]*g
def saw(freq,dur,detune=(0,-7,7)):
    n=int(dur*SR); tt=np.arange(n)/SR; out=np.zeros(n)
    for dc in detune:
        f=freq*2**(dc/1200); ph=rng.uniform(0,6.28)
        for h in range(1,14):
            if f*h>9000: break
            out+=np.sin(2*np.pi*f*h*tt+ph*h)/h
    return out/len(detune)
def reverb(x,dur=2.8,wet=0.35):
    n=int(dur*SR); ir=rng.normal(0,1,n)*np.exp(-np.arange(n)/SR*3.2); ir=lp(ir,6000); ir/=np.sqrt((ir**2).sum())
    L=len(x)+n; F=1<<int(np.ceil(np.log2(L)))
    y=np.fft.irfft(np.fft.rfft(x,F)*np.fft.rfft(ir,F),F)[:len(x)]
    return x*(1-wet)+y*wet
L=TL['lines']; shots=TL['shots']
climax=[s['start'] for s in shots if s['img']=='085'][0]
endt=shots[-1]['start']
calm=L[11]['start']-0.2
mus=np.zeros(N); drums=np.zeros(N); sfx=np.zeros(N)
nf=lambda m: 440*2**((m-69)/12)
# chord progression in D minor (Dm, Bb, F, C / Gm, Bb, A) – 2.4 s per chord (100 BPM, 4 beats)
BEAT=0.6; BAR=4*BEAT
prog=[[50,57,62,65],[46,53,58,62],[53,57,60,65],[48,55,60,64],[43,55,58,62],[46,53,58,62],[45,52,57,61],[45,52,57,61]]
k=0; tt0=0.0
while tt0<T:
    ch=prog[k%len(prog)]; d=BAR+0.4
    for m in ch:
        x=saw(nf(m),d)*env(int(d*SR),0.35,0.6)*0.10
        place(mus,x,tt0)
    k+=1; tt0+=BAR
mus=lp(mus,1800)
# amplitude automation of pad
a=np.interp(t,[0,3,climax-4,climax,calm,calm+1,endt-1,endt,T],[0.55,0.7,0.85,1.0,1.0,0.75,0.95,1.0,0.0]); mus*=a
# low sub ostinato on 8ths (D), starts at line 2, pauses briefly before climax, back after, stops at calm
sub=np.zeros(N)
roots=[38,34,41,36,31,34,33,33]
tt0=L[2]['start']-0.2
while tt0<endt:
    if not (climax-2.6<tt0<climax) :
        bar=int(tt0/BAR); r=roots[bar%len(roots)]
        n=int(0.28*SR); tn=np.arange(n)/SR
        x=np.sin(2*np.pi*nf(r)*tn)*np.exp(-tn*9)+0.4*np.sin(2*np.pi*nf(r+12)*tn)*np.exp(-tn*14)
        g=0.32 if tt0<calm or tt0>endt-5.5 else 0.12
        place(sub,np.tanh(x*1.5)*g,tt0)
    tt0+=BEAT/2
# taiko-style hits on beats 1 and 3 from engine section; denser after climax
def taiko(g=1.0,f0=95,f1=48,dec=5.0):
    n=int(0.9*SR); tn=np.arange(n)/SR; f=f1+(f0-f1)*np.exp(-tn*25)
    x=np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-tn*dec)+lp(rng.normal(0,1,n),900)*np.exp(-tn*30)*0.5
    return np.tanh(x*1.4)*g
tt0=L[5]['start']-0.2
while tt0<calm:
    beatn=round(tt0/BEAT)
    if not (climax-2.6<tt0<climax-0.05):
        dense=tt0>=climax
        if beatn%4==0: place(drums,taiko(0.55),tt0)
        if beatn%4==2: place(drums,taiko(0.38,120,60),tt0)
        if dense and beatn%2==1: place(drums,taiko(0.22,140,70,9),tt0)
    tt0+=BEAT
# ticking hi pulse (tension) during first half
tt0=L[1]['start']
while tt0<climax-0.3:
    n=int(0.05*SR); tn=np.arange(n)/SR
    x=hp(rng.normal(0,1,n),6000)*np.exp(-tn*90)*0.05
    place(drums,x,tt0); tt0+=BEAT/2
# --- SFX ---
def boom(g=1.0,dur=3.2):
    n=int(dur*SR); tn=np.arange(n)/SR; f=28+45*np.exp(-tn*6)
    x=np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-tn*1.6)
    x+=lp(rng.normal(0,1,n),400)*np.exp(-tn*3)*0.6
    x+=hp(rng.normal(0,1,n),2500)*np.exp(-tn*12)*0.25
    return np.tanh(x*1.6)*g
def riser(dur):
    n=int(dur*SR); tn=np.arange(n)/SR; ramp=(tn/dur)**2.2
    nz=rng.normal(0,1,n); x=np.zeros(n); blk=2048
    for i in range(0,n,blk):
        fc=400+9000*ramp[i]; x[i:i+blk]=bp(nz[i:i+blk+0],fc*0.5,fc)[:len(x[i:i+blk])] if False else 0
    # use crossfaded bands instead (cheap): mix lowpassed & highpassed noise by ramp
    lo=lp(nz,900); hi=bp(nz,2500,10000)
    x=(lo*(1-ramp)+hi*ramp)*ramp
    f=110*2**(3*ramp); x+=0.35*np.sin(2*np.pi*np.cumsum(f)/SR)*ramp
    return x*0.55
def whoosh(dur=0.55,g=0.35):
    n=int(dur*SR); tn=np.arange(n)/SR; e=np.sin(np.pi*np.clip(tn/dur,0,1))**2
    nz=rng.normal(0,1,n); lo=lp(nz,700); hi=bp(nz,1500,7000)
    m=np.sin(np.pi*tn/dur)
    return (lo*(1-m)+hi*m)*e*g
place(sfx,boom(0.9),0.0)
place(sfx,riser(3.0),climax-3.0)
place(sfx,boom(1.0),climax-0.01)
place(sfx,boom(0.85,4.5),endt)
for k,s in enumerate(shots[1:],1):
    if s['line']!=shots[k-1]['line'] and s['img'] not in ('085','END'):
        place(sfx,whoosh(),s['start']-0.28)
# impacts on engine & record
for s in shots:
    if s['img'] in ('V:gseng','089'): place(sfx,taiko(0.6,80,40,3.5),s['start'])
mix=reverb(mus,3.5,0.45)*0.9+reverb(sub,1.2,0.15)+reverb(drums,1.6,0.2)*0.9
mix_sfx=reverb(sfx,2.2,0.25)
def wr(x,f):
    x=x[:int(T*SR)]; fade=int(1.2*SR); x[-fade:]*=np.linspace(1,0,fade)
    x=x/np.max(np.abs(x))*0.89
    st=np.stack([x,x],1)
    # subtle stereo width via short delay on one side for music
    st[:,1]=np.roll(x,int(0.011*SR))*0.98
    with wave.open(f,'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st*32767).astype(np.int16).tobytes())
wr(mix,f'{S}/music.wav'); wr(mix_sfx,f'{S}/sfx.wav')
print('climax',climax,'end',endt,'calm',calm)

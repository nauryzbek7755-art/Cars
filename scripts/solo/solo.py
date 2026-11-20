"""Solo car TikTok pipeline.  usage: solo.py <cardir> <timeline|music|subs|preview|render|final> [args]
cardir contains: narration.json, vo/ (tts mp3+json), hi/ (images), cfg.json
"""
import json,sys,os,math,re,subprocess,wave
import numpy as np
from PIL import Image,ImageDraw,ImageFont,ImageFilter,ImageOps
D=sys.argv[1].rstrip('/'); CMD=sys.argv[2]
W,H,FPS=1080,1920,30
CFG=json.load(open(f'{D}/cfg.json'))
lines=json.load(open(f'{D}/narration.json'))
VO=CFG.get('vo','vo')
def timeline():
    words=[json.load(open(f'{D}/{VO}/l{i:02d}.json')) for i in range(len(lines))]
    gap=CFG.get('gap',0.5); gaps={int(k):v for k,v in CFG.get('gaps',{}).items()}
    t=0.12; L=[]
    for i,w in enumerate(words):
        ws=[dict(s=t+x['t'],e=t+x['t']+x['d'],w=x['w']) for x in w]
        L.append(dict(i=i,start=t,end=ws[-1]['e'],words=ws)); t=ws[-1]['e']+gaps.get(i,gap)
    total=L[-1]['end']+CFG.get('tail',1.6)
    json.dump(dict(lines=L,total=total),open(f'{D}/tl.json','w'),indent=1,ensure_ascii=False)
    for l in L: print(l['i'],round(l['start'],2),' '.join(f"{k}:{x['w']}" for k,x in enumerate(l['words'])))
    print('total',round(total,2))
if CMD=='timeline': timeline(); sys.exit()
TL=json.load(open(f'{D}/tl.json')); L=TL['lines']; T=TL['total']
def ws(i,k): return L[i]['words'][k]['s']
# ======================= MUSIC (phonk) =======================
if CMD=='music':
    SR=48000; N=int((T+2)*SR); rng=np.random.default_rng(CFG.get('seed',3)); t=np.arange(N)/SR
    def lp(x,fc):
        X=np.fft.rfft(x); f=np.fft.rfftfreq(len(x),1/SR); X*=1/(1+(f/fc)**4); return np.fft.irfft(X,len(x))
    def hp(x,fc):
        X=np.fft.rfft(x); f=np.fft.rfftfreq(len(x),1/SR); X*=1/(1+(fc/np.maximum(f,1e-3))**4); return np.fft.irfft(X,len(x))
    def bp(x,a,b): return hp(lp(x,b),a)
    def place(buf,x,t0,g=1.0):
        i=int(t0*SR)
        if i<0: x=x[-i:]; i=0
        j=min(len(buf),i+len(x)); buf[i:j]+=x[:j-i]*g
    nf=lambda m:440*2**((m-69)/12)
    def reverb(x,dur=2.0,wet=0.3):
        n=int(dur*SR); ir=rng.normal(0,1,n)*np.exp(-np.arange(n)/SR*3.5); ir=lp(ir,6000); ir/=np.sqrt((ir**2).sum())
        F=1<<int(np.ceil(np.log2(len(x)+n))); y=np.fft.irfft(np.fft.rfft(x,F)*np.fft.rfft(ir,F),F)[:len(x)]
        return x*(1-wet)+y*wet
    BPM=CFG.get('bpm',130); B=60/BPM
    def kick():
        n=int(0.5*SR); tn=np.arange(n)/SR; f=42+150*np.exp(-tn*32)
        return np.tanh(2.5*np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-tn*6))
    def e808(m,dur):
        n=int(dur*SR); tn=np.arange(n)/SR; f=nf(m)*(1+0.8*np.exp(-tn*30))
        return np.tanh(3.0*np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-tn*1.6))*0.8
    def clap():
        n=int(0.35*SR); tn=np.arange(n)/SR; nz=bp(rng.normal(0,1,n),900,6000)
        env=np.exp(-tn*20)+0.6*np.exp(-np.maximum(tn-0.012,0)*40)*(tn>0.012)+0.5*np.exp(-np.maximum(tn-0.024,0)*40)*(tn>0.024)
        return np.tanh(nz*env*1.6)*0.8
    def hat(o=False):
        n=int((0.16 if o else 0.035)*SR); tn=np.arange(n)/SR
        return hp(rng.normal(0,1,n),7500)*np.exp(-tn*(16 if o else 130))*0.3
    def cowbell(m,dur=0.22):
        n=int(dur*SR); tn=np.arange(n)/SR; f=nf(m)
        x=np.sign(np.sin(2*np.pi*f*tn))+np.sign(np.sin(2*np.pi*f*1.48*tn))
        x=bp(x,f*0.8,f*5)*np.exp(-tn*12)
        return x*0.22
    def boom(g=1.0,dur=2.2):
        n=int(dur*SR); tn=np.arange(n)/SR; f=30+60*np.exp(-tn*7)
        x=np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-tn*2)+lp(rng.normal(0,1,n),300)*np.exp(-tn*4)*0.5
        return np.tanh(x*1.8)*g
    def braam(dur=1.8):
        n=int(dur*SR); tn=np.arange(n)/SR; x=np.zeros(n)
        for m in (26,38,45,50):
            for dc in (-8,0,8):
                f=nf(m)*2**(dc/1200)
                for h in range(1,10): x+=np.sin(2*np.pi*f*h*tn)/h
        x=(lp(x,2200)*np.exp(-tn*2)+lp(x,800)*(1-np.exp(-tn*2)))*np.exp(-tn*1.5)*np.minimum(1,tn*40)
        return np.tanh(x*0.12)*0.9
    def riser(dur):
        n=int(dur*SR); tn=np.arange(n)/SR; r=(tn/dur)**2; nz=rng.normal(0,1,n)
        x=(lp(nz,900)*(1-r)+hp(nz,3000)*r)*r*0.5; f=200*2**(2.5*r); x+=0.25*np.sin(2*np.pi*np.cumsum(f)/SR)*r
        return x
    def whoosh(dur=0.4,g=0.4):
        n=int(dur*SR); tn=np.arange(n)/SR; e=np.sin(np.pi*tn/dur)**2; m=tn/dur; nz=rng.normal(0,1,n)
        return (lp(nz,800)*(1-m)+hp(nz,2500)*m)*e*g
    drums=np.zeros(N); bass=np.zeros(N); bell=np.zeros(N); fx=np.zeros(N)
    drop=CFG.get('drop',L[2]['start'])
    root=CFG.get('root',37)   # C#
    prog=[root,root,root+3,root-2]
    mel=CFG.get('melody',[0,3,7,10,12,10,7,3, 0,3,7,12,15,12,10,7])
    # intro: dark braam + sparse cowbell
    place(fx,boom(1.0),0.0); place(fx,braam(2.8),0.03,0.8)
    tb=0.0; k=0
    while tb<drop-0.05:
        if k%2==0: place(bell,cowbell(root+36+mel[k%len(mel)]),tb,0.6)
        tb+=B/2; k+=1
    place(fx,riser(max(0.5,drop-0.8)),0.6,0.6)
    breaks=[ws(*b)-0.02 for b in CFG.get('breaks',[])]
    beat=0; tb=drop
    while tb<T+0.5:
        bar=beat//4; pos=beat%4
        mute=any(b-0.6<=tb<b+0.05 for b in breaks)
        if not mute:
            if pos==0 or (pos==2 and bar%2==1) or (pos==3 and bar%4==3): place(drums,kick(),tb,0.9)
            if pos in (1,3): place(drums,clap(),tb,0.5)
            for h in range(4):
                th=tb+h*B/4
                if bar%4==3 and pos==3: place(drums,hat(),th,0.6); place(drums,hat(),th+B/8,0.5)
                else: place(drums,hat(),th,0.55 if h%2==0 else 0.35)
            if pos==0: place(bass,e808(prog[bar%4],B*3.8),tb,0.8)
            for h in range(2):
                st=beat*2+h; place(bell,cowbell(prog[bar%4]+36+mel[st%len(mel)]),tb+h*B/2,0.85)
        beat+=1; tb+=B
    for b in breaks: place(fx,boom(0.85,1.8),b); place(fx,braam(1.4),b,0.6); place(fx,riser(0.6),b-0.6,0.5)
    for h in CFG.get('hits',[]): place(fx,boom(0.55,1.2),ws(*h)-0.02)
    for c in CFG['_cuts'] if '_cuts' in CFG else []: pass
    cuts=json.load(open(f'{D}/edl.json')) if os.path.exists(f'{D}/edl.json') else []
    for c in cuts[1:]:
        if c.get('wh'): place(fx,whoosh(0.35,0.32),c['s']-0.22)
    end=L[-1]['end']
    mus=reverb(drums,0.7,0.1)+bass+reverb(bell,1.2,0.3)
    mus*=np.interp(t,[0,T-1.0,T+0.2],[1,1,0]); fxm=reverb(fx,1.8,0.25)*np.interp(t,[0,T,T+0.4],[1,1,0])
    def wr(x,f):
        x=x[:int((T+0.2)*SR)]; x=x/np.max(np.abs(x))*0.89
        st=np.stack([x,np.roll(x,int(0.009*SR))*0.98],1)
        with wave.open(f,'wb') as w:
            w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st*32767).astype(np.int16).tobytes())
    wr(mus,f'{D}/music.wav'); wr(fxm,f'{D}/sfx.wav')
    # voice
    ins=[];fl=[]
    for ln in L: ins+=['-i',f"{D}/{VO}/l{ln['i']:02d}.mp3"]
    for k,ln in enumerate(L):
        d=int(ln['start']*1000); fl.append(f"[{k}:a]aresample=48000,aformat=channel_layouts=mono,adelay={d}|{d}[a{k}]")
    fl.append(''.join(f'[a{k}]' for k in range(len(L)))+f"amix=inputs={len(L)}:normalize=0,apad,atrim=0:{T}[v]")
    subprocess.run(['ffmpeg','-y','-v','error',*ins,'-filter_complex',';'.join(fl),'-map','[v]','-ar','48000',f'{D}/voice_raw.wav'],check=True)
    subprocess.run(['ffmpeg','-y','-v','error','-i',f'{D}/voice_raw.wav','-af','highpass=f=80,equalizer=f=170:t=q:w=1:g=2.5,equalizer=f=3200:t=q:w=1.2:g=3,acompressor=threshold=-20dB:ratio=3.5:attack=6:release=100:makeup=3.5,alimiter=limit=0.9','-ac','2',f'{D}/voice.wav'],check=True)
    eng=np.zeros((int((T+1)*SR),2),np.float32); has_eng=False
    for c in cuts:
        if not c['img'].startswith('V:'): continue
        _,name,st=c['img'].split(':')
        if name not in CFG.get('vaudio',[]): continue
        dur=c['e']-c['s']+0.15
        raw=subprocess.run(['ffmpeg','-v','error','-ss',st,'-i',CFG['videos'][name],'-t',str(dur),'-vn','-ac','2','-ar',str(SR),'-f','f32le','-'],capture_output=True).stdout
        a=np.frombuffer(raw,np.float32).reshape(-1,2).copy()
        if len(a)<100: continue
        fd=int(0.04*SR); a[:fd]*=np.linspace(0,1,fd)[:,None]; a[-fd:]*=np.linspace(1,0,fd)[:,None]
        i=int(c['s']*SR); j=min(len(eng),i+len(a)); eng[i:j]+=a[:j-i]; has_eng=True
    if has_eng:
        eng=eng/max(1e-6,np.abs(eng).max())*0.9
        with wave.open(f'{D}/engine.wav','wb') as w:
            w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((eng*32767).astype(np.int16).tobytes())
    ins=['-i',f'{D}/voice.wav','-i',f'{D}/music.wav','-i',f'{D}/sfx.wav']+(['-i',f'{D}/engine.wav'] if has_eng else [])
    fc=f"[0:a]asplit=3[vo][sc][sc2];[1:a]volume={CFG.get('musvol',0.40)}[m];[m][sc]sidechaincompress=threshold=0.03:ratio=5:attack=20:release=300[md];[2:a]volume=0.5[fx];"
    if has_eng:
        fc+=f"[3:a]volume={CFG.get('engvol',0.55)}[e];[e][sc2]sidechaincompress=threshold=0.02:ratio=8:attack=15:release=250[ed];[vo][md][fx][ed]amix=inputs=4:normalize=0"
    else:
        fc+="[sc2]anullsink;[vo][md][fx]amix=inputs=3:normalize=0"
    fc+=",loudnorm=I=-13:TP=-1.0:LRA=8"
    subprocess.run(['ffmpeg','-y','-v','error',*ins,'-filter_complex',fc,'-ar','48000','-c:a','pcm_s16le',f'{D}/mix.wav'],check=True)
    print('music ok'); sys.exit()
# ======================= SUBTITLES =======================
if CMD=='subs':
    def tss(t):
        t=max(t,0); return f"0:{int(t//60):02d}:{t%60:05.2f}"
    MAP=CFG.get('map',{})
    ACC=CFG.get('accent_ass','&H0045C8FF&'); WHITE='&H00FFFFFF&'
    keys=[k.upper() for k in CFG.get('keywords',[])]
    def kcol(w):
        u=w.upper()
        if re.search(r'\d',u) or any(k in u for k in keys): return ACC
        return WHITE
    head="""[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Sub,Inter Display Black,86,&H00FFFFFF,&H00FFFFFF,&H00000000,&HA0000000,-1,0,0,0,100,100,1,0,1,6,4,5,90,90,0,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    ev=[]; Y=CFG.get('suby',1380)
    for ln in L:
        text=lines[ln['i']]; pos=0; toks=[]
        for w in ln['words']:
            tok=w['w']; j=text.find(tok.split(' ')[0],pos); j=pos if j<0 else j
            k=j+len(tok); m=re.match(r'\s*([.,:?!;]+)',text[k:]); tail=''
            if m: tail=m.group(1).strip(); k+=m.end()
            pos=k
            disp=' '.join(MAP.get(p,p) for p in tok.split()).upper()
            if tail in ('?','!',':'): disp+=' '+tail
            elif tail: disp+=tail
            toks.append(dict(s=w['s'],e=w['e'],d=disp,brk=bool(tail)))
        chunks=[];cur=[]
        for tk in toks:
            if cur and sum(len(x['d'])+1 for x in cur)+len(tk['d'])>16: chunks.append(cur);cur=[]
            cur.append(tk)
            if tk['brk'] or len(cur)>=3: chunks.append(cur);cur=[]
        if cur: chunks.append(cur)
        for ci,ch in enumerate(chunks):
            cend=chunks[ci+1][0]['s']-0.03 if ci+1<len(chunks) else ch[-1]['e']+0.25
            for wi,w in enumerate(ch):
                st=w['s']-0.03 if wi==0 else w['s']; en=ch[wi+1]['s'] if wi+1<len(ch) else cend
                parts=[]
                for xj,x in enumerate(ch):
                    c=kcol(x['d'])
                    if xj==wi: parts.append(f"{{\\c{c}\\fscx116\\fscy116}}{x['d']}{{\\fscx100\\fscy100}}")
                    else: parts.append(f"{{\\c{c}}}{x['d']}")
                anim="{\\fscx55\\fscy55\\alpha&HFF&\\t(0,80,\\fscx112\\fscy112\\alpha&H00&)\\t(80,150,\\fscx100\\fscy100)}" if wi==0 else ""
                ev.append(f"Dialogue: 2,{tss(st)},{tss(en)},Sub,,0,0,0,,{{\\pos(540,{Y})}}{anim}"+' '.join(parts))
    open(f'{D}/subs.ass','w').write(head+'\n'.join(ev)+'\n'); print('subs',len(ev)); sys.exit()
# ======================= VIDEO =======================
FONT='/usr/share/fonts/opentype/inter/'
def F(sz,w='Black'): return ImageFont.truetype(FONT+f'InterDisplay-{w}.otf',sz)
ACC=tuple(CFG.get('accent',[255,200,69])); WHITE=(255,255,255)
def grade(a):
    a=a.astype(np.float32)/255.0*CFG.get('expo',0.86)
    Lm=(0.2126*a[...,0]+0.7152*a[...,1]+0.0722*a[...,2])[...,None]
    a=Lm+(a-Lm)*CFG.get('sat',0.9)
    a=np.clip(a,0,1); a=a*(1-0.6)+0.6*(a*a*(3-2*a)); a=a**1.1
    Lm=(0.2126*a[...,0]+0.7152*a[...,1]+0.0722*a[...,2])[...,None]
    a=a+(1-Lm)**2*np.array([-0.04,0.0,0.05],np.float32)+Lm**2*np.array([0.04,0.015,-0.03],np.float32)
    return np.clip(0.01+a*0.98,0,1)
cache={}
def src(img,fi=0):
    if img.startswith('V:'):
        _,name,st=img.split(':'); dd=f'{D}/vf/{name}_{st}'
        fs=sorted(os.listdir(dd)); f=f'{dd}/{fs[min(max(fi,0),len(fs)-1)]}'
        if f not in cache:
            if len(cache)>300: cache.clear()
            im=Image.open(f).convert('RGB')
            cache[f]=im if CFG.get('vfast') else Image.fromarray((grade(np.asarray(im))*255+0.5).astype(np.uint8))
        return cache[f]
    if img not in cache:
        im=Image.open(f'{D}/hi/{img}.jpg'); im=ImageOps.exif_transpose(im).convert('RGB')
        sc=2400/max(im.size) if max(im.size)>2400 else 1
        if sc!=1: im=im.resize((int(im.width*sc),int(im.height*sc)),Image.LANCZOS)
        cache[img]=Image.fromarray((grade(np.asarray(im))*255+0.5).astype(np.uint8))
    return cache[img]
CAM=CFG.get('cam',{})
def view(img,w,h,p,z0,z1,dx,rot,shake=(0,0),punch=0.0,fi=0,cxo=None):
    im=src(img,fi); Ws,Hs=im.size; cx,cy=CAM.get(img.split(':')[1] if img.startswith('V:') else img,[0.5,0.55])[:2]
    if cxo is not None: cx=cxo
    e=p*p*(3-2*p)*0.6+p*0.4; z=(z0+(z1-z0)*e)*(1+punch)
    ar=w/h; ch=Hs/z; cw=ch*ar
    if cw>Ws/z: cw=Ws/z; ch=cw/ar
    x=cx*Ws+(e-0.5)*dx*Ws; y=cy*Hs
    x=min(max(x,cw/2),Ws-cw/2); y=min(max(y,ch/2),Hs-ch/2)
    x+=shake[0]*cw/w; y+=shake[1]*ch/h
    a=math.radians(rot*(e-0.5)); ca,sa=math.cos(a),math.sin(a)
    def P(u,v): return (x+u*ca-v*sa, y+u*sa+v*ca)
    hw,hh=cw/2*1.04,ch/2*1.04
    quad=(*P(-hw,-hh),*P(-hw,hh),*P(hw,hh),*P(hw,-hh))
    return np.asarray(im.transform((w,h),Image.QUAD,quad,Image.BICUBIC),np.float32)/255.0
# ---- EDL from cfg: shots per line [[img,wordIndex], ...]
EDL=[]
for i,ln in enumerate(L):
    for sp_ in CFG['shots'][str(i)]:
        img,wi=sp_[0],sp_[1]
        s=0.0 if (i==0 and wi==0 and not EDL) else (ws(i,wi)-0.08 if wi>0 else ln['start']-0.12)
        EDL.append(dict(img=img,s=max(0,s),cx=(sp_[2] if len(sp_)>2 and sp_[2] is not None else None),fit=(len(sp_)>3 and sp_[3]=='fit')))
# hook: rapid cuts inside first line if configured
EDL.sort(key=lambda c:c['s'])
for k,c in enumerate(EDL): c['e']=EDL[k+1]['s'] if k+1<len(EDL) else T
rng=np.random.default_rng(9)
for k,c in enumerate(EDL):
    mv=CFG.get('moves',{}).get(c['img'])
    if mv: c['z0'],c['z1'],c['dx'],c['rot']=mv
    elif c['img'].startswith('V:'):
        c['z0'],c['z1'],c['dx'],c['rot']=[(1.0,1.08,0.03,0.8),(1.08,1.0,-0.03,-0.8)][k%2]
    else:
        r=k%4
        c['z0'],c['z1'],c['dx'],c['rot']=[(1.0,1.2,0.06,1.6),(1.22,1.02,-0.07,-1.6),(1.05,1.25,-0.05,1.2),(1.2,1.04,0.08,-1.2)][r]
    c['wh']= k>0 and EDL[k-1]['img']!=c['img']
json.dump(EDL,open(f'{D}/edl.json','w'),indent=1)
VGRADE="eq=brightness=-0.035:contrast=1.14:saturation=0.9:gamma=0.93,colorbalance=rs=-0.04:gs=0.0:bs=0.05:rh=0.04:gh=0.015:bh=-0.03,vignette=PI/5"
if CMD=='vprep':
    SPEED=CFG.get('vspeed',{})
    for c in EDL:
        if not c['img'].startswith('V:'): continue
        _,name,st=c['img'].split(':'); dd=f'{D}/vf/{name}_{st}'
        if os.path.isdir(dd) and len(os.listdir(dd))>0: continue
        os.makedirs(dd,exist_ok=True); sp=SPEED.get(name,1.0); dur=(c['e']-c['s']+0.6)*sp
        subprocess.run(['ffmpeg','-v','error','-ss',st,'-i',CFG['videos'][name],'-t',str(dur),'-vf',(CFG.get('vcrop',{}).get(name,'')+',' if CFG.get('vcrop',{}).get(name) else '')+f'setpts={1/sp}*PTS,fps=30,scale=-2:'+str(CFG.get('vh',1440))+(','+CFG.get('vgrade',VGRADE) if CFG.get('vfast') else ''),'-q:v','2',f'{dd}/%04d.jpg'],check=True)
        print(dd,len(os.listdir(dd)))
    sys.exit()
STATS=[dict(t=ws(s[0],s[1])-0.05,big=s[2],small=s[3],until=(ws(s[4],s[5]) if len(s)>5 else None)) for s in CFG.get('stats',[])]
for k,s in enumerate(STATS):
    if s['until'] is None:
        nxt=[x['t'] for x in STATS[k+1:]]
        s['until']=min([s['t']+2.6]+nxt)
TITLE=CFG.get('title')  # [line, word, big, small, untilLine, untilWord]
HITS=[ws(*h) for h in CFG.get('hits',[])]+[ws(*b) for b in CFG.get('breaks',[])]
def text_img(txt,font,fill,stroke=0):
    b=font.getbbox(txt,stroke_width=stroke); w,h=b[2]-b[0]+8,b[3]-b[1]+8
    im=Image.new('RGBA',(w,h),(0,0,0,0)); ImageDraw.Draw(im).text((4-b[0],4-b[1]),txt,font=font,fill=fill,stroke_width=stroke,stroke_fill=(0,0,0,255))
    return im
TC={}
def paste_center(base,im,cx,cy,scale=1.0,alpha=1.0):
    if im.width*scale>1030: scale=1030/im.width
    if scale!=1.0: im=im.resize((max(1,int(im.width*scale)),max(1,int(im.height*scale))),Image.BICUBIC)
    if alpha<1: im=im.copy(); im.putalpha(im.split()[3].point(lambda v:int(v*alpha)))
    base.alpha_composite(im,(int(cx-im.width/2),int(cy-im.height/2)))
def stext(base,txt,font,fill,cx,cy,scale=1.0,alpha=1.0,glow=None,stroke=5,track=0):
    key=(txt,font.size,font.path,fill,glow,stroke)
    if key not in TC:
        sh=text_img(txt,font,(0,0,0,210)).filter(ImageFilter.GaussianBlur(10))
        g=text_img(txt,font,glow+(255,)).filter(ImageFilter.GaussianBlur(20)) if glow else None
        TC[key]=(sh,g,text_img(txt,font,fill+(255,),stroke))
    sh,g,m=TC[key]
    paste_center(base,sh,cx+4,cy+7,scale,alpha*0.9)
    if g: paste_center(base,g,cx,cy,scale,alpha*0.85)
    paste_center(base,m,cx,cy,scale,alpha)
def pop(dt,dur=0.13,over=1.28):
    if dt<0: return 0
    if dt<dur: return over*math.sin(dt/dur*math.pi/2)
    if dt<2*dur: return over+(1-over)*(dt-dur)/dur
    return 1.0
def count_text(txt,prog):
    m=re.match(r'^([^\d]*)([\d\s]+[\d])(.*)$',txt)
    if not m or prog>=1 or re.search(r'(19|20)\d\d',txt) or '<' in txt: return txt
    if m.group(1).strip() not in ('','≈') or m.group(3).strip().replace('+','').strip() not in ('','CH','KM/H','NM','S','L','TR/MIN'): return txt
    num=int(m.group(2).replace(' ','')); v=int(num*prog)
    s=f'{v:,}'.replace(',',' ') if ' ' in m.group(2) else str(v)
    return m.group(1)+s+m.group(3)
def overlays(t):
    ov=Image.new('RGBA',(W,H),(0,0,0,0)); d=ImageDraw.Draw(ov)
    # brand tag top
    if CFG.get('tag'):
        stext(ov,CFG['tag'],F(34,'ExtraBold'),(235,235,235),540,215,1,0.85,stroke=3)
    if TITLE:
        t0=ws(TITLE[0],TITLE[1])-0.05; t1=ws(TITLE[4],TITLE[5]) if len(TITLE)>5 else t0+2.8
        if t0<=t<t1:
            dt=t-t0; a=min(1,(t1-t)/0.2)
            stext(ov,TITLE[2],F(150),WHITE,540,860,pop(dt,0.12,1.35),a,glow=ACC if dt<0.5 else None,stroke=6)
            s2=pop(dt-0.15,0.12,1.2)
            if s2>0: stext(ov,TITLE[3],F(64,'ExtraBold'),ACC,540,990,s2,a,stroke=5)
            w=int(380*min(1,dt/0.4)); d.rectangle((540-w,1050,540+w,1056),fill=ACC+(int(255*a),))
    for s in STATS:
        if s['t']<=t<s['until']:
            dt=t-s['t']; a=min(1,(s['until']-t)/0.18)
            prog=min(1,dt/0.55); prog=1-(1-prog)**3
            stext(ov,count_text(s['big'],prog),F(170),ACC,540,560,pop(dt,0.12,1.3),a,glow=ACC if dt<0.5 else None,stroke=7)
            stext(ov,s['small'],F(56,'ExtraBold'),WHITE,540,700,min(1,pop(dt-0.12,0.1,1.15)),a,stroke=5)
    if CFG.get('cta') and t>=ws(*CFG['cta'][0])-0.1:
        dt=t-ws(*CFG['cta'][0])+0.1
        stext(ov,CFG['cta'][1],F(CFG.get('cta_size',110)),WHITE,540,620,pop(dt,0.13,1.3),glow=ACC,stroke=6)
        k=0.9+0.1*abs(math.sin(dt*6))
        stext(ov,CFG['cta'][2],F(60,'ExtraBold'),ACC,540,760,k*min(1,pop(dt-0.2,0.12,1.2)),stroke=5)
    # progress bar bottom (retention cue)
    d.rectangle((0,H-10,int(W*t/T),H),fill=ACC+(200,))
    return ov
yy,xx=np.mgrid[0:H,0:W].astype(np.float32)
r=np.sqrt(((xx-W/2)/(W*0.6))**2+((yy-H/2)/(H*0.58))**2)
VIG=np.clip(1-0.8*np.clip(r-0.42,0,1)**1.3,0,1)[...,None]
TOPG=np.clip(1-np.clip((yy-0)/520,0,1),0,1)[...,None]*0.35   # darken top for stats
BOTG=np.clip((yy-1150)/500,0,1)[...,None]*np.clip((1700-yy)/250,0,1)[...,None]*0.25
GR=[(np.asarray(Image.fromarray((rng.normal(128,40,(H//2,W//2))).clip(0,255).astype(np.uint8)).resize((W,H)),np.float32)/255-0.5)[...,None]*0.055 for _ in range(5)]
def shake(t):
    sx=sy=0
    for tt in HITS:
        d_=t-tt
        if 0<=d_<0.32: a=(1-d_/0.32)**2*20; sx+=a*math.sin(t*97); sy+=a*math.cos(t*71)
    return (sx,sy)
FITBG={}
def fitframe(c,t,p,punch):
    img=c['img']; im=src(img,int((t-c['s'])*FPS))
    key=img if not img.startswith('V:') else None
    if key not in FITBG or key is None:
        b=im.resize((W//4,int(W//4*im.height/im.width))) if im.width/im.height>W/H else im.resize((int(H//4*im.width/im.height),H//4))
        bw,bh=b.size; sc=max(W/4/bw,H/4/bh); b=b.resize((int(bw*sc)+1,int(bh*sc)+1)); b=b.crop((0,0,W//4,H//4)).filter(ImageFilter.GaussianBlur(6)).resize((W,H),Image.BILINEAR)
        bg=np.asarray(b,np.float32)/255*0.38
        if key: FITBG[key]=bg
    else: bg=FITBG[key]
    e=p*p*(3-2*p)*0.6+p*0.4; z=(1.12+0.14*e)*(1+punch)
    fw=int(W*z); fh=int(fw*im.height/im.width)
    fg=np.asarray(im.resize((fw,fh),Image.BICUBIC),np.float32)/255
    out=bg.copy(); x0=(fw-W)//2+int((e-0.5)*0.06*fw); y0=int(H*0.47-fh/2)
    sx0=max(0,x0); sx1=min(fw,x0+W); dy0=max(0,y0); dy1=min(H,y0+fh)
    out[dy0:dy1,:sx1-sx0]=fg[dy0-y0:dy1-y0,sx0:sx1]
    # soft edges top/bottom
    for k in range(18):
        a=k/18
        if 0<=dy0+k<H: out[dy0+k]=out[dy0+k]*a+bg[dy0+k]*(1-a)
        if 0<=dy1-1-k<H: out[dy1-1-k]=out[dy1-1-k]*a+bg[dy1-1-k]*(1-a)
    return out
def shot(c,t):
    p=min(max((t-c['s'])/max(c['e']-c['s'],1e-3),0),1)
    punch=0.14*(1-(t-c['s'])/0.2) if 0<=t-c['s']<0.2 else 0
    if c.get('fit'): return fitframe(c,t,p,punch)
    return view(c['img'],W,H,p,c['z0'],c['z1'],c['dx'],c['rot'],shake(t),punch,fi=int((t-c['s'])*FPS),cxo=c.get('cx'))
def rgb_split(fr,amt):
    k=int(amt)
    if k<1: return fr
    o=fr.copy(); o[...,0]=np.roll(fr[...,0],k,1); o[...,2]=np.roll(fr[...,2],-k,1); return o
def whip(fr,amt):
    if amt<2: return fr
    acc=np.zeros_like(fr); n=6
    for i in range(n): acc+=np.roll(fr,int(amt*i/n),axis=1)
    return acc/n
def render(t):
    k=0
    for i,c in enumerate(EDL):
        if c['s']<=t: k=i
    c=EDL[k]; fr=shot(c,t); dt=t-c['s']
    if k>0 and dt<0.12: fr=whip(rgb_split(fr,(1-dt/0.12)*26),(1-dt/0.12)*180)
    if k+1<len(EDL) and EDL[k+1]['s']-t<0.08: fr=whip(fr,(1-(EDL[k+1]['s']-t)/0.08)*150)
    fr=fr*VIG*(1-TOPG)*(1-BOTG)
    o=np.asarray(overlays(t),np.float32)/255; fr=fr*(1-o[...,3:])+o[...,:3]*o[...,3:]
    for tt in HITS:
        d_=t-tt
        if 0<=d_<0.15: a=(1-d_/0.15)*0.7; fr=fr*(1-a)+a
    if k>0 and dt<0.04: fr=fr*0.6+0.4
    if t<0.12: fr=fr*(t/0.12)
    return fr
if CMD=='preview':
    ts=[float(x) for x in sys.argv[3].split(',')]
    tiles=[Image.fromarray((np.clip(render(t)+GR[0],0,1)*255).astype(np.uint8)).resize((270,480)) for t in ts]
    sh=Image.new('RGB',(270*min(8,len(tiles)),480*math.ceil(len(tiles)/8)))
    for k,tl in enumerate(tiles): sh.paste(tl,((k%8)*270,(k//8)*480))
    sh.save(f'{D}/preview.jpg',quality=85); sys.exit()
if CMD=='render':
    N=int(T*FPS)
    ff=subprocess.Popen(['ffmpeg','-y','-v','error','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-',
      '-c:v','libx264','-preset','medium','-crf','16','-pix_fmt','yuv420p',f'{D}/video.mp4'],stdin=subprocess.PIPE)
    for n in range(N):
        t=n/FPS; ff.stdin.write((np.clip(render(t)+GR[n%5],0,1)*255).astype(np.uint8).tobytes())
        if n%150==0: print(n,N,flush=True)
    ff.stdin.close(); ff.wait()
    out=sys.argv[3]
    subprocess.run(['ffmpeg','-y','-v','error','-i',f'{D}/video.mp4','-i',f'{D}/mix.wav','-vf',f'ass={D}/subs.ass:fontsdir=/usr/share/fonts/opentype/inter',
      '-c:v','libx264','-preset','medium','-crf','19','-profile:v','high','-pix_fmt','yuv420p','-r','30','-c:a','aac','-b:a','192k','-ar','48000','-movflags','+faststart','-shortest',out],check=True)
    print('done',out)

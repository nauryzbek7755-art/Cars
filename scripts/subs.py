import json,sys,re
S=sys.argv[1]
TL=json.load(open(f'{S}/timeline.json')); lines=json.load(open(f'{S}/scripts/narration.json'))
def ts(t):
    t=max(t,0); h=int(t//3600); m=int(t%3600//60); s=t%60
    return f"{h}:{m:02d}:{s:05.2f}"
MAP={'kilomètres-heure':'KM/H','seize-quatre':'16.4','1200':'1 200','Seize':'SEIZE'}
GOLD='&H0045C8FF&'; WHITE='&H00FFFFFF&'
head=f"""[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Sub,Inter ExtraBold,82,&H00FFFFFF,&H00FFFFFF,&H00000000,&H96000000,-1,0,0,0,100,100,1,0,1,5,3,5,110,110,0,1
Style: Label,Inter SemiBold,38,&H0045C8FF,&H00FFFFFF,&H00000000,&H64000000,-1,0,0,0,100,100,9,0,1,0,2,5,60,60,0,1
Style: Big,Inter ExtraBold,128,&H00FFFFFF,&H00FFFFFF,&H00000000,&H78000000,-1,0,0,0,100,100,2,0,1,0,4,5,60,60,0,1
Style: Small,Inter,34,&H00D0D0D0,&H00FFFFFF,&H00000000,&H64000000,0,0,0,0,100,100,1,0,1,0,1,5,60,60,0,1
Style: Bar,Inter,10,&H0045C8FF,&H00FFFFFF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,0,0,7,0,0,0,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
ev=[]
SUBY=1390
for ln in TL['lines']:
    text=lines[ln['i']]; pos=0; toks=[]
    for w in ln['words']:
        tok=w['w']; j=text.find(tok.split(' ')[0],pos)
        if j<0: j=pos
        k=j+len(tok); 
        # capture trailing punctuation
        tail=''
        m=re.match(r'\s*([.,:?!;]+)',text[k:])
        if m: tail=m.group(1).strip(); k+=m.end()
        pos=k
        disp=' '.join(MAP.get(p,p) for p in tok.split(' '))
        disp=disp.upper()+(' '+tail if tail in ('?',':') else tail)
        toks.append(dict(s=w['s'],e=w['e'],d=disp,brk=bool(tail)))
    FW={'PIERRE','LA','DE','DU','DES','EN','À','ET','UN','UNE','SA','SES','LE','QUE','PAS',"QU'UNE",'LES'}
    chunks=[];cur=[]
    for n,tk in enumerate(toks):
        nxt=toks[n+1] if n+1<len(toks) else None
        if cur and sum(len(x['d'])+1 for x in cur)+len(tk['d'])>20:
            carry=[]
            while len(cur)>1 and cur[-1]['d'] in FW and not cur[-1]['brk']: carry.insert(0,cur.pop())
            chunks.append(cur);cur=carry
        cur.append(tk)
        if tk['brk'] or len(cur)>=4: 
            carry=[]
            while not tk['brk'] and len(cur)>1 and cur[-1]['d'] in FW: carry.insert(0,cur.pop())
            chunks.append(cur);cur=carry
    if cur: chunks.append(cur)
    for ci,ch in enumerate(chunks):
        cend=chunks[ci+1][0]['s']-0.05 if ci+1<len(chunks) else ch[-1]['e']+0.25
        for wi,w in enumerate(ch):
            st=w['s'] if wi>0 else w['s']-0.05
            en=ch[wi+1]['s'] if wi+1<len(ch) else cend
            parts=[]
            for xj,x in enumerate(ch):
                c=GOLD if xj==wi else WHITE
                parts.append(f"{{\\c{c}}}{x['d']}")
            anim="{\\fscx70\\fscy70\\alpha&HFF&\\blur6\\t(0,90,\\fscx108\\fscy108\\alpha&H00&\\blur0)\\t(90,170,\\fscx100\\fscy100)}" if wi==0 else ""
            ev.append(f"Dialogue: 2,{ts(st)},{ts(en)},Sub,,0,0,0,,{{\\pos(540,{SUBY})}}{anim}"+' '.join(parts))
L=TL['lines']
def W(i,k): return L[i]['words'][k]['s']
def stat(t0,t1,label,big,bigsize=128):
    ev.append(f"Dialogue: 1,{ts(t0)},{ts(t1)},Label,,0,0,0,,{{\\fad(220,250)\\move(540,300,540,290)\\blur0.6}}{label}")
    ev.append(f"Dialogue: 1,{ts(t0+0.08)},{ts(t1)},Big,,0,0,0,,{{\\fad(220,250)\\fs{bigsize}\\move(540,400,540,388)\\blur0.4}}{big}")
    ev.append(f"Dialogue: 1,{ts(t0+0.08)},{ts(t1)},Bar,,0,0,0,,{{\\fad(220,250)\\an5\\pos(540,470)\\p1\\c&H0045C8FF&\\t(0,400,\\fscx100)\\fscx0}}m -70 0 l 70 0 l 70 4 l -70 4{{\\p0}}")
stat(0.05,L[1]['end']+0.2,'DOCUMENTAIRE','BUGATTI VEYRON',100)
stat(W(2,1)-0.1,L[3]['end']+0.15,'VOLKSWAGEN RACHÈTE BUGATTI','1998')
stat(W(4,1)-0.1,L[4]['end']+0.2,'MOLSHEIM · ALSACE','2005')
stat(L[5]['start'],L[5]['end']+0.15,'W16 · 16 CYLINDRES · 4 TURBOS','8,0 L')
stat(L[6]['start'],L[6]['end']+0.15,'REFROIDISSEMENT','10 RADIATEURS',96)
stat(L[7]['start'],L[7]['end']+0.15,'0 – 100 KM/H','2,5 S')
stat(W(8,6)-0.1,L[8]['end']+0.3,'VITESSE DE POINTE · 2005','407 KM/H')
stat(W(9,1)-0.1,L[10]['end']+0.3,'SUPER SPORT · 2010 · 1 200 CH','431,072 KM/H',104)
stat(W(11,5)-0.1,L[11]['end']+0.15,'PIERRE VEYRON','LE MANS 1939',110)
stat(W(12,1)-0.1,L[12]['end']+0.2,'2005 – 2015','450 EXEMPLAIRES',92)
ev.append(f"Dialogue: 0,{ts(0)},{ts(TL['shots'][-1]['start']+0.3)},Bar,,0,0,0,,{{\\an7\\pos(0,0)\\p1\\c&H000000&\\1a&H50&\\blur90}}m -200 -200 l 1280 -200 l 1280 560 l -200 560{{\\p0}}")
ev.append(f"Dialogue: 0,{ts(0)},{ts(TL['shots'][-1]['start']+0.3)},Bar,,0,0,0,,{{\\an7\\pos(0,0)\\p1\\c&H000000&\\1a&HA0&\\blur90}}m -200 1250 l 1280 1250 l 1280 1530 l -200 1530{{\\p0}}")
# end card
T0=TL['shots'][-1]['start']+0.2; T1=TL['total']
ev.append(f"Dialogue: 1,{ts(T0)},{ts(T1)},Big,,0,0,0,,{{\\fad(500,400)\\fs118\\fsp14\\pos(540,880)}}BUGATTI")
ev.append(f"Dialogue: 1,{ts(T0+0.25)},{ts(T1)},Big,,0,0,0,,{{\\fad(500,400)\\fs118\\fsp14\\pos(540,1010)\\c&H0045C8FF&}}VEYRON")
ev.append(f"Dialogue: 1,{ts(T0+0.5)},{ts(T1)},Label,,0,0,0,,{{\\fad(500,400)\\pos(540,1110)}}16.4 · 2005 – 2015")
ev.append(f"Dialogue: 1,{ts(T0+0.7)},{ts(T1)},Small,,0,0,0,,{{\\fad(500,400)\\pos(540,1640)}}Images : Wikimedia Commons (CC BY / CC BY-SA)\\NCrédits complets en description")
open(f'{S}/subs.ass','w').write(head+'\n'.join(ev)+'\n')
print(len(ev))

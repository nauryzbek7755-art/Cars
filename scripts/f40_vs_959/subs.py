import json,sys,re
S=sys.argv[1]
TL=json.load(open(f'{S}/fv/tl.json')); lines=json.load(open(f'{S}/fv/narration.json'))
def ts(t):
    t=max(t,0); return f"0:{int(t//60):02d}:{t%60:05.2f}"
MAP={'kilomètres-heure':'KM/H','neuf-cinq-neuf':'959','Deux-zéro':'DEUX-ZÉRO'}
RED='&H001F2AFF&'; ICE='&H00FFDCC4&'; GOLD='&H0045C8FF&'; WHITE='&H00FFFFFF&'
def kcol(w):
    u=w.upper()
    if any(k in u for k in ('FERRARI','F40')): return RED
    if any(k in u for k in ('PORSCHE','959')): return ICE
    if re.search(r'\d',u) or u.startswith(('DEUX','PARTOUT','ABS','COMMENTE','ZÉRO')) : return GOLD
    return WHITE
head="""[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Sub,Inter Display Black,84,&H00FFFFFF,&H00FFFFFF,&H00000000,&HA0000000,-1,0,0,0,100,100,1,0,1,6,4,5,100,100,0,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
ev=[]; Y=1560
SKIP={1,3,5,7}  # round cards show the text on screen
for ln in TL['lines']:
    if ln['i'] in SKIP: continue
    text=lines[ln['i']]; pos=0; toks=[]
    for w in ln['words']:
        tok=w['w']; j=text.find(tok.split(' ')[0],pos); j=pos if j<0 else j
        k=j+len(tok); m=re.match(r'\s*([.,:?!;]+)',text[k:]); tail=''
        if m: tail=m.group(1).strip(); k+=m.end()
        pos=k
        disp=' '.join(MAP.get(p,p) for p in tok.split(' ')).upper()
        if tail in ('?','!',':'): disp+=' '+tail
        elif tail: disp+=tail
        toks.append(dict(s=w['s'],e=w['e'],d=disp,brk=bool(tail)))
    chunks=[];cur=[]
    for tk in toks:
        if cur and sum(len(x['d'])+1 for x in cur)+len(tk['d'])>17: chunks.append(cur);cur=[]
        cur.append(tk)
        if tk['brk'] or len(cur)>=3: chunks.append(cur);cur=[]
    if cur: chunks.append(cur)
    for ci,ch in enumerate(chunks):
        cend=chunks[ci+1][0]['s']-0.03 if ci+1<len(chunks) else ch[-1]['e']+0.2
        for wi,w in enumerate(ch):
            st=w['s']-0.03 if wi==0 else w['s']; en=ch[wi+1]['s'] if wi+1<len(ch) else cend
            parts=[]
            for xj,x in enumerate(ch):
                c=kcol(x['d']); 
                if xj==wi: parts.append(f"{{\\c{c}\\fscx115\\fscy115}}{x['d']}{{\\fscx100\\fscy100}}")
                else: parts.append(f"{{\\c{c}}}{x['d']}")
            anim="{\\fscx60\\fscy60\\alpha&HFF&\\t(0,80,\\fscx110\\fscy110\\alpha&H00&)\\t(80,150,\\fscx100\\fscy100)}" if wi==0 else ""
            ev.append(f"Dialogue: 2,{ts(st)},{ts(en)},Sub,,0,0,0,,{{\\pos(540,{Y})}}{anim}"+' '.join(parts))
open(f'{S}/fv/subs.ass','w').write(head+'\n'.join(ev)+'\n')
for e in ev: pass
import collections
print(len(ev))

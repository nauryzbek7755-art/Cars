// ===== Et si tu devenais le plus beau de l'école ? =====
var SNOW=0;
const BX=`<linearGradient id="lockG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3f7ad9"/><stop offset="1" stop-color="#2a5ab0"/></linearGradient>
<linearGradient id="hallW" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4efe4"/><stop offset="1" stop-color="#e2d8c4"/></linearGradient>
<linearGradient id="hallF" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9d3e0"/><stop offset="1" stop-color="#9eabbd"/></linearGradient>
<linearGradient id="hStyle" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#c9ccd8"/></linearGradient><radialGradient id="aura"><stop offset="0" stop-color="#fff6c0" stop-opacity=".8"/><stop offset="1" stop-color="#ffd45a" stop-opacity="0"/></radialGradient>`;
KIDS.g1={hood:'hPurple',hair:'#e8c040',skin:'skin',long:true};
KIDS.g2={hood:'hTeach',hair:'#2a1a10',skin:'skin2',long:true};
KIDS.g3={hood:'hGreen',hair:'#c46a2a',skin:'skin',long:true};
KIDS.b1={hood:'hOrange',hair:'#111',skin:'skin3'};
KIDS.pote={hood:'hRed',hair:'#111111',skin:'skin2'};
function heartAt(x,y,r,col='#ff3b5c'){return `<path d="M${x},${y+r*0.9} C${x-r*1.6},${y-r*0.2} ${x-r*0.8},${y-r*1.3} ${x},${y-r*0.4} C${x+r*0.8},${y-r*1.3} ${x+r*1.6},${y-r*0.2} ${x},${y+r*0.9}Z" fill="${col}"/>`}
function heartEyes(x,y,K){const hc=y-1.64*K;return heartAt(x-0.06*K,hc+0.02*K,0.045*K)+heartAt(x+0.06*K,hc+0.02*K,0.045*K)}
function sparkles(x,y,R,t,n=8){let s='';for(let k=0;k<n;k++){const a=k/n*Math.PI*2+t*1.2,rr=R*(0.8+0.25*Math.sin(t*3+k)),sz=10+8*Math.abs(Math.sin(t*4+k));const px=x+Math.cos(a)*rr,py=y+Math.sin(a)*rr*0.8;
  s+=`<path d="M${px},${py-sz} L${px+sz*0.3},${py-sz*0.3} L${px+sz},${py} L${px+sz*0.3},${py+sz*0.3} L${px},${py+sz} L${px-sz*0.3},${py+sz*0.3} L${px-sz},${py} L${px-sz*0.3},${py-sz*0.3}Z" fill="#fff6b0"/>`;}return s}
// handsome hero: aura + quiff + sunglasses on head + shiny smile
function beauHero(x,y,K,o){const hc=y-(o.jump||0)-1.64*K;let s=`<circle cx="${x}" cy="${hc}" r="${0.55*K}" fill="url(#aura)" opacity="${o.glow??1}"/>`;
  s+=hero(x,y,K,{flag:false,mood:'happy',...o}).split('url(#hood)').join('url(#hStyle)');
  s+=`<path d="M${x-0.12*K},${y-(o.jump||0)-1.44*K} Q${x},${y-(o.jump||0)-1.28*K} ${x+0.12*K},${y-(o.jump||0)-1.44*K}" stroke="#f0c030" stroke-width="${0.018*K}" fill="none"/><circle cx="${x}" cy="${y-(o.jump||0)-1.31*K}" r="${0.025*K}" fill="#ffd45a" stroke="#c9a030" stroke-width="${0.006*K}"/>`;
  s+=`<path d="M${x-0.17*K},${hc-0.1*K} Q${x-0.12*K},${hc-0.34*K} ${x+0.06*K},${hc-0.3*K} Q${x+0.24*K},${hc-0.27*K} ${x+0.2*K},${hc-0.1*K} Q${x+0.1*K},${hc-0.2*K} ${x-0.02*K},${hc-0.16*K} Q${x-0.1*K},${hc-0.13*K} ${x-0.17*K},${hc-0.1*K}Z" fill="#3a2214"/>`;
  s+=`<path d="M${x-0.08*K},${hc-0.27*K} Q${x+0.05*K},${hc-0.33*K} ${x+0.16*K},${hc-0.24*K}" stroke="#7a4a2a" stroke-width="${0.012*K}" fill="none"/>`;
  s+=`<rect x="${x-0.13*K}" y="${hc-0.2*K}" width="${0.26*K}" height="${0.05*K}" rx="${0.02*K}" fill="#111"/><circle cx="${x-0.06*K}" cy="${hc-0.175*K}" r="${0.035*K}" fill="#222"/><circle cx="${x+0.06*K}" cy="${hc-0.175*K}" r="${0.035*K}" fill="#222"/>`;
  s+=`<path d="M${x+0.02*K},${hc+0.12*K} l${0.02*K},${-0.02*K} l${0.02*K},${0.02*K} l${-0.02*K},${0.02*K}Z" fill="#fff"/>`;
  return s}
function hallway(t,scroll=0){let s=`<rect width="1080" height="1920" fill="url(#hallW)"/>`;
  for(let k=0;k<6;k++) s+=`<rect x="${k*200-20}" y="60" width="140" height="20" rx="10" fill="#fff" opacity=".9"/><rect x="${k*200-30}" y="80" width="160" height="40" fill="#fff8d0" opacity=".3"/>`;
  s+=`<rect x="0" y="380" width="1080" height="40" fill="#c9b48e"/>`;
  for(let k=-1;k<9;k++){const x=((k*140-scroll)%1260+1260)%1260-140;
    s+=`<rect x="${x}" y="420" width="132" height="820" rx="6" fill="url(#lockG)"/><rect x="${x+8}" y="430" width="116" height="800" rx="4" fill="none" stroke="#1f4a90" stroke-width="4"/>`;
    for(let v=0;v<5;v++) s+=`<rect x="${x+36}" y="${470+v*18}" width="60" height="8" rx="4" fill="#1f4a90"/>`;
    s+=`<rect x="${x+100}" y="780" width="12" height="60" rx="6" fill="#d9dde6"/><text x="${x+66}" y="1200" font-family="IB" font-size="30" text-anchor="middle" fill="#cfe0ff">${100+((k+20)%40)}</text>`;}
  s+=`<rect x="0" y="1240" width="1080" height="680" fill="url(#hallF)"/>`;for(let k=0;k<12;k++) s+=`<line x1="${k*100-40}" y1="1240" x2="${(k*100-540)*2+540}" y2="1920" stroke="#b5c0cf" stroke-width="3"/>`;
  s+=`<ellipse cx="540" cy="1400" rx="420" ry="40" fill="#fff" opacity=".35"/>`;
  return s}
function letter(x,y,r,sc=1){return `<g transform="translate(${x},${y}) rotate(${r}) scale(${sc})"><rect x="-50" y="-34" width="100" height="68" rx="6" fill="#ffd0dc" stroke="#e86a8a" stroke-width="3"/><path d="M-50,-34 L0,8 L50,-34" fill="none" stroke="#e86a8a" stroke-width="3"/>${heartAt(0,6,12)}</g>`}
function phone(x,y,flash){return `<g transform="translate(${x},${y})"><rect x="-22" y="-40" width="44" height="80" rx="8" fill="#111"/><rect x="-18" y="-34" width="36" height="66" rx="4" fill="#4a6aa8"/>${flash?`<circle cx="0" cy="-30" r="40" fill="#fff" opacity=".85"/>`:''}</g>`}
function render(t){
  let i=0;for(let k=0;k<S.length-1;k++) if(t>=S[k]-0.12) i=k; const lt=t-S[i];
  const blink=(t%3.1)>2.98; let s=DEFS.replace('</defs>',EXTRA+BX+'</defs>'); let shake=0; SNOW=0;
  if(i===0){
    // bathroom mirror: before/after with flash
    s+=`<rect width="1080" height="1920" fill="#dff2f0"/>`;for(let y=0;y<1920;y+=120) for(let x=-60*((y/120)%2);x<1080;x+=120) s+=`<rect x="${x}" y="${y}" width="116" height="116" fill="#eaf8f6" stroke="#cfe6e2" stroke-width="3"/>`;
    s+=`<rect x="140" y="260" width="800" height="1060" rx="40" fill="#b8dff0" stroke="#c9a46a" stroke-width="20"/><path d="M220,320 L420,320 L260,700Z" fill="#fff" opacity=".35"/>`;
    s+=`<rect x="80" y="1320" width="920" height="80" rx="16" fill="#fff"/><rect x="100" y="1400" width="880" height="520" fill="#e8eef2"/>`;
    const after=t>1.1;
    if(!after) s+=hero(540,1900,560,{t,flag:false,mood:t<0.6?'neutral':'wow',blink:t<0.4,look:[0,0]});
    else{s+=beauHero(540,1900,560,{t,look:[0.4,0],armR:-140,glow:1});s+=sparkles(540,1900-1.64*560,330,t,10);}
    if(t>1.0&&t<1.25) s+=`<rect width="1080" height="1920" fill="#fff" opacity="${1-Math.abs(t-1.12)/0.13}"/>`;
    shake=t>1.1&&t<1.4?0.2:0;
    s+=bigText([["LE PLUS BEAU",110,'#ffd45a'],["DE L'ÉCOLE ?",100,'#ffffff']],180,back((t-0.1)/0.3));
  } else if(i===1){
    s+=hallway(t,lt*30);
    // students on both sides turning with heart eyes
    const side=[['g1',150,1700,300],['b1',330,1520,230],['g2',930,1700,300],['g3',760,1520,230]];
    side.forEach(([v,x,y,K],k)=>{const turn=lt>0.5+k*0.25;s+=kid(v,x,y,K,{t,mood:'wow',look:[x<540?1:-1,0],blink:false,armR:turn&&k%2?-120:0});if(turn) s+=heartEyes(x,y,K);});
    s+=beauHero(540,1880,420,{t,walk:t*4,look:[0,0],blink});
    for(let k=0;k<6;k++) s+=`<line x1="${100+k*160}" y1="${900+k*30}" x2="${40+k*160}" y2="${880+k*30}" stroke="#fff" stroke-width="6" opacity=".6"/>`;
    s+=sparkles(540,1880-1.64*420,240,t,8);
    s+=bigText([["TOUT LE MONDE",84,'#ffffff'],["SE RETOURNE",96,'#ff7ab0']],230,back((lt-0.6)/0.3));
  } else if(i===2||i===3){
    s+=hallway(t,0);
    const open=ease((t-S[2]-0.5)/0.4);
    // locker door
    s+=`<rect x="360" y="420" width="300" height="820" fill="#1a2a50"/>`;
    s+=`<g transform="translate(360,420) scale(${1-open*0.85},1)"><rect width="300" height="820" rx="6" fill="url(#lockG)"/><text x="150" y="420" font-family="IB" font-size="60" fill="#cfe0ff" text-anchor="middle">121</text></g>`;
    if(open>0.2) for(let k=0;k<34;k++){const p=Math.max(0,Math.min(1.4,(t-S[2]-0.6-rnd(k)*0.5)));const x=510+(rnd(k+3)-.5)*260+(rnd(k+7)-.5)*600*p,y=700+rnd(k+5)*400+p*p*700-p*200;s+=letter(x,Math.min(y,1820),rnd(k)*80-40+p*200*(rnd(k+9)-.5),0.9+rnd(k+2)*0.5);}
    s+=beauHero(220,1900,360,{t,mood:'wow',look:[1,-0.4],blink:false,armR:-40});
    if(i===2) s+=bigText([["DES DIZAINES",100,'#ffffff'],["DE LETTRES D'AMOUR",72,'#ff7ab0']],230,back((lt-0.9)/0.3));
    else{s+=button('+ Abonne-toi',1180,lt);const cp=easeOut((lt-0.35)/0.4);s+=cursor(lerp(900,640,cp),lerp(1400,1210,cp),lt>0.8&&lt<1.0);}
  } else if(i===4){
    // crowd with phones, everywhere
    s+=hallway(t,0)+`<rect width="1080" height="1920" fill="#000" opacity=".1"/>`;
    s+=beauHero(540,1880,420,{t,mood:'sad',look:[Math.sin(t*5),0],glow:0.4,blink:false});
    const crowd=[['g1',140,1900,260],['b1',300,1700,220],['g2',780,1700,220],['g3',940,1900,260],['pote',120,1560,180],['g1',960,1560,180]];
    crowd.forEach(([v,x,y,K],k)=>{s+=kid(v,x,y,K,{t,mood:'happy',look:[x<540?1:-1,-0.2],armR:x<540?-110:0,armL:x>540?110:0});const fl=Math.sin(t*9+k*2)>0.85;s+=phone(x+(x<540?0.5:-0.5)*K,y-1.55*K,fl);if(fl) shake=0.05;});
    s+=bigText([["PLUS UNE SECONDE",80,'#ffffff'],["DE TRANQUILLITÉ",80,'#ff5a5a']],230,back((lt-1.0)/0.3));
  } else if(i===5){
    // schoolyard: best friend turns away
    s+=sky('skyGold',t)+`<rect x="0" y="1200" width="1080" height="720" fill="#c9b48e"/><rect x="0" y="1180" width="1080" height="30" fill="#8a6a4a"/>`;
    s+=`<rect x="0" y="700" width="1080" height="500" fill="#e8c27a"/>`;for(let k=0;k<8;k++) s+=`<rect x="${40+k*130}" y="760" width="90" height="120" fill="#9fd4ff" stroke="#fff" stroke-width="6"/>`;
    s+=`<rect x="600" y="1500" width="420" height="40" rx="10" fill="#8a5a32"/><rect x="620" y="1540" width="20" height="120" fill="#6a4a2a"/><rect x="980" y="1540" width="20" height="120" fill="#6a4a2a"/>`;
    s+=`<g transform="translate(1620,0) scale(-1,1)">${kid('pote',810,1560+0.8*300,300,{t,sit:true,mood:'sad',look:[1,0.4],armL:-25,armR:25})}</g>`;
    s+=beauHero(300,1880,380,{t,mood:'sad',look:[1,0],glow:0.2,blink});
    s+=heartAt(560,820,40,'#c22a4a').replace('Z"','Z" opacity="0.9"')+`<line x1="545" y1="790" x2="575" y2="850" stroke="#fff" stroke-width="6"/>`;
    s+=bigText([["TON MEILLEUR POTE…",80,'#ffffff']],230,back((lt-0.1)/0.3));
  } else {
    s+=`<rect width="1080" height="1920" fill="#1a1440"/>`;
    // two choices
    s+=`<rect x="40" y="520" width="480" height="900" rx="40" fill="#ffd45a"/><rect x="560" y="520" width="480" height="900" rx="40" fill="#5fd35f"/>`;
    s+=`<g transform="translate(0,0)">${beauHero(280,1300,300,{t,look:[0,0],blink})}</g>`;
    s+=hero(720,1300,250,{t,flag:false,mood:'happy',blink})+kid('pote',900,1300,250,{t,mood:'happy',armL:40,blink});
    s+=`<text x="280" y="1380" font-family="IB" font-size="70" text-anchor="middle" fill="#120a1c">BEAU</text><text x="800" y="1380" font-family="IB" font-size="56" text-anchor="middle" fill="#120a1c">VRAIS AMIS</text>`;
    s+=`<g transform="translate(540,960) scale(${1+0.06*Math.sin(t*6)})"><circle r="70" fill="#fe2c55"/><text y="22" font-family="IB" font-size="56" text-anchor="middle" fill="#fff">OU</text></g>`;
    s+=bigText([["TU PRÉFÈRES… ?",96,'#ffffff']],200,back(lt/0.3));
    s+=button('Commente !',420,lt-1.2);
  }
  const dt=t-S[i]; if(i>0&&dt<0.1&&i!==3) s+=`<rect width="1080" height="1920" fill="#fff" opacity="${(1-dt/0.1)*0.5}"/>`;
  s+=`<rect width="1080" height="1920" fill="url(#vig)"/>`;
  if(t>T-0.35) s+=`<rect width="1080" height="1920" fill="#000" opacity="${(t-(T-0.35))/0.35}"/>`;
  const sx=Math.sin(t*61)*24*shake, sy=Math.cos(t*53)*18*shake, kick=1+0.05*Math.exp(-Math.max(0,dt)*6);
  SV.innerHTML=`<g transform="translate(${540+sx},${960+sy}) scale(${kick}) translate(-540,-960)">${s}</g>`;
}
render(0);

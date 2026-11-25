// ===== Le chien qui a menti sur son CV =====
var SNOW=0;
const DX=`<radialGradient id="dogG" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#f6dcb0"/><stop offset=".6" stop-color="#e0b47a"/><stop offset="1" stop-color="#b8844a"/></radialGradient>
<linearGradient id="earG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9a5f30"/><stop offset="1" stop-color="#6a3a18"/></linearGradient>
<linearGradient id="vest" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffe23a"/><stop offset="1" stop-color="#e8b800"/></linearGradient>
<linearGradient id="navy" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#34406e"/><stop offset="1" stop-color="#1c2448"/></linearGradient>
<linearGradient id="termFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9dde6"/><stop offset="1" stop-color="#aab1c0"/></linearGradient>
<linearGradient id="glassW" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6fb8ff"/><stop offset="1" stop-color="#c8e8ff"/></linearGradient>
<linearGradient id="bagG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3a3f4a"/><stop offset="1" stop-color="#1e2128"/></linearGradient>`;
// ---- Biscotte (dog) ----
function biscotte(x,y,s,o={}){
  const t=o.t||0, mood=o.mood||'happy', br=Math.sin(t*2.4)*3, outfit=o.outfit||'none', nose=o.nose||0, sniff=o.sniff;
  const walk=o.walk; const bob=walk!=null?Math.abs(Math.sin(walk))*12:0;
  let g=`<g transform="translate(${x},${y-bob*s}) scale(${s})">`;
  g+=`<ellipse cx="0" cy="${6+bob}" rx="140" ry="20" fill="#000" opacity=".3"/>`;
  const fL=walk!=null?Math.max(0,Math.sin(walk))*30:0, fR=walk!=null?Math.max(0,-Math.sin(walk))*30:0;
  g+=`<ellipse cx="-55" cy="${-10-fL}" rx="44" ry="22" fill="#e0b47a"/><ellipse cx="55" cy="${-10-fR}" rx="44" ry="22" fill="#e0b47a"/>`;
  // body
  g+=`<ellipse cx="0" cy="${-140-br}" rx="130" ry="${140+br}" fill="url(#dogG)"/><ellipse cx="0" cy="-110" rx="80" ry="95" fill="#fff4e0"/>`;
  if(outfit==='suit') g+=`<path d="M-128,-170 Q-130,-30 -100,-20 L100,-20 Q130,-30 128,-170 Q100,-250 0,-260 Q-100,-250 -128,-170Z" fill="url(#navy)"/><path d="M-40,-255 L0,-150 L40,-255Z" fill="#fff"/><path d="M0,-240 l-14,20 l14,90 l14,-90Z" fill="#d0202a"/><circle cx="0" cy="-90" r="7" fill="#c9a030"/><circle cx="0" cy="-55" r="7" fill="#c9a030"/>`;
  if(outfit==='security'||outfit==='chef') g+=`<path d="M-128,-170 Q-130,-30 -100,-20 L100,-20 Q130,-30 128,-170 Q100,-250 0,-260 Q-100,-250 -128,-170Z" fill="url(#vest)"/><rect x="-128" y="-130" width="256" height="18" fill="#c0c4cc"/><rect x="-128" y="-80" width="256" height="18" fill="#c0c4cc"/><rect x="-60" y="-215" width="120" height="44" rx="8" fill="#1c2448"/><text x="0" y="-185" font-family="IB" font-size="22" text-anchor="middle" fill="#fff">SÉCURITÉ</text>`;
  if(outfit==='chef') g+=`<g transform="translate(70,-150)"><circle r="26" fill="#ffd45a" stroke="#c9a030" stroke-width="5"/><path d="M0,-14 L4,-4 L14,-4 L6,3 L9,14 L0,7 L-9,14 L-6,3 L-14,-4 L-4,-4Z" fill="#c9a030"/></g>`;
  // arms
  const aR=o.armR??0, aL=o.armL??0;
  for(const [sd,a] of [[-1,aL],[1,aR]]) g+=`<g transform="rotate(${a} ${sd*110} -200)"><path d="M${sd*110},-200 Q${sd*150},-140 ${sd*130},-90" stroke="${outfit==='suit'?'#2a335c':outfit==='none'?'#d9a868':'#f0c820'}" stroke-width="44" fill="none" stroke-linecap="round"/><ellipse cx="${sd*130}" cy="-84" rx="24" ry="20" fill="#e0b47a"/></g>`;
  // head
  const hy=-300-br+(sniff?20:0), tilt=o.tilt||0;
  g+=`<g transform="rotate(${tilt} 0 ${hy})">`;
  const earUp=mood==='alert'||mood==='serious';
  for(const sd of [-1,1]) g+=earUp?`<path d="M${sd*80},${hy-70} Q${sd*150},${hy-150} ${sd*120},${hy-30}Z" fill="url(#earG)"/>`:`<path d="M${sd*90},${hy-80} Q${sd*175},${hy-40} ${sd*150},${hy+90} Q${sd*110},${hy+110} ${sd*95},${hy+10}Z" fill="url(#earG)"/>`;
  g+=`<ellipse cx="0" cy="${hy}" rx="118" ry="108" fill="url(#dogG)"/>`;
  g+=`<ellipse cx="0" cy="${hy+50}" rx="76" ry="56" fill="#fff4e0"/>`;
  g+=`<ellipse cx="-40" cy="${hy-30}" rx="34" ry="30" fill="#c8945a" opacity=".5"/>`;
  if(o.cap) g+=`<path d="M-100,${hy-60} Q0,${hy-170} 100,${hy-60}Z" fill="#1c2448"/><rect x="-110" y="${hy-66}" width="220" height="16" rx="8" fill="#141a38"/><path d="M-20,${hy-66} q100,-10 150,20 l-150,4Z" fill="#141a38"/><rect x="-26" y="${hy-120}" width="52" height="34" rx="6" fill="#ffd45a"/><text x="0" y="${hy-96}" font-family="IB" font-size="16" text-anchor="middle" fill="#1c2448">${o.cap}</text>`;
  for(const sd of [-1,1]){const ex=sd*44, ey=hy-6;
    if(o.blink) g+=`<path d="M${ex-18},${ey} q18,12 36,0" stroke="#1a1010" stroke-width="7" fill="none" stroke-linecap="round"/>`;
    else{const big=mood==='panic'?1.35:1;g+=`<ellipse cx="${ex}" cy="${ey}" rx="${18*big}" ry="${22*big}" fill="#1a1010"/><circle cx="${ex-6}" cy="${ey-8}" r="${7*big}" fill="#fff"/><circle cx="${ex+5}" cy="${ey+8}" r="3" fill="#fff"/>`;}
    if(mood==='serious'||mood==='alert') g+=`<path d="M${sd*70},${ey-40} L${sd*18},${ey-26}" stroke="#6a3a18" stroke-width="10" stroke-linecap="round"/>`;
    else if(mood==='panic'||mood==='nervous') g+=`<path d="M${sd*68},${ey-30} L${sd*20},${ey-46}" stroke="#6a3a18" stroke-width="9" stroke-linecap="round"/>`;
    else g+=`<path d="M${sd*66},${ey-40} Q${sd*44},${ey-52} ${sd*22},${ey-40}" stroke="#6a3a18" stroke-width="8" fill="none" stroke-linecap="round"/>`;}
  // nose (grows when lying!)
  const nl=nose*90;
  if(nl>2) g+=`<rect x="-14" y="${hy+18}" width="${0}" height="0"/><path d="M-12,${hy+18} L${nl},${hy+16} L${nl},${hy+44} L-12,${hy+48}Z" fill="#d9a868" stroke="#a8783a" stroke-width="4"/>`;
  g+=`<ellipse cx="${nl}" cy="${hy+30}" rx="28" ry="20" fill="#2a1a12"/><ellipse cx="${nl-8}" cy="${hy+24}" rx="9" ry="5" fill="#fff" opacity=".5"/>`;
  if(sniff) for(let k=0;k<3;k++){const p=((t*2+k*0.33)%1);g+=`<path d="M${nl+40+p*60},${hy+30-k*14} q12,-8 24,0 t24,0" stroke="#9fd8ff" stroke-width="5" fill="none" opacity="${1-p}"/>`;}
  // mouth
  if(mood==='happy'||mood==='proud') g+=`<path d="M-30,${hy+56} Q0,${hy+90} 30,${hy+56}Z" fill="#7a2030"/><ellipse cx="6" cy="${hy+82}" rx="16" ry="20" fill="#ff7a8a"/>`;
  else if(mood==='panic'||mood==='bark') g+=`<ellipse cx="0" cy="${hy+70}" rx="26" ry="${mood==='bark'?30:20}" fill="#5a1525"/><ellipse cx="0" cy="${hy+82}" rx="14" ry="8" fill="#ff7a8a"/>`;
  else if(mood==='nervous') g+=`<path d="M-26,${hy+66} q13,-10 26,0 t26,0" stroke="#5a2a1a" stroke-width="6" fill="none"/>`;
  else g+=`<path d="M-22,${hy+64} Q0,${hy+56} 22,${hy+64}" stroke="#5a2a1a" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  if(o.sweat||mood==='nervous'||mood==='panic') for(let k=0;k<3;k++){const p=((t*1.3+k*0.33)%1);g+=`<path d="M${84+k*16},${hy-70+p*110} q-11,20 0,28 q11,-8 0,-28Z" fill="#7fd0ff" opacity="${1-p}"/>`;}
  g+=`</g>`;
  if(o.salute) g+=`<path d="M110,-200 Q170,-300 70,${hy-60}" stroke="#f0c820" stroke-width="44" fill="none" stroke-linecap="round"/>`;
  return g+`</g>`}
// ---- tourists ----
function goose(x,y,s,t){return `<g transform="translate(${x},${y}) scale(${s})"><ellipse cx="0" cy="6" rx="110" ry="18" fill="#000" opacity=".25"/><line x1="-30" y1="-80" x2="-40" y2="0" stroke="#f08a20" stroke-width="12"/><line x1="30" y1="-80" x2="40" y2="0" stroke="#f08a20" stroke-width="12"/><ellipse cx="0" cy="-170" rx="120" ry="110" fill="#f8f8fa"/><path d="M-20,-260 Q-30,-380 20,-420" stroke="#f8f8fa" stroke-width="70" fill="none" stroke-linecap="round"/><ellipse cx="30" cy="-430" rx="62" ry="56" fill="#f8f8fa"/>
<path d="M80,-430 L150,-420 L80,-405Z" fill="#f08a20"/><circle cx="50" cy="-445" r="10" fill="#111"/><circle cx="46" cy="-449" r="3" fill="#fff"/><ellipse cx="20" cy="-485" rx="95" ry="18" fill="#f2d27a"/><path d="M-30,-490 Q20,-560 70,-490Z" fill="#f2d27a"/><rect x="-30" y="-500" width="100" height="10" fill="#e0263a"/>
<rect x="-70" y="-200" width="80" height="56" rx="8" fill="#333"/><circle cx="-30" cy="-172" r="18" fill="#7a8aa0"/><path d="M-70,-196 Q-30,-260 10,-196" stroke="#8a4a20" stroke-width="5" fill="none"/></g>`}
function panda(x,y,s){return `<g transform="translate(${x},${y}) scale(${s})"><ellipse cx="0" cy="6" rx="120" ry="18" fill="#000" opacity=".25"/><ellipse cx="0" cy="-140" rx="120" ry="140" fill="#f8f8fa"/><path d="M-120,-170 Q0,-110 120,-170 L120,-210 Q0,-150 -120,-210Z" fill="#1a1a22"/><ellipse cx="-60" cy="-10" rx="44" ry="24" fill="#1a1a22"/><ellipse cx="60" cy="-10" rx="44" ry="24" fill="#1a1a22"/>
<rect x="80" y="-250" width="80" height="140" rx="20" fill="#e0263a"/><circle cx="-80" cy="-410" r="38" fill="#1a1a22"/><circle cx="80" cy="-410" r="38" fill="#1a1a22"/><ellipse cx="0" cy="-330" rx="110" ry="100" fill="#f8f8fa"/>
<ellipse cx="-40" cy="-340" rx="30" ry="38" fill="#1a1a22" transform="rotate(-20 -40 -340)"/><ellipse cx="40" cy="-340" rx="30" ry="38" fill="#1a1a22" transform="rotate(20 40 -340)"/><circle cx="-38" cy="-342" r="10" fill="#fff"/><circle cx="42" cy="-342" r="10" fill="#fff"/><ellipse cx="0" cy="-300" rx="16" ry="11" fill="#1a1a22"/><path d="M-14,-282 Q0,-272 14,-282" stroke="#1a1a22" stroke-width="5" fill="none"/></g>`}
function teckel(x,y,s){return `<g transform="translate(${x},${y}) scale(${s})"><ellipse cx="0" cy="6" rx="200" ry="18" fill="#000" opacity=".25"/><rect x="-190" y="-120" width="360" height="110" rx="55" fill="#8a4a1a"/>${[-150,-100,90,140].map(lx=>`<rect x="${lx}" y="-30" width="26" height="34" rx="10" fill="#6a3410"/>`).join('')}
<ellipse cx="200" cy="-150" rx="70" ry="60" fill="#8a4a1a"/><path d="M180,-200 Q130,-130 160,-90 Q190,-120 200,-180Z" fill="#5a2a08"/><ellipse cx="270" cy="-140" rx="40" ry="26" fill="#9a5a2a"/><circle cx="302" cy="-146" r="12" fill="#111"/><circle cx="220" cy="-166" r="10" fill="#111"/><circle cx="217" cy="-170" r="3" fill="#fff"/>
<path d="M140,-205 L260,-205 L245,-230 L155,-230Z" fill="#2f6a3a"/><rect x="190" y="-250" width="20" height="24" fill="#2f6a3a"/><circle cx="200" cy="-255" r="10" fill="#e0263a"/><rect x="-200" y="-200" width="90" height="90" rx="10" fill="#4a6aa8"/></g>`}
function weasel(x,y,s,caught){return `<g transform="translate(${x},${y}) scale(${s}) rotate(${caught?-8:0})"><ellipse cx="0" cy="6" rx="100" ry="16" fill="#000" opacity=".25"/><path d="M-90,-20 L-70,-300 L70,-300 L90,-20Z" fill="#7a6a50"/><path d="M-70,-300 L0,-180 L70,-300Z" fill="#5a4a38"/><line x1="-80" y1="-160" x2="80" y2="-160" stroke="#3a2a20" stroke-width="10"/>
<ellipse cx="0" cy="-380" rx="80" ry="90" fill="#b07a4a"/><ellipse cx="0" cy="-340" rx="50" ry="40" fill="#f0dcc0"/><circle cx="-55" cy="-450" r="22" fill="#b07a4a"/><circle cx="55" cy="-450" r="22" fill="#b07a4a"/><rect x="-66" y="-405" width="132" height="34" rx="14" fill="#111"/><line x1="-80" y1="-392" x2="80" y2="-392" stroke="#111" stroke-width="6"/><ellipse cx="0" cy="-350" rx="12" ry="9" fill="#2a1a12"/>
<path d="M-26,-322 Q0,${caught?-334:-310} 26,-322" stroke="#3a1a10" stroke-width="6" fill="none"/><path d="M-80,-300 Q-130,-250 -150,-200" stroke="#7a6a50" stroke-width="36" stroke-linecap="round"/></g>`}
function suitcase(x,y,s,open=0,col='#3a3f4a'){let g=`<g transform="translate(${x},${y}) scale(${s})"><rect x="-26" y="-330" width="52" height="30" rx="10" fill="none" stroke="#666" stroke-width="10"/><line x1="-20" y1="-300" x2="-20" y2="-240" stroke="#666" stroke-width="10"/><line x1="20" y1="-300" x2="20" y2="-240" stroke="#666" stroke-width="10"/>`;
  g+=`<rect x="-130" y="-240" width="260" height="230" rx="24" fill="url(#bagG)"/>`;for(let k=0;k<4;k++) g+=`<line x1="${-90+k*60}" y1="-230" x2="${-90+k*60}" y2="-20" stroke="#555a66" stroke-width="5"/>`;
  g+=`<circle cx="-90" cy="0" r="16" fill="#111"/><circle cx="90" cy="0" r="16" fill="#111"/><rect x="40" y="-200" width="70" height="40" rx="6" fill="#ffd45a"/>`;
  if(open>0){g+=`<g transform="translate(0,-240) scale(1,${1-open*1.9})"><rect x="-130" y="-230" width="260" height="230" rx="24" fill="#2a2e38"/></g>`;
    for(let k=0;k<10;k++) g+=`<rect x="${-110+(k%5)*44}" y="${-238-Math.floor(k/5)*16}" width="40" height="22" rx="3" fill="#6fbf6a" stroke="#3a7a36" stroke-width="2"/>`;}
  return g+'</g>'}
function bill(x,y,r){return `<g transform="translate(${x},${y}) rotate(${r})"><rect x="-40" y="-20" width="80" height="40" rx="4" fill="#8fd08a" stroke="#3a7a36" stroke-width="3"/><circle r="12" fill="none" stroke="#3a7a36" stroke-width="3"/><text y="8" font-family="IB" font-size="20" text-anchor="middle" fill="#3a7a36">€</text></g>`}
function terminal(t){let s=`<rect width="1080" height="1920" fill="#eef2f8"/><rect x="0" y="120" width="1080" height="820" fill="url(#glassW)"/>`;
  for(let k=0;k<7;k++) s+=`<rect x="${k*180-10}" y="120" width="20" height="820" fill="#8a93a6"/>`;s+=`<rect x="0" y="520" width="1080" height="16" fill="#8a93a6"/>`;
  // planes outside
  const px=((t*60)%1600)-300;s+=`<g transform="translate(${px},760) scale(.9)"><ellipse cx="0" cy="0" rx="260" ry="38" fill="#fff"/><path d="M-60,0 L40,0 L-60,-150 L-110,-150Z" fill="#e8edf5"/><path d="M-60,0 L40,0 L-60,140 L-110,140Z" fill="#dfe5ef"/><path d="M-230,-10 L-260,-110 L-200,-110 L-170,-10Z" fill="#e0263a"/>${[0,1,2,3,4,5,6].map(k=>`<circle cx="${-120+k*44}" cy="-8" r="8" fill="#6fa8e0"/>`).join('')}<path d="M240,-10 Q270,0 240,14Z" fill="#6fa8e0"/></g>`;
  s+=`<rect x="0" y="880" width="1080" height="60" fill="#5a6070"/>`;
  s+=`<rect x="80" y="20" width="920" height="90" rx="14" fill="#1c2448"/><text x="540" y="82" font-family="IB" font-size="46" text-anchor="middle" fill="#ffd45a">AÉROPORT CHARLES-DE-CHAT</text>`;
  s+=`<rect x="0" y="940" width="1080" height="980" fill="url(#termFloor)"/>`;for(let k=0;k<12;k++) s+=`<line x1="${k*100-40}" y1="940" x2="${(k*100-540)*2.2+540}" y2="1920" stroke="#c2c8d4" stroke-width="3"/>`;
  s+=`<ellipse cx="540" cy="1200" rx="400" ry="40" fill="#fff" opacity=".35"/>`;
  return s}
function depBoard(x,y,sc,t){let s=`<g transform="translate(${x},${y}) scale(${sc})"><rect x="-260" y="-150" width="520" height="300" rx="16" fill="#111"/><text x="-230" y="-100" font-family="IB" font-size="34" fill="#ffd45a">DÉPARTS</text>`;
  const rows=[['LONDRES','12'],['PÉKIN','07'],['BERLIN','03'],['ROME','15']];rows.forEach((r,k)=>{s+=`<text x="-230" y="${-40+k*50}" font-family="IB" font-size="30" fill="#fff">${r[0]}</text><text x="200" y="${-40+k*50}" font-family="IB" font-size="30" fill="#5fd35f" text-anchor="end">${r[1]}</text>`;});return s+'</g>'}
function bubble2(txt,x,y,lt,w=560,size=46){const p=back(lt/0.25);if(p<=0.02)return '';return `<g transform="translate(${x},${y}) scale(${p})" filter="url(#ds)"><rect x="${-w/2}" y="-70" width="${w}" height="120" rx="36" fill="#fff" stroke="#120a1c" stroke-width="6"/><path d="M-30,48 L0,96 L20,48Z" fill="#fff" stroke="#120a1c" stroke-width="6"/><rect x="-34" y="40" width="58" height="14" fill="#fff"/><text y="0" font-family="IB" font-size="${size}" fill="#120a1c" text-anchor="middle" dominant-baseline="middle">${txt}</text></g>`}
function stamp(txt,x,y,lt,col='#d0202a'){const p=clamp(lt/0.18);if(lt<0)return '';const sc=lerp(2.2,1,easeOut(p));return `<g transform="translate(${x},${y}) rotate(-12) scale(${sc})" opacity="${p}"><rect x="-230" y="-70" width="460" height="130" rx="12" fill="none" stroke="${col}" stroke-width="12"/><text y="28" font-family="IB" font-size="84" text-anchor="middle" fill="${col}">${txt}</text></g>`}
function cvCard(x,y,sc,lines){let s=`<g transform="translate(${x},${y}) scale(${sc}) rotate(-3)" filter="url(#ds)"><rect x="-300" y="-380" width="600" height="760" rx="14" fill="#fff"/><text x="0" y="-300" font-family="IB" font-size="64" text-anchor="middle" fill="#1c2448">CV</text><text x="0" y="-240" font-family="IXB" font-size="40" text-anchor="middle" fill="#555">Biscotte</text><line x1="-250" y1="-210" x2="250" y2="-210" stroke="#ccc" stroke-width="4"/>`;
  lines.forEach((l,k)=>{s+=`<text x="-250" y="${-140+k*70}" font-family="IXB" font-size="40" fill="${l[1]||'#333'}">${l[0]}</text>`;});return s+'</g>'}
function matouX(x,y,s,o){let g=matou(x,y,s,{...o,mood:o.mood==='angry'?'smug':o.mood==='emu'?'smug':o.mood});const hy=y+(-150-470)*s;
  if(o.mood==='angry'){g+=`<ellipse cx="${x}" cy="${hy}" rx="${190*s}" ry="${160*s}" fill="#ff3b3b" opacity=".35"/>`;for(let k=0;k<3;k++){const p=((o.t*1.5+k*0.33)%1);g+=`<ellipse cx="${x+(k-1)*120*s}" cy="${hy-200*s-p*120}" rx="${30+p*30}" ry="${20+p*20}" fill="#fff" opacity="${(1-p)*0.8}"/>`;}}
  if(o.mood==='emu') for(const sd of [-1,1]) for(let k=0;k<2;k++){const p=((o.t*1.2+k*0.5)%1);g+=`<path d="M${x+sd*72*s},${hy+10*s+p*160*s} q-10,18 0,26 q10,-8 0,-26Z" fill="#7fd0ff" opacity="${1-p}"/>`;}
  return g}
function render(t){
  let i=0;for(let k=0;k<S.length-1;k++) if(t>=S[k]-0.12) i=k; const lt=t-S[i];
  const blink=(t%3.1)>2.98; let s=DEFS.replace('</defs>',HX+CX+DX+'</defs>'); let shake=0; SNOW=0;
  if(i===0){ // flash-forward hook: bills explode out of suitcase, Biscotte barking
    s+=terminal(t);
    const p=clamp((t-0.2)/0.4);
    s+=suitcase(720,1640,1.3,p);
    for(let k=0;k<26;k++){const a=-Math.PI*(0.15+0.7*rnd(k)),sp=500+rnd(k+3)*900,tt=Math.max(0,t-0.3);s+=bill(720+Math.cos(a)*sp*tt,1400+Math.sin(a)*sp*tt+500*tt*tt,tt*500*rnd(k));}
    s+=biscotte(320,1800,1.05,{t,mood:'bark',outfit:'security',cap:'SÉCURITÉ'});
    shake=t>0.25&&t<0.9?0.3:0;
    for(let k=0;k<2;k++){const on=Math.sin(t*14+k*3)>0;s+=`<circle cx="${k?980:100}" cy="200" r="70" fill="${k?'#3a6aff':'#ff3b3b'}" opacity="${on?0.8:0.15}"/>`;}
    s+=bigText([["IL A MENTI",104,'#ffffff'],["SUR SON CV…",104,'#ffd45a']],250,back((t-0.15)/0.3));
    if(t>2.4) s+=bigText([["ET SAUVÉ",86,'#ffffff'],["UN AÉROPORT",96,'#5fd35f']],560,back((t-2.4)/0.3));
  } else if(i===1){
    s+=sky('skyDay',t)+streetBG('day',0,0,t,lt*30);
    s+=biscotte(540,1820,1.05,{t,mood:'nervous',walk:t*9,armR:-10});
    s+=`<rect x="${540+0.13*1.05*100}" y="${1820-200*1.05}" width="0" height="0"/>`;
    for(let k=0;k<3;k++){const ts=0.7+k*0.85;if(lt>ts) s+=stamp('REFUSÉ',[300,780,540][k],[420,620,820][k],lt-ts);}
    s+=bigText([["6 MOIS",110,'#ffffff'],["SANS TRAVAIL",80,'#ff5a5a']],250,back((lt-0.1)/0.3)*(lt<0.7?1:1));
  } else if(i<=5){
    s+=office(t);
    const mm=i===2?'smug':'smug';
    s+=matou(540,1500,0.85,{t,mood:mm,point:i===5&&lt>0.4});
    s+=bossDesk();
    const nose=i===3?clamp((lt-0.8)/4.6):i>=4?1:0;
    s+=biscotte(290,1890,0.88,{t,mood:i===3?'happy':i===4?'nervous':'happy',outfit:'suit',nose,blink});
    if(i===2) s+=bigText([["ENTRETIEN",100,'#ffffff']],250,back((lt-0.1)/0.3));
    if(i===3){const langs=[['ANGLAIS',1.1],['ESPAGNOL',1.9],['CHINOIS',2.5],['ALLEMAND',3.1],['ITALIEN',4.3]];langs.forEach(([w,ts],k)=>{if(lt>ts) s+=`<g transform="translate(${780},${560+k*90}) scale(${back((lt-ts)/0.25)})"><rect x="-200" y="-40" width="400" height="74" rx="20" fill="#1c2448"/><text y="14" font-family="IB" font-size="44" fill="#5fd35f" text-anchor="middle">${w} ✓</text></g>`;});}
    if(i===4){s+=cvCard(780,800,0.75,[["Langues :",'#333'],["🐶 Chien",'#d0202a'],["",''],["(c'est tout)",'#888']]);}
    if(i===5) s+=stamp('ENGAGÉ !',620,820,lt-0.25,'#2a9a3a');
  } else if(i===6){
    s+=terminal(t)+depBoard(540,1150,1,t);
    s+=biscotte(540,1880,0.95,{t,mood:'proud',outfit:'security',cap:'SÉCURITÉ',blink});
    s+=button('+ Abonne-toi',600,lt);const cp=easeOut((lt-0.35)/0.4);s+=cursor(lerp(900,640,cp),lerp(900,630,cp),lt>0.8&&lt<1.0);
  } else if(i<=9){
    s+=terminal(t)+depBoard(800,1080,0.7,t);
    s+=biscotte(330,1880,1.1,{t,mood:i===9?'panic':i===8?'nervous':'proud',outfit:'security',cap:'SÉCURITÉ',blink:i===7&&blink,tilt:i===8?Math.sin(t*3)*6:0});
    if(i>=8){s+=goose(790,1880,0.95,t);s+=bubble2('Where is gate twelve?',620,640,t-S[8],680,48);}
    if(i===9){s+=bubble2('Ouaf… ?',330,820,lt,300,60);for(let k=0;k<3;k++) s+=`<text x="${200+k*110}" y="${900-((t*1.5+k*0.3)%1)*80}" font-family="IB" font-size="70" fill="#ffd45a" paint-order="stroke" stroke="#120a1c" stroke-width="8">?</text>`;}
    if(i===7) s+=bigText([["PREMIER JOUR",100,'#ffffff']],250,back((lt-0.1)/0.3));
  } else if(i===10){
    s+=terminal(t);
    s+=panda(250,1880,0.75)+teckel(760,1880,0.85)+goose(560,1700,0.55,t);
    s+=bubble2('？？？',250,980,lt-0.3,260,60)+bubble2('Entschuldigung?',760,1100,lt-1.8,560,46);
    s+=biscotte(540,1950,0.75,{t,mood:'panic',outfit:'security',cap:'SÉCURITÉ',sweat:true,tilt:Math.sin(t*12)*5});
    shake=0.08;
    if(lt>3.2) s+=bigText([["CATASTROPHE",110,'#ff4d4d']],280,back((lt-3.2)/0.3));
  } else if(i===11){
    s+=office(t);
    s+=matouX(540,1500,0.85,{t,mood:'angry',point:true});
    s+=bossDesk();
    s+=biscotte(290,1890,0.88,{t,mood:'nervous',outfit:'security',cap:'SÉCURITÉ'});
    shake=lt<1?0.15:0;
    s+=bigText([["DANS MON BUREAU !",80,'#ff4d4d']],250,back((lt-0.2)/0.3));
  } else if(i<=13){
    s+=terminal(t);
    // conveyor belt
    s+=`<rect x="0" y="1560" width="1080" height="70" fill="#3a3f4a"/>`;for(let k=0;k<14;k++) s+=`<rect x="${((k*90-t*80)%1260+1260)%1260-90}" y="1566" width="80" height="12" fill="#555a66"/>`;
    s+=suitcase(780,1560,0.9,0,'#3a3f4a')+suitcase(1060,1560,0.7)+suitcase(-20,1560,0.75);
    const alert=i===13;
    s+=biscotte(360,1900,1.1,{t,mood:alert?'bark':'serious',outfit:'security',cap:'SÉCURITÉ',sniff:!alert,walk:alert?null:(lt<1.2?t*8:null)});
    if(i===12&&lt>1.6) for(let k=0;k<4;k++){const p=((t*0.9+k*0.25)%1);s+=`<path d="M${760-p*300},${1380-k*30-p*40} q20,-16 40,0 t40,0" stroke="#9be36a" stroke-width="7" fill="none" opacity="${(1-p)*0.9}"/>`;}
    if(alert){for(let k=0;k<2;k++){const on=Math.sin(t*14+k*3)>0;s+=`<circle cx="${k?980:100}" cy="1000" r="60" fill="#ff3b3b" opacity="${on?0.8:0.15}"/>`;}
      s+=bubble2('OUAF ! OUAF !',360,900,lt,460,58);shake=0.15;}
    if(i===12) s+=bigText([["SON NEZ A SENTI…",80,'#ffffff']],250,back((lt-1.4)/0.3));
  } else if(i===14){
    s+=terminal(t);
    const p=clamp(lt/0.4);
    s+=suitcase(700,1700,1.2,p);
    for(let k=0;k<30;k++){const a=-Math.PI*(0.15+0.7*rnd(k)),sp=400+rnd(k+3)*800,tt=Math.max(0,lt-0.1);s+=bill(700+Math.cos(a)*sp*tt,1420+Math.sin(a)*sp*tt+500*tt*tt,tt*500*rnd(k));}
    const wx=lerp(1300,880,easeOut((lt-2.2)/0.6));
    if(lt>2.2) s+=weasel(wx,1900,1.05,true);
    s+=biscotte(300,1900,0.9,{t,mood:'serious',outfit:'security',cap:'SÉCURITÉ'});
    s+=bigText([["DES MILLIONS",100,'#5fd35f'],["EN FAUX BILLETS",76,'#ffffff']],250,back((lt-0.6)/0.3));
    if(lt>2.6) s+=stamp('ARRÊTÉ !',700,800,lt-2.6);
  } else if(i===15){
    s+=office(t);
    s+=matouX(540,1500,0.85,{t,mood:'emu'});
    s+=bossDesk();
    s+=biscotte(290,1890,0.88,{t,mood:'happy',outfit:'security',cap:'SÉCURITÉ',blink});
    if(lt>2.8) s+=bigText([["LE MEILLEUR",96,'#ffd45a'],["EMPLOYÉ DU MONDE",80,'#ffffff']],250,back((lt-2.8)/0.3));
  } else if(i===16){
    s+=terminal(t);
    s+=biscotte(540,1880,1.1,{t,mood:'proud',outfit:'chef',cap:'CHEF',salute:lt>1.2,blink});
    for(let k=0;k<20;k++){const p=((lt*0.5+rnd(k))%1);s+=`<rect x="${rnd(k+5)*1080}" y="${200+p*1500}" width="14" height="8" fill="${['#ffd45a','#ff4d7a','#4cc3ff','#7fd34e'][k%4]}" transform="rotate(${p*720} ${rnd(k+5)*1080} ${200+p*1500})"/>`;}
    s+=bigText([["CHEF DE",90,'#ffffff'],["LA SÉCURITÉ",110,'#ffd45a']],250,back((lt-0.1)/0.3));
    if(lt>3.5) s+=bigText([["LANGUE : CHIEN",70,'#5fd35f']],560,back((lt-3.5)/0.3));
  } else {
    s+=terminal(t);
    s+=biscotte(540,1880,1.0,{t,mood:'happy',outfit:'chef',cap:'CHEF',armR:-140+Math.sin(t*8)*20,blink});
    s+=bigText([["ET TOI, T'AS DÉJÀ",76,'#ffffff'],["MENTI SUR TON CV ?",80,'#ffd45a']],250,back(lt/0.3));
    s+=button('Avoue !',700,lt-1.2);
  }
  const dt=t-S[i]; if(i>0&&dt<0.08&&[1,2,6,7,10,11,12,14,15,16,17].includes(i)) s+=`<rect width="1080" height="1920" fill="#fff" opacity="${(1-dt/0.08)*0.5}"/>`;
  s+=`<rect width="1080" height="1920" fill="url(#vig)"/>`;
  if(t>T-0.35) s+=`<rect width="1080" height="1920" fill="#000" opacity="${(t-(T-0.35))/0.35}"/>`;
  const sx=Math.sin(t*61)*24*shake, sy=Math.cos(t*53)*18*shake, kick=1+0.04*Math.exp(-Math.max(0,dt)*6);
  SV.innerHTML=`<g transform="translate(${540+sx},${960+sy}) scale(${kick}) translate(-540,-960)">${s}</g>`;
}
render(0);

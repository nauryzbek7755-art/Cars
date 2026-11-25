const CX=`<radialGradient id="catG" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#c9ced8"/><stop offset=".6" stop-color="#9aa1b0"/><stop offset="1" stop-color="#6f7686"/></radialGradient>
<linearGradient id="suit" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3a3f52"/><stop offset="1" stop-color="#1a1d2a"/></linearGradient>
<linearGradient id="officeW" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3e6d2"/><stop offset="1" stop-color="#d9c4a6"/></linearGradient>
<linearGradient id="woodD" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a4f2a"/><stop offset="1" stop-color="#5a3018"/></linearGradient>
<linearGradient id="carpet" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a1f2a"/><stop offset="1" stop-color="#5a1018"/></linearGradient>`;
// ---- Gérard (hamster) — front view, rigged ----
function gerard(x,y,s,o={}){
  const t=o.t||0, run=o.run, br=Math.sin(t*2.4)*3, mood=o.mood||'neutral', blink=o.blink;
  const bob=run!=null?Math.abs(Math.sin(run))*14:0;
  let g=`<g transform="translate(${x},${y-bob*s}) scale(${s})">`;
  g+=`<ellipse cx="0" cy="${6+bob}" rx="150" ry="22" fill="#000" opacity=".3"/>`;
  // feet (running alternates)
  const fL=run!=null?Math.max(0,Math.sin(run))*40:0, fR=run!=null?Math.max(0,-Math.sin(run))*40:0;
  g+=`<ellipse cx="-60" cy="${-8-fL}" rx="42" ry="20" fill="#f4b8a8"/><ellipse cx="60" cy="${-8-fR}" rx="42" ry="20" fill="#f4b8a8"/>`;
  g+=`<ellipse cx="0" cy="${-150-br}" rx="150" ry="${150+br}" fill="url(#furG)"/><ellipse cx="0" cy="-120" rx="100" ry="105" fill="url(#bellyG)"/>`;
  // overalls
  g+=`<path d="M-118,-150 L118,-150 L128,-40 Q0,10 -128,-40Z" fill="url(#overall)"/><rect x="-58" y="-150" width="116" height="70" rx="10" fill="url(#overall)"/>`;
  g+=`<line x1="-50" y1="-150" x2="-80" y2="-240" stroke="#2a4aa8" stroke-width="16" stroke-linecap="round"/><line x1="50" y1="-150" x2="80" y2="-240" stroke="#2a4aa8" stroke-width="16" stroke-linecap="round"/>`;
  g+=`<circle cx="-48" cy="-146" r="8" fill="#ffd45a"/><circle cx="48" cy="-146" r="8" fill="#ffd45a"/><rect x="-26" y="-130" width="52" height="34" rx="6" fill="#3a62c0" stroke="#22408a" stroke-width="3"/>`;
  if(o.tie) g+=`<path d="M0,-238 l-14,20 l14,70 l14,-70Z" fill="#d0202a"/>`;
  // arms
  if(o.cross) g+=`<path d="M-120,-170 Q-20,-120 90,-175" stroke="#e89a4a" stroke-width="48" fill="none" stroke-linecap="round"/><path d="M120,-165 Q20,-125 -90,-178" stroke="#f0a85a" stroke-width="48" fill="none" stroke-linecap="round"/><ellipse cx="96" cy="-176" rx="22" ry="18" fill="#f4b8a8"/><ellipse cx="-96" cy="-178" rx="22" ry="18" fill="#f4b8a8"/>`;
  else if(run!=null){const a=Math.sin(run)*30;g+=`<path d="M-128,-190 Q-175,${-150+a} -150,${-110+a}" stroke="#e89a4a" stroke-width="42" fill="none" stroke-linecap="round"/><path d="M128,-190 Q175,${-150-a} 150,${-110-a}" stroke="#e89a4a" stroke-width="42" fill="none" stroke-linecap="round"/>`;}
  else if(o.hold) g+=`<path d="M-128,-185 Q-160,-120 -60,-110" stroke="#e89a4a" stroke-width="44" fill="none" stroke-linecap="round"/><path d="M128,-185 Q160,-120 60,-110" stroke="#e89a4a" stroke-width="44" fill="none" stroke-linecap="round"/><ellipse cx="-50" cy="-110" rx="22" ry="18" fill="#f4b8a8"/><ellipse cx="50" cy="-110" rx="22" ry="18" fill="#f4b8a8"/>`;
  else if(o.raise) g+=`<path d="M-128,-185 Q-160,-120 -140,-80" stroke="#e89a4a" stroke-width="44" fill="none" stroke-linecap="round"/><ellipse cx="-140" cy="-78" rx="22" ry="18" fill="#f4b8a8"/><path d="M128,-200 Q200,-280 180,-360" stroke="#e89a4a" stroke-width="44" fill="none" stroke-linecap="round"/><ellipse cx="180" cy="-366" rx="24" ry="20" fill="#f4b8a8"/>`;
  else g+=`<path d="M-128,-185 Q-160,-120 -140,-80" stroke="#e89a4a" stroke-width="44" fill="none" stroke-linecap="round"/><ellipse cx="-140" cy="-78" rx="22" ry="18" fill="#f4b8a8"/><path d="M128,-185 Q160,-120 140,-80" stroke="#e89a4a" stroke-width="44" fill="none" stroke-linecap="round"/><ellipse cx="140" cy="-78" rx="22" ry="18" fill="#f4b8a8"/>`;
  // head
  const hy=-300-br; const sad=mood==='sad'||mood==='timid'||mood==='tired';
  g+=`<ellipse cx="0" cy="${hy}" rx="128" ry="112" fill="url(#furG)"/><ellipse cx="-92" cy="${hy+40}" rx="62" ry="52" fill="#ffcf96"/><ellipse cx="92" cy="${hy+40}" rx="62" ry="52" fill="#ffcf96"/><ellipse cx="0" cy="${hy+50}" rx="70" ry="52" fill="url(#bellyG)"/>`;
  for(const sd of [-1,1]){const ey=sad?hy-60:hy-88, ex=sd*(sad?104:88);g+=`<ellipse cx="${ex}" cy="${ey}" rx="40" ry="36" fill="#e89a4a" transform="rotate(${sad?sd*35:0} ${ex} ${ey})"/><ellipse cx="${ex}" cy="${ey+2}" rx="25" ry="22" fill="#f7a8b8" transform="rotate(${sad?sd*35:0} ${ex} ${ey})"/>`;}
  if(o.hat==='helmet') g+=`<path d="M-90,${hy-70} Q0,${hy-160} 90,${hy-70}Z" fill="#ffd21f"/><rect x="-104" y="${hy-74}" width="208" height="18" rx="9" fill="#f0b800"/><rect x="-10" y="${hy-150}" width="20" height="80" rx="8" fill="#ffe46b"/>`;
  if(o.hat==='beret') g+=`<ellipse cx="-10" cy="${hy-92}" rx="112" ry="40" fill="#1a1a22" transform="rotate(-10 -10 ${hy-92})"/><circle cx="-20" cy="${hy-134}" r="8" fill="#1a1a22"/>`;
  for(const sd of [-1,1]){
    if(blink||mood==='happy2') g+=`<path d="M${sd*48-20},${hy+2} q20,-16 40,0" stroke="#1a1010" stroke-width="8" fill="none" stroke-linecap="round"/>`;
    else if(mood==='tired') g+=`<ellipse cx="${sd*48}" cy="${hy+4}" rx="20" ry="14" fill="#1a1010"/><path d="M${sd*48-24},${hy-6} L${sd*48+24},${hy-6}" stroke="#d98a3a" stroke-width="14"/><path d="M${sd*48-18},${hy+26} q18,8 36,0" stroke="#8a5a9a" stroke-width="5" fill="none" opacity=".6"/>`;
    else g+=`<ellipse cx="${sd*48}" cy="${hy}" rx="${mood==='timid'?24:20}" ry="${mood==='timid'?28:24}" fill="#1a1010"/><circle cx="${sd*48-6}" cy="${hy-8}" r="${mood==='timid'?9:7}" fill="#fff"/><circle cx="${sd*48+6}" cy="${hy+8}" r="3" fill="#fff"/>`;
    if(mood==='angry'||mood==='determined') g+=`<path d="M${sd*76},${hy-48} L${sd*20},${hy-30}" stroke="#6a3510" stroke-width="11" stroke-linecap="round"/>`;
    else if(sad) g+=`<path d="M${sd*76},${hy-34} L${sd*22},${hy-50}" stroke="#6a3510" stroke-width="9" stroke-linecap="round"/>`;
    else g+=`<path d="M${sd*72},${hy-46} Q${sd*48},${hy-58} ${sd*24},${hy-46}" stroke="#6a3510" stroke-width="8" fill="none" stroke-linecap="round"/>`;}
  g+=`<ellipse cx="0" cy="${hy+30}" rx="14" ry="10" fill="#e8607a"/>`;
  if(mood==='happy'||mood==='happy2') g+=`<path d="M-30,${hy+46} Q0,${hy+80} 30,${hy+46}Z" fill="#7a2030"/><rect x="-10" y="${hy+46}" width="20" height="14" rx="3" fill="#fff"/>`;
  else if(mood==='angry'||mood==='determined') g+=`<path d="M-22,${hy+58} Q0,${hy+46} 22,${hy+58}" stroke="#5a2a1a" stroke-width="6" fill="none" stroke-linecap="round"/><rect x="-10" y="${hy+40}" width="20" height="14" rx="3" fill="#fff"/>`;
  else if(sad) g+=`<path d="M-16,${hy+58} Q0,${hy+50} 16,${hy+58}" stroke="#5a2a1a" stroke-width="5" fill="none" stroke-linecap="round"/><rect x="-9" y="${hy+40}" width="18" height="13" rx="3" fill="#fff"/>`;
  else g+=`<path d="M-18,${hy+48} Q0,${hy+60} 18,${hy+48}" stroke="#5a2a1a" stroke-width="6" fill="none" stroke-linecap="round"/><rect x="-10" y="${hy+40}" width="20" height="15" rx="3" fill="#fff"/>`;
  for(const sd of [-1,1]) for(let k=-1;k<=1;k++) g+=`<line x1="${sd*30}" y1="${hy+34+k*6}" x2="${sd*120}" y2="${hy+24+k*16}" stroke="#7a4518" stroke-width="2.5" opacity=".7"/>`;
  if(o.sweat) for(let k=0;k<3;k++){const p=((t*1.3+k*0.33)%1);g+=`<path d="M${90+k*18},${hy-60+p*120} q-12,22 0,30 q12,-8 0,-30Z" fill="#7fd0ff" opacity="${1-p}"/>`;}
  if(o.blush) g+=`<ellipse cx="-80" cy="${hy+30}" rx="26" ry="14" fill="#ff7a8a" opacity=".5"/><ellipse cx="80" cy="${hy+30}" rx="26" ry="14" fill="#ff7a8a" opacity=".5"/>`;
  return g+`</g>`}
// ---- Monsieur Matou (fat cat boss) ----
function matou(x,y,s,o={}){
  const t=o.t||0, mood=o.mood||'smug', br=Math.sin(t*2)*3, kneel=o.kneel;
  let g=`<g transform="translate(${x},${y}) scale(${s})">`;
  g+=`<ellipse cx="0" cy="6" rx="210" ry="26" fill="#000" opacity=".3"/>`;
  if(!kneel) g+=`<rect x="-120" y="-150" width="90" height="150" rx="30" fill="#22263a"/><rect x="30" y="-150" width="90" height="150" rx="30" fill="#22263a"/><ellipse cx="-75" cy="-4" rx="60" ry="22" fill="#111"/><ellipse cx="75" cy="-4" rx="60" ry="22" fill="#111"/>`;
  else g+=`<ellipse cx="-90" cy="-30" rx="80" ry="40" fill="#22263a"/><ellipse cx="90" cy="-30" rx="80" ry="40" fill="#22263a"/>`;
  const by=kneel?-60:-150;
  g+=`<ellipse cx="0" cy="${by-160-br}" rx="200" ry="${190+br}" fill="url(#suit)"/>`;
  g+=`<path d="M-70,${by-330} L0,${by-180} L70,${by-330}Z" fill="#fff"/><path d="M0,${by-310} l-22,30 l22,150 l22,-150Z" fill="#d0202a"/><path d="M-70,${by-330} L-10,${by-190} L-120,${by-260}Z" fill="#2c3044"/><path d="M70,${by-330} L10,${by-190} L120,${by-260}Z" fill="#2c3044"/>`;
  g+=`<circle cx="0" cy="${by-120}" r="9" fill="#d9b030"/><circle cx="0" cy="${by-70}" r="9" fill="#d9b030"/><rect x="100" y="${by-260}" width="40" height="26" fill="#fff"/>`;
  // arms
  if(o.point) g+=`<path d="M170,${by-260} Q300,${by-300} 380,${by-250}" stroke="#2c3044" stroke-width="60" fill="none" stroke-linecap="round"/><circle cx="390" cy="${by-250}" r="34" fill="url(#catG)"/><path d="M-170,${by-260} Q-230,${by-150} -200,${by-60}" stroke="#2c3044" stroke-width="60" fill="none" stroke-linecap="round"/><circle cx="-196" cy="${by-52}" r="34" fill="url(#catG)"/>`;
  else if(o.beg) g+=`<path d="M-170,${by-260} Q-120,${by-150} -40,${by-200}" stroke="#2c3044" stroke-width="60" fill="none" stroke-linecap="round"/><path d="M170,${by-260} Q120,${by-150} 40,${by-200}" stroke="#2c3044" stroke-width="60" fill="none" stroke-linecap="round"/><circle cx="-30" cy="${by-205}" r="34" fill="url(#catG)"/><circle cx="30" cy="${by-205}" r="34" fill="url(#catG)"/>`;
  else if(o.run!=null){const a=Math.sin(o.run)*40;g+=`<path d="M-170,${by-260} Q-260,${by-200+a} -230,${by-130+a}" stroke="#2c3044" stroke-width="58" fill="none" stroke-linecap="round"/><path d="M170,${by-260} Q260,${by-200-a} 230,${by-130-a}" stroke="#2c3044" stroke-width="58" fill="none" stroke-linecap="round"/>`;}
  else g+=`<path d="M-170,${by-260} Q-230,${by-150} -200,${by-60}" stroke="#2c3044" stroke-width="60" fill="none" stroke-linecap="round"/><circle cx="-196" cy="${by-52}" r="34" fill="url(#catG)"/><path d="M170,${by-260} Q230,${by-150} 200,${by-60}" stroke="#2c3044" stroke-width="60" fill="none" stroke-linecap="round"/><circle cx="196" cy="${by-52}" r="34" fill="url(#catG)"/><rect x="170" y="${by-110}" width="50" height="22" rx="8" fill="#f0c040"/>`;
  // head
  const hy=by-470-br;
  for(const sd of [-1,1]) g+=`<path d="M${sd*150},${hy-40} L${sd*170},${hy-190} L${sd*60},${hy-120}Z" fill="url(#catG)"/><path d="M${sd*140},${hy-60} L${sd*155},${hy-160} L${sd*80},${hy-115}Z" fill="#f2a8b8"/>`;
  g+=`<ellipse cx="0" cy="${hy}" rx="190" ry="160" fill="url(#catG)"/><ellipse cx="-120" cy="${hy+70}" rx="80" ry="55" fill="#b9bfcc"/><ellipse cx="120" cy="${hy+70}" rx="80" ry="55" fill="#b9bfcc"/><ellipse cx="0" cy="${hy+70}" rx="90" ry="60" fill="#eef0f4"/>`;
  for(let k=0;k<3;k++) g+=`<path d="M${-30+k*30},${hy-155} L${-22+k*30},${hy-95}" stroke="#6f7686" stroke-width="12" stroke-linecap="round"/>`;
  for(const sd of [-1,1]){const ex=sd*72, ey=hy-10;
    if(mood==='smug') g+=`<ellipse cx="${ex}" cy="${ey}" rx="34" ry="26" fill="#c8e05a"/><ellipse cx="${ex}" cy="${ey}" rx="8" ry="22" fill="#111"/><path d="M${ex-38},${ey-8} L${ex+38},${ey-8} L${ex+38},${ey-30} L${ex-38},${ey-30}Z" fill="#9aa1b0"/><path d="M${ex-38},${ey-8} L${ex+38},${ey-8}" stroke="#555" stroke-width="5"/>`;
    else if(mood==='laugh') g+=`<path d="M${ex-30},${ey} q30,-26 60,0" stroke="#222" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M${ex+sd*30},${ey+10} q${sd*14},20 0,34" fill="#9fd8ff"/>`;
    else g+=`<ellipse cx="${ex}" cy="${ey}" rx="40" ry="44" fill="#fff"/><ellipse cx="${ex}" cy="${ey}" rx="20" ry="26" fill="#c8e05a"/><circle cx="${ex}" cy="${ey}" r="11" fill="#111"/>`;
    if(mood==='panic') g+=`<path d="M${ex-40},${ey-70} L${ex+40},${ey-60+sd*14}" stroke="#555" stroke-width="10" stroke-linecap="round"/>`;}
  g+=`<path d="M-18,${hy+40} L18,${hy+40} L0,${hy+60}Z" fill="#e8607a"/>`;
  if(mood==='laugh') g+=`<path d="M-80,${hy+70} Q0,${hy+190} 80,${hy+70}Z" fill="#7a2030"/><path d="M-50,${hy+78} L-36,${hy+100} L-22,${hy+78}Z M22,${hy+78} L36,${hy+100} L50,${hy+78}Z" fill="#fff"/>`;
  else if(mood==='panic') g+=`<ellipse cx="0" cy="${hy+100}" rx="40" ry="34" fill="#5a1525"/>`;
  else g+=`<path d="M-40,${hy+78} Q-20,${hy+96} 0,${hy+70} Q20,${hy+96} 40,${hy+78}" stroke="#333" stroke-width="7" fill="none" stroke-linecap="round"/>`;
  for(const sd of [-1,1]) for(let k=-1;k<=1;k++) g+=`<line x1="${sd*60}" y1="${hy+60+k*10}" x2="${sd*230}" y2="${hy+40+k*26}" stroke="#eee" stroke-width="4"/>`;
  if(mood==='panic'||o.sweat) for(let k=0;k<4;k++){const p=((t*1.4+k*0.25)%1);g+=`<path d="M${140+k*20},${hy-80+p*160} q-14,26 0,36 q14,-10 0,-36Z" fill="#7fd0ff" opacity="${1-p}"/>`;}
  return g+`</g>`}
function office(t,night=false){let s=`<rect width="1080" height="1920" fill="url(#officeW)"/>`;
  s+=`<rect x="140" y="220" width="800" height="760" rx="10" fill="#6a4a30"/><rect x="160" y="240" width="760" height="720" fill="${night?'#0b1030':'#8fd0ff'}"/>`;
  s+=towerImg(700,960,560,0)+`<g transform="translate(540,960) scale(.32)">${city(-1300,1300,night?'night':'day',0,0,123)}</g>`;
  s+=`<line x1="540" y1="240" x2="540" y2="960" stroke="#6a4a30" stroke-width="16"/><line x1="160" y1="600" x2="920" y2="600" stroke="#6a4a30" stroke-width="12"/>`;
  s+=`<rect x="0" y="1380" width="1080" height="540" fill="url(#carpet)"/>`;
  s+=`<rect x="60" y="1060" width="60" height="320" fill="#3a5a2a"/><ellipse cx="90" cy="1040" rx="90" ry="70" fill="#3fae4a"/><ellipse cx="60" cy="990" rx="60" ry="50" fill="#5fd35f"/>`;
  s+=`<rect x="900" y="1100" width="80" height="120" rx="10" fill="#e0b040"/><path d="M900,1100 q40,-90 80,0" fill="#f0c860"/>`;
  return s}
function bossDesk(y=1380){return `<rect x="80" y="${y-60}" width="920" height="80" rx="14" fill="url(#woodD)"/><rect x="120" y="${y+20}" width="840" height="300" fill="#5a3018"/><rect x="380" y="${y+60}" width="320" height="70" rx="8" fill="#d9b030"/><text x="540" y="${y+108}" font-family="IB" font-size="40" text-anchor="middle" fill="#3a2a10">P.-D.G.</text>`}
function gerDesk(y=1380){return `<rect x="80" y="${y-60}" width="920" height="80" rx="14" fill="url(#woodD)"/><rect x="120" y="${y+20}" width="840" height="300" fill="#5a3018"/><rect x="330" y="${y+60}" width="420" height="70" rx="8" fill="#d9b030"/><text x="540" y="${y+108}" font-family="IB" font-size="36" text-anchor="middle" fill="#3a2a10">DIRECTEUR GÉRARD</text>`}
function moneyBag(x,y,s){return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-60,0 Q-80,-90 -20,-110 L20,-110 Q80,-90 60,0Z" fill="#c8a060" stroke="#8a6a30" stroke-width="5"/><path d="M-24,-110 Q0,-140 24,-110" fill="#c8a060" stroke="#8a6a30" stroke-width="5"/><text y="-30" font-family="IB" font-size="64" text-anchor="middle" fill="#5a3a10">€</text></g>`}
function calendar(x,y,n,flip){return `<g transform="translate(${x},${y})" filter="url(#ds)"><rect x="-160" y="-200" width="320" height="380" rx="16" fill="#fff"/><rect x="-160" y="-200" width="320" height="90" rx="16" fill="#e0263a"/><text y="-140" font-family="IB" font-size="46" text-anchor="middle" fill="#fff">${2016+n}</text>
<g transform="translate(0,-110) scale(1,${1-flip})"><rect x="-160" y="0" width="320" height="290" fill="#fff"/><text y="190" font-family="IB" font-size="150" text-anchor="middle" fill="#222">${(n*37)%28+1}</text></g></g>`}
function tvNews(t){let s=`<rect width="1080" height="1920" fill="#16121e"/><rect x="60" y="560" width="960" height="640" rx="40" fill="#222" stroke="#444" stroke-width="16"/><rect x="100" y="600" width="880" height="560" fill="#0b1030"/>`;
  s+=`<g transform="translate(540,1160) scale(.42)">${city(-1100,1100,'night',1,0,55)}</g>`;
  s+=`<rect x="100" y="1060" width="880" height="100" fill="#d0202a"/><text x="540" y="1128" font-family="IB" font-size="54" text-anchor="middle" fill="#fff">PARIS DANS LE NOIR</text><rect x="100" y="600" width="230" height="60" fill="#d0202a"/><text x="215" y="642" font-family="IB" font-size="36" text-anchor="middle" fill="#fff">FLASH INFO</text>`;
  s+=`<circle cx="930" cy="630" r="12" fill="#ff3b3b" opacity="${(Math.sin(t*8)>0)?1:0.2}"/>`;return s}

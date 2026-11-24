// ===== Ce qui arrive si tu retiens un éternuement =====
var SNOW=0;
const BG1=`<linearGradient id="bgA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe6d6"/><stop offset="1" stop-color="#ffc2b0"/></linearGradient>
<linearGradient id="bgX" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#06122e"/><stop offset="1" stop-color="#0b2350"/></linearGradient>
<radialGradient id="redG"><stop offset="0" stop-color="#ff3b3b" stop-opacity=".85"/><stop offset="1" stop-color="#ff3b3b" stop-opacity="0"/></radialGradient>
<radialGradient id="cyanG"><stop offset="0" stop-color="#4cf0ff" stop-opacity=".5"/><stop offset="1" stop-color="#4cf0ff" stop-opacity="0"/></radialGradient>
<linearGradient id="wallH" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8f4f2"/><stop offset="1" stop-color="#cfe6e2"/></linearGradient>`;
function roomBG(){let s=`<rect width="1080" height="1920" fill="url(#bgA)"/>`;
  s+=`<rect x="80" y="260" width="380" height="520" rx="14" fill="#bfe6ff" stroke="#fff" stroke-width="18"/><line x1="270" y1="260" x2="270" y2="780" stroke="#fff" stroke-width="12"/><line x1="80" y1="520" x2="460" y2="520" stroke="#fff" stroke-width="12"/>`;
  s+=`<rect x="600" y="300" width="300" height="200" rx="10" fill="#fff6e6" stroke="#c9946a" stroke-width="12"/><circle cx="700" cy="400" r="40" fill="#ffb36b"/><path d="M620,480 l90,-80 l60,50 l40,-30 l70,60Z" fill="#7fc36b"/>`;
  s+=`<rect x="0" y="1500" width="1080" height="420" fill="#c98f62"/>`;for(let k=0;k<9;k++) s+=`<line x1="0" y1="${1520+k*48}" x2="1080" y2="${1520+k*48}" stroke="#b07a50" stroke-width="3"/>`;
  return s}
// close-up head: hero scaled so the head fills the frame
function closeHero(t,o,K=1150){return hero(540,860+1.64*K,K,{t,flag:false,noArms:o.noArms!==false,...o})}
function handsOnFace(t,K=1150,lift=1){const p=easeOut(lift), Y0=860+1.64*K; let s='';
  for(const sd of [-1,1]){
    const Sx=540+sd*0.27*K, Sy=Y0-1.38*K;                          // shoulder
    const hx0=Sx+sd*0.03*K, hy0=Sy+0.52*K;                           // hand hanging
    const hx1=540+sd*0.065*K, hy1=860+0.09*K;                         // hand on face
    const Hx=lerp(hx0,hx1,p), Hy=lerp(hy0,hy1,p);
    const A=0.29*K,B=0.29*K, dx=Hx-Sx, dy=Hy-Sy, d=Math.min(Math.hypot(dx,dy),A+B-1);
    const mx=Sx+dx*0.5, my=Sy+dy*0.5, h=Math.sqrt(Math.max(0,A*A-(d/2)*(d/2)));
    let nx=-dy/Math.hypot(dx,dy), ny=dx/Math.hypot(dx,dy); if(ny<0){nx=-nx;ny=-ny;}   // elbow points down
    const Ex=mx+nx*h, Ey=my+ny*h;
    const path=`M${Sx},${Sy} L${Ex},${Ey} L${Hx},${Hy}`;
    s+=`<path d="${path}" stroke="#171c50" stroke-width="${0.155*K}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    s+=`<path d="${path}" stroke="#343c92" stroke-width="${0.135*K}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    s+=`<path d="${path}" stroke="#5a64c8" stroke-width="${0.035*K}" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".45" transform="translate(${-0.03*K},${-0.02*K})"/>`;
    const cx=lerp(Ex,Hx,0.82), cy=lerp(Ey,Hy,0.82);
    s+=`<circle cx="${cx}" cy="${cy}" r="${0.07*K}" fill="#1c225c"/>`;
    s+=`<ellipse cx="${Hx}" cy="${Hy}" rx="${0.072*K}" ry="${0.058*K}" fill="url(#skin)" stroke="#c98a68" stroke-width="3"/>`;
    if(p>0.9) for(let f=0;f<3;f++) s+=`<line x1="${Hx-0.035*K+f*0.035*K}" y1="${Hy-0.05*K}" x2="${Hx-0.035*K+f*0.035*K}" y2="${Hy-0.015*K}" stroke="#c98a68" stroke-width="3" opacity=".7"/>`;}
  return s}
function droplets(x,y,p,dir=1){let s='';for(let k=0;k<60;k++){const a=(rnd(k)-.5)*1.1,sp=300+rnd(k+3)*900,px=x+dir*Math.cos(a)*sp*p,py=y+Math.sin(a)*sp*p+p*p*200;s+=`<circle cx="${px}" cy="${py}" r="${3+rnd(k+5)*9}" fill="#bfe9ff" stroke="#7cc4ef" stroke-width="2" opacity="${1-p*0.7}"/>`;}
  for(let k=0;k<8;k++){const yy=y-80+k*22;s+=`<line x1="${x+dir*60}" y1="${yy}" x2="${x+dir*(60+400*p)}" y2="${yy+(k-4)*20*p}" stroke="#fff" stroke-width="6" opacity="${.7*(1-p)}" stroke-linecap="round"/>`;}return s}
function xrayHead(t,press,blocked){let s=`<rect width="1080" height="1920" fill="url(#bgX)"/>`;
  for(let x=0;x<1080;x+=60) s+=`<line x1="${x}" y1="0" x2="${x}" y2="1920" stroke="#1b3a72" stroke-width="1.5"/>`;for(let y=0;y<1920;y+=60) s+=`<line x1="0" y1="${y}" x2="1080" y2="${y}" stroke="#1b3a72" stroke-width="1.5"/>`;
  // side-profile silhouette (facing right)
  const head="M380,1500 L380,1260 Q300,1180 300,1000 Q300,720 560,680 Q780,660 820,860 L860,930 Q880,960 840,975 L825,1000 Q850,1030 820,1050 L812,1090 Q800,1140 740,1145 L660,1150 L640,1260 L640,1500Z";
  s+=`<path d="${head}" fill="#13305f" stroke="#4cf0ff" stroke-width="6"/>`;
  s+=`<path d="M580,760 Q700,740 760,830" stroke="#4cf0ff" stroke-width="3" fill="none" opacity=".5"/><circle cx="700" cy="860" r="14" fill="#4cf0ff" opacity=".7"/>`;
  // airway: nostril -> nasal cavity -> throat -> trachea, mouth branch
  const air="M845,960 Q760,950 640,960 Q560,975 545,1040 L540,1300 L540,1500";
  s+=`<path d="${air}" stroke="#ff6b6b" stroke-width="${34+press*18}" fill="none" stroke-linecap="round" opacity=".85"/><path d="${air}" stroke="#ffd0d0" stroke-width="10" fill="none" stroke-linecap="round"/>`;
  s+=`<path d="M815,1060 Q700,1065 600,1070 L548,1080" stroke="#ff6b6b" stroke-width="${26+press*10}" fill="none" stroke-linecap="round" opacity=".7"/>`;
  // lungs hint
  s+=`<ellipse cx="460" cy="1700" rx="140" ry="190" fill="#ff6b6b" opacity=".35"/><ellipse cx="640" cy="1700" rx="140" ry="190" fill="#ff6b6b" opacity=".35"/>`;
  // pressure waves inside the throat
  for(let k=0;k<4;k++){const p=((t*1.4+k*0.25)%1);s+=`<circle cx="545" cy="1120" r="${40+p*220*press}" fill="none" stroke="#ff3b3b" stroke-width="${8*(1-p)}" opacity="${(1-p)*press}"/>`;}
  s+=`<circle cx="545" cy="1120" r="${120+press*120}" fill="url(#redG)" opacity="${press}"/>`;
  if(blocked){for(const [x,y] of [[860,955],[825,1062]]) s+=`<g transform="translate(${x},${y})"><circle r="40" fill="#120a1c" opacity=".7"/><path d="M-22,-22 L22,22 M22,-22 L-22,22" stroke="#ff4d4d" stroke-width="12" stroke-linecap="round"/></g>`;}
  return s}
function gauge(x,y,v,label){const a=lerp(-120,120,clamp(v));return `<g transform="translate(${x},${y})" filter="url(#ds)"><circle r="150" fill="#f4f6ff" stroke="#120a1c" stroke-width="8"/>
<path d="M-115,70 A135,135 0 0 1 -70,-115" stroke="#5fd35f" stroke-width="22" fill="none"/><path d="M-70,-115 A135,135 0 0 1 70,-115" stroke="#ffd45a" stroke-width="22" fill="none"/><path d="M70,-115 A135,135 0 0 1 115,70" stroke="#ff4d4d" stroke-width="22" fill="none"/>
<g transform="rotate(${a})"><path d="M-8,0 L0,-120 L8,0Z" fill="#120a1c"/></g><circle r="16" fill="#120a1c"/><text y="105" font-family="IB" font-size="46" text-anchor="middle" fill="#120a1c">${label}</text></g>`}
function newspaper(sc){return `<g transform="translate(540,760) rotate(-4) scale(${sc})" filter="url(#ds)"><rect x="-400" y="-300" width="800" height="600" fill="#fbf8f0"/>
<text x="0" y="-215" font-family="IB" font-size="58" text-anchor="middle" fill="#120a1c">MEDICAL NEWS · 2018</text><line x1="-360" y1="-185" x2="360" y2="-185" stroke="#120a1c" stroke-width="5"/>
<text x="0" y="-100" font-family="IB" font-size="54" text-anchor="middle" fill="#c21e28">Il retient un éternuement</text><text x="0" y="-35" font-family="IB" font-size="54" text-anchor="middle" fill="#c21e28">et se déchire la gorge</text>
${[0,1,2,3,4].map(k=>`<rect x="-360" y="${20+k*48}" width="${k%2?520:700}" height="20" rx="8" fill="#cfc8b8"/>`).join('')}<rect x="200" y="20" width="160" height="200" fill="#9fb0c8"/></g>`}
function hospital(t){let s=`<rect width="1080" height="1920" fill="url(#wallH)"/><rect x="0" y="1500" width="1080" height="420" fill="#b9d6d0"/>`;
  // monitor with ECG
  s+=`<rect x="700" y="420" width="300" height="220" rx="18" fill="#1b2230" stroke="#555" stroke-width="8"/>`;let d='M720,540';for(let x=0;x<260;x+=6){const ph=((x+t*240)%130);const y=ph>60&&ph<68?(ph<64?470:590):540;d+=` L${720+x},${y}`;}
  s+=`<path d="${d}" stroke="#5fff8a" stroke-width="5" fill="none"/><text x="850" y="620" font-family="IB" font-size="34" fill="#5fff8a" text-anchor="middle">♥ 82</text><rect x="842" y="640" width="16" height="240" fill="#888"/>`;
  // IV pole + bag + tube to nose
  s+=`<rect x="190" y="300" width="12" height="1220" fill="#9aa3b2"/><rect x="140" y="300" width="110" height="10" fill="#9aa3b2"/><rect x="150" y="320" width="90" height="150" rx="20" fill="#e8f6ff" stroke="#9fc7e6" stroke-width="5"/><rect x="160" y="400" width="70" height="60" rx="12" fill="#bfe3ff"/>`;
  s+=`<path d="M196,470 Q240,900 440,1010 Q520,1070 566,1088" stroke="#d9eef8" stroke-width="10" fill="none"/>`;
  // bed
  s+=`<rect x="80" y="1240" width="920" height="70" rx="20" fill="#eef2f6" stroke="#b8c2cc" stroke-width="5"/><rect x="90" y="1300" width="20" height="260" fill="#9aa3b2"/><rect x="970" y="1300" width="20" height="260" fill="#9aa3b2"/><rect x="60" y="900" width="60" height="420" rx="20" fill="#d5dde6"/>`;
  return s}
function render(t){
  let i=0;for(let k=0;k<S.length-1;k++) if(t>=S[k]-0.12) i=k; const lt=t-S[i];
  const blink=(t%3.1)>2.98; let s=DEFS.replace('</defs>',BG1+'</defs>'); let shake=0; SNOW=0;
  if(i===0){
    s+=roomBG();
    const hold=t>0.55, pop=t>2.25, red=clamp((t-0.6)/1.4);
    s+=closeHero(t,{mood:hold?'sad':'wow',blink:hold,look:[0,0]});
    s+=`<ellipse cx="540" cy="${860+0.03*1150}" rx="${0.15*1150}" ry="${0.13*1150}" fill="#ff3b3b" opacity="${0.35*red}"/>`;
    s+=`<ellipse cx="${540-0.13*1150}" cy="${860+0.07*1150}" rx="${60+red*30}" ry="${40+red*20}" fill="#ff6b7a" opacity="${.5*red}"/><ellipse cx="${540+0.13*1150}" cy="${860+0.07*1150}" rx="${60+red*30}" ry="${40+red*20}" fill="#ff6b7a" opacity="${.5*red}"/>`;
    s+=handsOnFace(t,1150,clamp((t-0.35)/0.3));
    if(t<0.6) s+=bigText([["AAA…",120,'#ffffff']],330,back((t)/0.25));
    if(pop){const p=clamp((t-2.25)/0.4);shake=Math.exp(-(t-2.25)*5);
      s+=`<g transform="translate(540,1380) scale(${back(p/0.6)})"><path d="M0,-150 L40,-60 L140,-90 L80,0 L150,80 L40,60 L0,150 L-40,60 L-150,80 L-80,0 L-140,-90 L-40,-60Z" fill="#ffd45a" stroke="#120a1c" stroke-width="10"/><text y="30" font-family="IB" font-size="90" text-anchor="middle" fill="#c21e28">POP!</text></g>`;}
    s+=bigText([["IL A RETENU",90,'#ffffff'],["UN ÉTERNUEMENT…",84,'#ffd45a']],150,back((t-0.6)/0.35));
  } else if(i===1){
    s+=roomBG();
    const sn=t>3.95, p=clamp((t-3.95)/0.9);
    s+=hero(560,1850,600,{t,flag:false,mood:sn?'wow':'happy',blink:t>3.7&&t<4.0,lean:sn?-10*Math.exp(-(t-3.95)*4):3*clamp((t-3.6)/0.35),look:[0.8,0]});
    if(sn) s+=droplets(560+0.08*600,1850-1.53*600,p,1);
    if(sn) s+=bigText([["ATCHOUM !",130,'#ffffff']],330,back((t-3.95)/0.3));
    if(t>5.6) s+=bigText([["FORCE ÉNORME",90,'#ffd45a']],480,back((t-5.6)/0.3));
    shake=sn?Math.exp(-(t-3.95)*6)*0.6:0;
  } else if(i===2||i===3){
    const press=i===2?ease((t-8.2)/2.4):1;
    s+=xrayHead(t,press,t>7.6);
    s+=gauge(830,420,press*0.95,`×${Math.round(lerp(1,20,press))}`);
    if(i===2) s+=bigText([["PRESSION",90,'#ffffff'],[`× ${Math.round(lerp(1,20,press))}`,130,'#ff4d4d']],1700,back((t-9.1)/0.3));
    else{s+=button('+ Abonne-toi',1700,lt);const cp=easeOut((lt-0.35)/0.4);s+=cursor(lerp(900,640,cp),lerp(1500,1730,cp),lt>0.8&&lt<1.0);}
  } else if(i===4){
    if(t<15.9){s+=`<rect width="1080" height="1920" fill="#2b3150"/>`+newspaper(back((t-13.1)/0.4));
      s+=bigText([["CAS RÉEL",110,'#ffd45a']],1350,back((t-13.3)/0.35));}
    else{s+=roomBG();const pop=t>16.8;
      s+=closeHero(t,{mood:pop?'scared':'sad',blink:!pop,look:[0,0]},1000);
      s+=handsOnFace(t,1000,1);
      if(pop){const p=clamp((t-16.8)/0.35);shake=Math.exp(-(t-16.8)*5);
        s+=`<circle cx="540" cy="1090" r="${80+p*260}" fill="none" stroke="#ff3b3b" stroke-width="${18*(1-p)}" opacity="${1-p}"/>`;
        s+=`<g transform="translate(800,1150) scale(${back(p/0.7)})"><path d="M0,-130 L35,-50 L120,-80 L70,0 L130,70 L35,50 L0,130 L-35,50 L-130,70 L-70,0 L-120,-80 L-35,-50Z" fill="#ffd45a" stroke="#120a1c" stroke-width="9"/><text y="28" font-family="IB" font-size="80" text-anchor="middle" fill="#c21e28">POP!</text></g>`;}
    }
  } else if(i===5){
    s+=hospital(t);
    s+=`<rect x="300" y="1060" width="520" height="200" rx="60" fill="#ffffff" stroke="#d0d6de" stroke-width="5"/>`+hero(560,1420+0.8*430,430,{t,flag:false,sit:true,mood:'sad',look:[0,0.3],blink});
    s+=`<rect x="${560-0.12*430}" y="${1420+0.8*430-1.5*430}" width="${0.24*430}" height="${0.07*430}" rx="12" fill="#ffffff" stroke="#d0d6de" stroke-width="3"/>`;

    s+=`<rect x="80" y="1380" width="920" height="160" rx="30" fill="#6aa7e8"/><rect x="80" y="1380" width="920" height="40" rx="20" fill="#f4f8ff"/>`;
    if(t>19.9) s+=bigText([["7 JOURS",120,'#ffffff'],["À L'HÔPITAL",84,'#ff4d4d']],190,back((t-19.9)/0.35));
    else s+=bigText([["GORGE DÉCHIRÉE",90,'#ff4d4d']],190,back((t-18.2)/0.35));
  } else {
    s+=roomBG();
    const sn=t>23.9&&t<24.6;
    s+=hero(540,1850,520,{t,flag:false,mood:sn?'wow':'happy',armR:sn?150:-20,blink:sn,look:[0,0]});
    if(sn) s+=`<g opacity="${1-clamp((t-24.2)/0.4)}">${[0,1,2,3,4,5].map(k=>`<circle cx="${380+rnd(k)*60}" cy="${1850-1.55*520+(rnd(k+4)-.5)*80}" r="10" fill="#bfe9ff"/>`).join('')}</g>`;
    s+=bigText([["LAISSE SORTIR !",104,'#5fd35f'],["(dans ton coude)",60,'#ffffff']],170,back((t-23.9)/0.35));
    if(t>25.1){s+=bigText([["ET TOI, TU RETIENS",64,'#ffffff'],["TES ÉTERNUEMENTS ?",64,'#ffd45a']],430,back((t-25.1)/0.35));s+=button('Commente !',1660,t-25.8);}
    s+=`<text x="540" y="1895" font-family="IXB" font-size="30" fill="#5a3a2a" text-anchor="middle" opacity=".8">Ceci n'est pas un avis médical</text>`;
  }
  const dt=t-S[i]; if(i>0&&dt<0.1) s+=`<rect width="1080" height="1920" fill="#fff" opacity="${(1-dt/0.1)*0.5}"/>`;
  s+=`<rect width="1080" height="1920" fill="url(#vig)"/>`;
  if(t>T-0.35) s+=`<rect width="1080" height="1920" fill="#000" opacity="${(t-(T-0.35))/0.35}"/>`;
  const sx=Math.sin(t*61)*24*shake, sy=Math.cos(t*53)*18*shake, kick=1+0.05*Math.exp(-Math.max(0,dt)*6);
  SV.innerHTML=`<g transform="translate(${540+sx},${960+sy}) scale(${kick}) translate(-540,-960)">${s}</g>`;
}
render(0);

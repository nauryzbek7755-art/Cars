// ===== Le géant qui veut boire la mer =====
var SNOW=0;
const MX=`<linearGradient id="seaG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3aa6e8"/><stop offset="1" stop-color="#0d5ea8"/></linearGradient>
<linearGradient id="seaF" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4cc3ff" stop-opacity=".85"/><stop offset="1" stop-color="#1a7ac8" stop-opacity=".95"/></linearGradient>
<linearGradient id="sand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6e0a8"/><stop offset="1" stop-color="#e0c080"/></linearGradient>
<linearGradient id="info" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c1440"/><stop offset="1" stop-color="#1c0f3a"/></linearGradient>
<linearGradient id="land" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9ccf6a"/><stop offset="1" stop-color="#d8c27a"/></linearGradient>`;
const MK=480, MGX=560, MGY=1520;
function sailboat(x,y,s,col,t,k){const b=Math.sin(t*3+k)*4;return `<g transform="translate(${x},${y+b}) scale(${s}) rotate(${Math.sin(t*2+k)*4})"><path d="M-60,0 L60,0 L45,22 L-45,22Z" fill="#fff" stroke="#999" stroke-width="3"/><line x1="0" y1="0" x2="0" y2="-110" stroke="#6a4a2a" stroke-width="5"/><path d="M4,-106 L54,-14 L4,-14Z" fill="${col}"/><path d="M-4,-90 L-40,-14 L-4,-14Z" fill="#fff"/></g>`}
function seaBack(t,level=0){let s=sky('skyDay',t);
  s+=`<path d="M0,860 Q200,780 380,830 Q560,760 760,820 Q920,790 1080,840 L1080,900 L0,900Z" fill="#a8c28a"/><path d="M0,880 Q240,840 520,870 Q800,840 1080,880 L1080,900 L0,900Z" fill="#8aa86a"/>`;
  for(let k=0;k<7;k++) s+=`<rect x="${60+k*150}" y="${850-rnd(k)*30}" width="${30+rnd(k+3)*30}" height="${30+rnd(k+5)*20}" fill="#f4efe6"/>`;
  s+=`<rect x="0" y="${900+level}" width="1080" height="${800-level}" fill="url(#seaG)"/>`;
  if(level>0) s+=`<rect x="0" y="900" width="1080" height="${level}" fill="#c8b48a"/>`;
  for(let k=0;k<14;k++){const y=940+k*55+level,x=((k*173+t*30*(k%2?1:-1))%1300+1300)%1300-120;s+=`<path d="M${x},${y} q30,-10 60,0 t60,0" stroke="#bfe6ff" stroke-width="4" fill="none" opacity=".6"/>`;}
  return s}
function beach(t){let s=`<rect x="0" y="1700" width="1080" height="220" fill="url(#sand)"/><path d="M0,1700 Q270,1680 540,1702 Q810,1682 1080,1700 L1080,1712 Q810,1694 540,1714 Q270,1692 0,1712Z" fill="#fff" opacity=".7"/>`;
  for(let k=0;k<5;k++){const x=120+k*210;s+=`<line x1="${x}" y1="1880" x2="${x}" y2="1760" stroke="#ddd" stroke-width="6"/><path d="M${x-70},1770 Q${x},1700 ${x+70},1770Z" fill="${['#e53935','#1e88e5','#fdd835','#43a047','#fb8c00'][k]}"/><rect x="${x+30}" y="1850" width="70" height="20" rx="6" fill="${['#fff','#ffd0dc','#bfe6ff','#fff','#ffe0b0'][k]}"/>`;}
  s+=peds(t,540,1860,7,false,1.6);return s}
function straw(x1,y1,x2,y2){const L=Math.hypot(x2-x1,y2-y1),a=Math.atan2(y2-y1,x2-x1)*180/Math.PI;let s=`<g transform="translate(${x1},${y1}) rotate(${a})"><rect x="0" y="-14" width="${L}" height="28" rx="14" fill="#fff" stroke="#bbb" stroke-width="2"/>`;
  for(let k=0;k<L/60;k++) s+=`<path d="M${k*60},-14 l30,0 l-12,28 l-30,0Z" fill="#e53935"/>`;return s+`</g>`}
function whirl(x,y,t,str=1){let s='';for(let k=0;k<5;k++){const r=(30+k*40)*str;s+=`<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r*0.3}" fill="none" stroke="#e8f8ff" stroke-width="5" stroke-dasharray="${r*0.8} ${r*0.5}" transform="rotate(${t*200*(k%2?1:-1)} ${x} ${y})" opacity=".8"/>`;}return s+`<ellipse cx="${x}" cy="${y}" rx="${26*str}" ry="${9*str}" fill="#0a3a6a"/>`}
function giantInSea(t,o={}){let s=hero(MGX,MGY,MK,{t,armR:-40,look:[0.4,0.3],...o});
  // straw from mouth to sea
  const mx=MGX+0.02*MK,my=MGY-1.53*MK, sx=MGX+0.62*MK, sy=1380;
  s+=straw(mx,my,sx,sy);
  s+=`<rect x="0" y="1360" width="1080" height="340" fill="url(#seaF)"/>`;
  for(let k=0;k<6;k++){const x=((k*190+t*40)%1200)-60;s+=`<path d="M${x},${1370+k*50} q30,-10 60,0 t60,0" stroke="#e8f8ff" stroke-width="4" fill="none" opacity=".7"/>`;}
  s+=whirl(sx,sy+6,t,o.whirl??1);
  return s}
function beard(x,y,K,len){const hc=y-1.64*K;if(len<=0.01) return '';
  return `<path d="M${x-0.12*K},${hc+0.06*K} Q${x-0.14*K},${hc+0.2*K+len*0.3*K} ${x},${hc+0.2*K+len*K} Q${x+0.14*K},${hc+0.2*K+len*0.3*K} ${x+0.12*K},${hc+0.06*K} Q${x},${hc+0.16*K} ${x-0.12*K},${hc+0.06*K}Z" fill="#f2f2f2" stroke="#ccc" stroke-width="3"/>`}
function medMap(t,dry=0){let s=`<rect width="1080" height="1920" fill="url(#info)"/><rect x="40" y="480" width="1000" height="900" rx="40" fill="#2a8ad8"/>`;
  // Europe (top) + Africa (bottom) stylized
  s+=`<path d="M40,480 L1040,480 L1040,760 Q960,820 900,760 Q860,820 820,880 Q780,820 720,860 Q700,760 640,800 Q600,900 560,840 Q520,780 470,820 Q420,760 380,840 Q330,760 260,800 Q200,760 140,820 Q90,760 40,780Z" fill="url(#land)"/>`;
  s+=`<path d="M40,1380 L1040,1380 L1040,1120 Q960,1080 880,1110 Q800,1060 720,1100 Q640,1140 560,1110 Q480,1080 400,1120 Q320,1150 240,1110 Q160,1070 100,1100 Q60,1080 40,1100Z" fill="#d8c27a"/>`;
  s+=`<text x="300" y="640" font-family="IXB" font-size="40" fill="#3a5a2a" opacity=".7">EUROPE</text><text x="560" y="1300" font-family="IXB" font-size="40" fill="#7a5a2a" opacity=".7">AFRIQUE</text>`;
  s+=`<text x="540" y="990" font-family="IB" font-size="54" fill="#bfe6ff" text-anchor="middle" opacity=".9">MÉDITERRANÉE</text>`;
  // tiny giant at Marseille
  s+=hero(470,840,60,{t,mood:'wow',blink:false});
  return s}
function render(t){
  let i=0;for(let k=0;k<S.length-1;k++) if(t>=S[k]-0.12) i=k; const lt=t-S[i];
  const blink=(t%3.1)>2.98; let s=DEFS.replace('</defs>',MX+'</defs>'); let shake=0;
  if(i===0){
    s+=seaBack(t,0);
    for(let k=0;k<4;k++){const p=clamp((t-1.5)/2);const bx=lerp([160,380,840,980][k],MGX+0.62*MK,p*0.25);s+=sailboat(bx,1100+k*60,0.8,['#e53935','#1e88e5','#fdd835','#43a047'][k],t,k);}
    s+=giantInSea(t,{mood:t<1.5?'happy':'wow',whirl:clamp((t-1.4)/0.6)*1.2});
    s+=beach(t);
    shake=t>1.5&&t<2.6?0.12:0;
    s+=bigText([["TU AS TELLEMENT",80,'#ffffff'],["SOIF…",120,'#4cc3ff']],200,back((t-0.05)/0.3));
    if(t>2.35) s+=bigText([["TU BOIS LA MER !",100,'#ffd45a']],470,back((t-2.35)/0.3));
  } else if(i===1&&t<5.85){
    s+=`<rect width="1080" height="1920" fill="url(#info)"/>`;
    const K=560, X=540, Y=1800;
    s+=`<g opacity=".35">${hero(X,Y,K,{t,flag:false,mood:'happy',blink})}</g>`;
    const fill=clamp((t-4.5)/1.2);
    const sx=X-0.05*K, sy=Y-1.12*K;
    s+=`<path d="M${sx-120},${sy-120} Q${sx-160},${sy+40} ${sx-40},${sy+120} Q${sx+120},${sy+170} ${sx+150},${sy+40} Q${sx+160},${sy-60} ${sx+40},${sy-90} Q${sx-40},${sy-110} ${sx-60},${sy-170}Z" fill="#ff9aa8" stroke="#fff" stroke-width="6"/>`;
    s+=`<clipPath id="stc"><path d="M${sx-120},${sy-120} Q${sx-160},${sy+40} ${sx-40},${sy+120} Q${sx+120},${sy+170} ${sx+150},${sy+40} Q${sx+160},${sy-60} ${sx+40},${sy-90} Q${sx-40},${sy-110} ${sx-60},${sy-170}Z"/></clipPath>`;
    s+=`<g clip-path="url(#stc)"><rect x="${sx-200}" y="${sy+170-fill*340}" width="400" height="400" fill="#4cc3ff"/>${wavePath(sx-200,sx+200,sy+170-fill*340,t)}</g>`;
    s+=bigText([["TON ESTOMAC",90,'#ffffff'],["1 000 m³",130,'#4cc3ff']],230,back((t-3.3)/0.3));
  } else if(i===1){
    s+=seaBack(t,0);
    const p=clamp((t-5.85)/2.8);
    for(let k=0;k<6;k++){const bx0=[120,300,480,760,900,1000][k],by0=1000+k*55;const tx=MGX+0.62*MK,ty=1380;const q=ease(p*(0.6+rnd(k)*0.5));
      s+=sailboat(lerp(bx0,tx,q*0.85),lerp(by0,ty-20,q*0.85),0.8*(1-q*0.4),['#e53935','#1e88e5','#fdd835','#43a047','#8e24aa','#fb8c00'][k],t,k);}
    s+=giantInSea(t,{mood:'happy',whirl:1.4});
    s+=beach(t);
    s+=bigText([["LES BATEAUX",96,'#ffffff'],["GLISSENT !",110,'#ff5a5a']],220,back((t-6.9)/0.3));
  } else if(i===2||i===3){
    s+=medMap(t);
    const n=Math.round(lerp(0,3750000,easeOut((t-9.6)/1.6)));
    if(i===2&&t<9.6) s+=bigText([["PROBLÈME…",110,'#ff5a5a']],250,back((lt-0.05)/0.3));
    else s+=bigText([[n.toLocaleString('fr-FR').replace(/ /g,' '),110,'#4cc3ff'],["KM³ D'EAU",90,'#ffffff']],200,back((t-9.6)/0.3));
    if(i===3){s+=button('+ Abonne-toi',1560,lt);const cp=easeOut((lt-0.35)/0.4);s+=cursor(lerp(900,640,cp),lerp(1750,1590,cp),lt>0.8&&lt<1.0);}
  } else if(i===4){
    const age=ease((t-16.4)/2.6);
    s+=seaBack(t,0)+giantInSea(t,{mood:age>0.5?'sad':'neutral',blink:blink});
    s+=beard(MGX,MGY,MK,age*0.9);
    // white hair streaks
    if(age>0.2) s+=`<path d="M${MGX-0.15*MK},${MGY-1.78*MK} Q${MGX},${MGY-1.86*MK} ${MGX+0.15*MK},${MGY-1.78*MK}" stroke="#eee" stroke-width="${12*age}" fill="none" opacity="${age}"/>`;
    s+=beach(t);
    const yrs=Math.round(lerp(0,7000000,age));
    s+=`<g transform="translate(540,560)" filter="url(#ds)"><rect x="-300" y="-70" width="600" height="130" rx="30" fill="#120a1c" opacity=".85"/><text y="22" font-family="IB" font-size="76" text-anchor="middle" fill="#ffd45a">${yrs.toLocaleString('fr-FR').replace(/ /g,' ')} ans</text></g>`;
    s+=bigText([["7 MILLIONS",110,'#ffffff'],["D'ANNÉES",96,'#ffd45a']],230,back((t-17.9)/0.3));
    if(t<17.9) s+=bigText([["1 GORGÉE / MINUTE",80,'#ffffff']],230,back((lt-0.1)/0.3));
  } else if(i===5){
    s+=`<rect width="1080" height="1920" fill="url(#info)"/>`;
    const K=1050, X=540, Y=2600;
    s+=hero(X,Y,K,{t,flag:false,mood:'scared',look:[0,0],blink:false,noArms:true});
    const hc=Y-1.64*K;
    s+=`<ellipse cx="${X}" cy="${hc+0.14*K}" rx="${0.05*K}" ry="${0.04*K}" fill="#5a1525"/><path d="M${X-0.04*K},${hc+0.15*K} Q${X},${hc+0.27*K} ${X+0.04*K},${hc+0.15*K}Z" fill="#ff7a8a"/>`;
    for(let k=0;k<16;k++){const p=((t*0.9+rnd(k))%1),x=X+(rnd(k+4)-.5)*700,y=hc+0.2*K-p*600;s+=`<rect x="${x}" y="${y}" width="${14+rnd(k)*10}" height="${14+rnd(k)*10}" fill="#fff" opacity="${1-p}" transform="rotate(${p*300} ${x} ${y})"/>`;}
    const thirst=clamp((t-21.3)/1.4);
    s+=`<g transform="translate(540,1330)"><rect x="-380" y="-50" width="760" height="100" rx="50" fill="#1c1c2a" stroke="#fff" stroke-width="6"/><rect x="-370" y="-40" width="${740*(0.3+0.7*thirst)}" height="80" rx="40" fill="${thirst>0.7?'#ff3b3b':'#ffaa4c'}"/><text y="18" font-family="IB" font-size="50" text-anchor="middle" fill="#fff">SOIF</text></g>`;
    s+=bigText([["L'EAU DE MER",90,'#ffffff'],["EST SALÉE !",110,'#ff5a5a']],230,back((t-20.5)/0.3));
    if(t<20.5) s+=bigText([["PIRE…",110,'#ffffff']],230,back((lt-0.05)/0.3));
    shake=thirst>0.5?0.08:0;
  } else {
    s+=seaBack(t,0)+giantInSea(t,{mood:'happy',whirl:0.3,blink});
    s+=beach(t);
    s+=bigText([["TOI, TU BOIRAIS",86,'#ffffff'],["QUOI À SA PLACE ?",86,'#ffd45a']],200,back(lt/0.35));
    s+=button('Commente !',470,lt-1.3);
  }
  const dt=t-S[i]; const cutAt=(i===1&&Math.abs(t-5.85)<0.1);
  if((i>0&&dt<0.1&&i!==3)||cutAt) s+=`<rect width="1080" height="1920" fill="#fff" opacity="${cutAt?0.5*(1-Math.abs(t-5.85)/0.1):(1-dt/0.1)*0.55}"/>`;
  s+=`<rect width="1080" height="1920" fill="url(#vig)"/>`;
  if(t>T-0.35) s+=`<rect width="1080" height="1920" fill="#000" opacity="${(t-(T-0.35))/0.35}"/>`;
  const sx=Math.sin(t*61)*24*shake, sy=Math.cos(t*53)*18*shake, kick=1+0.05*Math.exp(-Math.max(0,dt)*6);
  SV.innerHTML=`<g transform="translate(${540+sx},${960+sy}) scale(${kick}) translate(-540,-960)">${s}</g>`;
}
function wavePath(x0,x1,y,t){let d=`M${x0},${y}`;for(let x=x0;x<=x1;x+=10) d+=` L${x},${y+Math.sin(x/30+t*6)*8}`;return `<path d="${d}" stroke="#bfe6ff" stroke-width="6" fill="none"/>`}
render(0);

// ===== Et si le Soleil s'éteignait ? =====
var SNOW=0;
function space(t,sunK){let s=`<rect width="1080" height="1920" fill="#03040c"/>`;
  for(let k=0;k<160;k++){const x=rnd(k)*1080,y=rnd(k+300)*1920,tw=.5+.5*Math.sin(t*3+k);s+=`<circle cx="${x}" cy="${y}" r="${.8+rnd(k+9)*2}" fill="#fff" opacity="${.3+.6*tw}"/>`;}
  // sun: sunK 1 = alive, 0 = dead ember
  const R=230*lerp(0.55,1,sunK);
  s+=`<circle cx="540" cy="760" r="${R*2.4}" fill="url(#sunG)" opacity="${sunK}"/>`;
  s+=`<circle cx="540" cy="760" r="${R}" fill="${mixc('#3a1408','#ffcf3a',sunK)}"/>`;
  if(sunK>0.05) for(let k=0;k<14;k++){const a=k/14*Math.PI*2+t*.3;s+=`<ellipse cx="${540+Math.cos(a)*R*.55}" cy="${760+Math.sin(a)*R*.55}" rx="${R*.18}" ry="${R*.1}" fill="#ff9a1a" opacity="${.5*sunK}" transform="rotate(${a*57} ${540+Math.cos(a)*R*.55} ${760+Math.sin(a)*R*.55})"/>`;}
  s+=`<circle cx="540" cy="760" r="${R}" fill="none" stroke="${mixc('#5a2010','#fff3a0',sunK)}" stroke-width="6" opacity=".7"/>`;
  // Earth
  s+=`<circle cx="880" cy="1600" r="70" fill="#2a6fd6"/><path d="M840,1570 q20,-20 40,-5 q10,20 -10,30 q-25,5 -30,-25Z M880,1620 q25,-5 35,10 q-10,25 -35,15Z" fill="#3fae5a"/><circle cx="880" cy="1600" r="70" fill="none" stroke="#9fd4ff" stroke-width="5" opacity=".7"/>`;
  return s}
function iceCream(x,y,rot,sc=1){return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${sc})" filter="url(#ds)"><path d="M-30,-10 L30,-10 L0,80Z" fill="#e0a05a" stroke="#b5743a" stroke-width="3"/>
<path d="M-20,5 L12,45 M-8,-8 L20,30 M5,-8 L-15,40" stroke="#b5743a" stroke-width="3"/><circle cx="-12" cy="-22" r="26" fill="#ff8fb8"/><circle cx="14" cy="-26" r="24" fill="#fff4e6"/><circle cx="0" cy="-50" r="22" fill="#9be3c2"/><circle cx="-6" cy="-58" r="6" fill="#fff" opacity=".7"/><circle cx="2" cy="-74" r="7" fill="#e0263a"/></g>`}
function timer(sec,y,sc=1){const m=Math.floor(sec/60),ss=Math.floor(sec%60);const txt=`${String(m).padStart(2,'0')}:${String(ss).padStart(2,'0')}`;
  return `<g transform="translate(540,${y}) scale(${sc})" filter="url(#ds)"><rect x="-260" y="-92" width="520" height="160" rx="36" fill="#120a1c" opacity=".85"/><text y="40" font-family="IB" font-size="130" fill="${sec<60?'#ff4d4d':'#ffd45a'}" text-anchor="middle">${txt}</text></g>`}
function thermo(x,y,frac,label){return `<g transform="translate(${x},${y})" filter="url(#ds)"><rect x="-26" y="-420" width="52" height="420" rx="26" fill="#f4f8ff" stroke="#334" stroke-width="5"/><circle cx="0" cy="20" r="52" fill="#f4f8ff" stroke="#334" stroke-width="5"/>
<rect x="-12" y="${-400*frac}" width="24" height="${400*frac+20}" rx="12" fill="#4cc3ff"/><circle cx="0" cy="20" r="38" fill="#4cc3ff"/>
${[0,1,2,3,4,5,6,7].map(k=>`<line x1="26" x2="${k%2?40:50}" y1="${-380+k*50}" y2="${-380+k*50}" stroke="#334" stroke-width="4"/>`).join('')}
<text x="0" y="-450" font-family="IB" font-size="64" fill="#9fd8ff" text-anchor="middle" paint-order="stroke" stroke="#120a1c" stroke-width="10">${label}</text></g>`}
function snow(t,n=140,speed=1,big=1){let s='';for(let k=0;k<n;k++){const sp=(60+rnd(k)*80)*speed,y=((rnd(k+3)*1920+t*sp)%2000)-40,x=(rnd(k+7)*1180-50)+Math.sin(t*1.3+k)*30,r=(2+rnd(k+11)*5)*big;s+=`<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity="${.6+.4*rnd(k)}"/>`;}return s}
function frost(op){return `<rect width="1080" height="1920" fill="url(#frostG)" opacity="${op}"/>`}
function breath(x,y,t){let s='';for(let k=0;k<3;k++){const p=((t*0.8+k*0.33)%1);s+=`<circle cx="${x+p*90}" cy="${y-p*60}" r="${14+p*40}" fill="#fff" opacity="${(1-p)*0.55}" filter="url(#b5)"/>`;}return s}
function snowOnHero(x,y,K,o){return `<g opacity="${o}"><ellipse cx="${x}" cy="${y-1.87*K}" rx="${0.15*K}" ry="${0.05*K}" fill="#fff"/><ellipse cx="${x-0.22*K}" cy="${y-1.46*K}" rx="${0.1*K}" ry="${0.03*K}" fill="#fff"/><ellipse cx="${x+0.22*K}" cy="${y-1.46*K}" rx="${0.1*K}" ry="${0.03*K}" fill="#fff"/></g>`}
function frozenSeine(t,tower=true){let s=`<rect width="1080" height="1920" fill="url(#skyNight)"/>`+stars(t).replace(/<circle cx="820"[\s\S]*$/,'');
  if(tower) s+=`<image href="tower.png" x="${540-670*1400/2600}" y="${1300-2786*1400/2600}" width="${1340*1400/2600}" height="${2796*1400/2600}" filter="url(#tIce)"/>`;
  s+=`<g transform="translate(540,1300) scale(.42)">${city(-1500,1500,'night',1,0,91)}</g>`;
  s+=`<rect x="0" y="1300" width="1080" height="40" fill="#e9f3ff"/><rect x="0" y="1340" width="1080" height="20" fill="#b8cde6"/>`;
  s+=`<rect x="0" y="1360" width="1080" height="560" fill="url(#iceG)"/>`;
  for(let k=0;k<10;k++){const x=rnd(k+40)*1080,y=1400+rnd(k+41)*480;let d=`M${x},${y}`;for(let j=1;j<5;j++) d+=` L${x+(rnd(k*7+j)-.5)*200},${y+(rnd(k*3+j)-.5)*60}`;s+=`<path d="${d}" stroke="#ffffff" stroke-width="3" fill="none" opacity=".75"/>`;}
  for(let k=0;k<6;k++) s+=`<path d="M${k*200-50},${1420+k*70} l260,-30" stroke="#fff" stroke-width="10" opacity=".35" stroke-linecap="round"/>`;
  for(let k=0;k<5;k++){const x=120+k*220,y=1500+rnd(k)*300;s+=`<path d="M${x},${y} l40,-30 l50,10 l20,30 l-60,20Z" fill="#dff0ff" stroke="#b8d8f0" stroke-width="3"/>`;}
  return s}
function render(t){
  let i=0;for(let k=0;k<S.length-1;k++) if(t>=S[k]-0.12) i=k; const lt=t-S[i];
  const blink=(t%3.1)>2.98; let s=DEFS.replace('</defs>',`<radialGradient id="frostG" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#cfeaff" stop-opacity="0"/><stop offset="1" stop-color="#e8f6ff" stop-opacity=".85"/></radialGradient><linearGradient id="iceG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d8efff"/><stop offset="1" stop-color="#8fc0e8"/></linearGradient></defs>`);
  let shake=0; SNOW=0;
  const HX=540,HY=1830,K=370;
  if(i===0&&t<1.55){
    const dieK=1-ease((t-0.55)/0.6);
    s+=space(t,dieK);
    if(t>0.5&&t<0.6) s+=`<rect width="1080" height="1920" fill="#fff6d0" opacity=".8"/>`;
    shake=t>0.55?Math.exp(-(t-0.55)*5)*0.6:0;
    // last light still travelling to Earth
    const p=clamp((t-0.6)/0.9);s+=`<line x1="${lerp(540,880,p*0.2)}" y1="${lerp(760,1600,p*0.2)}" x2="${lerp(540,880,Math.min(1,p*0.2+0.5))}" y2="${lerp(760,1600,Math.min(1,p*0.2+0.5))}" stroke="#ffe68a" stroke-width="12" stroke-linecap="round" opacity="${t>0.6?0.9:0}"/>`;
    s+=bigText([["LE SOLEIL",104,'#ffffff'],["S'ÉTEINT",120,'#ff8a3a']],250,back((t-0.2)/0.35));
  } else if(i<=1){
    s+=sky('skyDay',t)+streetBG('day',0,0,t,Math.sin(t*.4)*10);
    const aa=-38+Math.sin(t*3)*6, ar=aa*Math.PI/180, shx=HX+0.27*K, shy=HY-1.38*K, hx=shx-Math.sin(ar)*0.54*K, hy=shy+Math.cos(ar)*0.54*K;
    s+=hero(HX,HY,K,{t,mood:'happy',armR:aa,look:[0.6,-0.3],blink});
    s+=iceCream(hx+5,hy-30,-10+Math.sin(t*3)*6,1.15);
    if(i===0) s+=bigText([["TU NE LE SAIS",90,'#ffffff'],["PAS ENCORE…",100,'#ffd45a']],250,back((t-1.65)/0.35));
    else{const sec=lerp(500,0,clamp(lt/2.9));s+=timer(sec,330,back(lt/0.3))+bigText([["LA LUMIÈRE ARRIVE ENCORE",50,'#ffffff']],520,back((lt-0.3)/0.3));}
  } else if(i===2||i===3){
    const dark=t>7.2;
    if(!dark){s+=sky('skyDay',t)+streetBG('day',0,0,t,0)+timer(0,330,1);}
    else{SNOW=0;s+=`<rect width="1080" height="1920" fill="#02030a"/>`;
      const moon=1-ease((t-8.9)/0.6);
      s+=stars(t).replace(/<circle cx="820"[\s\S]*$/,'');
      s+=`<g opacity="${moon}"><circle cx="150" cy="470" r="170" fill="url(#moonG)"/><circle cx="150" cy="470" r="70" fill="#f4f1ff"/><circle cx="128" cy="452" r="14" fill="#dcd8ee"/><circle cx="175" cy="495" r="9" fill="#dcd8ee"/></g>`;
      s+=streetBG('night',0,0,t,0);}
    const drop=t>7.3?easeIn((t-7.3)/0.45):0;
    const aa=-38, ar=aa*Math.PI/180, shx=HX+0.27*K, shy=HY-1.38*K, hx=shx-Math.sin(ar)*0.54*K, hy=shy+Math.cos(ar)*0.54*K;
    s+=hero(HX,HY,K,{t,mood:dark?'scared':'happy',armR:aa,look:dark?[Math.sin(t*4),-0.6]:[0.6,-0.3],blink:!dark&&blink});
    if(drop<1) s+=iceCream(hx+5,lerp(hy-30,HY-20,drop),-10+drop*120,1.15); else s+=`<ellipse cx="${hx+20}" cy="${HY-8}" rx="60" ry="16" fill="#ff8fb8"/><ellipse cx="${hx+40}" cy="${HY-12}" rx="30" ry="10" fill="#9be3c2"/>`;
    if(t>7.2&&t<7.3) s+=`<rect width="1080" height="1920" fill="#000"/>`;
    if(i===2&&dark) s+=bigText([["NOIR TOTAL",116,'#ffffff']],300,back((t-7.3)/0.3))+(t>8.5?bigText([["MÊME LA LUNE…",80,'#9fd8ff']],460,back((t-8.5)/0.3)):'');
    if(i===3){s+=button('+ Abonne-toi',760,lt);const cp=easeOut((lt-0.35)/0.4);s+=cursor(lerp(900,640,cp),lerp(1100,790,cp),lt>0.8&&lt<1.0);}
  } else if(i===4){
    SNOW=ease(lt/1.5);
    s+=`<rect width="1080" height="1920" fill="#02030a"/>`+stars(t).replace(/<circle cx="820"[\s\S]*$/,'')+streetBG('night',0.15,0,t,0);
    s+=`<rect x="0" y="1540" width="1080" height="380" fill="#eef6ff" opacity="${0.9*SNOW}"/><path d="M0,1150 ${Array.from({length:19},(_,k)=>`L${k*60},${1146-rnd(k)*10*SNOW}`).join(' ')} L1080,1170 L0,1170Z" fill="#fff" opacity="${SNOW}"/>`;
    const shiv=Math.sin(t*40)*1.5;
    s+=hero(HX+shiv,HY,K,{t,mood:'scared',armL:-30,armR:32,look:[0.3,0],blink,lean:shiv});
    s+=snowOnHero(HX,HY,K,SNOW)+breath(HX+30,HY-1.52*K,t);
    s+=snow(t,160,1.2)+frost(0.6*SNOW);
    s+=thermo(900,1250,lerp(0.85,0.42,ease((t-12.7)/0.8)),Math.round(lerp(15,-17,ease((t-12.7)/0.8)))+'°C');
    s+=bigText([["1 SEMAINE",100,'#ffffff'],["-17 °C",130,'#4cc3ff']],250,back((lt-0.05)/0.35));
  } else {
    SNOW=1; const end=i===6;
    s+=frozenSeine(t);
    const shiv=Math.sin(t*40)*1.8;
    s+=hero(HX+shiv,1860,340,{t,mood:end?'sad':'scared',armL:-30,armR:32,look:end?[0,0]:[0,-0.8],blink,lean:shiv});
    s+=snowOnHero(HX,1860,340,1)+breath(HX+30,1860-1.52*340,t);
    s+=snow(t,200,0.9,1.2)+frost(0.85);
    if(!end){const v=Math.round(lerp(-17,-73,ease((t-15.5)/0.9)));s+=thermo(910,1250,lerp(0.42,0.08,ease((t-15.5)/0.9)),v+'°C');
      s+=bigText([["1 AN",100,'#ffffff'],[`${v} °C`,130,'#4cc3ff']],250,back(lt/0.35));
      if(t>16.9) s+=bigText([["LA SEINE GELÉE",84,'#e8f6ff']],540,back((t-16.9)/0.3));}
    else{s+=bigText([["TU SURVIVRAIS",92,'#ffffff'],["COMBIEN DE",92,'#9fd8ff'],["TEMPS ?",110,'#ffd45a']],230,back(lt/0.4));s+=button('Commente !',1200,lt-1.2);}
  }
  const dt=t-S[i]; if(i>0&&dt<0.1) s+=`<rect width="1080" height="1920" fill="#fff" opacity="${(1-dt/0.1)*0.5}"/>`;
  if(i===0&&Math.abs(t-1.55)<0.08) s+=`<rect width="1080" height="1920" fill="#fff" opacity="${(1-Math.abs(t-1.55)/0.08)*0.5}"/>`;
  s+=`<rect width="1080" height="1920" fill="url(#vig)"/>`;
  if(t>T-0.35) s+=`<rect width="1080" height="1920" fill="#000" opacity="${(t-(T-0.35))/0.35}"/>`;
  const sx=Math.sin(t*61)*24*shake, sy=Math.cos(t*53)*18*shake, kick=1+0.05*Math.exp(-Math.max(0,dt)*6);
  SV.innerHTML=`<g transform="translate(${540+sx},${960+sy}) scale(${kick}) translate(-540,-960)">${s}</g>`;
}
render(0);

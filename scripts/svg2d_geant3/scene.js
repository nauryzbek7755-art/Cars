// ===== Et si tu devenais géant ? (épisode « voix / chaleur / lit ») =====
var SNOW=0;
const G3=`<radialGradient id="heatG"><stop offset="0" stop-color="#ff3b2a" stop-opacity=".55"/><stop offset="1" stop-color="#ff3b2a" stop-opacity="0"/></radialGradient>
<radialGradient id="steamG"><stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>
<linearGradient id="info" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c1440"/><stop offset="1" stop-color="#1c0f3a"/></linearGradient>
<linearGradient id="nightLawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f6a3a"/><stop offset="1" stop-color="#173a22"/></linearGradient>
<radialGradient id="towerGlow"><stop offset="0" stop-color="#ffcf60" stop-opacity=".55"/><stop offset="1" stop-color="#ffcf60" stop-opacity="0"/></radialGradient>`;
// big screaming mouth over the hero's face
function scream(x,y,K,open=1,jump=0){const hc=y-jump-1.64*K, my=hc+0.115*K;
  return `<ellipse cx="${x}" cy="${my+0.01*K}" rx="${0.06*K*open}" ry="${0.075*K*open}" fill="#4a0f1c"/><ellipse cx="${x}" cy="${my+0.05*K}" rx="${0.035*K*open}" ry="${0.025*K*open}" fill="#ff7a8a"/><rect x="${x-0.04*K*open}" y="${my-0.06*K*open}" width="${0.08*K*open}" height="${0.018*K}" rx="${0.008*K}" fill="#fff"/>`}
function soundWaves(cx,cy,t,col='#ffffff',n=5,spd=0.45,maxR=1300){let s='';for(let k=0;k<n;k++){const p=((t*spd+k/n)%1);s+=`<ellipse cx="${cx}" cy="${cy}" rx="${80+p*maxR}" ry="${(80+p*maxR)*0.55}" fill="none" stroke="${col}" stroke-width="${18*(1-p)+3}" opacity="${(1-p)*0.75}"/>`;}return s}
function muteIcon(x,y,s){return `<g transform="translate(${x},${y}) scale(${s})" filter="url(#ds)"><circle r="90" fill="#120a1c"/><path d="M-50,-22 L-24,-22 L6,-50 L6,50 L-24,22 L-50,22Z" fill="#fff"/><path d="M24,-30 L64,30 M64,-30 L24,30" stroke="#ff4d4d" stroke-width="14" stroke-linecap="round"/></g>`}
function earIcon(x,y,s,crossed){return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-10,-80 Q70,-90 70,-10 Q70,40 30,60 Q10,70 10,100 Q0,120 -20,110" stroke="#ffd2b8" stroke-width="26" fill="none" stroke-linecap="round"/><path d="M10,-30 Q40,-30 36,0 Q30,20 10,24" stroke="#e8a888" stroke-width="16" fill="none" stroke-linecap="round"/>${crossed?`<path d="M-70,-90 L110,110 M110,-90 L-70,110" stroke="#ff3b3b" stroke-width="22" stroke-linecap="round"/>`:''}</g>`}
function wave(x0,x1,y,amp,freq,ph,col,w=10){let d=`M${x0},${y}`;for(let x=x0;x<=x1;x+=6) d+=` L${x},${y+Math.sin((x-x0)/((x1-x0))*Math.PI*2*freq+ph)*amp}`;return `<path d="${d}" stroke="${col}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`}
function thermo2(x,y,frac,label){return `<g transform="translate(${x},${y})" filter="url(#ds)"><rect x="-30" y="-460" width="60" height="460" rx="30" fill="#fff" stroke="#334" stroke-width="6"/><circle cx="0" cy="24" r="58" fill="#fff" stroke="#334" stroke-width="6"/>
<rect x="-14" y="${-440*frac}" width="28" height="${440*frac+20}" rx="14" fill="#ff3b2a"/><circle cx="0" cy="24" r="42" fill="#ff3b2a"/>${[0,1,2,3,4,5,6,7].map(k=>`<line x1="30" x2="${k%2?44:56}" y1="${-420+k*55}" y2="${-420+k*55}" stroke="#334" stroke-width="4"/>`).join('')}
<text x="0" y="-490" font-family="IB" font-size="68" fill="#ff5a3a" text-anchor="middle" paint-order="stroke" stroke="#120a1c" stroke-width="10">${label}</text></g>`}
function umbrella(x,y,s,col){return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-40,0 Q0,-46 40,0 Q30,-8 20,0 Q10,-8 0,0 Q-10,-8 -20,0 Q-30,-8 -40,0Z" fill="${col}"/><line x1="0" y1="0" x2="0" y2="30" stroke="#333" stroke-width="3"/><path d="M0,30 q0,8 -8,8" stroke="#333" stroke-width="3" fill="none"/></g>`}
function facadeClose(t,trem){ // close-up façade with trembling windows
  let s=`<rect width="1080" height="1920" fill="#f2dcb4"/>`;for(let y=0;y<1920;y+=48) s+=`<line x1="0" y1="${y}" x2="1080" y2="${y}" stroke="#d9bf92" stroke-width="2"/>`;
  const rows=[260,760,1260],cols=[110,600];let k=0;
  for(const wy of rows) for(const wx of cols){const j=trem*(Math.sin(t*70+k*1.7)*7), jy=trem*(Math.cos(t*63+k)*4);
    s+=`<rect x="${wx-20}" y="${wy-30}" width="410" height="20" fill="#fff0d0"/><rect x="${wx-14}" y="${wy-14}" width="398" height="440" fill="#3a2a20"/>`;
    s+=`<g transform="translate(${j},${jy})"><rect x="${wx}" y="${wy}" width="180" height="410" fill="url(#winD)"/><rect x="${wx+190}" y="${wy}" width="180" height="410" fill="url(#winD)"/>`;
    s+=`<path d="M${wx+20},${wy+30} L${wx+80},${wy+30} L${wx+20},${wy+150}Z" fill="#fff" opacity=".35"/><path d="M${wx+210},${wy+30} L${wx+270},${wy+30} L${wx+210},${wy+150}Z" fill="#fff" opacity=".35"/>`;
    if(trem>0.2) for(let r=0;r<3;r++){const p=((t*3+r*0.33+k*0.2)%1);s+=`<ellipse cx="${wx+90}" cy="${wy+200}" rx="${20+p*70}" ry="${10+p*40}" fill="none" stroke="#fff" stroke-width="3" opacity="${(1-p)*0.7}"/><ellipse cx="${wx+280}" cy="${wy+200}" rx="${20+p*70}" ry="${10+p*40}" fill="none" stroke="#fff" stroke-width="3" opacity="${(1-p)*0.7}"/>`;}
    s+=`</g><rect x="${wx+180}" y="${wy}" width="10" height="410" fill="#3a2a20"/>`;
    s+=`<rect x="${wx-30}" y="${wy+400}" width="430" height="16" fill="#1e1a22"/>`;for(let b=0;b<14;b++) s+=`<line x1="${wx-26+b*31}" y1="${wy+360}" x2="${wx-26+b*31}" y2="${wy+402}" stroke="#1e1a22" stroke-width="5"/>`;
    k++;}
  // confused resident in middle-left window
  const rx=200,ry=900;s+=`<circle cx="${rx}" cy="${ry}" r="58" fill="url(#skin)"/><path d="M${rx-60},${ry-14} Q${rx},${ry-90} ${rx+60},${ry-14}Z" fill="#5a3a20"/><circle cx="${rx-20}" cy="${ry+4}" r="7" fill="#222"/><circle cx="${rx+20}" cy="${ry+4}" r="7" fill="#222"/><path d="M${rx-14},${ry+30} q14,-8 28,0" stroke="#5a2a1a" stroke-width="5" fill="none"/>`;
  if(trem>0.2) s+=`<text x="${rx+70}" y="${ry-60-((t*1.5)%1)*30}" font-family="IB" font-size="80" fill="#ffd45a" paint-order="stroke" stroke="#120a1c" stroke-width="9">?</text>`;
  // cat in right window
  const cx=790,cy=1440;s+=`<g transform="translate(${cx},${cy})"><path d="M-40,-30 L-34,-80 L-10,-50Z M40,-30 L34,-80 L10,-50Z" fill="#555"/><ellipse cx="0" cy="0" rx="50" ry="44" fill="#666"/><ellipse cx="-16" cy="-4" rx="9" ry="${trem>0.2?13:6}" fill="#e0e040"/><ellipse cx="16" cy="-4" rx="9" ry="${trem>0.2?13:6}" fill="#e0e040"/><circle cx="-16" cy="-4" r="4" fill="#111"/><circle cx="16" cy="-4" r="4" fill="#111"/></g>`;
  return s}
function render(t){
  let i=0;for(let k=0;k<S.length-1;k++) if(t>=S[k]-0.12) i=k; const lt=t-S[i];
  const blink=(t%3.1)>2.98; let s=DEFS.replace('</defs>',G3+'</defs>'); let shake=0, cut=false;
  if(i===0&&t<1.9){
    // low-angle close-up: giant screaming over Paris
    const K=980, X=560, Y=2420;
    s+=sky('skyDay',t)+denseCity(t);
    s+=soundWaves(X,Y-1.52*K,t,'#ffffff',6,0.55,1500);
    s+=hero(X,Y,K,{t,mood:'scared',armL:150+Math.sin(t*20)*6,armR:-150-Math.sin(t*20)*6,look:[0,-0.4],blink:false});
    s+=scream(X,Y,K,1+0.08*Math.sin(t*30));
    s+=frontRow(1920,.72,77);
    shake=0.45;
    s+=bigText([["TU HURLES",120,'#ffffff'],["DE TOUTES TES FORCES",70,'#ffd45a']],230,back((t-0.05)/0.25));
  } else if(i===0){
    // street level: nobody reacts
    const lt0=t-1.9; cut=lt0<0.08;
    s+=sky('skyDay',t)+streetBG('day',0,0,t,lt0*20);
    s+=bigFoot(980,1600,520).replace('filter="url(#ds)"','filter="url(#ds)" opacity=".95"');
    s+=peds(lt0,470,1760,5,false,4.2);
    // pigeon pecking calmly
    s+=pigeon(250,1820,1.8,0,0);
    s+=muteIcon(540,820,back((lt0-0.1)/0.3));
    s+=bigText([["PERSONNE",110,'#ffffff'],["NE T'ENTEND",110,'#ff5a5a']],230,back((lt0-0.05)/0.3));
  } else if(i===1){
    s+=`<rect width="1080" height="1920" fill="url(#info)"/>`;
    for(let k=0;k<60;k++) s+=`<circle cx="${rnd(k)*1080}" cy="${rnd(k+7)*1920}" r="${1+rnd(k+3)*2}" fill="#fff" opacity=".25"/>`;
    // vocal cords ×100
    const p1=back((t-3.25)/0.35);
    s+=`<g transform="translate(540,290) scale(${p1})"><text y="0" font-family="IB" font-size="64" text-anchor="middle" fill="#fff" paint-order="stroke" stroke="#120a1c" stroke-width="10">CORDES VOCALES</text><text y="110" font-family="IB" font-size="120" text-anchor="middle" fill="#ffd45a" paint-order="stroke" stroke="#120a1c" stroke-width="12">× 100</text></g>`;
    // wave comparison
    const p2=clamp((t-4.6)/0.4);
    s+=`<g opacity="${p2}"><rect x="60" y="560" width="960" height="320" rx="36" fill="#14205a"/><text x="100" y="630" font-family="IB" font-size="46" fill="#9fd8ff">AVANT · 120 Hz</text>${wave(100,980,760,70,9,-t*14,'#4cc3ff',10)}</g>`;
    s+=`<g opacity="${p2}"><rect x="60" y="920" width="960" height="320" rx="36" fill="#3a1440"/><text x="100" y="990" font-family="IB" font-size="46" fill="#ffb0b0">GÉANT · ~1 Hz</text>${wave(100,980,1120,95,0.55,-t*1.2,'#ff5a5a',16)}</g>`;
    const p3=back((t-5.5)/0.35);
    s+=`<g transform="translate(300,1360) scale(${p3})">${earIcon(0,0,1.1,true)}</g>`;
    s+=`<g transform="translate(660,1360) scale(${p3})"><text y="-10" font-family="IB" font-size="76" text-anchor="middle" fill="#ff5a5a" paint-order="stroke" stroke="#120a1c" stroke-width="10">INFRASONS</text><text y="70" font-family="IXB" font-size="44" text-anchor="middle" fill="#fff">trop grave pour l'oreille</text></g>`;
  } else if(i===2||i===3){
    const trem=i===3?1:clamp((t-8.1)/0.3);
    s+=`<g transform="translate(${Math.sin(t*55)*6*trem},${Math.cos(t*47)*4*trem})">${facadeClose(t,trem)}</g>`;
    if(i===2) s+=bigText([["SEULES LES VITRES",84,'#ffffff'],["TREMBLENT",116,'#4cc3ff']],150,back((t-8.2)/0.3));
    else{s+=button('+ Abonne-toi',1640,lt);const cp=easeOut((lt-0.35)/0.4);s+=cursor(lerp(900,640,cp),lerp(1850,1670,cp),lt>0.8&&lt<1.0);}
  } else if(i===4){
    const heat=clamp((t-12.5)/2.0);
    s+=sky('skyGold',t)+denseCity(t,'#ffd9c0');
    s+=hero(GX,GY,GK,{t,mood:'sad',look:[0,0],blink});
    s+=`<ellipse cx="${GX}" cy="${GY-1.1*GK}" rx="${0.55*GK}" ry="${0.9*GK}" fill="url(#heatG)" opacity="${heat}"/>`;
    for(let k=0;k<10;k++){const p=((t*0.6+k*0.1)%1);const sx=GX+(rnd(k)-.5)*0.6*GK,sy=GY-1.6*GK-p*500;s+=`<circle cx="${sx+Math.sin(t*2+k)*30}" cy="${sy}" r="${50+p*90}" fill="url(#steamG)" opacity="${heat*(1-p)}"/>`;}
    for(let k=0;k<5;k++){const y=700+k*140;s+=wave(0,1080,y,8,4,t*6+k,'#fff',3).replace('stroke-width="3"',`stroke-width="3" opacity="${0.25*heat}"`);}
    s+=frontRow()+peds(t,540,1915,10,false,1.1);
    s+=thermo2(930,1300,lerp(0.45,0.95,heat),`${Math.round(lerp(37,41,heat))} °C`);
    if(t>14.5) s+=bigText([["TU SURCHAUFFES",96,'#ff5a3a']],230,back((t-14.5)/0.3));
    else s+=bigText([["PIRE…",110,'#ffffff']],230,back((lt-0.05)/0.3));
  } else if(i===5){
    s+=sky('skyGold',t)+denseCity(t,'#ffd9c0');
    s+=hero(GX,GY,GK,{t,mood:'sad',look:[0,0.8],blink});
    s+=`<ellipse cx="${GX}" cy="${GY-1.1*GK}" rx="${0.55*GK}" ry="${0.9*GK}" fill="url(#heatG)" opacity=".6"/>`;
    s+=frontRow();
    // giant sweat drops falling on the city
    for(let k=0;k<22;k++){const p=((t*0.9+rnd(k))%1),x=GX+(rnd(k+4)-.5)*0.9*GK+(rnd(k+11)-.5)*300,y=GY-1.6*GK+p*(1900-(GY-1.6*GK));const r=14+rnd(k+2)*14;
      s+=`<path d="M${x},${y-r*2} Q${x+r},${y} ${x},${y+r} Q${x-r},${y} ${x},${y-r*2}Z" fill="#9fd8ff" stroke="#4a9ad8" stroke-width="3" opacity=".9"/>`;
      if(p>0.92) s+=`<ellipse cx="${x}" cy="1890" rx="${30+(p-0.92)*600}" ry="10" fill="none" stroke="#9fd8ff" stroke-width="4" opacity="${(1-p)*10}"/>`;}
    for(let k=0;k<9;k++) s+=umbrella(110+k*110,1880,1.5,['#e53935','#1e88e5','#fdd835','#43a047','#8e24aa'][k%5]);
    s+=bigText([["AVERSE",110,'#4cc3ff'],["DE SUEUR",110,'#ffffff']],230,back((t-17.2)/0.3));
    if(t<17.2) s+=bigText([["TA SUEUR…",100,'#ffffff']],230,back((lt-0.05)/0.3));
  } else if(i===6){
    // night on the Champ-de-Mars
    s+=`<rect width="1080" height="1920" fill="url(#skyNight)"/>`+stars(t).replace(/<circle cx="820" cy="260" r="150"[\s\S]*$/,'')+`<circle cx="880" cy="300" r="140" fill="url(#moonG)"/><circle cx="880" cy="300" r="60" fill="#f4f1ff"/>`;
    s+=`<circle cx="330" cy="900" r="520" fill="url(#towerGlow)"/>`+towerImg(330,1420,1250,0).replace('filter="url(#tTower)"','filter="url(#tTower)" opacity=".95"');
    for(let k=0;k<26;k++){const yy=1420-rnd(k)*1150,xx=330+(rnd(k+5)-.5)*(1-(1420-yy)/1250)*470;s+=`<circle cx="${xx}" cy="${yy}" r="6" fill="#ffe68a" opacity="${.5+.5*Math.sin(t*6+k)}"/>`;}
    s+=`<g transform="translate(540,1420) scale(.34)">${city(-1700,-700,'night',0.1,0,31)}${city(700,1700,'night',0.1,0,47)}</g>`;
    s+=`<rect x="0" y="1420" width="1080" height="500" fill="url(#nightLawn)"/>`;for(let k=0;k<7;k++) s+=`<path d="M${k*170},1920 L${540+(k*170-540)*0.25},1420" stroke="#2a5a32" stroke-width="18" opacity=".5"/>`;
    // cloud pillow + sleeping giant (rotated) + blanket
    const K=500, FX=1030, FY=1640;
    s+=`<g opacity=".95"><ellipse cx="${FX-1.66*K}" cy="${FY+20}" rx="150" ry="90" fill="#fff"/><ellipse cx="${FX-1.66*K-90}" cy="${FY}" rx="90" ry="70" fill="#f4f8ff"/><ellipse cx="${FX-1.66*K+90}" cy="${FY+10}" rx="100" ry="70" fill="#f4f8ff"/></g>`;
    const breath=Math.sin(t*1.6)*0.012*K;
    s+=`<g transform="rotate(-90 ${FX} ${FY})">${hero(FX,FY,K,{t,mood:'happy',blink:true,look:[0,0],flag:false})}</g>`;
    s+=`<path d="M${FX-0.95*K},${FY-0.36*K-breath} Q${FX-0.5*K},${FY-0.44*K-breath} ${FX+30},${FY-0.34*K} L${FX+30},${FY+0.36*K} Q${FX-0.5*K},${FY+0.46*K} ${FX-0.95*K},${FY+0.38*K}Z" fill="#3f6ad8"/>`;
    for(let k=0;k<6;k++) s+=`<line x1="${FX-0.95*K+k*90}" y1="${FY-0.38*K}" x2="${FX-0.95*K+k*90}" y2="${FY+0.4*K}" stroke="#5a86f0" stroke-width="8" opacity=".6"/>`;
    for(let k=0;k<3;k++){const p=((t*0.5+k*0.33)%1);s+=`<text x="${FX-1.66*K+40+p*160}" y="${FY-140-p*420}" font-family="IB" font-size="${60+p*80}" fill="#cfe0ff" opacity="${1-p}">Z</text>`;}
    s+=bigText([["TON LIT :",90,'#ffffff'],["LE CHAMP-DE-MARS",88,'#ffd45a']],230,back((t-20.7)/0.3));
    if(t<20.7) s+=bigText([["LE SOIR…",100,'#ffffff']],230,back((lt-0.05)/0.3));
  } else {
    const sh=Math.sin((t-S[7])*3);
    s+=wideGiant(t,{sky:'skyGold',h:{mood:'happy',armR:-140+sh*20,look:[0,0],blink}});
    s+=bigText([["TOI, TU FERAIS QUOI",76,'#ffffff'],["AVEC 170 MÈTRES ?",86,'#ffd45a']],200,back(lt/0.35));
    s+=button('Commente !',1330,lt-1.3);
  }
  const dt=t-S[i]; if((i>0&&dt<0.1&&i!==3)||cut) s+=`<rect width="1080" height="1920" fill="#fff" opacity="${cut?0.5:(1-dt/0.1)*0.55}"/>`;
  s+=`<rect width="1080" height="1920" fill="url(#vig)"/>`;
  if(t>T-0.35) s+=`<rect width="1080" height="1920" fill="#000" opacity="${(t-(T-0.35))/0.35}"/>`;
  const sx=Math.sin(t*61)*24*shake, sy=Math.cos(t*53)*18*shake, kick=1+0.05*Math.exp(-Math.max(0,cut?t-1.9:dt)*6);
  SV.innerHTML=`<g transform="translate(${540+sx},${960+sy}) scale(${kick}) translate(-540,-960)">${s}</g>`;
}
render(0);

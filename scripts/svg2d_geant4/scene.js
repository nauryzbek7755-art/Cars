// ===== Et si tu devenais géant ? (tour Eiffel / piscine / tee-shirt / lumière) =====
var SNOW=0;
const G4=`<linearGradient id="poolW" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fd8ff"/><stop offset="1" stop-color="#2a8ad8"/></linearGradient>
<radialGradient id="redGlow"><stop offset="0" stop-color="#ff2a2a" stop-opacity=".9"/><stop offset="1" stop-color="#ff2a2a" stop-opacity="0"/></radialGradient>
<linearGradient id="info" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c1440"/><stop offset="1" stop-color="#1c0f3a"/></linearGradient>`;
function towerBent(cx,base,H,bend){const ts=H/2600, w=1340*ts, h=2796*ts;
  return `<g transform="translate(${cx},${base}) skewX(${bend}) translate(${-cx},${-base})"><image href="tower.png" x="${cx-670*ts}" y="${base-2786*ts}" width="${w}" height="${h}" filter="url(#tTower)"/></g>`}
function tshirt(x,y,s,col){return `<path transform="translate(${x},${y}) scale(${s})" d="M-30,-30 L-12,-38 Q0,-30 12,-38 L30,-30 L42,-12 L27,-5 L27,34 L-27,34 L-27,-5 L-42,-12Z" fill="${col}"/>`}
function plane(x,y,s,dir=1,night=false,t=0){return `<g transform="translate(${x},${y}) scale(${s*dir},${s})"><ellipse cx="0" cy="0" rx="110" ry="18" fill="${night?'#9aa3b8':'#fff'}"/><path d="M-20,0 L30,0 L-20,-70 L-45,-70Z" fill="${night?'#7a8398':'#e8edf5'}"/><path d="M-20,0 L30,0 L-20,60 L-45,60Z" fill="${night?'#6a7388':'#dfe5ef'}"/><path d="M-95,-4 L-110,-50 L-85,-50 L-70,-4Z" fill="#e0263a"/>
${night?`<circle cx="-112" cy="-48" r="7" fill="#ff3b3b" opacity="${Math.sin(t*10)>0?1:0.2}"/><circle cx="100" cy="0" r="6" fill="#fff"/>`:''}</g>`}
function burger(x,y,s){return `<g transform="translate(${x},${y}) scale(${s})"><ellipse cx="0" cy="-60" rx="110" ry="60" fill="#e0a050"/><rect x="-112" y="-50" width="224" height="22" rx="10" fill="#5fd35f"/><rect x="-108" y="-30" width="216" height="34" rx="14" fill="#7a3a1a"/><rect x="-112" y="2" width="224" height="16" fill="#ffd45a"/><ellipse cx="0" cy="30" rx="108" ry="26" fill="#d89040"/>${[0,1,2,3,4].map(k=>`<ellipse cx="${-60+k*30}" cy="-90" rx="5" ry="3" fill="#fff6d0"/>`).join('')}</g>`}
function croissant(x,y,s){return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-110,20 Q-60,-70 0,-60 Q60,-70 110,20 Q80,0 60,10 Q30,-30 0,-28 Q-30,-30 -60,10 Q-80,0 -110,20Z" fill="#e8a040" stroke="#b8742a" stroke-width="6"/></g>`}
function pizza(x,y,s){return `<g transform="translate(${x},${y}) scale(${s})"><path d="M0,90 L-90,-70 Q0,-110 90,-70Z" fill="#ffcf60" stroke="#d89040" stroke-width="10"/>${[[-30,-40],[20,-50],[0,0],[-10,40]].map(([a,b])=>`<circle cx="${a}" cy="${b}" r="14" fill="#d0202a"/>`).join('')}</g>`}
function render(t){
  let i=0;for(let k=0;k<S.length-1;k++) if(t>=S[k]-0.12) i=k; const lt=t-S[i];
  const blink=(t%3.1)>2.98; let s=DEFS.replace('</defs>',G4+'</defs>'); let shake=0;
  if(i===0){
    s+=sky('skyDay',t)+`<g transform="translate(540,1700) scale(.36)">${city(-1700,1700,'day',0,0,61)}</g>`;
    s+=`<rect x="0" y="1700" width="1080" height="220" fill="url(#grass)"/>`;
    const bend=lerp(0,16,easeOut((t-0.3)/2.2))+Math.sin(t*14)*(t>0.3?0.6:0);
    s+=towerBent(330,1720,1380,bend);
    // creak marks
    if(t>0.5) for(let k=0;k<4;k++){const p=((t*2+k*0.25)%1);s+=`<path d="M${420+k*20},${1100-k*120} l${20+p*30},${-10}" stroke="#ffd45a" stroke-width="6" opacity="${1-p}"/>`;}
    const K=360, lean=-12+Math.sin(t*2)*1;
    s+=`<g transform="rotate(${lean} 700 1720)">${hero(700,1720,K,{t,mood:'happy',look:[-0.8,0],armL:60,armR:-20,blink})}</g>`;
    s+=`<rect x="0" y="1720" width="1080" height="200" fill="url(#grass)"/>`;
    for(let k=0;k<30;k++){const x=rnd(k)*1080,y=1730+rnd(k+3)*180;s+=grassTuft(x,y,20+rnd(k)*20,k,t);}
    shake=t>0.3&&t<2.6?0.12:0;
    s+=bigText([["TU T'ADOSSES",100,'#ffffff'],["À LA TOUR EIFFEL…",80,'#ffd45a']],200,back((t-0.05)/0.3));
    if(t>2.15) s+=bigText([["ELLE SE PLIE !",110,'#ff5a5a']],1300,back((t-2.15)/0.3));
  } else if(i===1){
    s+=`<rect width="1080" height="1920" fill="url(#info)"/>`;for(let k=0;k<60;k++) s+=`<circle cx="${rnd(k)*1080}" cy="${rnd(k+7)*1920}" r="${1+rnd(k+3)*2}" fill="#fff" opacity=".25"/>`;
    const tilt=lerp(0,14,back((t-3.6)/0.6));
    s+=`<rect x="525" y="900" width="30" height="620" fill="#c9a030"/><path d="M420,1560 L660,1560 L600,1500 L480,1500Z" fill="#c9a030"/>`;
    s+=`<g transform="rotate(${tilt} 540 900)"><rect x="140" y="885" width="800" height="30" rx="15" fill="#e0b840"/>`;
    // pans hang vertical (counter-rotate)
    for(const [px,item] of [[180,'tower'],[900,'giant']]){s+=`<g transform="translate(${px},900) rotate(${-tilt})"><line x1="-90" y1="0" x2="-110" y2="240" stroke="#c9a030" stroke-width="5"/><line x1="90" y1="0" x2="110" y2="240" stroke="#c9a030" stroke-width="5"/><path d="M-150,240 L150,240 Q120,300 0,300 Q-120,300 -150,240Z" fill="#e0b840"/>`;
      s+=item==='tower'?`<image href="tower.png" x="-50" y="${240-210}" width="100" height="210" filter="url(#tTower)"/>`:hero(0,240,120,{t,mood:'happy',blink});s+=`</g>`;}
    s+=`</g>`;
    const st=Math.sin(tilt*Math.PI/180);s+=`<text x="180" y="${900-360*st+390}" font-family="IB" font-size="54" text-anchor="middle" fill="#9fd8ff" paint-order="stroke" stroke="#120a1c" stroke-width="8">7 300 t</text>`;
    s+=`<text x="900" y="${900+360*st+390}" font-family="IB" font-size="60" text-anchor="middle" fill="#ff5a5a" paint-order="stroke" stroke="#120a1c" stroke-width="8">70 000 t</text>`;
    s+=bigText([["× 10",150,'#ffd45a']],330,back((t-4.6)/0.3));
    if(t>5.8) s+=bigText([["70 000 TONNES",90,'#ffffff']],1720,back((t-5.8)/0.3));
  } else if(i===2||i===3){
    const aa=-128+Math.sin(t*2)*3, ar=aa*Math.PI/180;
    const shx=GX+0.27*GK, shy=GY-1.38*GK, hx=shx-Math.sin(ar)*0.54*GK, hy=shy+Math.cos(ar)*0.54*GK;
    const gulp=i===2?ease((t-9.0)/1.2):1;
    const poolX=hx-40, poolY=hy-60, tiltP=lerp(0,-40,gulp);
    let pool=`<g transform="translate(${poolX},${poolY}) rotate(${tiltP}) scale(1.35)"><rect x="-170" y="-70" width="300" height="120" rx="12" fill="#e9eef5" stroke="#b8c2cc" stroke-width="8"/><rect x="-156" y="-56" width="272" height="${92*(1-gulp*0.8)}" rx="6" fill="url(#poolW)"/>`;
    pool+=`<path d="M100,-70 v-40 M120,-70 v-40 M100,-100 h20 M100,-85 h20" stroke="#aab" stroke-width="5"/>`;
    for(let k=0;k<3;k++) pool+=`<circle cx="${-110+k*60+Math.sin(t*4+k)*8}" cy="${-30}" r="9" fill="#eab08c"/><rect x="${-116+k*60+Math.sin(t*4+k)*8}" y="-22" width="12" height="6" fill="${['#ff4d4d','#ffd45a','#4cc3ff'][k]}"/>`;
    pool+=`</g>`;
    if(gulp>0.05) pool+=`<path d="M${poolX-150},${poolY-40} Q${GX+0.05*GK},${poolY-120} ${GX+0.02*GK},${GY-1.5*GK}" stroke="#7fd8ff" stroke-width="${30*gulp}" fill="none" opacity=".8"/>`;
    s+=wideGiant(t,{h:{mood:gulp>0.3?'wow':'happy',armR:aa,look:[0.6,-0.6],blink},mid:pool+`<circle cx="${hx}" cy="${hy}" r="${0.058*GK}" fill="url(#skin)"/>`});
    if(i===2) s+=bigText([["1 GORGÉE",110,'#4cc3ff'],["= 1 PISCINE",100,'#ffffff']],220,back((t-8.85)/0.3));
    else{s+=button('+ Abonne-toi',1260,lt);const cp=easeOut((lt-0.35)/0.4);s+=cursor(lerp(920,640,cp),lerp(1600,1290,cp),lt>0.8&&lt<1.0);}
  } else if(i===4){
    s+=`<rect width="1080" height="1920" fill="url(#info)"/>`;
    const fill=clamp((t-13.4)/1.6), merge=ease((t-15.6)/0.8);
    const cols=['#e53935','#1e88e5','#fdd835','#43a047','#8e24aa','#fb8c00','#ffffff'];
    const N=Math.floor(fill*360);
    for(let k=0;k<N;k++){const c=k%18,r=Math.floor(k/18),x=60+c*56,y=420+r*58;const tx=lerp(x,540,merge),ty=lerp(y,1000,merge);s+=tshirt(tx,ty,0.62*(1-merge*0.6),cols[(k*7)%7]);}
    if(merge>0.3) s+=`<g transform="translate(540,1000) scale(${lerp(0,1,merge)})">${tshirt(0,0,12,'#2f378a')}<text y="60" font-family="IB" font-size="80" text-anchor="middle" fill="#fff">1</text></g>`;
    const n=Math.round(lerp(0,10000,fill));
    s+=bigText([[n.toLocaleString('fr-FR').replace(/ /g,' '),120,'#ffd45a'],["TEE-SHIRTS",80,'#ffffff']],200,back((lt-0.1)/0.3));
  } else if(i===5){
    s+=`<rect width="1080" height="1920" fill="url(#skyNight)"/>`+stars(t).replace(/<circle cx="820" cy="260" r="150"[\s\S]*$/,'');
    s+=`<g transform="translate(0,0)">`;
    for(const r of [{z:.30,gy:1250,sd:11},{z:.38,gy:1330,sd:23},{z:.47,gy:1430,sd:37},{z:.58,gy:1560,sd:51}]) s+=`<g transform="translate(540,${r.gy}) scale(${r.z})">${city(-540/r.z-260,540/r.z+260,'night',0.3,0,r.sd)}</g><rect x="0" y="${r.gy}" width="1080" height="200" fill="#1c1e3a"/>`;
    s+=`</g>`;
    s+=hero(GX,GY,GK,{t,mood:'happy',look:[Math.sin(t*1.5),-0.6],blink}).split('url(#hood)').join('url(#hood)');
    s+=`<rect width="1080" height="1920" fill="#0a0c28" opacity=".35"/>`;
    const on=Math.sin(t*6)>0, hy=GY-1.89*GK-30;
    s+=`<rect x="${GX-18}" y="${hy-10}" width="36" height="40" rx="8" fill="#333"/><circle cx="${GX}" cy="${hy-16}" r="24" fill="${on?'#ff3b3b':'#661010'}"/>`+(on?`<circle cx="${GX}" cy="${hy-16}" r="190" fill="url(#redGlow)"/>`:'');
    for(let k=0;k<2;k++){const px=((t*180+k*700)%1600)-300;s+=plane(k?1080-px:px,420+k*160,0.9,k?-1:1,true,t);}
    s+=frontRow(1920,.72,77).split("'day'").join("'night'");
    s+=bigText([["UNE LUMIÈRE ROUGE",80,'#ff5a5a'],["SUR LA TÊTE",90,'#ffffff']],200,back((t-17.9)/0.3));
    if(t<17.9) s+=bigText([["LA NUIT…",100,'#ffffff']],200,back((lt-0.05)/0.3));
  } else {
    const sh=Math.sin((t-S[6])*3);
    s+=wideGiant(t,{sky:'skyGold',h:{mood:'happy',armR:-30-8*sh,look:[0,-0.4],blink}});
    const p=back((lt-0.6)/0.4);
    s+=`<g opacity="${clamp(p)}">`+burger(220,880,0.9*p)+pizza(860,860,0.9*p)+croissant(220,1120,1.0*p)+`</g>`;
    s+=bigText([["TON PREMIER REPAS",80,'#ffffff'],["DE GÉANT ?",110,'#ffd45a']],200,back(lt/0.35));
    s+=button('Commente !',1330,lt-1.3);
  }
  const dt=t-S[i]; if(i>0&&dt<0.1&&i!==3) s+=`<rect width="1080" height="1920" fill="#fff" opacity="${(1-dt/0.1)*0.55}"/>`;
  s+=`<rect width="1080" height="1920" fill="url(#vig)"/>`;
  if(t>T-0.35) s+=`<rect width="1080" height="1920" fill="#000" opacity="${(t-(T-0.35))/0.35}"/>`;
  const sx=Math.sin(t*61)*24*shake, sy=Math.cos(t*53)*18*shake, kick=1+0.05*Math.exp(-Math.max(0,dt)*6);
  SV.innerHTML=`<g transform="translate(${540+sx},${960+sy}) scale(${kick}) translate(-540,-960)">${s}</g>`;
}
render(0);

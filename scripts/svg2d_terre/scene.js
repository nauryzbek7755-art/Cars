// ===== Et si la Terre arrêtait de tourner ? =====
var SNOW=0;
const TX=`<radialGradient id="ocean" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#4cb0ff"/><stop offset="1" stop-color="#0a3f8a"/></radialGradient>
<radialGradient id="atmo"><stop offset=".8" stop-color="#7fd0ff" stop-opacity="0"/><stop offset=".92" stop-color="#7fd0ff" stop-opacity=".5"/><stop offset="1" stop-color="#7fd0ff" stop-opacity="0"/></radialGradient>
<radialGradient id="shade" cx=".3" cy=".3" r=".9"><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient>
<clipPath id="globeC"><circle cx="540" cy="980" r="380"/></clipPath>`;
const CONT=[[0,-120,150,90],[160,-40,120,160],[330,-180,170,80],[480,40,140,120],[650,-90,200,110],[820,120,110,70],[930,-200,140,60]];
function globe(t,rot,oceanToPoles=0){let s=`<circle cx="540" cy="980" r="470" fill="url(#atmo)"/><g clip-path="url(#globeC)"><rect x="160" y="600" width="760" height="760" fill="url(#ocean)"/>`;
  // land moving with rotation
  const W=1100;for(const [x0,y0,rx,ry] of CONT) for(const w of [0,-W]){const x=((x0+rot)%W+W)%W+w+160;s+=`<ellipse cx="${x}" cy="${980+y0*(1-oceanToPoles*0.2)}" rx="${rx}" ry="${ry}" fill="#5fbf5a"/><ellipse cx="${x-rx*0.3}" cy="${980+y0-ry*0.3}" rx="${rx*0.4}" ry="${ry*0.35}" fill="#7fd06a"/>`;}
  if(oceanToPoles>0){ // equator dries into a land belt, oceans pile at poles
    s+=`<rect x="160" y="${980-200*oceanToPoles}" width="760" height="${400*oceanToPoles}" fill="#c9a86a" opacity="${oceanToPoles}"/>`;
    s+=`<ellipse cx="540" cy="620" rx="380" ry="${90+150*oceanToPoles}" fill="#2a8ad8"/><ellipse cx="540" cy="1340" rx="380" ry="${90+150*oceanToPoles}" fill="#2a8ad8"/>`;}
  s+=`<ellipse cx="540" cy="620" rx="380" ry="70" fill="#fff" opacity=".85"/><ellipse cx="540" cy="1345" rx="380" ry="70" fill="#fff" opacity=".85"/>`;
  return s+`</g><circle cx="540" cy="980" r="380" fill="url(#shade)"/>`}
function spaceBG(t){let s=`<rect width="1080" height="1920" fill="#04061a"/>`;for(let k=0;k<160;k++) s+=`<circle cx="${rnd(k)*1080}" cy="${rnd(k+300)*1920}" r="${.8+rnd(k+9)*2}" fill="#fff" opacity="${.3+.6*(.5+.5*Math.sin(t*3+k))}"/>`;return s}
function chair(x,y,s,r){return `<g transform="translate(${x},${y}) rotate(${r}) scale(${s})"><rect x="-30" y="-60" width="60" height="10" fill="#c0392b"/><rect x="-30" y="-110" width="10" height="60" fill="#8a4a2a"/><line x1="-28" y1="-50" x2="-34" y2="0" stroke="#8a4a2a" stroke-width="8"/><line x1="28" y1="-50" x2="34" y2="0" stroke="#8a4a2a" stroke-width="8"/></g>`}
function flyingStreet(t,t0,dens=1){let s=sky('skyDay',t)+streetBG('day',0,0,t,0);
  const tt=Math.max(0,t-t0);
  // flying objects heading east (right)
  const objs=[['car',-200,1440,1.3,0],['car',-700,1300,1.0,1],['tree',-400,1250,1,2],['chair',-100,1500,1.2,3],['chair',-500,1400,1,4],['car',-1200,1500,1.2,5],['tree',-1000,1350,1,6],['pigeon',-300,900,1.5,7],['pigeon',-800,1000,1.5,8],['paper',-150,1100,1,9],['paper',-600,1200,1,10]];
  for(const [ty,x0,y0,sc,k] of objs){const sp=900+rnd(k)*500;const x=x0+sp*tt;if(x<-300||x>1400) continue;const y=y0-Math.sin(tt*2+k)*60-tt*40*rnd(k+3);const r=tt*(200+rnd(k)*400)*(k%2?1:-1);
    if(ty==='car') s+=`<g transform="translate(${x},${y}) rotate(${r*0.4}) scale(${sc})">${abandonedCar(0)}</g>`;
    else if(ty==='tree') s+=`<g transform="translate(${x},${y}) rotate(${r*0.3})">${tree(0,0.9,k+3)}</g>`;
    else if(ty==='chair') s+=chair(x,y,sc,r);
    else if(ty==='pigeon') s+=pigeon(x,y,ph(t,k),sc,1);
    else s+=`<rect x="${x}" y="${y}" width="46" height="34" fill="#f8f4ea" stroke="#bbb" stroke-width="2" transform="rotate(${r} ${x+23} ${y+17})"/>`;}
  for(let k=0;k<16;k++){const y=rnd(k)*1900,x=((rnd(k+3)*1400+t*2400)%1600)-300;s+=`<rect x="${x}" y="${y}" width="${200+rnd(k)*300}" height="5" rx="2" fill="#fff" opacity="${0.6*dens}"/>`;}
  return s}
function ph(t,k){return t*24+k}
function render(t){
  let i=0;for(let k=0;k<S.length-1;k++) if(t>=S[k]-0.12) i=k; const lt=t-S[i];
  const blink=(t%3.1)>2.98; let s=DEFS.replace('</defs>',TX+'</defs>'); let shake=0;
  if(i===0){
    s+=spaceBG(t);
    const STOP=1.3, rot=t<STOP?t*420:STOP*420+Math.sin((t-STOP)*30)*20*Math.exp(-(t-STOP)*5);
    s+=globe(t,rot);
    if(t<STOP) for(let k=0;k<4;k++) s+=`<path d="M${200+k*20},${1000+k*60} A380,380 0 0 1 ${360+k*20},${640+k*30}" stroke="#fff" stroke-width="5" fill="none" opacity=".35"/>`;
    if(t>STOP){shake=Math.exp(-(t-STOP)*3)*0.6;for(let k=0;k<6;k++){const p=clamp((t-STOP)/0.6);s+=`<line x1="${540+Math.cos(k)*400}" y1="${980+Math.sin(k)*400}" x2="${540+Math.cos(k)*(400+p*200)}" y2="${980+Math.sin(k)*(400+p*200)}" stroke="#ffd45a" stroke-width="10" opacity="${1-p}"/>`;}}
    if(t>STOP&&t<STOP+0.12) s+=`<rect width="1080" height="1920" fill="#fff" opacity=".6"/>`;
    s+=bigText([["LA TERRE",110,'#ffffff'],["S'ARRÊTE !",120,'#ff5a5a']],230,back((t-STOP)/0.3));
    if(t<STOP) s+=`<g transform="translate(540,1420)"><rect x="-200" y="-50" width="400" height="90" rx="24" fill="#120a1c" opacity=".8"/><text y="16" font-family="IB" font-size="54" fill="#5fd35f" text-anchor="middle">1 670 km/h</text></g>`;
    else s+=`<g transform="translate(540,1420)"><rect x="-200" y="-50" width="400" height="90" rx="24" fill="#120a1c" opacity=".8"/><text y="16" font-family="IB" font-size="54" fill="#ff5a5a" text-anchor="middle">0 km/h</text></g>`;
  } else if(i===1){
    s+=flyingStreet(t,S[1]+0.2);
    const hx=lerp(200,900,ease((lt-0.6)/3.6)), hy=1820-Math.sin(clamp((lt-0.6)/3.6)*Math.PI)*500;
    s+=`<g transform="rotate(${lt>0.6?(lt-0.6)*120:0} ${hx} ${hy-300})">${hero(hx,hy,300,{t,mood:'scared',armL:150,armR:-150,look:[1,0],blink:false})}</g>`;
    shake=0.15;
    s+=bigText([["PROJETÉ",110,'#ffffff'],["VERS L'EST",100,'#ffd45a']],220,back((lt-0.8)/0.3));
    if(t>6.4) s+=bigText([["+1 000 KM/H",120,'#ff5a5a']],520,back((t-6.4)/0.25));
  } else if(i===2||i===3){
    const frozen=i===3; const tf=frozen?S[3]:t;
    s+=sky('skyDay',tf)+towerImg(540,1700,1300,0)+`<rect x="0" y="1700" width="1080" height="220" fill="url(#grass)"/>`;
    // tumbling hero + objects around (tracking shot)
    const rot=frozen?0:t*240;
    s+=`<g transform="rotate(${rot*0.2} 540 900)">${`<g transform="translate(${-200+((tf*300)%300)},${300})">${abandonedCar(0).replace('translate(0,0)','translate(200,400) scale(1.5)')}</g>`}</g>`;
    s+=`<g transform="translate(860,${1150+Math.sin(tf*3)*60}) rotate(${tf*90})">${tree(0,1.0,4)}</g>`;
    s+=`<g transform="rotate(${frozen?-20:Math.sin(t*4)*25+t*60} 540 1000)">${hero(540,1250,340,{t:tf,mood:'scared',armL:150,armR:-150,look:[0,-1],blink:false})}</g>`;
    for(let k=0;k<18;k++){const y=rnd(k)*1900,x=((rnd(k+3)*1400+tf*2400)%1600)-300;s+=`<rect x="${x}" y="${y}" width="${200+rnd(k)*300}" height="5" rx="2" fill="#fff" opacity=".6"/>`;}
    if(i===2) s+=bigText([["ET TOI…",120,'#ffffff']],250,back((t-9.8)/0.3));
    else{s+=`<rect width="1080" height="1920" fill="#000" opacity=".25"/>`;s+=button("+ Abonne-toi",1300,lt);const cp=easeOut((lt-0.35)/0.4);s+=cursor(lerp(900,640,cp),lerp(1500,1330,cp),lt>0.8&&lt<1.0);s+=`<text x="60" y="140" font-family="IB" font-size="60" fill="#fff">II PAUSE</text>`;}
  } else if(i===4){
    s+=spaceBG(t);
    const p=ease((t-14.0)/1.8);
    s+=globe(t,lt*40,p);
    s+=bigText([["DOUCEMENT ?",100,'#ffffff']],200,back((lt-0.05)/0.3));
    if(t>14.0){s+=bigText([["OCÉANS → PÔLES",96,'#4cc3ff']],1560-150,back((t-14.0)/0.3));
      s+=`<path d="M540,900 L540,700" stroke="#fff" stroke-width="10" marker-end="url(#ar)" opacity="${p}"/><path d="M540,1060 L540,1260" stroke="#fff" stroke-width="10" opacity="${p}"/>`;}
  } else if(i===5){
    // split: 6 months day / 6 months night
    s+=`<svg x="0" y="0" width="1080" height="960"><g>${sky('skyDay',t)}<circle cx="540" cy="200" r="180" fill="url(#sunG)"/></g><g transform="translate(540,940) scale(.55)">${city(-1100,1100,'day',0,0,9)}</g></svg>`;
    s+=`<svg x="0" y="960" width="1080" height="960"><rect width="1080" height="960" fill="url(#skyNight)"/>${stars(t).replace(/<circle cx="820" cy="260" r="150"[\s\S]*$/,'')}<g transform="translate(540,940) scale(.55)">${city(-1100,1100,'night',0.2,0,9)}</g></svg>`;
    s+=`<rect x="0" y="952" width="1080" height="16" fill="#fff"/>`;
    s+=`<g transform="translate(540,960)"><circle r="120" fill="#120a1c"/><text y="-10" font-family="IB" font-size="48" fill="#ffd45a" text-anchor="middle">1 JOUR</text><text y="46" font-family="IB" font-size="48" fill="#fff" text-anchor="middle">= 1 AN</text></g>`;
    if(t>18.0) s+=`<g><rect x="60" y="60" width="440" height="110" rx="30" fill="#ffd45a"/><text x="280" y="135" font-family="IB" font-size="58" text-anchor="middle" fill="#120a1c">6 MOIS ☀</text></g>`;
    if(t>19.4) s+=`<g><rect x="580" y="1040" width="440" height="110" rx="30" fill="#2a3a8a"/><text x="800" y="1115" font-family="IB" font-size="58" text-anchor="middle" fill="#fff">6 MOIS ☾</text></g>`;
  } else {
    s+=`<rect width="1080" height="1920" fill="#1a1440"/>`;
    s+=`<rect x="40" y="560" width="480" height="900" rx="40" fill="#ffd45a"/><rect x="560" y="560" width="480" height="900" rx="40" fill="#1f2a6a"/>`;
    s+=`<circle cx="280" cy="760" r="110" fill="url(#sunG)"/><circle cx="280" cy="760" r="60" fill="#fff6c0"/><circle cx="800" cy="760" r="60" fill="#f4f1ff"/><circle cx="780" cy="740" r="12" fill="#dcd8ee"/>`;
    s+=`<text x="280" y="1250" font-family="IB" font-size="64" text-anchor="middle" fill="#120a1c">6 MOIS</text><text x="280" y="1330" font-family="IB" font-size="64" text-anchor="middle" fill="#120a1c">DE JOUR</text><text x="800" y="1250" font-family="IB" font-size="64" text-anchor="middle" fill="#fff">6 MOIS</text><text x="800" y="1330" font-family="IB" font-size="64" text-anchor="middle" fill="#fff">DE NUIT</text>`;
    s+=`<g transform="translate(540,1010) scale(${1+0.06*Math.sin(t*6)})"><circle r="70" fill="#fe2c55"/><text y="22" font-family="IB" font-size="56" text-anchor="middle" fill="#fff">OU</text></g>`;
    s+=bigText([["TU CHOISIS QUOI ?",96,'#ffffff']],250,back(lt/0.3));
    s+=button('Commente !',440,lt-1.3);
  }
  const dt=t-S[i]; if(i>0&&dt<0.1&&i!==3) s+=`<rect width="1080" height="1920" fill="#fff" opacity="${(1-dt/0.1)*0.55}"/>`;
  s+=`<rect width="1080" height="1920" fill="url(#vig)"/>`;
  if(t>T-0.35) s+=`<rect width="1080" height="1920" fill="#000" opacity="${(t-(T-0.35))/0.35}"/>`;
  const sx=Math.sin(t*61)*24*shake, sy=Math.cos(t*53)*18*shake, kick=1+0.05*Math.exp(-Math.max(0,dt)*6);
  SV.innerHTML=`<g transform="translate(${540+sx},${960+sy}) scale(${kick}) translate(-540,-960)">${s}</g>`;
}
render(0);

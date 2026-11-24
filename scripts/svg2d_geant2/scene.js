// ===== Et si tu devenais géant ? Partie 2 =====
const GX=600, GK=690, GY=1880;           // giant placement in wide shots
function haze(y,col,op){return `<rect x="0" y="0" width="1080" height="${y}" fill="${col}" opacity="${op}"/>`}
// dense Paris: several rows of buildings with atmospheric depth
function denseCity(t,skyCol='#cfe9ff',front=false){
  let s='';
  const rows=[{z:.30,gy:1250,sd:11,op:.45},{z:.38,gy:1330,sd:23,op:.35},{z:.47,gy:1430,sd:37,op:.25},{z:.58,gy:1560,sd:51,op:.12}];
  s+=towerImg(170,1250,620,0);
  rows.forEach((r,k)=>{s+=haze(r.gy,skyCol,r.op*0.6);
    s+=`<g transform="translate(540,${r.gy}) scale(${r.z})">${city(-540/r.z-260,540/r.z+260,'day',0,0,r.sd)}</g>`;
    s+=`<rect x="0" y="${r.gy}" width="1080" height="${(rows[k+1]?rows[k+1].gy:1920)-r.gy}" fill="${['#b9aeb6','#aca2ab','#9f969f','#938b94'][k]}"/>`;
    for(let x=0;x<1080;x+=90) s+=`<rect x="${x+((k*37)%90)}" y="${r.gy+8}" width="${40*r.z*2}" height="${3}" fill="#f4efe6" opacity=".5"/>`;
  });
  return s}
function frontRow(gy=1920,z=.72,sd=77){return `<g transform="translate(540,${gy}) scale(${z})">${city(-540/z-260,540/z+260,'day',0,0,sd)}</g>`}
function peds(t,cx,y,n,run,sc=1){let s='';for(let k=0;k<n;k++){const x0=cx-400+k*(800/n)+rnd(k)*40;let x=x0;if(run) x+=(x0>cx?1:-1)*t*(140+rnd(k)*80);
  const a=Math.sin(t*(run?16:6)+k)*(run?6:3),col=['#c0392b','#2e86c1','#f4d03f','#27ae60','#8e44ad'][k%5];
  s+=`<g transform="translate(${x},${y}) scale(${sc})"><line x1="0" y1="-10" x2="${a}" y2="0" stroke="#2a2433" stroke-width="3" stroke-linecap="round"/><line x1="0" y1="-10" x2="${-a}" y2="0" stroke="#2a2433" stroke-width="3" stroke-linecap="round"/><rect x="-4" y="-22" width="8" height="13" rx="3" fill="${col}"/><circle cx="0" cy="-26" r="4" fill="#eab08c"/></g>`;}return s}
function bigFoot(x,yb,W){const H=W*0.5,lw=W*0.62;
  return `<g filter="url(#ds)"><rect x="${x-lw/2}" y="-200" width="${lw}" height="${yb-H*0.9+200}" fill="url(#jeans)"/><rect x="${x-lw/2}" y="${yb-H*1.05}" width="${lw}" height="${H*0.2}" fill="#2a3f80"/>
  <line x1="${x+lw*0.3}" x2="${x+lw*0.3}" y1="-200" y2="${yb-H}" stroke="#d2a24a" stroke-width="6" stroke-dasharray="22 14" opacity=".6"/>
  <path d="M${x-W/2},${yb} L${x-W/2},${yb-H*.55} Q${x-W/2},${yb-H} ${x-W*.1},${yb-H} L${x+W*.12},${yb-H} Q${x+W/2},${yb-H*.95} ${x+W/2},${yb-H*.4} L${x+W/2},${yb}Z" fill="url(#shoe)" stroke="#9fa3b8" stroke-width="4"/>
  ${[0,1,2,3].map(k=>`<line x1="${x-W*.16}" x2="${x+W*.16}" y1="${yb-H*.86+k*H*.12}" y2="${yb-H*.82+k*H*.12}" stroke="#8d90a8" stroke-width="10" stroke-linecap="round"/>`).join('')}
  <rect x="${x-W/2-8}" y="${yb-H*.22}" width="${W+16}" height="${H*.22}" rx="${H*.08}" fill="#e7e9f2"/><rect x="${x-W/2-8}" y="${yb-H*.07}" width="${W+16}" height="${H*.07}" fill="#e85a5a"/></g>`}
function dust(x,y,imp,n=40,R=600){let s='';for(let k=0;k<n;k++){const a=Math.PI*(0.03+0.94*rnd(k)),sp=R*(0.4+rnd(k+3)),life=clamp(imp/(1.4+rnd(k+7)*1.4));
  const px=x+Math.cos(a)*sp*easeOut(life),py=y-Math.abs(Math.sin(a))*sp*0.3*easeOut(life),r=30+life*120*rnd(k+11)+20;
  s+=`<circle cx="${px}" cy="${py}" r="${r}" fill="#efe0c8" opacity="${(1-life)*0.85}"/>`;}return s}
function cracks(x,y,imp){let s='';const cr=easeOut(imp/0.25);for(let k=0;k<11;k++){const a=(k/10)*Math.PI,L=(160+rnd(k)*300)*cr;let d=`M${x},${y}`;for(let j=1;j<=5;j++) d+=` L${x+Math.cos(a)*L*j/5+(rnd(k*9+j)-.5)*30},${y+Math.sin(a)*L*j/5*0.25+(rnd(k*5+j)-.5)*8}`;s+=`<path d="${d}" stroke="#2a2030" stroke-width="${5-k%3}" fill="none"/>`;}return s}
function cloudsAt(t,y0,op=.95,front=false){let s='';for(let k=0;k<3;k++){const x=((rnd(k+50)*1400+t*(40+k*15))%1500)-250,y=y0+k*90;s+=`<g opacity="${op}"><ellipse cx="${x}" cy="${y}" rx="170" ry="42" fill="#fff"/><ellipse cx="${x+70}" cy="${y-30}" rx="100" ry="46" fill="#fff"/><ellipse cx="${x-70}" cy="${y-14}" rx="80" ry="34" fill="#f3f8ff"/></g>`;}return s}
function heartIcon(x,y,sc){return `<g transform="translate(${x},${y}) scale(${sc})"><path d="M0,30 C-60,-10 -40,-60 0,-30 C40,-60 60,-10 0,30Z" fill="#ff3b5c" stroke="#fff" stroke-width="5"/><path d="M-14,-28 q-10,8 -6,20" stroke="#fff" stroke-width="5" fill="none" opacity=".7"/></g>`}
function baguette(x1,y1,x2,y2,w){const L=Math.hypot(x2-x1,y2-y1),a=Math.atan2(y2-y1,x2-x1)*180/Math.PI;
  return `<g transform="translate(${x1},${y1}) rotate(${a})" filter="url(#ds)"><rect x="0" y="${-w/2}" width="${L}" height="${w}" rx="${w/2}" fill="#e3a14a"/><rect x="0" y="${-w/2}" width="${L}" height="${w*0.35}" rx="${w/4}" fill="#f2c27a"/>
  ${[0.2,0.38,0.56,0.74].map(u=>`<path d="M${L*u},${-w*0.32} q${w*0.5},${w*0.25} ${w*0.9},0" stroke="#fbe2b0" stroke-width="${w*0.12}" fill="none" stroke-linecap="round"/>`).join('')}</g>`}
function breadMountain(cx,base,w,h){let s=`<path d="M${cx-w/2},${base} Q${cx-w*0.3},${base-h*1.1} ${cx},${base-h} Q${cx+w*0.3},${base-h*1.1} ${cx+w/2},${base}Z" fill="#d48f3c"/>`;
  for(let k=0;k<160;k++){const u=rnd(k)*2-1,v=rnd(k+9);const x=cx+u*w*0.45*(1-v*0.55),y=base-v*h*0.95*(1-Math.abs(u)*0.5);s+=`<rect x="${x-14}" y="${y-4}" width="28" height="8" rx="4" fill="${k%3?'#e9a752':'#f5c98a'}" transform="rotate(${rnd(k+3)*180-90} ${x} ${y})"/>`;}
  return s}
function jet(x,y,ang,sc=1){return `<g transform="translate(${x},${y}) rotate(${ang}) scale(${sc})"><path d="M60,0 L20,-6 L-10,-34 L-22,-34 L-6,-6 L-40,-6 L-52,-20 L-60,-20 L-54,0 L-60,20 L-52,20 L-40,6 L-6,6 L-22,34 L-10,34 L20,6Z" fill="#7d8796" stroke="#3a4250" stroke-width="2"/><ellipse cx="30" cy="0" rx="12" ry="4" fill="#9fd4ff"/></g>`}
function contrail(path){return `<path d="${path}" stroke="#fff" stroke-width="10" fill="none" opacity=".55" stroke-linecap="round"/>`}
function water(y,t,amp=10,col='#3d8fd6',op=.92){let d=`M0,${y}`;for(let x=0;x<=1080;x+=30) d+=` L${x},${y+Math.sin(x/60+t*4)*amp}`;d+=` L1080,1920 L0,1920Z`;
  return `<path d="${d}" fill="${col}" opacity="${op}"/><path d="${d.split(' L1080,1920')[0]}" stroke="#d8f0ff" stroke-width="6" fill="none" opacity=".8"/>`}
function wideGiant(t,o={}){let s=sky(o.sky||'skyDay',t,o.sky!=='skyGold');
  s+=denseCity(t,o.sky==='skyGold'?'#ffd9c0':'#cfe9ff');
  if(o.behind) s+=o.behind;
  s+=hero(GX+(o.dx||0),GY,GK,{t,...o.h});
  if(o.mid) s+=o.mid;
  s+=frontRow();
  s+=peds(t,540,1915,10,!!o.run,1.1);
  return s}
// ===== frame =====
function render(t){
  let i=0;for(let k=0;k<S.length-1;k++) if(t>=S[k]-0.12) i=k; const lt=t-S[i];
  const blink=(t%3.1)>2.98; let s=DEFS; let shake=0;
  if(i===0&&t<1.65){
    const IMP=0.55, imp=t-IMP; shake=imp>0?Math.exp(-imp*4):0;
    s+=sky('skyDay',t)+streetBG('day',0,0,t,0,1150,1.9);
    const fy=t<IMP?lerp(250,1640,easeIn(t/IMP)):1640;
    s+=`<ellipse cx="600" cy="1650" rx="${lerp(420,300,clamp(t/IMP))}" ry="${lerp(70,45,clamp(t/IMP))}" fill="url(#shadow)" opacity="${lerp(.3,1,clamp(t/IMP))}"/>`;
    if(imp>0) s+=cracks(600,1650,imp);
    // car flips + pedestrians run
    const cj=imp>0?Math.max(0,Math.sin(Math.min(imp*3.2,Math.PI)))*260:0;
    s+=`<g transform="translate(${960+(imp>0?easeOut(imp)*90:0)},${1470-cj}) rotate(${imp>0?easeOut(imp*1.4)*160:0}) scale(1.4)">${abandonedCar(0).replace('translate(0,0)','translate(0,0)')}</g>`;
    s+=peds(Math.max(0,imp),540,1560,9,imp>0,2.2);
    s+=bigFoot(600,fy,560);
    if(imp>0){s+=`<ellipse cx="600" cy="1650" rx="${easeOut(imp/0.6)*900}" ry="${easeOut(imp/0.6)*120}" fill="none" stroke="#fff6e0" stroke-width="${12*(1-clamp(imp/0.6))}" opacity="${1-clamp(imp/0.6)}"/>`+dust(600,1650,imp);}
    if(imp>0&&imp<0.2) s+=`<rect width="1080" height="1920" fill="#fff" opacity="${(1-imp/0.2)*0.6}"/>`;
    s+=bigText([['170 MÈTRES',118,'#ffd45a']],320,back((t-0.6)/0.35));
  } else if(i===0){
    const lt0=t-1.65;
    s+=wideGiant(t,{h:{mood:'neutral',look:[0,1],blink},run:true,behind:cloudsAt(t,700,.9)});
    s+=bigText([['ÊTRE GÉANT',100,'#ffffff'],['= CAUCHEMAR',112,'#ff5a5a']],190,back((t-2.4)/0.35));
  } else if(i===1){
    const air=t>6.25;
    s+=wideGiant(t,{h:{mood:air?'scared':'sad',look:[0,-0.4],blink,lean:air?Math.sin(t*3)*2.5:0},behind:cloudsAt(t,760,.85)});
    const hx=GX-0.08*GK, hy=GY-1.25*GK, beat=1+0.18*Math.abs(Math.sin(t*7));
    s+=`<circle cx="${hx}" cy="${hy}" r="${90*beat}" fill="#ff3b5c" opacity=".25" filter="url(#b12)"/>`+heartIcon(hx,hy,1.1*beat);
    // blood path up to the brain
    const p=clamp((t-4.6)/0.9);s+=`<path d="M${hx},${hy-40} L${hx},${lerp(hy-40,GY-1.62*GK,p)}" stroke="#ff3b5c" stroke-width="16" stroke-dasharray="26 18" stroke-dashoffset="${-t*120}" stroke-linecap="round"/>`;
    for(let k=0;k<3;k++){const dy=((t*0.9+k*0.33)%1)*120;s+=`<ellipse cx="${GX+0.13*GK}" cy="${GY-1.72*GK+dy}" rx="9" ry="14" fill="#9fd8ff" opacity="${1-dy/120}"/>`;}
    s+=bigText([['SANG',90,'#ffffff'],['× 100 PLUS HAUT',96,'#ff5a5a']],190,back((t-4.9)/0.35));
    if(air) s+=`<rect width="1080" height="1920" fill="#6a8cff" opacity="${0.12+0.06*Math.sin(t*6)}"/>`+bigText([["MANQUE D'AIR",100,'#9fd8ff']],520,back((t-6.3)/0.3));
  } else if(i===2||i===3){
    const aa=-122+Math.sin(t*2)*4, ar=aa*Math.PI/180;
    const shx=GX+0.27*GK, shy=GY-1.38*GK, hx=shx-Math.sin(ar)*0.54*GK, hy=shy+Math.cos(ar)*0.54*GK;
    s+=wideGiant(t,{h:{mood:'happy',armR:aa,look:[0.6,-0.6],blink},
      mid:baguette(hx+60,hy-20,GX+0.04*GK,GY-1.52*GK,44)+`<circle cx="${hx}" cy="${hy}" r="${0.058*GK}" fill="url(#skin)"/>`});
    s+=breadMountain(880,1915,420,260);
    for(let k=0;k<8;k++){const p=((t*1.2+k*0.13)%1);s+=`<circle cx="${GX+0.05*GK+(rnd(k)-.5)*80}" cy="${GY-1.5*GK+p*900}" r="7" fill="#e3a14a" opacity="${1-p}"/>`;}
    if(i===2){const n=Math.round(lerp(0,100000,easeOut((t-8.9)/0.9)));
      s+=bigText([[n.toLocaleString('fr-FR').replace(/ /g,' '),120,'#ffd45a'],['BAGUETTES / JOUR',72,'#ffffff']],190,back((t-8.8)/0.3));}
    else{s+=button('+ Abonne-toi',1260,lt);const cp=easeOut((lt-0.35)/0.4);s+=cursor(lerp(920,640,cp),lerp(1600,1290,cp),lt>0.8&&lt<1.0);}
  } else if(i===4){
    // the Seine
    s+=sky('skyDay',t)+denseCity(t);
    s+=`<rect x="0" y="1300" width="1080" height="620" fill="#9f969f"/><rect x="0" y="1300" width="1080" height="40" fill="#d8c9b2"/><rect x="0" y="1340" width="1080" height="20" fill="#b9a88e"/>`;
    for(let x=0;x<1080;x+=60) s+=`<rect x="${x}" y="1300" width="56" height="38" fill="#e4d5bd" stroke="#b9a88e" stroke-width="2"/>`;
    const sink=easeOut(lt/0.6), wl=1450-ease((lt-0.5)/1.6)*70;
    s+=water(1440,t,6,'#4a9ad8',1);
    s+=`<g transform="translate(0,${lerp(-600,0,sink)})">${hero(540,1480+0.8*700,700,{t,sit:true,mood:t>13.4?'wow':'happy',armL:40,armR:-40,look:[0,0.4],blink})}</g>`;
    const boatTilt=Math.sin(t*3)*8*clamp(lt/0.6);
    s+=`<g transform="translate(${880+Math.sin(t)*20},${wl-10}) rotate(${boatTilt})"><path d="M-110,0 L110,0 L90,30 L-95,30Z" fill="#3a3a48"/><rect x="-80" y="-30" width="120" height="30" fill="#f2efe8"/><rect x="-70" y="-24" width="20" height="14" fill="#9fd4ff"/><rect x="-40" y="-24" width="20" height="14" fill="#9fd4ff"/><rect x="-10" y="-24" width="20" height="14" fill="#9fd4ff"/></g>`;
    s+=water(wl,t,14,'#3d8fd6',.88);
    // overflow onto the quay + splash
    const ov=ease((t-13.4)/1.2);
    if(ov>0){s+=`<path d="M0,${1720-ov*40} Q270,${1700-ov*80} 540,${1720-ov*50} T1080,${1715-ov*60} L1080,1920 L0,1920Z" fill="#3d8fd6" opacity="${0.75*ov}"/>`;
      for(let k=0;k<14;k++){const x=rnd(k)*1080,h=60+rnd(k+4)*140,p=((t*1.5+k*0.2)%1);s+=`<ellipse cx="${x}" cy="${1700-p*h}" rx="${10+p*10}" ry="${14}" fill="#d8f0ff" opacity="${(1-p)*ov}"/>`;}}
    if(lt<0.9) for(let k=0;k<18;k++){const a=Math.PI*(0.05+0.9*rnd(k)),p=clamp((lt-0.45)/0.6),sp=500*rnd(k+3)+200;s+=`<circle cx="${540+Math.cos(a)*sp*p}" cy="${1440-Math.sin(a)*sp*p*0.8+p*p*300}" r="${12+rnd(k)*14}" fill="#d8f0ff" opacity="${p>0?1-p:0}"/>`;}
    s+=`<rect x="0" y="1760" width="1080" height="160" fill="#8f868f"/>`+peds(Math.max(0,t-13.4),540,1840,10,t>13.4,1.6);
    if(ov>0) s+=`<rect x="0" y="1760" width="1080" height="160" fill="#3d8fd6" opacity="${0.6*ov}"/>`;
    s+=bigText([['LA SEINE',100,'#ffffff'],['DÉBORDE !',116,'#4cc3ff']],190,back((t-13.5)/0.35));
  } else if(i===5){
    let jets='',trails='';
    for(let k=0;k<3;k++){const a=t*1.6+k*2.1,cx=GX-0.05*GK,cy=GY-1.6*GK;
      const pts=[];for(let j=0;j<14;j++){const aj=a-j*0.09;pts.push(`${cx+Math.cos(aj)*(420+k*40)},${cy+Math.sin(aj)*(150+k*20)}`);}
      trails+=contrail('M'+pts.join(' L'));
      const x=cx+Math.cos(a)*(420+k*40),y=cy+Math.sin(a)*(150+k*20),ang=Math.atan2(Math.cos(a)*(150+k*20),-Math.sin(a)*(420+k*40))*180/Math.PI;
      const j=jet(x,y,ang,1.7);if(Math.sin(a)<0) jets+=j; else trails+=j;}
    const lookX=Math.cos(t*1.6)*1.2;
    s+=wideGiant(t,{h:{mood:'wow',look:[lookX,-0.3],blink,armR:-120+Math.sin(t*9)*20},behind:jets,mid:trails});
    s+=bigText([["L'ARMÉE",100,'#ffffff'],['ARRIVE…',112,'#ff5a5a']],190,back((t-15.7)/0.35));
  } else {
    const sh=Math.sin((t-S[6])*3);
    const mini=hero(GX+0.2*GK,GY-1.47*GK,95,{t,mood:'happy',armR:-140+Math.sin(t*9)*25,blink});
    s+=wideGiant(t,{sky:'skyGold',h:{mood:'happy',armL:20,armR:-30-8*sh,look:[0.7,-0.4],blink},mid:mini});
    s+=bigText([['TU PRÉFÈRES ÊTRE',78,'#ffffff'],['GÉANT',110,'#ffd45a'],['OU MINUSCULE ?',96,'#4cc3ff']],170,back((t-S[6])/0.4));
    s+=button('Commente !',1400,t-S[6]-1.2);
  }
  const dt=t-S[i]; if(i>0&&dt<0.1) s+=`<rect width="1080" height="1920" fill="#fff" opacity="${(1-dt/0.1)*0.6}"/>`;
  if(i===0&&Math.abs(t-1.65)<0.08) s+=`<rect width="1080" height="1920" fill="#fff" opacity="${(1-Math.abs(t-1.65)/0.08)*0.5}"/>`;
  s+=`<rect width="1080" height="1920" fill="url(#vig)"/>`;
  if(t>T-0.35) s+=`<rect width="1080" height="1920" fill="#000" opacity="${(t-(T-0.35))/0.35}"/>`;
  const sx=Math.sin(t*61)*24*shake, sy=Math.cos(t*53)*18*shake, kick=1+0.05*Math.exp(-Math.max(0,dt)*6);
  SV.innerHTML=`<g transform="translate(${540+sx},${960+sy}) scale(${kick}) translate(-540,-960)">${s}</g>`;
}
render(0);

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

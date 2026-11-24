// ===== Brick-toy style test (5 s) =====
const U=40; // one stud pitch in px
function shade(hex,f){const p=[1,3,5].map(i=>parseInt(hex.substr(i,2),16));return '#'+p.map(v=>Math.round(clamp(v*f,0,255)).toString(16).padStart(2,'0')).join('')}
function stud(x,y,col,s=1){const r=12*s,h=7*s;return `<rect x="${x-r}" y="${y-h}" width="${2*r}" height="${h}" fill="${shade(col,.82)}"/><ellipse cx="${x}" cy="${y-h}" rx="${r}" ry="${r*.38}" fill="${shade(col,1.12)}"/><ellipse cx="${x-r*.35}" cy="${y-h-r*.08}" rx="${r*.35}" ry="${r*.12}" fill="#fff" opacity=".45"/>`}
// brick: studs n wide, rows tall (1 row = 0.6U plate*... we use 1.2U brick height)
function brick(x,y,n,col,studs=true,hgt=1.2*U){const w=n*U;let s=`<rect x="${x}" y="${y-hgt}" width="${w}" height="${hgt}" rx="3" fill="${col}"/>`;
  s+=`<rect x="${x}" y="${y-hgt}" width="${w}" height="${hgt*.18}" fill="${shade(col,1.15)}"/><rect x="${x+w-6}" y="${y-hgt}" width="6" height="${hgt}" fill="${shade(col,.78)}"/><rect x="${x}" y="${y-3}" width="${w}" height="3" fill="${shade(col,.6)}"/>`;
  s+=`<rect x="${x+5}" y="${y-hgt+5}" width="${w*.35}" height="4" rx="2" fill="#fff" opacity=".35"/>`;
  if(studs) for(let k=0;k<n;k++) s+=stud(x+U/2+k*U,y-hgt,col);
  return s}
function plate(x,y,n,col,studs=true){return brick(x,y,n,col,studs,0.45*U)}
// wall of bricks with running bond; windows are transparent "window bricks"
function brickHouse(x,y,cols,rows,col,roofCol,seed,off=0){let s='';
  for(let r=0;r<rows;r++){const yy=y-r*1.2*U;let cx=x-(r%2?U:0);const end=x+cols*U;
    while(cx<end){const n=Math.min(2+(Math.floor(rnd(seed+r*7+cx)*2)),Math.ceil((end-cx)/U));const xs=Math.max(cx,x),ne=Math.min(n,Math.round((end-xs)/U));
      if(ne>0){const win=r>=1&&r<rows-1&&((xs-x)/U)%4===1&&r%2===1;
        s+=win?`<rect x="${xs}" y="${yy-1.2*U}" width="${ne*U}" height="${1.2*U}" fill="#9fdcff" stroke="${shade(col,.7)}" stroke-width="5"/><line x1="${xs+ne*U/2}" y1="${yy-1.2*U}" x2="${xs+ne*U/2}" y2="${yy}" stroke="${shade(col,.7)}" stroke-width="4"/><rect x="${xs+6}" y="${yy-1.2*U+6}" width="10" height="${U*.6}" fill="#fff" opacity=".6"/>`
               :brick(xs,yy,ne,col,r===rows-1);}
      cx+=n*U;}}
  // roof: stepped slope bricks
  const ry=y-rows*1.2*U;for(let k=0;k<Math.ceil(cols/2);k++){const w=cols-2*k;if(w<=0)break;s+=brick(x+k*U,ry-k*1.2*U,w,roofCol,true);}
  return s}
function minifig(x,y,u,o={}){ // y = feet; u ~ px per "unit" (fig height ~ 4.1u)
  const t=o.t||0,w=o.walk,mood=o.mood||'happy';let lA=0,rA=0,aL=o.armL??0,aR=o.armR??0;
  if(w!=null){lA=Math.sin(w)*22;rA=-lA;aL+=-Math.sin(w)*25;aR+=Math.sin(w)*25;}
  const bob=w!=null?Math.abs(Math.sin(w))*0.05*u:0, jy=o.jump||0;
  let s=`<ellipse cx="${x}" cy="${y+3}" rx="${1.1*u*(1-jy/(u*6))}" ry="${0.16*u}" fill="#000" opacity=".25"/>`;
  s+=`<g transform="translate(${x},${y-bob-jy})">`;
  const leg=(sd,a)=>`<g transform="rotate(${a*0.25} ${sd*0.38*u} ${-1.55*u})"><g transform="translate(0,${-Math.abs(Math.sin(a/22*1.57))*0.08*u*0})"><rect x="${sd>0?0.02*u:-0.78*u}" y="${-1.55*u}" width="${0.76*u}" height="${1.25*u}" rx="${0.08*u}" fill="#3a66c9"/><rect x="${sd>0?0.02*u:-0.78*u}" y="${-1.55*u}" width="${0.76*u}" height="${0.2*u}" fill="#5b86e6"/>
     <rect x="${sd>0?0.0*u:-0.82*u}" y="${-0.32*u}" width="${0.82*u}" height="${0.32*u}" rx="${0.06*u}" fill="#2e55aa"/><rect x="${sd>0?0.62*u:-0.82*u}" y="${-1.5*u}" width="${0.16*u}" height="${1.2*u}" fill="#2a4a95" opacity=".6"/></g></g>`;
  s+=leg(-1,lA)+leg(1,rA);
  s+=`<rect x="${-0.82*u}" y="${-1.78*u}" width="${1.64*u}" height="${0.3*u}" rx="${0.05*u}" fill="#2a4a95"/>`;       // hips
  // torso (trapezoid) with hoodie print
  s+=`<path d="M${-0.62*u},${-3.05*u} L${0.62*u},${-3.05*u} L${0.82*u},${-1.78*u} L${-0.82*u},${-1.78*u}Z" fill="#2f378a"/><path d="M${-0.62*u},${-3.05*u} L${-0.4*u},${-3.05*u} L${-0.55*u},${-1.78*u} L${-0.82*u},${-1.78*u}Z" fill="#4b55b8" opacity=".7"/>
   <line x1="0" y1="${-3.0*u}" x2="0" y2="${-1.8*u}" stroke="#1b2060" stroke-width="${0.04*u}"/><path d="M${-0.35*u},${-2.25*u} h${0.7*u} l${-0.08*u},${0.32*u} h${-0.54*u}Z" fill="#262d78"/>
   <line x1="${-0.12*u}" y1="${-3.0*u}" x2="${-0.14*u}" y2="${-2.6*u}" stroke="#fff" stroke-width="${0.04*u}" stroke-linecap="round"/><line x1="${0.12*u}" y1="${-3.0*u}" x2="${0.14*u}" y2="${-2.6*u}" stroke="#fff" stroke-width="${0.04*u}" stroke-linecap="round"/>
   <rect x="${0.25*u}" y="${-2.85*u}" width="${0.24*u}" height="${0.16*u}" fill="#fff"/><rect x="${0.25*u}" y="${-2.85*u}" width="${0.08*u}" height="${0.16*u}" fill="#0055a4"/><rect x="${0.41*u}" y="${-2.85*u}" width="${0.08*u}" height="${0.16*u}" fill="#ef4135"/>`;
  // arms with C-hands
  const arm=(sd,a,flag)=>{const sx=sd*0.66*u,sy=-2.9*u;let r=`<g transform="rotate(${a} ${sx} ${sy})"><path d="M${sx-0.2*u},${sy} L${sx+0.2*u},${sy} L${sx+sd*0.12*u+0.17*u},${sy+0.95*u} L${sx+sd*0.12*u-0.17*u},${sy+0.95*u}Z" fill="#343c92"/><rect x="${sx+sd*0.12*u-0.1*u}" y="${sy+0.92*u}" width="${0.2*u}" height="${0.14*u}" fill="#f2c200"/>`;
    const hx=sx+sd*0.12*u,hy=sy+1.18*u;
    if(flag) r+=`<g transform="rotate(${-a} ${hx} ${hy})"><line x1="${hx}" y1="${hy+0.3*u}" x2="${hx}" y2="${hy-1.6*u}" stroke="#7a5638" stroke-width="${0.08*u}" stroke-linecap="round"/>${flagSVG(hx,hy-1.55*u,t,u*3.6)}</g>`;
    r+=`<circle cx="${hx}" cy="${hy}" r="${0.2*u}" fill="none" stroke="#ffd21f" stroke-width="${0.12*u}" stroke-dasharray="${0.95*u} ${0.3*u}" transform="rotate(${sd>0?20:200} ${hx} ${hy})"/></g>`;return r};
  s+=arm(1,aR,false)+arm(-1,aL,o.flag!==false);
  // neck + head (cylinder) + stud + hair
  s+=`<rect x="${-0.22*u}" y="${-3.2*u}" width="${0.44*u}" height="${0.18*u}" fill="#e6b800"/>`;
  s+=`<rect x="${-0.55*u}" y="${-4.0*u}" width="${1.1*u}" height="${0.85*u}" rx="${0.18*u}" fill="#ffd21f"/><rect x="${-0.55*u}" y="${-4.0*u}" width="${0.22*u}" height="${0.85*u}" rx="${0.1*u}" fill="#ffe46b" opacity=".8"/><rect x="${0.36*u}" y="${-4.0*u}" width="${0.19*u}" height="${0.85*u}" rx="${0.1*u}" fill="#e6b800" opacity=".8"/>`;
  s+=`<path d="M${-0.62*u},${-3.6*u} Q${-0.66*u},${-4.42*u} 0,${-4.45*u} Q${0.66*u},${-4.42*u} ${0.62*u},${-3.6*u} L${0.5*u},${-3.75*u} Q${0.3*u},${-3.95*u} ${0.05*u},${-3.9*u} Q${-0.3*u},${-3.95*u} ${-0.5*u},${-3.72*u}Z" fill="#5a3420"/><path d="M${-0.4*u},${-4.32*u} Q0,${-4.45*u} ${0.35*u},${-4.3*u}" stroke="#8a5a3a" stroke-width="${0.06*u}" fill="none"/>`;
  const ey=-3.58*u, blink=o.blink;
  for(const sd of [-1,1]) s+=blink?`<line x1="${sd*0.2*u-0.06*u}" x2="${sd*0.2*u+0.06*u}" y1="${ey}" y2="${ey}" stroke="#111" stroke-width="${0.05*u}"/>`:`<ellipse cx="${sd*0.2*u}" cy="${ey}" rx="${0.065*u}" ry="${0.085*u}" fill="#111"/><circle cx="${sd*0.2*u-0.02*u}" cy="${ey-0.03*u}" r="${0.02*u}" fill="#fff"/>`;
  s+=mood==='wow'?`<ellipse cx="0" cy="${-3.35*u}" rx="${0.1*u}" ry="${0.13*u}" fill="#111"/>`:`<path d="M${-0.22*u},${-3.4*u} Q0,${-3.2*u} ${0.22*u},${-3.4*u}" stroke="#111" stroke-width="${0.06*u}" fill="none" stroke-linecap="round"/>`;
  s+=`</g>`;return s}
function brickCar(x,y,col){let s=plate(x-80,y-34,6,'#555a66',false);s+=brick(x-120,y-34,6,col,false,0.9*U)+brick(x-40,y-70,3,col,true,0.7*U)+`<rect x="${x-34}" y="${y-120}" width="${U*1.4}" height="${0.55*U}" fill="#9fdcff" opacity=".85"/>`;
  for(const wx of [x-80,x+70]) s+=`<circle cx="${wx}" cy="${y-16}" r="26" fill="#1c1c22"/><circle cx="${wx}" cy="${y-16}" r="12" fill="#cfd4de"/>`;return s}
function brickTower(x,base,sc){let s='';const rows=26;for(let r=0;r<rows;r++){const w=Math.max(1,Math.round((rows-r)*0.42*sc));const yy=base-r*1.2*U*sc*0.6;
  s+=`<g transform="translate(${x-w*U*0.3*sc},${yy}) scale(${0.6*sc})">${brick(0,0,w,r%4===0?'#8a4f22':'#a8632d',r===rows-1)}</g>`;}
  return s}
function render(t){
  let s=DEFS+`<rect width="1080" height="1920" fill="url(#skyDay)"/>`;
  for(const [cx,cy] of [[200,260],[760,180]]) s+=`<g opacity=".95">${brick(cx,cy,4,'#ffffff',true,0.8*U)}${brick(cx-40,cy+0.8*U,6,'#f2f6ff',false,0.8*U)}</g>`;
  s+=`<g opacity=".9">${brickTower(540,1330,1.0)}</g>`;
  // back houses
  s+=brickHouse(20,1330,7,7,'#e8c27a','#c0392b',3)+brickHouse(820,1330,6,8,'#f4f1ea','#2a6fd6',5);
  // baseplate ground with stud rows
  s+=`<rect x="0" y="1330" width="1080" height="590" fill="#4caf50"/>`;
  for(let r=0;r<6;r++){const yy=1360+r*95,sc=0.8+r*0.25;for(let x=-40+(r%2)*20;x<1120;x+=U*sc*1.2) s+=stud(x,yy,'#4caf50',sc);}
  s+=`<rect x="0" y="1560" width="1080" height="110" fill="#8d9199"/>`;for(let x=0;x<1080;x+=U) s+=stud(x+U/2,1560,'#8d9199',.9);
  // car drives
  s+=brickCar(1200-t*260,1660,'#e53935');
  // target house (gets smashed)
  const IMP=1.7, imp=t-IMP;
  if(imp<0) s+=brickHouse(690,1560,6,5,'#ffb74d','#6d4c41',9);
  else{ // flying bricks
    for(let k=0;k<26;k++){const bx=690+(k%6)*U,by=1560-Math.floor(k/6)*1.2*U;const vx=(rnd(k)-.4)*900,vy=-500-rnd(k+5)*700,tt=Math.min(imp,1.6);
      const x=bx+vx*tt,y=Math.min(1640,by+vy*tt+1500*tt*tt);s+=`<g transform="translate(${x},${y}) rotate(${tt*rnd(k+9)*900})">${brick(-U,0,2,['#ffb74d','#6d4c41','#ffb74d'][k%3],true)}</g>`;}
  }
  // hero minifig walks in then reacts
  const walk=t<1.5, hx=walk?lerp(-80,330,t/1.5):330;
  const jump=imp>0&&imp<0.6?Math.sin(imp/0.6*Math.PI)*120:0;
  s+=minifig(hx,1640,105,{t,walk:walk?t*9:null,mood:imp>0?'wow':'happy',armL:imp>0.1?-10:0,armR:imp>0.1?-150+Math.sin(t*10)*15:0,jump,blink:(t%2.6)>2.48});
  // giant brick foot
  const fy=imp<0?lerp(-400,1560,easeIn(clamp((t-1.1)/0.6))):1560-Math.max(0,(imp-1.2))*900;
  if(t>1.0){const fx=780;s+=`<g filter="url(#ds)"><rect x="${fx-170}" y="-200" width="340" height="${fy-150+200}" fill="#3a66c9"/><rect x="${fx-170}" y="-200" width="70" height="${fy-150+200}" fill="#5b86e6" opacity=".6"/><rect x="${fx-200}" y="${fy-160}" width="400" height="160" rx="12" fill="#2e55aa"/><rect x="${fx-200}" y="${fy-160}" width="400" height="26" fill="#5b86e6"/></g>`;}
  let shake=imp>0?Math.exp(-imp*4):0;
  if(imp>0&&imp<0.15) s+=`<rect width="1080" height="1920" fill="#fff" opacity="${(1-imp/0.15)*0.6}"/>`;
  if(t>2.0) s+=bigText([['ET SI TU DEVENAIS',78,'#ffffff'],['GÉANT ?',130,'#ffd45a']],300,back((t-2.0)/0.35));
  s+=`<rect width="1080" height="1920" fill="url(#vig)"/>`;
  const sx=Math.sin(t*61)*24*shake, sy=Math.cos(t*53)*18*shake;
  SV.innerHTML=`<g transform="translate(${sx},${sy})">${s}</g>`;
}
render(0);

// ---------- helpers ----------
const SV=document.getElementById('s');
const rnd=s=>{let x=Math.sin(s*127.1+311.7)*43758.5453;return x-Math.floor(x)};
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const ease=x=>{x=clamp(x);return x*x*(3-2*x)};
const easeIn=x=>{x=clamp(x);return x*x*x};
const easeOut=x=>{x=clamp(x);return 1-Math.pow(1-x,3)};
const back=x=>{x=clamp(x);const c=1.70158;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)};
const lerp=(a,b,x)=>a+(b-a)*x;
const mixc=(a,b,x)=>{const p=h=>[1,3,5].map(i=>parseInt(h.substr(i,2),16));const A=p(a),B=p(b);return '#'+A.map((v,i)=>Math.round(lerp(v,B[i],clamp(x))).toString(16).padStart(2,'0')).join('')};
const OUTL='#1a1428';
// ---------- defs ----------
const DEFS=`<defs>
<linearGradient id="skyDay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f8cff"/><stop offset=".6" stop-color="#8fd0ff"/><stop offset="1" stop-color="#d8f1ff"/></linearGradient>
<linearGradient id="skyGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a62c9"/><stop offset=".5" stop-color="#f6a2a0"/><stop offset=".8" stop-color="#ffc98a"/><stop offset="1" stop-color="#ffe9b8"/></linearGradient>
<linearGradient id="skyNight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050820"/><stop offset=".6" stop-color="#16204e"/><stop offset="1" stop-color="#2b2f6b"/></linearGradient>
<linearGradient id="skyWild" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3fa0ff"/><stop offset=".7" stop-color="#bfe8ff"/><stop offset="1" stop-color="#f0ffe8"/></linearGradient>
<radialGradient id="sunG"><stop offset="0" stop-color="#fffbe0"/><stop offset=".3" stop-color="#ffe68a" stop-opacity=".9"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient>
<radialGradient id="moonG"><stop offset="0" stop-color="#ffffff" stop-opacity=".5"/><stop offset="1" stop-color="#a0b4ff" stop-opacity="0"/></radialGradient>
<linearGradient id="wall" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffe9c9"/><stop offset=".75" stop-color="#f2d2a6"/><stop offset="1" stop-color="#d6ad80"/></linearGradient>
<linearGradient id="wallN" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3c4378"/><stop offset="1" stop-color="#262a55"/></linearGradient>
<linearGradient id="wallsh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#2a1a40" stop-opacity=".28"/></linearGradient>
<linearGradient id="roof" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5d78c4"/><stop offset="1" stop-color="#34467e"/></linearGradient>
<linearGradient id="win" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3bf"/><stop offset="1" stop-color="#ffb347"/></linearGradient>
<linearGradient id="winD" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d9f0ff"/><stop offset=".35" stop-color="#6c9ad8"/><stop offset="1" stop-color="#34508e"/></linearGradient>
<linearGradient id="winOff" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2d3566"/><stop offset="1" stop-color="#151a38"/></linearGradient>
<linearGradient id="road" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6b6878"/><stop offset="1" stop-color="#454352"/></linearGradient>
<linearGradient id="walk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e2d6cc"/><stop offset="1" stop-color="#bfb0a6"/></linearGradient>
<linearGradient id="grass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fd34e"/><stop offset="1" stop-color="#3f9a2c"/></linearGradient>
<linearGradient id="jeans" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5f8ff0"/><stop offset=".45" stop-color="#3a66c9"/><stop offset="1" stop-color="#23408a"/></linearGradient>
<linearGradient id="hood" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4b55b8"/><stop offset=".5" stop-color="#2f378a"/><stop offset="1" stop-color="#1e2463"/></linearGradient>
<linearGradient id="hoodv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".14"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient>
<linearGradient id="shoe" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#c9ccdc"/></linearGradient>
<radialGradient id="skin" cx=".38" cy=".35" r=".75"><stop offset="0" stop-color="#ffe2c8"/><stop offset=".7" stop-color="#f1b48c"/><stop offset="1" stop-color="#d9916a"/></radialGradient>
<radialGradient id="shadow"><stop offset="0" stop-color="#1a0f20" stop-opacity=".45"/><stop offset="1" stop-color="#1a0f20" stop-opacity="0"/></radialGradient>
<radialGradient id="vig" cx=".5" cy=".5" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#0a0418" stop-opacity=".45"/></radialGradient>
<radialGradient id="glowW"><stop offset="0" stop-color="#ffcf70" stop-opacity=".6"/><stop offset="1" stop-color="#ffcf70" stop-opacity="0"/></radialGradient>
<radialGradient id="lampG"><stop offset="0" stop-color="#fff2c0" stop-opacity=".9"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient>
<linearGradient id="beam" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff8d0" stop-opacity=".85"/><stop offset="1" stop-color="#fff8d0" stop-opacity="0"/></linearGradient>
<linearGradient id="carRed" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff5a5f"/><stop offset=".55" stop-color="#e0262f"/><stop offset="1" stop-color="#9c1220"/></linearGradient>
<linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e8f7ff" stop-opacity=".95"/><stop offset=".5" stop-color="#8cc8f0" stop-opacity=".85"/><stop offset="1" stop-color="#3d7fbf" stop-opacity=".9"/></linearGradient>
<linearGradient id="stoneA" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fbf0dc"/><stop offset=".7" stop-color="#e8d3b2"/><stop offset="1" stop-color="#c9ab85"/></linearGradient>
<linearGradient id="rust" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c25a1e"/><stop offset="1" stop-color="#7a3010"/></linearGradient>
<filter id="b2"><feGaussianBlur stdDeviation="2"/></filter>
<filter id="b5"><feGaussianBlur stdDeviation="5"/></filter>
<filter id="b12"><feGaussianBlur stdDeviation="12"/></filter>
<filter id="ds" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#000" flood-opacity=".3"/></filter>
<filter id="tTower"><feColorMatrix type="matrix" values=".75 .2 .05 0 .08  .18 .55 .05 0 .04  .1 .1 .5 0 .05  0 0 0 1 0"/></filter>
<filter id="tIce"><feColorMatrix type="matrix" values=".3 .3 .3 0 .45  .3 .35 .3 0 .55  .3 .3 .4 0 .65  0 0 0 1 0"/></filter><filter id="tRust"><feColorMatrix type="matrix" values=".6 .4 .1 0 .32  .2 .4 .05 0 .1  .05 .1 .2 0 .02  0 0 0 1 0"/></filter>
</defs>`;
// ---------- buildings ----------
// mode: 'day' | 'night' (off: 0..1 fraction of windows switched off) | 'wild' (overgrown)
function building(x,w,h,v,seed,mode='day',off=0,grow=0){
  const N=mode==='night', Wd=mode==='wild';
  let s='';
  s+=`<rect x="${x}" y="${-h}" width="${w}" height="${h}" fill="${N?'url(#wallN)':'url(#wall)'}"/>`;
  for(let y=-h+14;y<-50;y+=9) s+=`<line x1="${x}" x2="${x+w}" y1="${y}" y2="${y}" stroke="${N?'#20244a':'#c49a6c'}" stroke-opacity=".25" stroke-width=".8"/>`;
  s+=`<rect x="${x}" y="${-h}" width="5" height="${h}" fill="${N?'#30366a':'#e2c098'}"/><rect x="${x+w-5}" y="${-h}" width="5" height="${h}" fill="${N?'#1e2250':'#c39b70'}"/>`;
  s+=`<rect x="${x+w*.2}" y="${-h-58}" width="11" height="24" fill="${N?'#3a2a40':'#c0634a'}"/><rect x="${x+w*.68}" y="${-h-55}" width="11" height="22" fill="${N?'#30223a':'#a8523e'}"/>`;
  s+=`<path d="M${x-4},${-h} L${x+w+4},${-h} L${x+w-12},${-h-40} L${x+12},${-h-40}Z" fill="${N?'#1c2350':'url(#roof)'}"/>`;
  for(let y=-h-34;y<-h;y+=6) s+=`<line x1="${x+10}" x2="${x+w-10}" y1="${y}" y2="${y}" stroke="#1d2550" stroke-opacity=".35" stroke-width=".7"/>`;
  for(let dx=x+16;dx<x+w-24;dx+=32){const l=N?rnd(seed+dx)>Math.max(.55,off):rnd(seed+dx)>.7;
    s+=`<path d="M${dx-3},${-h-24} L${dx+7},${-h-36} L${dx+17},${-h-24}Z" fill="${N?'#4a4f80':'#f4e2c2'}"/><rect x="${dx}" y="${-h-24}" width="14" height="20" rx="6" fill="${N?(l?'url(#win)':'url(#winOff)'):'url(#winD)'}"/>`;}
  s+=`<rect x="${x-4}" y="${-h-3}" width="${w+8}" height="6" fill="${N?'#4b5288':'#fff0d6'}"/>`;
  const rows=Math.floor((h-70)/36);
  for(let r=0;r<rows;r++){const wy=-h+16+r*36;
    for(let wx=x+14;wx<x+w-22;wx+=30){const rv=rnd(seed*7+r*13+wx);
      let fill='url(#winD)',glow=false;
      if(N){const lit=rv>off;fill=lit?'url(#win)':'url(#winOff)';glow=lit;}
      if(Wd&&rv<.35) fill='#1a1a26';
      if(glow) s+=`<circle cx="${wx+8}" cy="${wy+12}" r="24" fill="url(#glowW)"/>`;
      s+=`<rect x="${wx-2}" y="${wy-4}" width="20" height="3" fill="${N?'#555c94':'#fff3dc'}"/>`;
      s+=`<rect x="${wx}" y="${wy}" width="16" height="25" fill="${fill}"/><line x1="${wx+8}" x2="${wx+8}" y1="${wy}" y2="${wy+25}" stroke="#3a3048" stroke-width=".8"/><line x1="${wx}" x2="${wx+16}" y1="${wy+11}" y2="${wy+11}" stroke="#3a3048" stroke-width=".8"/>`;
      s+=`<rect x="${wx-5}" y="${wy}" width="4" height="25" fill="${N?'#2a3a5a':'#3d9a78'}"/><rect x="${wx+17}" y="${wy}" width="4" height="25" fill="${N?'#22304e':'#2f8064'}"/>`;
      if(r===1||r===rows-1){s+=`<rect x="${wx-6}" y="${wy+23}" width="28" height="2.5" fill="#1e1a22"/>`; for(let k=0;k<6;k++) s+=`<line x1="${wx-5+k*5}" x2="${wx-5+k*5}" y1="${wy+19}" y2="${wy+25}" stroke="#1e1a22" stroke-width=".8"/>`;
        if(!N&&rnd(wx+r)>.45) s+=`<circle cx="${wx+2}" cy="${wy+20}" r="2.8" fill="#ff4d7a"/><circle cx="${wx+10}" cy="${wy+19}" r="2.8" fill="#ffd34d"/><circle cx="${wx+6}" cy="${wy+21}" r="2.4" fill="#5fd35f"/>`;}
    }}
  const shop=N?['#2a1d3a','#1a2340','#1a3028'][v]:['#d8343f','#2a6fd6','#2f9a55'][v];
  s+=`<rect x="${x}" y="-52" width="${w}" height="52" fill="${N?'#3a3f70':'#f3e2c4'}"/><rect x="${x+5}" y="-40" width="${w-10}" height="40" fill="${shop}"/>`;
  s+=`<rect x="${x+12}" y="-32" width="${w*.55}" height="28" fill="${N?'url(#winOff)':'url(#winD)'}"/><rect x="${x+w*.72}" y="-32" width="${w*.16}" height="32" fill="#3a2520"/>`;
  for(let sx=x+5;sx<x+w-5;sx+=12) s+=`<path d="M${sx},-40 h12 v8 l-6,3 l-6,-3Z" fill="${Math.floor((sx-x)/12)%2?(N?'#5a5e88':'#fffaf2'):shop}"/>`;
  s+=`<rect x="${x}" y="${-h}" width="${w}" height="${h}" fill="url(#wallsh)"/>`;
  if(typeof SNOW!=='undefined'&&SNOW>0){const o=SNOW;
    s+=`<path d="M${x+8},${-h-38} Q${x+w/2},${-h-48} ${x+w-8},${-h-38} L${x+w-6},${-h-32} Q${x+w/2},${-h-36} ${x+10},${-h-32}Z" fill="#f4f8ff" opacity="${o}"/>`;
    s+=`<path d="M${x-4},${-h-1} L${x+w+4},${-h-1} L${x+w+4},${-h+4} Q${x+w/2},${-h+8} ${x-4},${-h+4}Z" fill="#ffffff" opacity="${o}"/>`;
    for(let k=0;k<Math.floor(w/9);k++){const ix=x+4+k*9+rnd(seed+k)*4,il=(6+rnd(seed*3+k)*18)*o;s+=`<path d="M${ix-2.5},${-h+4} L${ix+2.5},${-h+4} L${ix},${-h+4+il}Z" fill="#dff2ff" opacity="${.9*o}"/>`;}
    for(let r=0;r<rows;r++){const wy=-h+16+r*36;for(let wx=x+14;wx<x+w-22;wx+=30) s+=`<rect x="${wx-3}" y="${wy+24}" width="22" height="4" rx="2" fill="#fff" opacity="${o}"/>`;}
    s+=`<rect x="${x+w*.2-2}" y="${-h-62}" width="15" height="6" rx="3" fill="#fff" opacity="${o}"/><rect x="${x+w*.68-2}" y="${-h-59}" width="15" height="6" rx="3" fill="#fff" opacity="${o}"/>`;
    s+=`<rect x="${x}" y="-44" width="${w}" height="5" fill="#fff" opacity="${o}"/>`;}
  if(Wd&&grow>0){ // vines + moss climbing
    for(let k=0;k<5;k++){const vx=x+10+rnd(seed+k)*(w-20),vh=h*(.3+.7*rnd(seed*3+k))*grow;let d=`M${vx},0`;
      for(let j=1;j<=10;j++) d+=` Q${vx+(j%2?12:-12)},${-vh*(j-.5)/10} ${vx+(rnd(k+j)-.5)*10},${-vh*j/10}`;
      s+=`<path d="${d}" stroke="#2f7a28" stroke-width="3" fill="none"/>`;
      for(let j=0;j<14;j++){const ly=-vh*j/14,lx=vx+(rnd(seed+k*20+j)-.5)*22;s+=`<ellipse cx="${lx}" cy="${ly}" rx="7" ry="4" fill="${j%3?'#4cae38':'#2f8a2a'}" transform="rotate(${rnd(j+k)*180} ${lx} ${ly})"/>`;}}
    s+=`<rect x="${x}" y="-12" width="${w}" height="12" fill="#3f8f2c" opacity="${.8*grow}"/>`;
  }
  return s;
}
function city(x0,x1,mode,off,grow,seed=1){let s='',x=x0,k=0;while(x<x1){const w=170+rnd(k+seed)*60,h=240+rnd(k+50+seed)*70;s+=building(x,w,h,k%3,k+seed,mode,off,grow);x+=w+3;k++;}return s}
// ---------- street props ----------
function lamp(x,on=1,night=false){let s=`<rect x="${x-3}" y="-150" width="6" height="150" fill="#1f2230"/><rect x="${x-9}" y="-6" width="18" height="6" fill="#1f2230"/><path d="M${x-12},-150 h24 l-5,-16 h-14Z" fill="#1f2230"/><rect x="${x-9}" y="-150" width="18" height="14" fill="${on>0.5?'#fff2b8':'#566'}"/>`;
  if(night&&on>0.5) s+=`<circle cx="${x}" cy="-140" r="90" fill="url(#lampG)" opacity="${on}"/><path d="M${x-10},-136 L${x-60},0 L${x+60},0 L${x+10},-136Z" fill="#fff0b0" opacity="${.12*on}"/>`;return s}
function tree(x,s_=1,seed=1,leaf=['#2f8a2a','#4cae38','#7fd34e']){let s=`<g transform="translate(${x},0) scale(${s_})"><path d="M-9,0 L-6,-90 Q-20,-120 -30,-130 M-6,-90 L6,-90 L9,0Z" fill="#7a4a2a"/><path d="M0,-80 Q20,-110 30,-125" stroke="#7a4a2a" stroke-width="7" fill="none"/>`;
  for(let k=0;k<26;k++){const a=rnd(seed+k)*Math.PI*2,r=rnd(seed+k+40)*55,cx=Math.cos(a)*r,cy=-150+Math.sin(a)*r*.7,rr=20+rnd(k+seed*3)*16;const tone=cy<-160?2:(cx>10?0:1);s+=`<circle cx="${cx}" cy="${cy}" r="${rr}" fill="${leaf[tone]}"/>`;}
  for(let k=0;k<10;k++){const cx=(rnd(seed+k*7)-.5)*90,cy=-175+(rnd(seed+k*9))*40;s+=`<circle cx="${cx}" cy="${cy}" r="5" fill="#b8f07a" opacity=".8"/>`;}
  return s+'</g>'}
function pigeon(x,y,ph,s_=1,fly=1){const f=Math.sin(ph)*16*fly;return `<g transform="translate(${x},${y}) scale(${s_})"><ellipse cx="0" cy="0" rx="14" ry="8" fill="#8f97a8"/><circle cx="11" cy="-6" r="6" fill="#7c859a"/><circle cx="13" cy="-7" r="1.4" fill="#111"/><path d="M16,-6 l5,1 l-5,2Z" fill="#e0a040"/>
<path d="M-4,-3 Q-10,${-14-f} -24,${-10-f*1.3} Q-12,-4 -4,2Z" fill="#a9b0c0"/><path d="M-14,0 l-10,3 l10,3Z" fill="#6c7488"/></g>`}
function abandonedCar(x,col='url(#carRed)'){return `<g transform="translate(${x},0)" filter="url(#ds)"><path d="M-80,-14 Q-82,-42 -60,-46 L-38,-46 L-22,-72 Q-18,-77 -10,-77 L30,-77 Q38,-77 42,-72 L58,-46 L72,-44 Q82,-42 82,-26 L82,-14Z" fill="${col}"/>
<path d="M-30,-48 L-16,-68 L4,-68 L4,-48Z M8,-48 L8,-68 L30,-68 L44,-48Z" fill="url(#glass)"/><circle cx="-48" cy="-12" r="15" fill="#1c1c22"/><circle cx="48" cy="-12" r="15" fill="#1c1c22"/><circle cx="-48" cy="-12" r="6" fill="#bbb"/><circle cx="48" cy="-12" r="6" fill="#bbb"/>
<path d="M4,-48 L4,-18 L-38,-6 L-40,-44Z" fill="#c21e28" stroke="#7a1018" stroke-width="2"/><rect x="74" y="-38" width="8" height="6" fill="#fff6c0"/></g>`}
// ---------- hero (2D vector, rigged) ----------
// o: {walk:phase|null, jump:px, armL:deg, armR:deg, look:[x,y], mood:'happy'|'wow'|'scared'|'sad'|'neutral', blink:bool, lean:deg, flash:bool, bag:bool, sit:bool, t}
function flagSVG(px,py,t,K){const fw=0.34*K,fh=0.22*K,cols=['#0055a4','#ffffff','#ef4135'];let s='';
  for(let j=0;j<3;j++){const pts=[];for(let k=0;k<=8;k++){const u=(j+k/8)/3,x=px-u*fw,wv=Math.sin(t*6-u*5)*u*0.05*K;pts.push([x,py+wv]);}
    const top=pts.map(p=>p.join(',')).join(' '),bot=pts.slice().reverse().map(p=>[p[0],p[1]+fh].join(',')).join(' ');
    s+=`<polygon points="${top} ${bot}" fill="${cols[j]}"/>`;}
  for(let k=0;k<12;k++){const u=k/12,x=px-u*fw,c=Math.cos(t*6-u*5),wv=Math.sin(t*6-u*5)*u*0.05*K;s+=`<rect x="${x-fw/12}" y="${py+wv}" width="${fw/12+1}" height="${fh}" fill="${c>0?'#fff':'#000'}" opacity="${Math.abs(c)*.13*u}"/>`;}
  return s}
function hero(x,y,K,o={}){
  const t=o.t||0, w=o.walk, mood=o.mood||'happy', look=o.look||[0,0];
  let bob=0,lL=0,lR=0,aL=o.armL??0,aR=o.armR??0,liftL=0,liftR=0;
  if(w!=null){bob=Math.abs(Math.sin(w))*0.035*K;lL=Math.sin(w)*16;lR=-Math.sin(w)*16;aR+=Math.sin(w)*22;aL+=-Math.sin(w)*10;liftL=Math.max(0,Math.sin(w))*0.05*K;liftR=Math.max(0,-Math.sin(w))*0.05*K;}
  const breath=Math.sin(t*2.2)*0.006*K, jy=o.jump||0, sq=o.squash||0;
  const cx=x, gy=y-jy;
  let s=`<ellipse cx="${x}" cy="${y+2}" rx="${0.34*K*(1-jy/(K*2))}" ry="${0.05*K}" fill="url(#shadow)"/>`;
  s+=`<g transform="translate(${cx},${gy-bob}) rotate(${o.lean||0}) scale(${1+sq*0.12},${1-sq*0.12})">`;
  const leg=(sx,ang,lift)=>{const hx=sx*0.1*K,hy=-0.88*K;return `<g transform="rotate(${ang} ${hx} ${hy}) translate(0,${-lift})"><rect x="${hx-0.078*K}" y="${hy}" width="${0.156*K}" height="${0.8*K}" rx="${0.06*K}" fill="url(#jeans)"/>
   <rect x="${hx-0.078*K}" y="${-0.13*K}" width="${0.156*K}" height="${0.04*K}" fill="#2a3f80"/>
   <path d="M${hx-0.09*K},0 L${hx-0.09*K},${-0.06*K} Q${hx-0.09*K},${-0.11*K} ${hx-0.02*K},${-0.11*K} L${hx+0.04*K},${-0.11*K} Q${hx+0.1*K},${-0.1*K} ${hx+0.1*K},${-0.04*K} L${hx+0.1*K},0Z" fill="url(#shoe)" stroke="#9fa3b8" stroke-width="${0.006*K}"/>
   <rect x="${hx-0.095*K}" y="${-0.02*K}" width="${0.2*K}" height="${0.022*K}" rx="${0.01*K}" fill="#e85a5a"/></g>`};
  if(!o.sit){s+=leg(-1,lL,liftL)+leg(1,lR,liftR);}
  // backpack
  if(o.bag) s+=`<rect x="${-0.27*K}" y="${-1.42*K}" width="${0.54*K}" height="${0.5*K}" rx="${0.1*K}" fill="#d9742b"/>`;
  // torso
  s+=`<g transform="translate(0,${-breath})"><rect x="${-0.29*K}" y="${-1.47*K}" width="${0.58*K}" height="${0.67*K}" rx="${0.14*K}" fill="url(#hood)"/><rect x="${-0.29*K}" y="${-1.47*K}" width="${0.58*K}" height="${0.67*K}" rx="${0.14*K}" fill="url(#hoodv)"/>
   <rect x="${-0.29*K}" y="${-0.88*K}" width="${0.58*K}" height="${0.075*K}" rx="${0.03*K}" fill="#1c225c"/>
   <path d="M${-0.17*K},${-1.08*K} h${0.34*K} l${-0.04*K},${0.17*K} h${-0.26*K}Z" fill="#262d78"/>
   <line x1="0" x2="0" y1="${-1.38*K}" y2="${-0.9*K}" stroke="#171c50" stroke-width="${0.008*K}"/>
   <line x1="${-0.05*K}" x2="${-0.06*K}" y1="${-1.42*K}" y2="${-1.22*K}" stroke="#eef" stroke-width="${0.01*K}" stroke-linecap="round"/><line x1="${0.05*K}" x2="${0.06*K}" y1="${-1.42*K}" y2="${-1.24*K}" stroke="#eef" stroke-width="${0.01*K}" stroke-linecap="round"/>
   <rect x="${0.17*K}" y="${-1.35*K}" width="${0.07*K}" height="${0.07*K}" rx="${0.015*K}" fill="#ef4135"/><rect x="${0.17*K}" y="${-1.35*K}" width="${0.023*K}" height="${0.07*K}" fill="#0055a4"/><rect x="${0.193*K}" y="${-1.35*K}" width="${0.023*K}" height="${0.07*K}" fill="#fff"/></g>`;
  // arms
  const arm=(sx,ang,flag)=>{const sx0=sx*0.27*K,sy0=-1.38*K;let a=`<g transform="rotate(${ang} ${sx0} ${sy0})"><rect x="${sx0-0.07*K}" y="${sy0-0.04*K}" width="${0.14*K}" height="${0.54*K}" rx="${0.07*K}" fill="url(#hood)"/><rect x="${sx0-0.07*K}" y="${sy0+0.44*K}" width="${0.14*K}" height="${0.05*K}" rx="${0.02*K}" fill="#1c225c"/>`;
    const hx=sx0,hy=sy0+0.54*K;
    if(flag){a+=`<g transform="rotate(${-ang} ${hx} ${hy})"><line x1="${hx}" y1="${hy+0.05*K}" x2="${hx}" y2="${hy-0.66*K}" stroke="#7a5638" stroke-width="${0.022*K}" stroke-linecap="round"/><circle cx="${hx}" cy="${hy-0.67*K}" r="${0.018*K}" fill="#e0b050"/>${flagSVG(hx,hy-0.64*K,t,K)}</g>`;}
    if(o.flash&&!flag){a+=`<g transform="rotate(${-ang} ${hx} ${hy})"><rect x="${hx-0.02*K}" y="${hy-0.08*K}" width="${0.04*K}" height="${0.12*K}" rx="${0.01*K}" fill="#222"/></g>`;}
    a+=`<circle cx="${hx}" cy="${hy}" r="${0.058*K}" fill="url(#skin)"/></g>`;return a};
  if(!o.noArms) s+=arm(1,aR,false)+arm(-1,aL,o.flag!==false);
  // head
  const hc=-1.64*K, hb=Math.sin(t*1.7)*0.01*K;
  s+=`<g transform="translate(0,${hb-breath}) rotate(${(o.tilt||0)} 0 ${hc})">`;
  s+=`<path d="M${-0.2*K},${hc+0.1*K} Q${-0.23*K},${hc-0.22*K} 0,${hc-0.25*K} Q${0.23*K},${hc-0.22*K} ${0.2*K},${hc+0.1*K} Q${0.12*K},${hc+0.2*K} 0,${hc+0.2*K} Q${-0.12*K},${hc+0.2*K} ${-0.2*K},${hc+0.1*K}Z" fill="url(#hood)"/>`;
  s+=`<path d="M${-0.2*K},${hc+0.1*K} Q${-0.23*K},${hc-0.22*K} 0,${hc-0.25*K}" stroke="#6a74d8" stroke-width="${0.012*K}" fill="none" opacity=".6"/>`;
  s+=`<ellipse cx="0" cy="${hc+0.02*K}" rx="${0.155*K}" ry="${0.165*K}" fill="url(#skin)"/>`;
  s+=`<path d="M${-0.16*K},${hc-0.02*K} Q${-0.14*K},${hc-0.18*K} 0,${hc-0.17*K} Q${0.15*K},${hc-0.17*K} ${0.16*K},${hc-0.01*K} Q${0.1*K},${hc-0.1*K} ${0.02*K},${hc-0.1*K} Q${-0.02*K},${hc-0.06*K} ${-0.08*K},${hc-0.08*K} Q${-0.13*K},${hc-0.06*K} ${-0.16*K},${hc-0.02*K}Z" fill="#4a2a18"/>`;
  const big=(mood==='wow'||mood==='scared')?1.2:1;
  for(const sd of [-1,1]){const ex=sd*0.06*K, ey=hc+0.025*K;
    if(o.blink) s+=`<path d="M${ex-0.03*K},${ey} q${0.03*K},${0.018*K} ${0.06*K},0" stroke="#2a1a12" stroke-width="${0.012*K}" fill="none" stroke-linecap="round"/>`;
    else s+=`<ellipse cx="${ex}" cy="${ey}" rx="${0.034*K*big}" ry="${0.042*K*big}" fill="#fff" stroke="#2a1a12" stroke-width="${0.005*K}"/><circle cx="${ex+look[0]*0.012*K}" cy="${ey+look[1]*0.014*K}" r="${0.022*K}" fill="#3a2414"/><circle cx="${ex+look[0]*0.012*K-0.008*K}" cy="${ey+look[1]*0.014*K-0.01*K}" r="${0.008*K}" fill="#fff"/>`;
    const by=mood==='sad'?sd*0.012*K:mood==='scared'||mood==='wow'?-0.022*K:0, tilt=mood==='sad'?-sd*0.02*K:mood==='scared'?sd*0.012*K:0;
    s+=`<path d="M${ex-0.036*K},${ey-0.065*K+by-tilt} Q${ex},${ey-0.085*K+by} ${ex+0.036*K},${ey-0.065*K+by+tilt}" stroke="#3a2010" stroke-width="${0.014*K}" fill="none" stroke-linecap="round"/>`;}
  s+=`<path d="M${-0.006*K},${hc+0.06*K} q${0.014*K},${0.024*K} ${-0.004*K},${0.03*K}" stroke="#c97a58" stroke-width="${0.008*K}" fill="none" stroke-linecap="round"/>`;
  s+=`<ellipse cx="${0.1*K}" cy="${hc+0.085*K}" rx="${0.03*K}" ry="${0.016*K}" fill="#ff7f8a" opacity=".45"/><ellipse cx="${-0.1*K}" cy="${hc+0.085*K}" rx="${0.03*K}" ry="${0.016*K}" fill="#ff7f8a" opacity=".45"/>`;
  const my=hc+0.115*K;
  if(mood==='happy') s+=`<path d="M${-0.05*K},${my-0.01*K} Q0,${my+0.05*K} ${0.05*K},${my-0.01*K}Z" fill="#7a2030"/><path d="M${-0.03*K},${my+0.012*K} Q0,${my+0.03*K} ${0.03*K},${my+0.012*K}" fill="#ff7a8a"/>`;
  else if(mood==='wow'||mood==='scared') s+=`<ellipse cx="0" cy="${my+0.01*K}" rx="${0.028*K}" ry="${0.036*K}" fill="#5a1525"/>`;
  else if(mood==='sad') s+=`<path d="M${-0.04*K},${my+0.02*K} Q0,${my-0.015*K} ${0.04*K},${my+0.02*K}" stroke="#5a1525" stroke-width="${0.012*K}" fill="none" stroke-linecap="round"/>`;
  else s+=`<path d="M${-0.03*K},${my} L${0.03*K},${my}" stroke="#5a1525" stroke-width="${0.012*K}" stroke-linecap="round"/>`;
  s+=`</g></g>`;
  return s;
}
// ---------- UI ----------
function bigText(lines,y,sc=1){let s=`<g transform="translate(540,${y}) scale(${sc})" font-family="IB" text-anchor="middle" paint-order="stroke" stroke="#120a1c" stroke-width="15" stroke-linejoin="round">`;
  lines.forEach(([txt,size,col],i)=>{s+=`<text y="${i*size*1.12}" font-size="${size}" fill="${col}">${txt}</text>`;});return s+'</g>'}
function button(txt,y,lt,col='#fe2c55'){const p=back(lt/0.35),bob=Math.sin(lt*7)*6;if(p<=0.02)return '';
  return `<g transform="translate(540,${y+bob}) scale(${p})" filter="url(#ds)"><rect x="-290" y="-64" width="580" height="128" rx="64" fill="${col}"/><text y="22" font-family="IB" font-size="64" fill="#fff" text-anchor="middle">${txt}</text></g>`}
function cursor(x,y,press){return `<g transform="translate(${x},${y}) scale(${press?0.9:1})"><path d="M0,0 L0,70 L18,54 L32,84 L44,78 L30,50 L54,50Z" fill="#fff" stroke="#111" stroke-width="4" stroke-linejoin="round"/></g>`}

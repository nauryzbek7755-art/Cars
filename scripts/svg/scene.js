const SV=document.getElementById('s');
const rnd=s=>{let x=Math.sin(s*127.1+311.7)*43758.5453;return x-Math.floor(x)};
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const ease=x=>{x=clamp(x);return x*x*(3-2*x)};
const easeIn=x=>{x=clamp(x);return x*x*x};
const easeOut=x=>{x=clamp(x);return 1-Math.pow(1-x,3)};
const lerp=(a,b,x)=>a+(b-a)*x;
const HM=1300, IMPACT=0.75, FX=150, FY=100;   // hero-metre px, impact time, right-foot x, feet ground y
const TW={w:1340,h:2796,ox:670,oy:2786,Hh:2600};
const DEFS=`<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#232a6b"/><stop offset=".42" stop-color="#7b5aa8"/><stop offset=".72" stop-color="#ff8c7a"/><stop offset="1" stop-color="#ffd59e"/></linearGradient>
<radialGradient id="sun"><stop offset="0" stop-color="#fffbe6"/><stop offset=".18" stop-color="#ffe28a"/><stop offset=".45" stop-color="#ffb070" stop-opacity=".55"/><stop offset="1" stop-color="#ff8a70" stop-opacity="0"/></radialGradient>
<linearGradient id="haze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffa98a" stop-opacity="0"/><stop offset="1" stop-color="#ffb894" stop-opacity=".75"/></linearGradient>
<linearGradient id="wall" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffe6c4"/><stop offset=".7" stop-color="#e9cba3"/><stop offset="1" stop-color="#c9a47e"/></linearGradient>
<linearGradient id="wallsh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#3a2340" stop-opacity=".35"/></linearGradient>
<linearGradient id="roof" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6e7aa3"/><stop offset="1" stop-color="#3a4262"/></linearGradient>
<linearGradient id="win" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff1b8"/><stop offset="1" stop-color="#ffaa45"/></linearGradient>
<linearGradient id="windark" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffc9a8"/><stop offset=".35" stop-color="#5a6a9a"/><stop offset="1" stop-color="#2a3358"/></linearGradient>
<linearGradient id="road" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#555064"/><stop offset="1" stop-color="#2c2a3a"/></linearGradient>
<linearGradient id="walk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9b8b0"/><stop offset="1" stop-color="#9c8c8e"/></linearGradient>
<linearGradient id="jeans" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6d8fd0"/><stop offset=".35" stop-color="#3f5a96"/><stop offset="1" stop-color="#1b2647"/></linearGradient>
<linearGradient id="hood" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6a6fa6"/><stop offset=".4" stop-color="#3a3e68"/><stop offset="1" stop-color="#1a1c33"/></linearGradient>
<linearGradient id="hoodv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".12"/><stop offset="1" stop-color="#000" stop-opacity=".25"/></linearGradient>
<linearGradient id="shoe" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#eceef6"/><stop offset="1" stop-color="#b9bccc"/></linearGradient>
<radialGradient id="skin" cx=".38" cy=".35" r=".7"><stop offset="0" stop-color="#ffe0c6"/><stop offset=".7" stop-color="#eab08c"/><stop offset="1" stop-color="#c98a68"/></radialGradient>
<radialGradient id="dust"><stop offset="0" stop-color="#f3e1c8" stop-opacity=".95"/><stop offset=".6" stop-color="#d9c0a2" stop-opacity=".6"/><stop offset="1" stop-color="#c9b49a" stop-opacity="0"/></radialGradient>
<radialGradient id="shadow"><stop offset="0" stop-color="#1a0f20" stop-opacity=".75"/><stop offset="1" stop-color="#1a0f20" stop-opacity="0"/></radialGradient>
<radialGradient id="vig" cx=".5" cy=".5" r=".72"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#10061a" stop-opacity=".6"/></radialGradient>
<radialGradient id="glowwin"><stop offset="0" stop-color="#ffcf70" stop-opacity=".55"/><stop offset="1" stop-color="#ffcf70" stop-opacity="0"/></radialGradient>
<filter id="b1"><feGaussianBlur stdDeviation="1.2"/></filter>
<filter id="b3"><feGaussianBlur stdDeviation="3"/></filter>
<filter id="b10"><feGaussianBlur stdDeviation="10"/></filter>
<filter id="mblur" x="-10%" y="-30%" width="120%" height="160%"><feGaussianBlur stdDeviation="0 18"/></filter>
<filter id="tint"><feColorMatrix type="matrix" values=".55 .15 .1 0 .18  .12 .45 .1 0 .1  .15 .12 .6 0 .2  0 0 0 1 0"/><feGaussianBlur stdDeviation="1"/></filter>
<filter id="ds" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#000" flood-opacity=".45"/></filter>
</defs>`;
// ---------- static city (generated once) ----------
function building(x,w,h,v,seed){
  let s='';
  s+=`<rect x="${x}" y="${-h}" width="${w}" height="${h}" fill="url(#wall)"/>`;
  for(let y=-h+14;y<-46;y+=9) s+=`<line x1="${x}" x2="${x+w}" y1="${y}" y2="${y}" stroke="#b8946c" stroke-opacity=".28" stroke-width=".8"/>`;
  s+=`<rect x="${x}" y="${-h}" width="5" height="${h}" fill="#d2b08a"/><rect x="${x+w-5}" y="${-h}" width="5" height="${h}" fill="#b48f6a"/>`;
  s+=`<rect x="${x+w*.2}" y="${-h-58}" width="11" height="24" fill="#a85f4b"/><rect x="${x+w*.68}" y="${-h-55}" width="11" height="22" fill="#94523f"/>`;
  s+=`<path d="M${x-4},${-h} L${x+w+4},${-h} L${x+w-12},${-h-40} L${x+12},${-h-40}Z" fill="url(#roof)"/>`;
  for(let y=-h-34;y<-h;y+=6) s+=`<line x1="${x+10}" x2="${x+w-10}" y1="${y}" y2="${y}" stroke="#2e3552" stroke-opacity=".35" stroke-width=".7"/>`;
  for(let dx=x+16;dx<x+w-24;dx+=32){const l=rnd(seed+dx)>.55;
    s+=`<path d="M${dx-3},${-h-24} L${dx+7},${-h-36} L${dx+17},${-h-24}Z" fill="#e8d2ae"/><rect x="${dx}" y="${-h-24}" width="14" height="20" rx="6" fill="${l?'url(#win)':'url(#windark)'}"/>`;}
  s+=`<rect x="${x-4}" y="${-h-3}" width="${w+8}" height="6" fill="#f3dfbd"/><rect x="${x-4}" y="${-h+3}" width="${w+8}" height="2" fill="#a88a66" opacity=".5"/>`;
  const rows=Math.floor((h-70)/36);
  for(let r=0;r<rows;r++){const wy=-h+16+r*36;
    for(let wx=x+14;wx<x+w-22;wx+=30){const lit=rnd(seed*7+r*13+wx)>.62;
      if(lit) s+=`<circle cx="${wx+8}" cy="${wy+12}" r="22" fill="url(#glowwin)"/>`;
      s+=`<rect x="${wx-2}" y="${wy-4}" width="20" height="3" fill="#f0dcb8"/>`;
      s+=`<rect x="${wx}" y="${wy}" width="16" height="25" fill="${lit?'url(#win)':'url(#windark)'}"/><line x1="${wx+8}" x2="${wx+8}" y1="${wy}" y2="${wy+25}" stroke="#4a3b3b" stroke-width=".8"/><line x1="${wx}" x2="${wx+16}" y1="${wy+11}" y2="${wy+11}" stroke="#4a3b3b" stroke-width=".8"/>`;
      s+=`<rect x="${wx-5}" y="${wy}" width="4" height="25" fill="#4d6e5e"/><rect x="${wx+17}" y="${wy}" width="4" height="25" fill="#3f5d4f"/>`;
      if(r===1||r===rows-1){s+=`<rect x="${wx-6}" y="${wy+23}" width="28" height="2.5" fill="#1e1a22"/>`; for(let k=0;k<6;k++) s+=`<line x1="${wx-5+k*5}" x2="${wx-5+k*5}" y1="${wy+19}" y2="${wy+25}" stroke="#1e1a22" stroke-width=".8"/>`;
        if(rnd(wx+r)>.5) s+=`<circle cx="${wx+2}" cy="${wy+20}" r="2.6" fill="#ff5d7a"/><circle cx="${wx+10}" cy="${wy+19}" r="2.6" fill="#ffd34d"/><circle cx="${wx+5}" cy="${wy+21}" r="2.2" fill="#6cc36c"/>`;}
    }}
  const shop=['#8c2f3a','#22476b','#2f6247'][v];
  s+=`<rect x="${x}" y="-52" width="${w}" height="52" fill="#e3cfae"/><rect x="${x+5}" y="-40" width="${w-10}" height="40" fill="${shop}"/>`;
  s+=`<rect x="${x+12}" y="-32" width="${w*.55}" height="28" fill="url(#win)" opacity=".85"/><rect x="${x+w*.72}" y="-32" width="${w*.16}" height="32" fill="#3a2520"/>`;
  for(let sx=x+5;sx<x+w-5;sx+=12) s+=`<path d="M${sx},-40 h12 v8 l-6,3 l-6,-3Z" fill="${Math.floor((sx-x)/12)%2?'#f6f2ee':shop}"/>`;
  s+=`<rect x="${x}" y="${-h}" width="${w}" height="${h}" fill="url(#wallsh)"/>`;
  return s;
}
let CITY='';{let x=-1700,k=0;while(x<1700){const w=170+rnd(k)*60,h=230+rnd(k+50)*60;CITY+=building(x,w,h,k%3,k+1);x+=w+3;k++;}}
let FAR='';{let x=-2200,k=0;while(x<2200){const w=120+rnd(k+9)*120,h=330+rnd(k+3)*220;FAR+=`<rect x="${x}" y="${-h}" width="${w}" height="${h}" fill="#9a6f9e"/><path d="M${x},${-h} L${x+w*.5},${-h-30} L${x+w},${-h}Z" fill="#8c6594"/>`;
  for(let j=0;j<12;j++){const wx=x+8+rnd(k*31+j)*(w-16),wy=-h+20+rnd(k*17+j)*(h-40);FAR+=`<rect x="${wx}" y="${wy}" width="5" height="7" fill="#ffd38a" opacity=".8"/>`;}
  x+=w+6;k++;}}
// ---------- dynamic pieces ----------
function car(x,y,col,rot=0,sc=1){return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${sc})" filter="url(#ds)">
<path d="M-30,-6 Q-31,-16 -22,-17 L-14,-17 L-7,-27 Q-5,-29 -2,-29 L10,-29 Q13,-29 15,-27 L21,-17 L27,-16 Q31,-15 31,-9 L31,-6Z" fill="${col}"/>
<path d="M-11,-18 L-5,-26 L2,-26 L2,-18Z M4,-18 L4,-26 L11,-26 L17,-18Z" fill="#bfe0ff" opacity=".9"/>
<rect x="-29" y="-14" width="59" height="2" fill="#fff" opacity=".35"/><circle cx="-18" cy="-5" r="5.5" fill="#15151a"/><circle cx="18" cy="-5" r="5.5" fill="#15151a"/>
<circle cx="-18" cy="-5" r="2.4" fill="#aaa"/><circle cx="18" cy="-5" r="2.4" fill="#aaa"/><rect x="27" y="-14" width="4" height="3" fill="#fff6c0"/></g>`}
function ped(x,y,ph,col,run){const a=Math.sin(ph)*(run?5:3);
 return `<g transform="translate(${x},${y})"><line x1="0" y1="-8" x2="${a}" y2="0" stroke="#2a2433" stroke-width="2.4" stroke-linecap="round"/><line x1="0" y1="-8" x2="${-a}" y2="0" stroke="#2a2433" stroke-width="2.4" stroke-linecap="round"/>
<rect x="-3" y="-17" width="6" height="10" rx="2" fill="${col}"/><circle cx="0" cy="-20" r="2.8" fill="#eab08c"/>${run?`<line x1="0" y1="-15" x2="${4+a}" y2="-20" stroke="${col}" stroke-width="2"/>`:''}</g>`}
function shoe(cx,y){const w=0.16*HM,h=0.1*HM;
 return `<g filter="url(#ds)"><path d="M${cx-w/2},${y} L${cx-w/2},${y-h*.55} Q${cx-w/2},${y-h} ${cx},${y-h} Q${cx+w/2},${y-h} ${cx+w/2},${y-h*.55} L${cx+w/2},${y}Z" fill="url(#shoe)"/>
<rect x="${cx-w/2-4}" y="${y-h*.2}" width="${w+8}" height="${h*.22}" rx="${h*.08}" fill="#d9dbe6"/><rect x="${cx-w/2-4}" y="${y-h*.05}" width="${w+8}" height="${h*.07}" fill="#9b9eb2"/>
${[0,1,2].map(k=>`<line x1="${cx-w*.18}" x2="${cx+w*.18}" y1="${y-h*.85+k*h*.13}" y2="${y-h*.8+k*h*.13}" stroke="#8d90a8" stroke-width="5" stroke-linecap="round"/>`).join('')}
<path d="M${cx-w*.38},${y-h*.35} Q${cx},${y-h*.5} ${cx+w*.38},${y-h*.35}" stroke="#c7cad8" stroke-width="5" fill="none"/></g>`}
function leg(cx,dy,blur){const w=0.155*HM, top=-0.9*HM+dy, bot=-0.09*HM+dy;
 return `<g ${blur?'filter="url(#mblur)"':''}><rect x="${cx-w/2}" y="${top}" width="${w}" height="${bot-top}" rx="30" fill="url(#jeans)"/>
<path d="M${cx-w*.2},${top+0.42*HM} q${w*.2},${12} ${w*.4},0" stroke="#24345e" stroke-width="5" fill="none" opacity=".7"/><path d="M${cx-w*.25},${top+0.47*HM} q${w*.25},${14} ${w*.5},0" stroke="#24345e" stroke-width="4" fill="none" opacity=".5"/>
<line x1="${cx+w*.3}" x2="${cx+w*.3}" y1="${top+20}" y2="${bot-10}" stroke="#d2a24a" stroke-width="3" stroke-dasharray="10 8" opacity=".55"/>
<rect x="${cx-w/2}" y="${bot-0.04*HM}" width="${w}" height="${0.04*HM}" rx="8" fill="#2a3a66"/>${shoe(cx,dy)}</g>`}
function flag(px,py,t){const fw=0.34*HM,fh=0.22*HM,cols=['#0055a4','#ffffff','#ef4135'];let s='';
 for(let j=0;j<3;j++){const pts=[];for(let k=0;k<=8;k++){const u=(j+k/8)/3,x=px-u*fw,wv=Math.sin(t*5-u*5)*u*0.05*HM;pts.push([x,py+wv]);}
  const top=pts.map(p=>p.join(',')).join(' '),bot=pts.slice().reverse().map(p=>[p[0],p[1]+fh].join(',')).join(' ');
  s+=`<polygon points="${top} ${bot}" fill="${cols[j]}"/>`;}
 const sh=[];for(let k=0;k<=24;k++){const u=k/24,x=px-u*fw,wv=Math.sin(t*5-u*5)*u*0.05*HM;sh.push([x,py+wv+fh*.5,Math.cos(t*5-u*5)]);}
 s+=sh.slice(0,-1).map((p,k)=>`<rect x="${p[0]-fw/24}" y="${p[1]-fh/2}" width="${fw/24+1}" height="${fh}" fill="${p[2]>0?'#fff':'#000'}" opacity="${Math.abs(p[2])*.12*(k/24)}"/>`).join('');
 return s}
function hero(t,dyR,blink,look){const c=FX-0.095*HM, L=FX-0.19*HM; let s='';
 s+=`<ellipse cx="${c}" cy="6" rx="${0.42*HM}" ry="40" fill="url(#shadow)"/>`;
 s+=leg(L,0,false);
 s+=`<rect x="${c-0.29*HM}" y="${-1.47*HM}" width="${0.58*HM}" height="${0.66*HM}" rx="${0.13*HM}" fill="url(#hood)"/><rect x="${c-0.29*HM}" y="${-1.47*HM}" width="${0.58*HM}" height="${0.66*HM}" rx="${0.13*HM}" fill="url(#hoodv)"/>`;
 s+=`<rect x="${c-0.29*HM}" y="${-0.88*HM}" width="${0.58*HM}" height="${0.07*HM}" rx="20" fill="#25284a"/>`;
 s+=`<path d="M${c-0.17*HM},${-1.08*HM} h${0.34*HM} l${-0.04*HM},${0.17*HM} h${-0.26*HM}Z" fill="#2a2d52" stroke="#1c1e38" stroke-width="4"/>`;
 s+=`<line x1="${c}" x2="${c}" y1="${-1.38*HM}" y2="${-0.9*HM}" stroke="#1c1e38" stroke-width="8"/>`;
 s+=`<line x1="${c-0.05*HM}" x2="${c-0.06*HM}" y1="${-1.42*HM}" y2="${-1.22*HM}" stroke="#e6e6f0" stroke-width="7" stroke-linecap="round"/><line x1="${c+0.05*HM}" x2="${c+0.06*HM}" y1="${-1.42*HM}" y2="${-1.24*HM}" stroke="#e6e6f0" stroke-width="7" stroke-linecap="round"/>`;
 s+=leg(FX,dyR,dyR<-30);
 // arms
 s+=`<path d="M${c+0.2*HM},${-1.42*HM} Q${c+0.33*HM},${-1.45*HM} ${c+0.36*HM},${-1.3*HM} L${c+0.37*HM},${-0.9*HM} Q${c+0.3*HM},${-0.86*HM} ${c+0.24*HM},${-0.9*HM} L${c+0.22*HM},${-1.25*HM}Z" fill="url(#hood)"/><circle cx="${c+0.3*HM}" cy="${-0.84*HM}" r="${0.055*HM}" fill="url(#skin)"/>`;
 const hx=c-0.33*HM,hy=-0.88*HM;
  s+=flag(hx,hy-0.64*HM,t);
 s+=`<path d="M${c-0.2*HM},${-1.42*HM} Q${c-0.33*HM},${-1.45*HM} ${c-0.37*HM},${-1.3*HM} L${hx-0.06*HM},${hy-0.02*HM} Q${hx},${hy+0.03*HM} ${hx+0.06*HM},${hy-0.03*HM} L${c-0.23*HM},${-1.25*HM}Z" fill="url(#hood)"/>`;
 s+=`<line x1="${hx}" y1="${hy+0.04*HM}" x2="${hx}" y2="${hy-0.66*HM}" stroke="#7a5638" stroke-width="18" stroke-linecap="round"/>`;
 s+=`<circle cx="${hx}" cy="${hy}" r="${0.055*HM}" fill="url(#skin)"/>`;
 // head
 const hc=-1.62*HM;
 s+=`<circle cx="${c}" cy="${hc}" r="${0.185*HM}" fill="url(#hood)"/><rect x="${c-0.045*HM}" y="${hc+0.1*HM}" width="${0.09*HM}" height="${0.08*HM}" fill="#c98a68"/>`;
 s+=`<ellipse cx="${c}" cy="${hc+0.01*HM}" rx="${0.125*HM}" ry="${0.14*HM}" fill="url(#skin)"/>`;
 s+=`<path d="M${c-0.13*HM},${hc-0.03*HM} Q${c-0.1*HM},${hc-0.16*HM} ${c},${hc-0.155*HM} Q${c+0.12*HM},${hc-0.15*HM} ${c+0.13*HM},${hc-0.02*HM} Q${c+0.06*HM},${hc-0.09*HM} ${c-0.02*HM},${hc-0.08*HM} Q${c-0.09*HM},${hc-0.08*HM} ${c-0.13*HM},${hc-0.03*HM}Z" fill="#3a2418"/>`;
 for(const sd of [-1,1]){const ex=c+sd*0.05*HM, ey=hc+0.005*HM;
   if(blink) s+=`<path d="M${ex-0.022*HM},${ey} q${0.022*HM},${0.012*HM} ${0.044*HM},0" stroke="#2a1a12" stroke-width="7" fill="none"/>`;
   else s+=`<ellipse cx="${ex}" cy="${ey}" rx="${0.026*HM}" ry="${0.03*HM}" fill="#fff"/><circle cx="${ex+look[0]*0.008*HM}" cy="${ey+look[1]*0.012*HM}" r="${0.016*HM}" fill="#24160f"/><circle cx="${ex+look[0]*0.008*HM-6}" cy="${ey+look[1]*0.012*HM-7}" r="5" fill="#fff"/>`;
   s+=`<path d="M${ex-0.03*HM},${ey-0.05*HM} q${0.03*HM},${-0.015*HM} ${0.06*HM},0" stroke="#3a2418" stroke-width="9" fill="none" stroke-linecap="round"/>`;}
 s+=`<ellipse cx="${c+0.075*HM}" cy="${hc+0.06*HM}" rx="${0.025*HM}" ry="${0.014*HM}" fill="#ff8f8f" opacity=".45"/><ellipse cx="${c-0.075*HM}" cy="${hc+0.06*HM}" rx="${0.025*HM}" ry="${0.014*HM}" fill="#ff8f8f" opacity=".45"/>`;
 s+=`<path d="M${c-0.04*HM},${hc+0.075*HM} Q${c},${hc+0.11*HM} ${c+0.04*HM},${hc+0.075*HM}" stroke="#7a2e2e" stroke-width="8" fill="none" stroke-linecap="round"/>`;
 // rim light (sun on the right)
 s+=`<rect x="${c+0.27*HM}" y="${-1.4*HM}" width="8" height="${0.5*HM}" rx="4" fill="#ffc28a" opacity=".55"/>`;
 return s}
function render(t){
  const imp=t-IMPACT;
  const shake=imp>0?Math.exp(-imp*3.2):0;
  const zo=ease((t-1.5)/3.2);
  const z=lerp(1.75,0.55,zo), cx=lerp(FX-30,-40,zo), gy=lerp(1520,1880,zo);
  const sx=Math.sin(t*61)*22*shake, sy=Math.cos(t*53)*16*shake;
  let s=DEFS+`<rect width="1080" height="1920" fill="url(#sky)"/><circle cx="880" cy="${1160-zo*300}" r="420" fill="url(#sun)"/>`;
  // clouds (screen space, slow)
  for(let k=0;k<5;k++){const x=(rnd(k)*1400+t*12*(1+k*.3))%1400-160,y=180+k*150;s+=`<g opacity=".55" filter="url(#b3)"><ellipse cx="${x}" cy="${y}" rx="${130+k*15}" ry="26" fill="#ffc6c0"/><ellipse cx="${x+60}" cy="${y-14}" rx="80" ry="24" fill="#ffd9cf"/></g>`;}
  s+=`<g transform="translate(${540+sx},${gy+sy}) scale(${z}) translate(${-cx},0)">`;
  // tower + far city with parallax-ish haze
  const TH=3500, ts=TH/TW.Hh;
  s+=`<image href="tower.png" x="${-720-TW.ox*ts}" y="${-TW.oy*ts}" width="${TW.w*ts}" height="${TW.h*ts}" filter="url(#tint)" opacity=".95"/>`;
  s+=`<g filter="url(#b1)">${FAR}</g><rect x="-3000" y="-1200" width="6000" height="1200" fill="url(#haze)"/>`;
  s+=CITY;
  s+=`<rect x="-3000" y="0" width="6000" height="24" fill="url(#walk)"/><rect x="-3000" y="24" width="6000" height="4" fill="#7d6f78"/>`;
  s+=`<rect x="-3000" y="28" width="6000" height="150" fill="url(#road)"/>`;
  for(let x=-3000;x<3000;x+=90) s+=`<rect x="${x}" y="100" width="45" height="4" fill="#efe6d8" opacity=".8"/>`;
  s+=`<rect x="-3000" y="178" width="6000" height="6" fill="#7d6f78"/><rect x="-3000" y="184" width="6000" height="1400" fill="url(#walk)"/>`;
  for(let x=-3000;x<3000;x+=60) s+=`<line x1="${x}" y1="184" x2="${x-30}" y2="260" stroke="#8d7d82" stroke-width="1.5" opacity=".6"/>`;
  // cracks
  if(imp>0){const cr=easeOut(imp/0.25);for(let k=0;k<11;k++){const a=(k/10)*Math.PI, L=(140+rnd(k)*260)*cr;let d=`M${FX},${FY}`;let px=FX,py=FY;for(let j=1;j<=5;j++){px=FX+Math.cos(a)*L*j/5+(rnd(k*9+j)-.5)*30;py=FY+Math.sin(a)*L*j/5*0.18+(rnd(k*5+j)-.5)*8;d+=` L${px},${py}`;}
    s+=`<path d="${d}" stroke="#1c1520" stroke-width="${4-k%3}" fill="none" opacity=".8"/>`;}}
  // back-lane cars + pedestrians
  const cars=[[-520,62,'#e04848'],[-260,62,'#3d8bd9'],[330,62,'#f1c232'],[620,62,'#46a86b'],[-700,62,'#e9e9ef']];
  for(const [x0,y0,col] of cars){let x=x0+(t*40)%2000*(x0>0?-0.2:0.2),y=y0,rot=0;const d=Math.abs(x-FX);
    if(imp>0&&d<500){const p=Math.max(0,1-d/500);const j=Math.max(0,Math.sin(Math.min(imp*5,Math.PI)))*120*p;y-=j;rot=(x>FX?1:-1)*j*0.6;x+=(x>FX?1:-1)*easeOut(imp)*120*p;}
    s+=car(x,y,col,rot);}
  for(let k=0;k<14;k++){const x0=-900+k*140+rnd(k)*60;let x=x0+Math.sin(t*.5+k)*20;const run=imp>0;
    if(run) x+=(x0>FX?1:-1)*imp*(110+rnd(k)*60);
    s+=ped(x,20,t*(run?14:6)+k,['#c0392b','#2e86c1','#f4d03f','#27ae60','#8e44ad'][k%5],run);
    if(run&&imp<1.2&&k%3==0) s+=`<text x="${x}" y="-12" font-family="IB" font-size="16" fill="#fff" text-anchor="middle">!</text>`;}
  // stomping foot timeline
  const dyR= t<IMPACT? -lerp(720,0,easeIn(t/IMPACT)) : 0;
  const preShadow=t<IMPACT?easeIn(t/IMPACT):1;
  s+=`<ellipse cx="${FX}" cy="${FY+6}" rx="${lerp(260,120,preShadow)}" ry="${lerp(60,26,preShadow)}" fill="url(#shadow)" opacity="${lerp(.25,1,preShadow)}"/>`;
  s+=`<g transform="translate(0,${FY})">${hero(t,dyR,(t%3.1)>2.95,[zo*0.2,lerp(0.3,1,zo)])}</g>`;
  // front lane cars
  for(const [x0,col] of [[-380,'#7d5ba6'],[560,'#e67e22'],[-900,'#1abc9c']]){let x=x0-(t*55),y=160,rot=0;const d=Math.abs(x-FX);
    if(imp>0&&d<450){const p=1-d/450;const j=Math.max(0,Math.sin(Math.min(imp*4,Math.PI)))*160*p;y-=j;rot=(x>FX?1:-1)*j*0.8;}
    s+=car(x,y,col,rot,1.15);}
  // dust + debris + shockwave
  if(imp>0){
    const rw=easeOut(imp/0.6)*900; s+=`<ellipse cx="${FX}" cy="${FY}" rx="${rw}" ry="${rw*.13}" fill="none" stroke="#fff4e0" stroke-width="${10*(1-clamp(imp/0.6))}" opacity="${1-clamp(imp/0.6)}"/>`;
    for(let k=0;k<46;k++){const a=Math.PI*(0.02+0.96*rnd(k)),sp=200+rnd(k+3)*520,life=clamp(imp/(1.6+rnd(k+7)*1.6));
      const x=FX+Math.cos(a)*sp*easeOut(life)*1.1,y=FY-Math.abs(Math.sin(a))*sp*0.35*easeOut(life),r=30+life*140*rnd(k+11)+20;
      s+=`<circle cx="${x}" cy="${y}" r="${r}" fill="url(#dust)" opacity="${(1-life)*0.95}"/>`;}
    for(let k=0;k<24;k++){const a=Math.PI*(0.1+0.8*rnd(k+40)),v=500+rnd(k+41)*500,tt=Math.min(imp,1.4);
      const x=FX+Math.cos(a)*v*tt*0.6,y=FY-Math.sin(a)*v*tt+900*tt*tt;if(y<FY+60) s+=`<rect x="${x}" y="${y}" width="${6+rnd(k)*8}" height="${5+rnd(k+1)*6}" fill="#6a5a5a" transform="rotate(${tt*500*rnd(k)} ${x} ${y})"/>`;}
  }
  // birds near the head when zoomed out
  if(zo>0.4){for(let k=0;k<6;k++){const bx=200+k*60+Math.sin(t+k)*40+t*30,by=-2150-k*40+Math.sin(t*2+k)*30,f=Math.sin(t*14+k)*14;
    s+=`<path d="M${bx-22},${by+f} Q${bx-10},${by-8} ${bx},${by} Q${bx+10},${by-8} ${bx+22},${by+f}" stroke="#2b1d3a" stroke-width="5" fill="none" opacity="${clamp((zo-0.4)*3)}"/>`;}}
  s+=`</g>`;
  // flash
  if(imp>0&&imp<0.25) s+=`<rect width="1080" height="1920" fill="#fff" opacity="${(1-imp/0.25)*0.55}"/>`;
  s+=`<rect width="1080" height="1920" fill="url(#vig)"/>`;
  // title
  if(t>0.85){const p=easeOut((t-0.85)/0.35),sc=lerp(0.3,1,p)*(1+0.04*Math.sin(t*5));
    s+=`<g transform="translate(540,250) scale(${sc})" font-family="IB" text-anchor="middle" paint-order="stroke" stroke="#120a1c" stroke-width="16" stroke-linejoin="round">
    <text y="0" font-size="74" fill="#fff">ET SI TU DEVENAIS</text><text y="100" font-size="92" fill="#ffd45a">100× PLUS GRAND ?</text></g>`;}
  SV.innerHTML=s;
}
render(0);

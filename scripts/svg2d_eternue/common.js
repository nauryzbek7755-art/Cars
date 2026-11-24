// ===== Et si tu étais seul sur Terre ? =====
function sky(id,t,sun=true){let s=`<rect width="1080" height="1920" fill="url(#${id})"/>`;
  if(sun) s+=`<circle cx="860" cy="330" r="260" fill="url(#sunG)"/>`;
  for(let k=0;k<5;k++){const x=(rnd(k+3)*1500+t*14*(1+k*.4))%1500-200,y=170+k*120,c=id==='skyGold'?'#ffd8d0':'#ffffff';
    s+=`<g opacity="${id==='skyNight'?0:.9}"><ellipse cx="${x}" cy="${y}" rx="${110+k*12}" ry="34" fill="${c}"/><ellipse cx="${x+55}" cy="${y-22}" rx="70" ry="34" fill="${c}"/><ellipse cx="${x-50}" cy="${y-10}" rx="55" ry="26" fill="${c}"/></g>`;}
  return s}
function stars(t){let s='';for(let k=0;k<90;k++){const x=rnd(k)*1080,y=rnd(k+200)*1000,tw=.5+.5*Math.sin(t*3+k);s+=`<circle cx="${x}" cy="${y}" r="${1+rnd(k+9)*2.2}" fill="#fff" opacity="${.35+.65*tw}"/>`;}
  return s+`<circle cx="820" cy="260" r="150" fill="url(#moonG)"/><circle cx="820" cy="260" r="62" fill="#f4f1ff"/><circle cx="800" cy="245" r="12" fill="#dcd8ee"/><circle cx="840" cy="282" r="8" fill="#dcd8ee"/>`}
// street backdrop: buildings across the road (ground at gy), road + front sidewalk
function streetBG(mode,off,grow,t,camx=0,gy=1150,z=1.9){
  let s=`<g transform="translate(${540-camx*z},${gy}) scale(${z})">${city(-900,900,mode,off,grow,3)}`;
  for(let x=-700;x<700;x+=230) s+=lamp(x+60,mode==='night'?(off>0.5?0:1):1,mode==='night');
  if(mode==='wild') for(let x=-700;x<700;x+=330) s+=tree(x+150,1.3,x);
  s+='</g>';
  const N=mode==='night';
  s+=`<rect x="0" y="${gy}" width="1080" height="${1920-gy}" fill="${N?'#1c1e3a':'url(#road)'}"/>`;
  s+=`<rect x="0" y="${gy}" width="1080" height="22" fill="${N?'#2c2f55':'url(#walk)'}"/>`;
  if(!N) for(let x=-200;x<1300;x+=160){const xx=x-((camx*1.3)%160);s+=`<rect x="${xx}" y="${gy+150}" width="90" height="10" fill="#f4efe6" opacity="${mode==='wild'?.35:.9}"/>`;}
  s+=`<rect x="0" y="1560" width="1080" height="360" fill="${N?'#262947':'url(#walk)'}"/><rect x="0" y="1556" width="1080" height="10" fill="${N?'#3a3d66':'#a89a90'}"/>`;
  for(let x=-100;x<1200;x+=120){const xx=x-((camx*2)%120);s+=`<line x1="${xx}" y1="1566" x2="${xx-60}" y2="1920" stroke="${N?'#1e2140':'#cbbdb2'}" stroke-width="3"/>`;}
  if(mode==='wild'){ // cracks + grass reclaiming
    for(let k=0;k<9;k++){const x=rnd(k)*1080,y=gy+40+rnd(k+5)*380;let d=`M${x},${y}`;for(let j=1;j<5;j++) d+=` L${x+(rnd(k*7+j)-.5)*140},${y+(rnd(k*3+j)-.3)*30}`;s+=`<path d="${d}" stroke="#3a3540" stroke-width="3" fill="none" opacity="${grow}"/>`;}
    for(let k=0;k<70;k++){const x=rnd(k+30)*1100-10,y=gy+10+rnd(k+80)*(1920-gy),h=(18+rnd(k)*40)*grow*(0.6+(y-gy)/700);s+=grassTuft(x,y,h,k,t);}
  }
  return s}
function grassTuft(x,y,h,k,t){const sw=Math.sin(t*2+k)*4;let s='';for(let j=-2;j<=2;j++) s+=`<path d="M${x+j*5},${y} Q${x+j*7+sw},${y-h*.6} ${x+j*10+sw*1.5},${y-h}" stroke="${j%2?'#4cae38':'#2f8a2a'}" stroke-width="5" fill="none" stroke-linecap="round"/>`;return s}
function papers(t){let s='';for(let k=0;k<4;k++){const p=((t*0.35+k*0.27)%1),x=1150-p*1300,y=1500-Math.sin(p*9+k)*60-k*40,r=p*720*(k%2?1:-1);s+=`<rect x="${x}" y="${y}" width="46" height="34" fill="#f8f4ea" stroke="#bbb" stroke-width="2" transform="rotate(${r} ${x+23} ${y+17})"/>`;}return s}
function arcTriomphe(x,base,h){const w=h*0.88,L=x-w/2,top=base-h;let s=`<g filter="url(#b2)" opacity=".95">`;
  s+=`<rect x="${L}" y="${top}" width="${w}" height="${h}" fill="url(#stoneA)"/>`;
  const aw=w*0.34,ah=h*0.62;s+=`<path d="M${x-aw/2},${base} L${x-aw/2},${base-ah+aw/2} A${aw/2},${aw/2} 0 0 1 ${x+aw/2},${base-ah+aw/2} L${x+aw/2},${base}Z" fill="#8fb8e6"/>`;
  s+=`<rect x="${L}" y="${top}" width="${w}" height="${h*0.14}" fill="#e9d5b2"/><rect x="${L-6}" y="${top+h*0.14}" width="${w+12}" height="${h*0.03}" fill="#d1b68e"/>`;
  for(const sd of [-1,1]){const px=x+sd*w*0.33;s+=`<rect x="${px-w*0.1}" y="${base-h*0.55}" width="${w*0.2}" height="${h*0.28}" fill="#dcc4a0"/><rect x="${px-w*0.08}" y="${base-h*0.53}" width="${w*0.16}" height="${h*0.24}" fill="#cbb08a"/>`;}
  for(let k=0;k<14;k++) s+=`<rect x="${L+w*k/14+3}" y="${top+h*0.04}" width="${w/14-6}" height="${h*0.06}" fill="#d8c19c"/>`;
  return s+`<rect x="${L}" y="${top}" width="${w}" height="${h}" fill="url(#wallsh)"/></g>`}
function wheel(wx,t){return `<g transform="translate(${wx},-78)"><circle r="80" fill="#121218"/><circle r="72" fill="#22222a"/><circle r="56" fill="#cfd4de"/><circle r="52" fill="#9aa2b2"/>
<g transform="rotate(${t*1100})">${[0,72,144,216,288].map(a=>`<path d="M-7,-8 L-11,-48 L11,-48 L7,-8Z" fill="#e8ecf3" transform="rotate(${a})"/>`).join('')}</g>
<circle r="52" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="4"/><rect x="18" y="-30" width="16" height="30" rx="5" fill="#e23a3a"/><circle r="12" fill="#5a6070"/><circle r="5" fill="#cfd4de"/></g>`}
function convertible(x,y,s_,t,heroSVG=''){const b=Math.sin(t*28)*1.5;
 const body="M-500,-62 Q-512,-110 -500,-168 Q-492,-196 -455,-202 L-150,-212 L230,-210 Q330,-206 440,-180 Q500,-166 512,-128 Q520,-90 512,-62 L415,-62 A92,92 0 0 0 245,-62 L-235,-62 A92,92 0 0 0 -405,-62Z";
 return `<g transform="translate(${x},${y+b}) scale(${s_})">
<ellipse cx="0" cy="4" rx="560" ry="26" fill="#000" opacity=".35" filter="url(#b5)"/>
<rect x="-110" y="-320" width="70" height="120" rx="30" fill="#c98b4e"/><rect x="-100" y="-310" width="50" height="40" rx="18" fill="#dba06a"/>
${heroSVG}
<path d="${body}" fill="url(#carRed)"/>
<path d="M-490,-150 Q-300,-178 -60,-176 L240,-174 Q380,-170 480,-140" stroke="#ff9a9e" stroke-width="7" fill="none" stroke-linecap="round" opacity=".8"/>
<path d="M-470,-120 Q-200,-130 60,-128 Q300,-126 500,-100" stroke="#8c0d1a" stroke-width="3" fill="none" opacity=".6"/>
<path d="M-455,-202 L-150,-212 L230,-210 Q330,-206 440,-180" stroke="#ffd0d2" stroke-width="4" fill="none" opacity=".7"/>
<line x1="-40" y1="-206" x2="-38" y2="-70" stroke="#8c0d1a" stroke-width="3"/><line x1="225" y1="-206" x2="228" y2="-75" stroke="#8c0d1a" stroke-width="3"/>
<rect x="150" y="-170" width="46" height="9" rx="4" fill="#e8ecf3"/>
<path d="M232,-212 L140,-335 L156,-338 L250,-214Z" fill="#2a2d38"/><path d="M226,-214 L150,-318 L168,-320 L240,-214Z" fill="url(#glass)" opacity=".75"/>
<path d="M200,-226 q24,-10 30,4 l-22,6Z" fill="#c21e28" stroke="#7a1018" stroke-width="2"/>
<rect x="-440" y="-80" width="880" height="10" rx="5" fill="#e8ecf3"/><rect x="-440" y="-80" width="880" height="3" fill="#fff"/>
<path d="M470,-160 Q505,-150 508,-128 L478,-126 Q462,-140 470,-160Z" fill="#fff6c8"/><circle cx="488" cy="-140" r="10" fill="#fff"/>
<rect x="-506" y="-176" width="16" height="34" rx="6" fill="#ff2e3b"/><rect x="-506" y="-176" width="16" height="10" rx="4" fill="#ffb0b5"/>
<rect x="-500" y="-60" width="70" height="14" rx="7" fill="#d9dde6"/><rect x="430" y="-62" width="85" height="14" rx="7" fill="#d9dde6"/>
<ellipse cx="-468" cy="-48" rx="16" ry="8" fill="#555"/>
${wheel(-320,t)}${wheel(330,t)}
<path d="M-60,-300 Q200,-360 420,-250" stroke="#fff" stroke-width="10" fill="none" opacity=".0"/>
</g>`}
function avenueTrees(t,speed,gy){let s='';const sp=t*speed;for(let k=-2;k<9;k++){const x=((k*260-sp)%(260*9)+260*9)%(260*9)-260;s+=`<g transform="translate(${x},${gy})">${tree(0,1.6,k+40)}</g>`;}return s}
function speedLines(t,y0,y1){let s='';for(let k=0;k<14;k++){const y=y0+rnd(k)*(y1-y0),x=((rnd(k+3)*1400-t*2600)%1400+1400)%1400-200;s+=`<rect x="${x}" y="${y}" width="${160+rnd(k)*200}" height="4" rx="2" fill="#fff" opacity=".7"/>`;}return s}
function louvre(gy){let s='';const L=-40,W=1160,H=330;
  s+=`<rect x="${L}" y="${gy-H}" width="${W}" height="${H}" fill="url(#stoneA)"/>`;
  s+=`<path d="M${L},${gy-H} L${L+40},${gy-H-90} L${L+W-40},${gy-H-90} L${L+W},${gy-H}Z" fill="#46537e"/>`;
  for(const px of [L+40,540,L+W-160]) s+=`<rect x="${px-60}" y="${gy-H-40}" width="160" height="${H+40}" fill="#f6e7cc"/><path d="M${px-70},${gy-H-40} L${px+20},${gy-H-170} L${px+110},${gy-H-40}Z" fill="#3c4870"/>`;
  for(let r=0;r<3;r++) for(let k=0;k<22;k++){const wx=L+20+k*52,wy=gy-H+40+r*95;s+=`<rect x="${wx}" y="${wy}" width="22" height="52" rx="10" fill="url(#winD)"/><rect x="${wx-8}" y="${wy-8}" width="4" height="70" fill="#e2cfaa"/>`;}
  return s+`<rect x="${L}" y="${gy-H}" width="${W}" height="${H}" fill="url(#wallsh)"/>`}
function pyramid(cx,base,h){const w=h*1.55;let s=`<polygon points="${cx-w/2},${base} ${cx},${base-h} ${cx+w/2},${base}" fill="url(#glass)" stroke="#e8f4ff" stroke-width="3"/>`;
  for(let k=1;k<10;k++){const u=k/10;s+=`<line x1="${cx-w/2*(1-u)}" y1="${base-h*u}" x2="${cx+w/2*(1-u)}" y2="${base-h*u}" stroke="#ffffff" stroke-opacity=".55" stroke-width="2"/>`;
    s+=`<line x1="${cx-w/2+w*u/2}" y1="${base}" x2="${cx-w/2+w*u/2+ (cx-(cx-w/2+w*u/2))}" y2="${base-h}" stroke="#ffffff" stroke-opacity=".35" stroke-width="1.5"/>`;}
  s+=`<polygon points="${cx},${base-h} ${cx+w/2},${base} ${cx+w*0.1},${base}" fill="#ffffff" opacity=".18"/>`;return s}
function deer(x,y,s_,ph){const l=Math.sin(ph)*12;return `<g transform="translate(${x},${y}) scale(${s_})"><ellipse cx="0" cy="-90" rx="62" ry="30" fill="#b36a32"/><ellipse cx="0" cy="-80" rx="40" ry="14" fill="#e8c08a"/>
${[[-40,l],[-25,-l],[35,-l],[48,l]].map(([lx,a])=>`<line x1="${lx}" y1="-80" x2="${lx+a}" y2="0" stroke="#8a4f22" stroke-width="9" stroke-linecap="round"/>`).join('')}
<path d="M48,-105 L72,-150 L88,-146 L70,-100Z" fill="#b36a32"/><ellipse cx="88" cy="-156" rx="22" ry="14" fill="#b36a32"/><circle cx="104" cy="-152" r="4" fill="#222"/><circle cx="90" cy="-160" r="3" fill="#111"/>
<path d="M80,-168 l-6,-30 m3,14 l-12,-6 M92,-168 l6,-30 m-3,14 l12,-8" stroke="#6a4020" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M-60,-100 l-14,-8 l4,14Z" fill="#fff"/></g>`}
function butterfly(x,y,ph,c){const f=Math.abs(Math.sin(ph))*1;return `<g transform="translate(${x},${y})"><ellipse cx="-8" cy="0" rx="${10*f+2}" ry="8" fill="${c}"/><ellipse cx="8" cy="0" rx="${10*f+2}" ry="8" fill="${c}"/><rect x="-1.5" y="-7" width="3" height="14" fill="#222"/></g>`}
function towerImg(cx,base,H,rustK){const ts=H/2600;const a=`x="${cx-670*ts}" y="${base-2786*ts}" width="${1340*ts}" height="${2796*ts}"`;
  return `<image href="tower.png" ${a} filter="url(#tTower)"/>`+(rustK>0?`<image href="tower.png" ${a} filter="url(#tRust)" opacity="${rustK}"/>`:'')}

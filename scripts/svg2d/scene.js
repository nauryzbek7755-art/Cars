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
function convertible(x,y,s_,t){const b=Math.sin(t*30)*1.5;return `<g transform="translate(${x},${y+b}) scale(${s_})" filter="url(#ds)">
<path d="M-260,-40 Q-262,-110 -200,-118 L-90,-122 L-40,-128 L60,-128 L150,-120 Q250,-112 262,-70 L264,-40Z" fill="url(#carRed)"/>
<path d="M-60,-128 L-20,-190 L-8,-190 L-40,-128Z" fill="#30343f"/><path d="M-54,-130 L-20,-184 L-10,-184 L-42,-130Z" fill="url(#glass)" opacity=".7"/>
<rect x="-250" y="-96" width="500" height="8" fill="#fff" opacity=".35"/><rect x="230" y="-100" width="30" height="14" rx="4" fill="#fff7c0"/><rect x="-262" y="-98" width="18" height="12" rx="3" fill="#ff3b3b"/>
${[-160,160].map(wx=>`<g transform="translate(${wx},-38) rotate(${t*900})"><circle r="52" fill="#16161c"/><circle r="30" fill="#c9cdd8"/>${[0,72,144,216,288].map(a=>`<rect x="-4" y="-28" width="8" height="26" fill="#8a8fa0" transform="rotate(${a})"/>`).join('')}<circle r="8" fill="#555"/></g>`).join('')}
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
// ===== frame =====
function render(t){
  let i=0;for(let k=0;k<S.length-1;k++) if(t>=S[k]-0.12) i=k; const lt=t-S[i];
  const blink=(t%3.3)>3.18;
  let s=DEFS, cam='';
  const kick=1+0.05*Math.exp(-Math.max(0,lt)*6);   // punch-in at every cut
  if(i===0){
    s+=sky('skyDay',t)+streetBG('day',0,0,t,Math.sin(t*.4)*10);
    s+=`<g transform="translate(0,0)">${abandonedCar(0).replace('translate(0,0)','translate(830,1440) scale(1.25)')}</g>`;
    s+=papers(t);
    // pigeons burst from the ground at t=0
    for(let k=0;k<9;k++){const p=Math.max(0,t-0.05*k),x=260+k*70+p*(k%2?260:-220),y=1620-p*520-p*p*120+Math.sin(k)*20;s+=pigeon(x,y,t*28+k,1.5,p>0?1:0);}
    const run=easeOut(t/0.9),hx=lerp(1250,540,run);
    s+=hero(hx,1820,380,{t,walk:t<0.9?t*18:null,mood:t<1.2?'happy':'wow',look:t<1.2?[-1,0]:[Math.sin((t-1.2)*3.5)*1.2,0],blink,lean:t<0.9?-8:0});
    const p=back((t-0.15)/0.4);
    if(p>0) s+=bigText([['ET SI TU ÉTAIS',80,'#ffffff'],['SEUL SUR TERRE ?',104,'#ffd45a']],250,p);
  } else if(i===1){
    s+=sky('skyDay',t)+arcTriomphe(540,1180,560);
    s+=`<rect x="0" y="1180" width="1080" height="740" fill="url(#road)"/><rect x="0" y="1180" width="1080" height="14" fill="#d9cfc4"/>`;
    s+=avenueTrees(t,520,1260);
    for(let k=0;k<8;k++){const x=((k*190-t*1900)%1520+1520)%1520-200;s+=`<rect x="${x}" y="1640" width="110" height="14" fill="#f4efe6"/>`;}
    s+=speedLines(t,1300,1800);
    const hx=470,hy=1975;
    s+=hero(hx,hy,330,{t,sit:true,mood:'happy',armL:150+Math.sin(t*8)*10,armR:-150-Math.sin(t*8)*10,look:[0,-0.6],blink});
    s+=convertible(540,1820,1.05,t);
    s+=bigText([['PARIS EST À TOI !',96,'#ffd45a']],330,back((t-S[1]-0.6)/0.4));
  } else if(i===2||i===3){
    s+=sky('skyGold',t)+louvre(1250);
    s+=`<rect x="0" y="1250" width="1080" height="670" fill="#e9dcc8"/>`;for(let k=0;k<12;k++) s+=`<line x1="${k*100-40}" y1="1250" x2="${(k*100-540)*2.4+540}" y2="1920" stroke="#d6c6ae" stroke-width="3"/>`;
    s+=pyramid(540,1330,330);
    for(const fx of [170,910]) s+=`<ellipse cx="${fx}" cy="1360" rx="120" ry="26" fill="#7cc4f0"/><ellipse cx="${fx}" cy="1360" rx="120" ry="26" fill="none" stroke="#c9b48e" stroke-width="8"/>${[0,1,2].map(k=>`<path d="M${fx-20+k*20},1352 q0,-${40+20*Math.sin(t*6+k)} ${10},-${60}" stroke="#d8f2ff" stroke-width="5" fill="none" opacity=".8"/>`).join('')}`;
    const lt2=t-S[2], jp=i===2?Math.abs(Math.sin(lt2*4.2))*120:0, sq=i===2?Math.max(0,1-Math.abs(Math.sin(lt2*4.2))*6)*0.8:0;
    s+=hero(540,1820,370,{t,jump:jp,squash:sq,mood:'happy',armL:i===2?140:10,armR:i===2?-140:-140+Math.sin(t*9)*25,blink,look:[0,-0.3]});
    if(i===2){for(let k=0;k<18;k++){const p=((lt2*0.8+rnd(k))%1),x=rnd(k+5)*1080,y=200+p*1500;s+=`<rect x="${x}" y="${y}" width="14" height="8" fill="${['#ffd45a','#ff4d7a','#4cc3ff','#7fd34e'][k%4]}" transform="rotate(${p*720+k*40} ${x} ${y})"/>`;}
      s+=bigText([['LE LOUVRE',100,'#ffffff'],['RIEN QUE POUR TOI',70,'#ffd45a']],300,back((lt2-0.1)/0.4));}
    else{s+=button('+ Abonne-toi',760,lt);const cp=easeOut((lt-0.35)/0.4);s+=cursor(lerp(900,640,cp),lerp(1100,790,cp),lt>0.8&&lt<1.0);}
  } else if(i===4){
    const off=ease((t-11.15)/0.9);
    s+=`<rect width="1080" height="1920" fill="url(#skyNight)"/>`+stars(t)+streetBG('night',off,0,t,0);
    const fl=t>11.1&&t<11.5?(Math.sin(t*90)>0?1:0.3):1;
    if(off>0.9) s+=`<rect width="1080" height="1920" fill="#000" opacity=".25"/>`;
    const sweep=Math.sin(lt*1.6)*25;
    s+=`<g transform="rotate(${sweep} 700 1350)"><polygon points="700,1350 1250,1050 1250,1650" fill="url(#beam)" opacity="${off>0.5?0.9:0.35}"/></g>`;
    s+=hero(520,1820,380,{t,mood:off>0.3?'scared':'neutral',armR:-75,flash:true,look:[off>0.3?Math.sin(t*5):0.8,0],blink:off<0.3&&blink});
    if(off>0.2) s+=bigText([['BLACKOUT',120,'#ff5a5a']],330,back((t-11.3)/0.35)*(fl));
  } else if(i===5){
    const g=ease(lt/1.6);
    s+=sky('skyWild',t)+streetBG('wild',0,g,t,lt*30);
    for(let k=0;k<6;k++) s+=butterfly(200+k*150+Math.sin(t*2+k)*60,1200+Math.cos(t*1.7+k)*120-k*40,t*18+k,['#ffd45a','#ff7ab0','#7fd3ff'][k%3]);
    const dx=lerp(1300,-300,clamp((lt-0.6)/2.4));s+=deer(dx,1480,1.25,t*10);
    s+=hero(540,1830,370,{t,walk:t*9,mood:'wow',bag:true,look:[-0.6,-0.2],blink});
    for(let k=0;k<26;k++){const x=rnd(k+300)*1080,y=1800+rnd(k+310)*130;s+=grassTuft(x,y,(50+rnd(k)*50)*g,k,t);}
    s+=bigText([['UN AN PLUS TARD…',90,'#ffffff']],300,back((lt-0.05)/0.4));
  } else {
    const end=i===7, lt6=t-S[6];
    const rustK=ease((t-17.6)/0.9);
    const tilt=end?0:lerp(-380,0,ease(lt6/2.6));
    s+=sky(end?'skyGold':'skyWild',t);
    s+=`<g transform="translate(0,${-tilt*0.6})">${towerImg(540,1500,1500,rustK)}</g>`;
    // vines at tower base
    s+=`<g transform="translate(0,${-tilt*0.6})">`;for(let k=0;k<16;k++){const vx=300+k*32,vh=(160+rnd(k)*260)*clamp(lt6/1.5+.3);let d=`M${vx},1500`;for(let j=1;j<=8;j++) d+=` Q${vx+(j%2?14:-14)},${1500-vh*(j-.5)/8} ${vx},${1500-vh*j/8}`;s+=`<path d="${d}" stroke="#2f7a28" stroke-width="5" fill="none"/>`;for(let j=0;j<8;j++) s+=`<ellipse cx="${vx+(j%2?8:-8)}" cy="${1500-vh*j/8}" rx="10" ry="6" fill="#4cae38"/>`;}s+='</g>';
    s+=`<rect x="0" y="${1500-tilt*0.6}" width="1080" height="${420+tilt}" fill="url(#grass)"/>`;
    for(let k=0;k<60;k++){const x=rnd(k+500)*1100-10,y=1520+rnd(k+510)*400-tilt*0.6;s+=grassTuft(x,y,30+rnd(k)*50,k,t);}
    for(let k=0;k<14;k++){const x=rnd(k+700)*1080,y=1560+rnd(k+720)*330;s+=`<circle cx="${x}" cy="${y}" r="7" fill="${['#ffffff','#ffd45a','#ff7ab0'][k%3]}"/>`;}
    if(!end) s+=hero(560,1850-tilt*0.2,300,{t,mood:'wow',look:[0,-1.2],blink,tilt:-6});
    else{const sh=Math.sin((t-S[7])*3);s+=hero(540,1840,330,{t,mood:'happy',armL:45+10*sh,armR:-55-12*sh,look:[0,0],blink});}
    if(!end&&rustK>0.1) s+=bigText([['ELLE ROUILLE…',100,'#ff8a3a']],330,back((t-17.8)/0.4));
    if(end){s+=bigText([['ET TOI,',90,'#ffffff'],['TU FERAIS QUOI',90,'#ffd45a'],['EN PREMIER ?',90,'#ffd45a']],240,back((t-S[7])/0.4));s+=button('Commente !',960,t-S[7]-0.8);}
  }
  // cut flash + vignette + fades
  const dt=t-S[i]; if(i>0&&dt<0.1) s+=`<rect width="1080" height="1920" fill="#fff" opacity="${(1-dt/0.1)*0.6}"/>`;
  s+=`<rect width="1080" height="1920" fill="url(#vig)"/>`;
  if(t>T-0.35) s+=`<rect width="1080" height="1920" fill="#000" opacity="${(t-(T-0.35))/0.35}"/>`;
  SV.innerHTML=`<g transform="translate(540,960) scale(${kick}) translate(-540,-960)">${s}</g>`;
}
render(0);

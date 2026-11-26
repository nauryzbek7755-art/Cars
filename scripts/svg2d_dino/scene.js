// ===== Et si les dinosaures revenaient à Paris ? =====
var SNOW=0;
const DD=`<linearGradient id="rexG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5fa04a"/><stop offset="1" stop-color="#2f6a2a"/></linearGradient>
<linearGradient id="rexB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d8d29a"/><stop offset="1" stop-color="#b8b070"/></linearGradient>
<linearGradient id="brachG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a9ac8"/><stop offset="1" stop-color="#4a6a98"/></linearGradient>
<linearGradient id="pterG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c87a4a"/><stop offset="1" stop-color="#8a4a2a"/></linearGradient>`;
// T-Rex, side view facing LEFT. x,y = feet; s = scale (~ height 600*s); jaw 0..1 open; walk phase
function trex(x,y,s,o={}){const t=o.t||0,jaw=o.jaw||0,w=o.walk;const lA=w!=null?Math.sin(w)*18:0,lB=-lA, bob=w!=null?Math.abs(Math.sin(w))*10:0;
  let g=`<g transform="translate(${x},${y-bob*s}) scale(${s})">`;
  g+=`<ellipse cx="40" cy="${8+bob}" rx="320" ry="30" fill="#000" opacity=".3"/>`;
  // far leg
  g+=`<g transform="rotate(${lB} 80 -330)"><path d="M40,-340 Q120,-260 90,-120 L70,-10 L150,-10 L150,-30 L110,-40 L130,-130 Q160,-280 110,-360Z" fill="#2f5a26"/></g>`;
  // tail + body
  g+=`<path d="M-40,-470 Q120,-560 300,-470 Q520,-420 720,-380 Q560,-330 320,-300 Q160,-250 20,-290 Q-80,-330 -40,-470Z" fill="url(#rexG)"/>`;
  g+=`<path d="M-30,-330 Q120,-270 300,-310 Q160,-250 20,-290Z" fill="url(#rexB)"/>`;
  for(let k=0;k<7;k++) g+=`<path d="M${60+k*70},${-520+k*12} q20,30 0,60" stroke="#2a5a22" stroke-width="12" fill="none" opacity=".55"/>`;
  // neck + head
  g+=`<path d="M-10,-470 Q-80,-560 -150,-580 L-120,-430 Q-60,-380 -20,-330Z" fill="url(#rexG)"/>`;
  const jy=jaw*40, ja=jaw*28;
  g+=`<g transform="rotate(${ja} -170 -560)"><path d="M-170,-560 L-400,-540 Q-420,-520 -400,-505 L-170,-520Z" fill="#4f8a3a"/>${Array.from({length:8},(_,k)=>`<path d="M${-380+k*26},-538 l9,-18 l9,18Z" fill="#fff"/>`).join('')}</g>`;
  if(jaw>0.05) g+=`<path d="M-170,-565 L-395,-560 L-395,-545 L-170,-530Z" fill="#7a1f2a"/>`;
  g+=`<path d="M-120,-640 Q-220,-660 -400,-610 Q-440,-580 -410,-560 L-170,-560 Q-110,-570 -100,-610Z" fill="url(#rexG)"/>`;
  g+=Array.from({length:9},(_,k)=>`<path d="M${-395+k*25},-562 l9,20 l9,-20Z" fill="#fff"/>`).join('');
  g+=`<ellipse cx="-230" cy="-618" rx="22" ry="16" fill="#ffd21f"/><ellipse cx="-230" cy="-618" rx="6" ry="14" fill="#111"/><path d="M-260,-640 L-200,-632" stroke="#1f4a1a" stroke-width="10" stroke-linecap="round"/><ellipse cx="-385" cy="-602" rx="10" ry="6" fill="#1f3a18"/>`;
  // tiny arms
  const aa=Math.sin(t*6)*10;g+=`<path d="M-80,-420 Q-130,${-400+aa} -150,${-380+aa}" stroke="#3f7a32" stroke-width="22" fill="none" stroke-linecap="round"/><path d="M-152,${-378+aa} l-14,8 M-152,${-378+aa} l-10,14" stroke="#eee" stroke-width="5"/>`;
  // near leg
  g+=`<g transform="rotate(${lA} 60 -330)"><path d="M10,-360 Q110,-280 70,-120 L50,-10 L140,-10 L140,-30 L95,-40 L115,-130 Q150,-290 90,-380Z" fill="#3f7a32"/><path d="M50,-12 l-16,10 M80,-12 l-6,14 M110,-12 l6,14" stroke="#eee" stroke-width="6"/></g>`;
  return g+`</g>`}
function pteranodon(x,y,s,ph){const f=Math.sin(ph);return `<g transform="translate(${x},${y}) scale(${s})"><path d="M0,0 L-160,${-60-f*70} L-60,10Z" fill="url(#pterG)"/><path d="M0,0 L160,${-60-f*70} L60,10Z" fill="url(#pterG)"/>
<ellipse cx="0" cy="8" rx="50" ry="20" fill="#a85a3a"/><path d="M-30,-4 L-110,-6 L-30,14Z" fill="#e0b060"/><path d="M-10,-10 L50,-40 L20,-2Z" fill="#a85a3a"/><circle cx="-22" cy="0" r="5" fill="#111"/></g>`}
function brachio(x,y,s,t){const nk=Math.sin(t*1.2)*6;return `<g transform="translate(${x},${y}) scale(${s})"><ellipse cx="0" cy="8" rx="380" ry="30" fill="#000" opacity=".25"/>
${[-180,-80,90,190].map((lx,k)=>`<rect x="${lx-34}" y="-260" width="68" height="260" rx="30" fill="${k%2?'#4a6a98':'#3a5a88'}"/>`).join('')}
<path d="M-320,-300 Q-420,-260 -520,-220 Q-400,-230 -260,-240Z" fill="url(#brachG)"/><ellipse cx="0" cy="-330" rx="300" ry="150" fill="url(#brachG)"/><ellipse cx="20" cy="-260" rx="220" ry="60" fill="#9ab4d8" opacity=".5"/>
<path d="M200,-400 Q${300+nk},-900 ${340+nk},-1260 L${410+nk},-1250 Q${360+nk},-880 290,-360Z" fill="url(#brachG)"/>
<ellipse cx="${400+nk}" cy="-1280" rx="90" ry="50" fill="#5a7ab0"/><circle cx="${430+nk}" cy="-1296" r="9" fill="#111"/><path d="M${460+nk},-1268 q20,10 26,-4" stroke="#2a3a58" stroke-width="5" fill="none"/></g>`}
function ebike(x,y,s,t){return `<g transform="translate(${x},${y}) scale(${s})"><g transform="translate(-150,-60) rotate(${t*900})"><circle r="70" fill="none" stroke="#1c1c22" stroke-width="16"/>${[0,45,90,135].map(a=>`<line x1="-66" y1="0" x2="66" y2="0" stroke="#aaa" stroke-width="3" transform="rotate(${a})"/>`).join('')}</g>
<g transform="translate(160,-60) rotate(${t*900})"><circle r="70" fill="none" stroke="#1c1c22" stroke-width="16"/>${[0,45,90,135].map(a=>`<line x1="-66" y1="0" x2="66" y2="0" stroke="#aaa" stroke-width="3" transform="rotate(${a})"/>`).join('')}</g>
<path d="M-150,-60 L-20,-60 L60,-200 L-60,-200Z M60,-200 L160,-60 M-60,-200 L-90,-250 M60,-200 L80,-280" stroke="#00b4d8" stroke-width="16" fill="none" stroke-linejoin="round" stroke-linecap="round"/><rect x="-60" y="-170" width="90" height="40" rx="10" fill="#1c1c22"/><rect x="-120" y="-268" width="80" height="20" rx="10" fill="#1c1c22"/><path d="M80,-280 l50,-10" stroke="#1c1c22" stroke-width="12" stroke-linecap="round"/></g>`}
function champs(t,scroll){let s=sky('skyDay',t)+arcTriomphe(540,1180,520);
  s+=`<rect x="0" y="1180" width="1080" height="740" fill="url(#road)"/><rect x="0" y="1180" width="1080" height="14" fill="#d9cfc4"/>`;
  s+=avenueTrees(t,scroll,1260);
  for(let k=0;k<8;k++){const x=((k*190-t*scroll*3.5)%1520+1520)%1520-200;s+=`<rect x="${x}" y="1640" width="110" height="14" fill="#f4efe6"/>`;}
  return s}
function render(t){
  let i=0;for(let k=0;k<S.length-1;k++) if(t>=S[k]-0.12) i=k; const lt=t-S[i];
  const blink=(t%3.1)>2.98; let s=DEFS.replace('</defs>',DD+'</defs>'); let shake=0;
  if(i===0){
    s+=champs(t,0);
    const rx=lerp(1500,760,easeOut(t/1.0)), roar=t>1.0&&t<2.4?Math.min(1,(t-1.0)*4):0;
    shake=Math.abs(Math.sin(t*9))>0.92?0.5:0; if(roar>0) shake=0.35;
    // car flips
    const cp=clamp((t-0.6)/1.2); s+=`<g transform="translate(${lerp(560,250,cp)},${1560-Math.sin(cp*Math.PI)*420}) rotate(${-cp*300}) scale(1.4)">${abandonedCar(0)}</g>`;
    s+=trex(rx,1700,1.15,{t,walk:t<1.0?t*10:null,jaw:roar});
    s+=hero(lerp(380,180,clamp((t-0.4)/1.5)),1850,300,{t,mood:'scared',walk:t*14,look:[1,0],lean:-6});
    if(roar>0) for(let k=0;k<4;k++){const p=((t*2+k*0.25)%1);s+=`<path d="M${rx-480*1.15-p*200},${1700-560*1.15+(k-1.5)*40} q-30,-20 -60,0" stroke="#fff" stroke-width="8" fill="none" opacity="${1-p}"/>`;}
    s+=bigText([["UN T-REX",110,'#ffffff'],["À PARIS !",120,'#ff5a5a']],250,back((t-0.1)/0.3));
  } else if(i===1){
    // close-up jaws on a car
    s+=champs(t,0)+`<rect width="1080" height="1920" fill="#000" opacity=".15"/>`;
    const bite=Math.max(0,Math.sin(lt*3.2)), crunch=bite<0.15&&lt>0.6;
    s+=`<g transform="translate(560,1240) scale(1.3)">${abandonedCar(0)}</g>`;
    s+=trex(1450,2500,2.5,{t,jaw:bite});
    if(crunch){shake=0.5;s+=bigText([["CRUNCH !",110,'#ffd45a']],1500,1);}
    s+=bigText([["MORSURE",96,'#ffffff'],["LA + PUISSANTE",96,'#ff5a5a']],230,back((lt-0.6)/0.3));
    s+=bigText([["DE L'HISTOIRE",70,'#ffffff']],470,back((lt-2.0)/0.3));
  } else if(i===2||i===3){
    s+=champs(t,520)+speedLines(t,1300,1800);
    const back_=lerp(0,-120,clamp((t-S[2])/3));
    s+=trex(1010+back_*-1,1830,0.78,{t,walk:t*9,jaw:0.3+0.3*Math.sin(t*5)});
    const K=250; s+=hero(470,1545+0.8*K,K,{t,sit:true,mood:'happy',look:[1,0],armL:-20,armR:-40,blink});
    s+=ebike(500,1830,1.0,t);
    if(i===2){s+=`<g transform="translate(400,1060)"><rect x="-140" y="-50" width="280" height="90" rx="20" fill="#1c1c22"/><text y="18" font-family="IB" font-size="56" fill="#5fd35f" text-anchor="middle">25 km/h</text></g>`;
      s+=`<g transform="translate(820,1000)"><rect x="-140" y="-50" width="280" height="90" rx="20" fill="#1c1c22"/><text y="18" font-family="IB" font-size="56" fill="#ff5a5a" text-anchor="middle">~20 km/h</text></g>`;
      s+=bigText([["BONNE",90,'#ffffff'],["NOUVELLE !",110,'#5fd35f']],230,back((lt-0.1)/0.3));}
    else{s+=button('+ Abonne-toi',600,lt);const cp=easeOut((lt-0.35)/0.4);s+=cursor(lerp(900,640,cp),lerp(900,630,cp),lt>0.8&&lt<1.0);}
  } else if(i===4){
    s+=sky('skyGold',t)+streetBG('day',0,0,t,0);
    for(let k=0;k<4;k++){const x=((k*380+t*(260+k*40))%1700)-300,y=380+k*130+Math.sin(t*2+k)*40;s+=pteranodon(1080-x,y,0.9+k*0.25,t*8+k);}
    const dive=clamp((lt-1.2)/0.8);s+=pteranodon(lerp(-200,600,dive),lerp(300,1250,dive),1.6,t*10);
    s+=hero(540,1830,360,{t,mood:'scared',look:[-0.6,-1.2],blink:false,lean:dive>0.5?14:0});
    s+=bigText([["6 MÈTRES",120,'#ffd45a'],["D'ENVERGURE",80,'#ffffff']],230,back((lt-1.4)/0.3));
  } else if(i===5){
    s+=sky('skyDay',t)+towerImg(330,1450,1350,0);
    s+=`<rect x="0" y="1440" width="1080" height="480" fill="url(#grass)"/>`;
    for(let k=0;k<4;k++) s+=tree(700+k*110,1460+k*6,(260-k*20),k+20).replace('<g transform','<g opacity="1" transform');
    s+=brachio(520,1560,0.95,t);
    for(let k=0;k<6;k++){const p=((t*0.8+k*0.17)%1);s+=`<ellipse cx="${900+(rnd(k)-.5)*80}" cy="${360+p*900}" rx="10" ry="6" fill="#4cae38" opacity="${1-p}"/>`;}
    s+=hero(150,1880,250,{t,mood:'wow',look:[1,-1.2],blink});
    s+=bigText([["UN BRACHIOSAURE",76,'#ffffff'],["AU CHAMP-DE-MARS",70,'#ffd45a']],200,back((lt-0.2)/0.3));
  } else {
    s+=champs(t,0);
    s+=trex(900,1700,1.0,{t,jaw:0.15+0.1*Math.sin(t*2)});
    s+=hero(330,1850,340,{t,mood:'happy',armR:-150+Math.sin(t*9)*20,look:[1,0],blink});
    s+=bigText([["TOI, TU FERAIS QUOI",72,'#ffffff'],["FACE À UN T-REX ?",80,'#ffd45a']],230,back(lt/0.3));
    s+=button('Commente !',620,lt-1.3);
  }
  const dt=t-S[i]; if(i>0&&dt<0.1&&i!==3) s+=`<rect width="1080" height="1920" fill="#fff" opacity="${(1-dt/0.1)*0.5}"/>`;
  s+=`<rect width="1080" height="1920" fill="url(#vig)"/>`;
  if(t>T-0.35) s+=`<rect width="1080" height="1920" fill="#000" opacity="${(t-(T-0.35))/0.35}"/>`;
  const sx=Math.sin(t*61)*24*shake, sy=Math.cos(t*53)*18*shake, kick=1+0.05*Math.exp(-Math.max(0,dt)*6);
  SV.innerHTML=`<g transform="translate(${540+sx},${960+sy}) scale(${kick}) translate(-540,-960)">${s}</g>`;
}
render(0);

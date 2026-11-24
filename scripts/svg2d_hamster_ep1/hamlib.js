const HX=`<radialGradient id="furG" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#ffd59a"/><stop offset=".6" stop-color="#f0a85a"/><stop offset="1" stop-color="#c97a32"/></radialGradient>
<radialGradient id="bellyG" cx=".5" cy=".4" r=".7"><stop offset="0" stop-color="#fffaf0"/><stop offset="1" stop-color="#f3dcc0"/></radialGradient>
<linearGradient id="overall" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4f7fe0"/><stop offset="1" stop-color="#2a4aa8"/></linearGradient>
<linearGradient id="brickW" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a3a3a"/><stop offset="1" stop-color="#3a2428"/></linearGradient>
<radialGradient id="bulbG"><stop offset="0" stop-color="#fff2b0" stop-opacity=".9"/><stop offset="1" stop-color="#ffcf60" stop-opacity="0"/></radialGradient>
<linearGradient id="metal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e4e8f0"/><stop offset="1" stop-color="#8d95a6"/></linearGradient>`;
function hamsterOld(x,y,s,o={}){ // y = feet line, s = scale (body ~ 300*s tall)
  const t=o.t||0, br=Math.sin(t*2.4)*3*s, ang=o.angry||0, blink=o.blink;
  let g=`<g transform="translate(${x},${y}) scale(${s})">`;
  g+=`<ellipse cx="0" cy="6" rx="150" ry="22" fill="#000" opacity=".35"/>`;
  // feet
  g+=`<ellipse cx="-60" cy="-8" rx="42" ry="20" fill="#f4b8a8"/><ellipse cx="60" cy="-8" rx="42" ry="20" fill="#f4b8a8"/>`;
  // body + belly
  g+=`<ellipse cx="0" cy="${-150-br}" rx="150" ry="${150+br}" fill="url(#furG)"/>`;
  g+=`<ellipse cx="0" cy="${-120}" rx="100" ry="105" fill="url(#bellyG)"/>`;
  // overalls
  g+=`<path d="M-118,-150 L118,-150 L128,-40 Q0,10 -128,-40Z" fill="url(#overall)"/><rect x="-58" y="-150" width="116" height="70" rx="10" fill="url(#overall)"/>`;
  g+=`<line x1="-50" y1="-150" x2="-80" y2="-240" stroke="#2a4aa8" stroke-width="16" stroke-linecap="round"/><line x1="50" y1="-150" x2="80" y2="-240" stroke="#2a4aa8" stroke-width="16" stroke-linecap="round"/>`;
  g+=`<circle cx="-48" cy="-146" r="8" fill="#ffd45a"/><circle cx="48" cy="-146" r="8" fill="#ffd45a"/><rect x="-26" y="-130" width="52" height="34" rx="6" fill="#3a62c0" stroke="#22408a" stroke-width="3"/>`;
  g+=`<text x="0" y="-60" font-family="IB" font-size="20" fill="#cfe0ff" text-anchor="middle">PARIS ÉNERGIE</text>`;
  // arms: crossed or holding sign
  if(o.cross) g+=`<path d="M-120,-170 Q-20,-120 90,-175" stroke="#e89a4a" stroke-width="48" fill="none" stroke-linecap="round"/><path d="M120,-165 Q20,-125 -90,-178" stroke="#f0a85a" stroke-width="48" fill="none" stroke-linecap="round"/><ellipse cx="96" cy="-176" rx="22" ry="18" fill="#f4b8a8"/><ellipse cx="-96" cy="-178" rx="22" ry="18" fill="#f4b8a8"/>`;
  else g+=`<path d="M-128,-180 Q-170,-120 -140,-80" stroke="#e89a4a" stroke-width="44" fill="none" stroke-linecap="round"/><ellipse cx="-140" cy="-78" rx="22" ry="18" fill="#f4b8a8"/>`;
  // head (merged, with cheeks)
  const hy=-300-br;
  g+=`<ellipse cx="0" cy="${hy}" rx="128" ry="112" fill="url(#furG)"/>`;
  g+=`<ellipse cx="-92" cy="${hy+40}" rx="62" ry="52" fill="#ffcf96"/><ellipse cx="92" cy="${hy+40}" rx="62" ry="52" fill="#ffcf96"/>`;
  g+=`<ellipse cx="0" cy="${hy+50}" rx="70" ry="52" fill="url(#bellyG)"/>`;
  // ears
  for(const sd of [-1,1]) g+=`<ellipse cx="${sd*88}" cy="${hy-88}" rx="40" ry="36" fill="#e89a4a"/><ellipse cx="${sd*88}" cy="${hy-86}" rx="25" ry="22" fill="#f7a8b8"/>`;
  // hard hat
  g+=`<path d="M-90,${hy-70} Q0,${hy-160} 90,${hy-70}Z" fill="#ffd21f"/><rect x="-104" y="${hy-74}" width="208" height="18" rx="9" fill="#f0b800"/><rect x="-10" y="${hy-150}" width="20" height="80" rx="8" fill="#ffe46b"/>`;
  // eyes + angry brows
  for(const sd of [-1,1]){
    if(blink) g+=`<path d="M${sd*48-18},${hy+2} q18,10 36,0" stroke="#1a1010" stroke-width="7" fill="none" stroke-linecap="round"/>`;
    else g+=`<ellipse cx="${sd*48}" cy="${hy}" rx="20" ry="24" fill="#1a1010"/><circle cx="${sd*48-6}" cy="${hy-8}" r="7" fill="#fff"/><circle cx="${sd*48+6}" cy="${hy+8}" r="3" fill="#fff"/>`;
    g+=`<path d="M${sd*76},${hy-48} L${sd*20},${hy-30+ang*6}" stroke="#6a3510" stroke-width="11" stroke-linecap="round"/>`;}
  // nose, mouth, teeth, whiskers
  g+=`<ellipse cx="0" cy="${hy+30}" rx="14" ry="10" fill="#e8607a"/>`;
  g+=ang>0.5?`<path d="M-22,${hy+56} Q0,${hy+44} 22,${hy+56}" stroke="#5a2a1a" stroke-width="6" fill="none" stroke-linecap="round"/>`:`<path d="M-18,${hy+48} Q0,${hy+62} 18,${hy+48}" stroke="#5a2a1a" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  g+=`<rect x="-10" y="${hy+40}" width="20" height="16" rx="3" fill="#fff" stroke="#ddd" stroke-width="2"/>`;
  for(const sd of [-1,1]) for(let k=-1;k<=1;k++) g+=`<line x1="${sd*30}" y1="${hy+34+k*6}" x2="${sd*120}" y2="${hy+24+k*16}" stroke="#7a4518" stroke-width="2.5" opacity=".7"/>`;
  g+=`</g>`; return g}
function wheel(cx,cy,R,rot){let s=`<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="url(#metal)" stroke-width="18"/><circle cx="${cx}" cy="${cy}" r="${R-26}" fill="none" stroke="#7d8596" stroke-width="6"/>`;
  for(let k=0;k<24;k++){const a=k/24*Math.PI*2+rot;s+=`<line x1="${cx+Math.cos(a)*(R-26)}" y1="${cy+Math.sin(a)*(R-26)}" x2="${cx+Math.cos(a)*R}" y2="${cy+Math.sin(a)*R}" stroke="#a8b0c0" stroke-width="5"/>`;}
  for(let k=0;k<6;k++){const a=k/6*Math.PI*2+rot;s+=`<line x1="${cx}" y1="${cy}" x2="${cx+Math.cos(a)*(R-26)}" y2="${cy+Math.sin(a)*(R-26)}" stroke="#9aa2b2" stroke-width="8"/>`;}
  s+=`<circle cx="${cx}" cy="${cy}" r="28" fill="#6d7586"/><rect x="${cx-14}" y="${cy}" width="28" height="${R+60}" fill="#5d6576"/>`;return s}
function basement(t,bulbOn){let s=`<rect width="1080" height="1920" fill="url(#brickW)"/>`;
  for(let r=0;r<40;r++) for(let c=-1;c<10;c++){const x=c*130+(r%2)*65,y=r*52;s+=`<rect x="${x}" y="${y}" width="124" height="46" rx="4" fill="${['#6a4240','#5e3a3a','#734846'][(r*7+c)%3]}" opacity=".9"/>`;}
  s+=`<rect x="0" y="0" width="1080" height="1920" fill="#120a1c" opacity="${bulbOn?0.25:0.55}"/>`;
  // pipes
  s+=`<rect x="0" y="180" width="1080" height="34" fill="#8a8f9c"/><rect x="0" y="186" width="1080" height="8" fill="#b9bfcc"/><rect x="860" y="180" width="34" height="900" fill="#8a8f9c"/>`;
  // generator + cable + sign
  s+=`<rect x="760" y="1080" width="250" height="300" rx="20" fill="#3d4a5c"/><rect x="780" y="1100" width="210" height="80" rx="10" fill="#1b2230"/><text x="885" y="1155" font-family="IB" font-size="36" text-anchor="middle" fill="${bulbOn?'#5fff8a':'#ff4d4d'}">${bulbOn?'100%':'0%'}</text>`;
  s+=`<path d="M885,1080 Q885,700 640,620 Q400,560 300,300" stroke="#222" stroke-width="16" fill="none"/>`;
  s+=`<rect x="80" y="560" width="420" height="110" rx="12" fill="#ffd45a" stroke="#120a1c" stroke-width="6"/><text x="290" y="630" font-family="IB" font-size="46" text-anchor="middle" fill="#120a1c">ÉNERGIE DE PARIS</text>`;
  // bulb
  s+=`<line x1="540" y1="0" x2="540" y2="120" stroke="#222" stroke-width="6"/><circle cx="540" cy="150" r="36" fill="${bulbOn?'#fff2b0':'#555'}"/>`+(bulbOn?`<circle cx="540" cy="150" r="320" fill="url(#bulbG)"/>`:'');
  s+=`<rect x="0" y="1560" width="1080" height="360" fill="#2a2230"/><rect x="0" y="1560" width="1080" height="12" fill="#4a3a4e"/>`;
  return s}

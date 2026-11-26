// ===== Trouve l'intrus — chats =====
const T=13.5, T0=3.6, T1=8.6;           // timer from T0 to T1
const COLS=7, ROWS=10, CW=146, CH=132, GX=540-COLS*CW/2+CW/2, GY=520;
const ODD=[5,6];                         // column,row of the intruder
function cat(x,y,r,odd,t,k){const w=Math.sin(t*2+k*0.7)*3;let s=`<g transform="translate(${x},${y}) rotate(${w})">`;
  // ears
  s+=`<path d="M${-r*0.85},${-r*0.35} L${-r*0.75},${-r*1.15} L${-r*0.2},${-r*0.8}Z" fill="#f2a24a"/><path d="M${-r*0.72},${-r*0.45} L${-r*0.66},${-r*0.95} L${-r*0.34},${-r*0.75}Z" fill="#ffc4cf"/>`;
  if(odd) s+=`<path d="M${r*0.85},${-r*0.35} L${r*1.05},${-r*0.62} L${r*0.45},${-r*0.82} L${r*0.2},${-r*0.8}Z" fill="#e8913a"/>`;
  else s+=`<path d="M${r*0.85},${-r*0.35} L${r*0.75},${-r*1.15} L${r*0.2},${-r*0.8}Z" fill="#f2a24a"/><path d="M${r*0.72},${-r*0.45} L${r*0.66},${-r*0.95} L${r*0.34},${-r*0.75}Z" fill="#ffc4cf"/>`;
  s+=`<ellipse cx="0" cy="0" rx="${r}" ry="${r*0.88}" fill="#f2a24a"/><ellipse cx="0" cy="${r*0.32}" rx="${r*0.55}" ry="${r*0.42}" fill="#fff6ea"/>`;
  s+=`<path d="M${-r*0.15},${-r*0.85} L${-r*0.1},${-r*0.5} M0,${-r*0.88} L0,${-r*0.5} M${r*0.15},${-r*0.85} L${r*0.1},${-r*0.5}" stroke="#d9822e" stroke-width="${r*0.07}" stroke-linecap="round"/>`;
  for(const sd of [-1,1]) s+=`<ellipse cx="${sd*r*0.36}" cy="${-r*0.08}" rx="${r*0.15}" ry="${r*0.19}" fill="#2a2018"/><circle cx="${sd*r*0.36-r*0.05}" cy="${-r*0.15}" r="${r*0.06}" fill="#fff"/>`;
  s+=`<path d="M${-r*0.08},${r*0.16} L${r*0.08},${r*0.16} L0,${r*0.26}Z" fill="#ff7a8a"/><path d="M${-r*0.16},${r*0.34} Q${-r*0.08},${r*0.42} 0,${r*0.3} Q${r*0.08},${r*0.42} ${r*0.16},${r*0.34}" stroke="#5a3a2a" stroke-width="${r*0.05}" fill="none" stroke-linecap="round"/>`;
  for(const sd of [-1,1]) for(let j=-1;j<=1;j+=2) s+=`<line x1="${sd*r*0.3}" y1="${r*0.28+j*r*0.05}" x2="${sd*r*0.95}" y2="${r*0.22+j*r*0.14}" stroke="#7a5a40" stroke-width="${r*0.035}"/>`;
  return s+'</g>'}
function render(t){
  let s=DEFS+`<defs><radialGradient id="bgQ" cx=".5" cy=".4" r=".8"><stop offset="0" stop-color="#2b3a8f"/><stop offset="1" stop-color="#121640"/></radialGradient></defs>`;
  s+=`<rect width="1080" height="1920" fill="url(#bgQ)"/>`;
  for(let k=0;k<40;k++) s+=`<circle cx="${rnd(k)*1080}" cy="${rnd(k+9)*1920}" r="${2+rnd(k+3)*3}" fill="#fff" opacity="${.08+.08*Math.sin(t*2+k)}"/>`;
  // panel
  s+=`<rect x="30" y="${GY-90}" width="1020" height="${ROWS*CH+60}" rx="40" fill="#fff8ee"/>`;
  const reveal=t>T1+0.15, rp=ease((t-T1-0.15)/0.5);
  let grid='';
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){const odd=c===ODD[0]&&r===ODD[1];
    const pop=back((t-0.15-(r*COLS+c)*0.004)/0.3);if(pop<=0.01) continue;
    grid+=`<g transform="translate(${GX+c*CW},${GY+r*CH}) scale(${pop})" opacity="${reveal&&!odd?1-0.75*rp:1}">${cat(0,0,52,odd,t,r*COLS+c)}</g>`;}
  s+=grid;
  if(reveal){const ox=GX+ODD[0]*CW, oy=GY+ODD[1]*CH, rr=lerp(400,82,rp);
    s+=`<circle cx="${ox}" cy="${oy}" r="${rr}" fill="none" stroke="#ff3b3b" stroke-width="12"/>`;
    s+=`<g transform="translate(${ox},${oy}) scale(${lerp(1,2.2,ease((t-T1-0.9)/0.5))})">${cat(0,0,52,true,t,0)}</g>`;
    if(t>T1+1.4) s+=bigText([["UNE OREILLE",84,'#ffffff'],["PLIÉE !",110,'#ffd45a']],1840-ROWS*0,back((t-T1-1.4)/0.3)).replace('translate(540,1840)','translate(540,1760)');}
  // header
  s+=bigText([["SEULEMENT 1 %",86,'#ffd45a'],["TROUVENT L'INTRUS",74,'#ffffff']],150,back((t-0.05)/0.35));
  // timer
  if(t>T0-0.2&&!reveal){const left=Math.max(0,Math.ceil(T1-t)), frac=clamp((T1-t)/(T1-T0)), pulse=1+0.12*Math.exp(-((t-T0)%1)*6);
    s+=`<g transform="translate(540,1830) scale(${pulse})"><circle r="74" fill="#120a1c"/><circle r="66" fill="none" stroke="#3a3f60" stroke-width="12"/>
    <circle r="66" fill="none" stroke="${left<=2?'#ff3b3b':'#5fd35f'}" stroke-width="12" stroke-dasharray="${2*Math.PI*66*frac} 999" transform="rotate(-90)" stroke-linecap="round"/><text y="28" font-family="IB" font-size="80" text-anchor="middle" fill="#fff">${left}</text></g>`;}
  if(t>T1&&t<T1+0.15) s+=`<rect width="1080" height="1920" fill="#ff3b3b" opacity=".35"/>`;
  if(t>T-2.4){const p=back((t-(T-2.4))/0.35);s+=`<g transform="translate(540,960) scale(${p})" filter="url(#ds)"><rect x="-430" y="-110" width="860" height="220" rx="50" fill="#fe2c55"/><text y="-12" font-family="IB" font-size="64" fill="#fff" text-anchor="middle">T'AS TROUVÉ ?</text><text y="64" font-family="IB" font-size="54" fill="#fff" text-anchor="middle">Dis-le en commentaire</text></g>`;}
  SV.innerHTML=s;
}
render(0);

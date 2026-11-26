const EXTRA=`<linearGradient id="hGreen" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4fc36a"/><stop offset="1" stop-color="#23803a"/></linearGradient>
<linearGradient id="hOrange" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffaa4c"/><stop offset="1" stop-color="#d86a12"/></linearGradient>
<linearGradient id="hRed" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ff5a5f"/><stop offset="1" stop-color="#b0202a"/></linearGradient>
<linearGradient id="hGray" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b9bfcc"/><stop offset="1" stop-color="#7d8496"/></linearGradient>
<linearGradient id="hPurple" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#a77bff"/><stop offset="1" stop-color="#5b33c2"/></linearGradient>
<linearGradient id="hTeach" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e86a9a"/><stop offset="1" stop-color="#a8325e"/></linearGradient>
<radialGradient id="skin2" cx=".38" cy=".35" r=".75"><stop offset="0" stop-color="#d9a27a"/><stop offset=".7" stop-color="#b07548"/><stop offset="1" stop-color="#8f5a34"/></radialGradient>
<radialGradient id="skin3" cx=".38" cy=".35" r=".75"><stop offset="0" stop-color="#a8714c"/><stop offset=".7" stop-color="#7a4a2c"/><stop offset="1" stop-color="#5e361e"/></radialGradient>
<linearGradient id="board" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f6b4f"/><stop offset="1" stop-color="#1f4d38"/></linearGradient>
<linearGradient id="wallC" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff1d6"/><stop offset="1" stop-color="#f4d9b0"/></linearGradient>
<linearGradient id="deskG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e0a66a"/><stop offset="1" stop-color="#a86c38"/></linearGradient>`;
// variant: hood gradient, hair colour, skin, glasses, long hair
const KIDS={genie:{hood:'hGreen',hair:'#2a1a10',skin:'skin',glasses:true},
  panic:{hood:'hOrange',hair:'#c46a2a',skin:'skin'},
  cheat:{hood:'hRed',hair:'#111111',skin:'skin2'},
  sleep:{hood:'hGray',hair:'#5a3a1a',skin:'skin3'},
  ask:{hood:'hPurple',hair:'#e8c040',skin:'skin',long:true},
  teach:{hood:'hTeach',hair:'#6a3a2a',skin:'skin',long:true,glasses:true}};
function kid(v,x,y,K,o){const c=KIDS[v];let s=hero(x,y,K,{flag:false,...o}).split('url(#hood)').join(`url(#${c.hood})`).split('url(#skin)').join(`url(#${c.skin})`).split('#4a2a18').join(c.hair);
  const hc=y-(o.jump||0)-1.64*K;
  if(c.long) s=`<path d="M${x-0.2*K},${hc-0.05*K} Q${x-0.26*K},${hc+0.35*K} ${x-0.14*K},${hc+0.42*K} L${x+0.14*K},${hc+0.42*K} Q${x+0.26*K},${hc+0.35*K} ${x+0.2*K},${hc-0.05*K}Z" fill="${c.hair}"/>`+s;
  if(c.glasses&&!o.blink) for(const sd of [-1,1]) s+=`<circle cx="${x+sd*0.06*K}" cy="${hc+0.025*K}" r="${0.05*K}" fill="#bfe6ff" fill-opacity=".25" stroke="#1a1428" stroke-width="${0.012*K}"/>`;
  if(c.glasses&&!o.blink) s+=`<line x1="${x-0.01*K}" y1="${hc+0.02*K}" x2="${x+0.01*K}" y2="${hc+0.02*K}" stroke="#1a1428" stroke-width="${0.012*K}"/>`;
  return s}
function classroom(t,zoom=1,cx=540,cy=960){let s=`<g transform="translate(${cx},${cy}) scale(${zoom}) translate(${-cx},${-cy})">`;
  s+=`<rect width="1080" height="1920" fill="url(#wallC)"/>`;
  s+=`<rect x="90" y="250" width="900" height="470" rx="12" fill="#8a5a32"/><rect x="110" y="270" width="860" height="430" fill="url(#board)"/>`;
  s+=`<text x="540" y="420" font-family="IXB" font-size="96" fill="#f4f4ea" text-anchor="middle" opacity=".92">CONTRÔLE</text><text x="540" y="520" font-family="IXB" font-size="44" fill="#f4f4ea" text-anchor="middle" opacity=".75">Durée : 1 h — Calculatrice interdite</text>`;
  s+=`<path d="M150,640 q60,-30 120,0 t120,0" stroke="#f4f4ea" stroke-width="4" fill="none" opacity=".5"/><rect x="760" y="690" width="120" height="16" rx="6" fill="#f4f4ea"/>`;
  // clock
  const ang=t*60, hang=t*5;s+=`<g transform="translate(940,150)"><circle r="62" fill="#fff" stroke="#333" stroke-width="8"/>${Array.from({length:12},(_,k)=>`<line x1="0" y1="-50" x2="0" y2="-42" stroke="#333" stroke-width="4" transform="rotate(${k*30})"/>`).join('')}<line x1="0" y1="0" x2="0" y2="-28" stroke="#333" stroke-width="7" stroke-linecap="round" transform="rotate(${hang})"/><line x1="0" y1="0" x2="0" y2="-46" stroke="#e33" stroke-width="4" stroke-linecap="round" transform="rotate(${ang})"/><circle r="6" fill="#333"/></g>`;
  // window + posters
  s+=`<rect x="40" y="60" width="200" height="150" fill="#bfe6ff" stroke="#fff" stroke-width="10"/><rect x="320" y="90" width="130" height="110" fill="#ffd45a" stroke="#c9946a" stroke-width="6"/><text x="385" y="160" font-family="IB" font-size="40" text-anchor="middle" fill="#7a3a10">ABC</text>`;
  s+=`<rect x="0" y="1340" width="1080" height="580" fill="#d9b48a"/>`;for(let k=0;k<12;k++) s+=`<line x1="${k*100-30}" y1="1340" x2="${(k*100-540)*1.6+540}" y2="1920" stroke="#c49a6e" stroke-width="3"/>`;
  return s+'</g>'}
function desk(x,y,w,paper=true,writing=0,t=0){let s=`<rect x="${x-w/2}" y="${y}" width="${w}" height="44" rx="10" fill="url(#deskG)"/><rect x="${x-w/2}" y="${y+40}" width="${w}" height="16" fill="#8a5528"/><rect x="${x-w/2+30}" y="${y+56}" width="22" height="300" fill="#6d6f7a"/><rect x="${x+w/2-52}" y="${y+56}" width="22" height="300" fill="#6d6f7a"/>`;
  if(paper){s+=`<polygon points="${x-130},${y+30} ${x+120},${y+30} ${x+100},${y-6} ${x-110},${y-6}" fill="#ffffff" stroke="#ccc" stroke-width="2"/>`;
    for(let k=0;k<Math.floor(writing*5);k++) s+=`<line x1="${x-90}" y1="${y+2+k*6}" x2="${x-90+150*(k+1===Math.ceil(writing*5)?(writing*5%1||1):1)}" y2="${y+2+k*6}" stroke="#2a4aa0" stroke-width="2.5"/>`;}
  return s}
function label(txt,lt,col='#ffd45a'){const p=back(lt/0.3);if(p<=0.02)return '';const fs=Math.min(70,1400/txt.length);return `<g transform="translate(540,1600) scale(${p})" filter="url(#ds)"><rect x="-470" y="-74" width="940" height="128" rx="30" fill="#120a1c"/><text y="22" font-family="IB" font-size="${fs}" fill="${col}" text-anchor="middle">${txt}</text></g>`}
function bubble(txt,x,y,lt,w=560,size=46){const p=back(lt/0.25);if(p<=0.02)return '';return `<g transform="translate(${x},${y}) scale(${p})" filter="url(#ds)"><rect x="${-w/2}" y="-70" width="${w}" height="120" rx="36" fill="#fff" stroke="#120a1c" stroke-width="6"/><path d="M-30,48 L0,96 L20,48Z" fill="#fff" stroke="#120a1c" stroke-width="6"/><rect x="-34" y="40" width="58" height="14" fill="#fff"/><text y="0" font-family="IB" font-size="${size}" fill="#120a1c" text-anchor="middle" dominant-baseline="middle">${txt}</text></g>`}
function sweat(x,y,t){let s='';for(let k=0;k<3;k++){const p=((t*1.2+k*0.33)%1);s+=`<path d="M${x+k*22},${y+p*90} q-10,18 0,26 q10,-8 0,-26Z" fill="#7fd0ff" opacity="${1-p}"/>`;}return s}

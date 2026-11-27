// ===== Vos idées : ce que boirait le géant =====
var SNOW=0;
const IX=`<linearGradient id="poolW" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fd8ff"/><stop offset="1" stop-color="#2a8ad8"/></linearGradient>
<linearGradient id="oj" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffb020"/><stop offset="1" stop-color="#ff8a00"/></linearGradient>
<linearGradient id="info" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c1440"/><stop offset="1" stop-color="#1c0f3a"/></linearGradient>
<linearGradient id="glassG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity=".55"/><stop offset=".5" stop-color="#ffffff" stop-opacity=".15"/><stop offset="1" stop-color="#ffffff" stop-opacity=".45"/></linearGradient>`;
function comment(x,y,sc,name,txt,col){return `<g transform="translate(${x},${y}) scale(${sc})" filter="url(#ds)"><rect x="-400" y="-70" width="800" height="140" rx="30" fill="#1f1f26"/><circle cx="-330" cy="0" r="44" fill="${col}"/><text x="-330" y="16" font-family="IB" font-size="44" text-anchor="middle" fill="#fff">${name[0].toUpperCase()}</text>
<text x="-266" y="-18" font-family="IXB" font-size="32" fill="#9aa0b0">@${name}</text><text x="-266" y="34" font-family="IB" font-size="42" fill="#fff">${txt}</text><path d="M330,-20 C300,-50 270,-10 330,30 C390,-10 360,-50 330,-20Z" fill="#ff3b5c"/></g>`}
function orange(x,y,r){return `<circle cx="${x}" cy="${y}" r="${r}" fill="#ff9a1a"/><circle cx="${x-r*0.3}" cy="${y-r*0.3}" r="${r*0.25}" fill="#ffc46a" opacity=".7"/><path d="M${x},${y-r} q4,-8 10,-6" stroke="#3a8a2a" stroke-width="3" fill="none"/>`}
function orangeMountain(cx,base,w,h){let s='';for(let k=0;k<170;k++){const u=rnd(k)*2-1,v=rnd(k+9);const x=cx+u*w*0.5*(1-v*0.6),y=base-v*h*(1-Math.abs(u)*0.45);s+=orange(x,y,12+rnd(k+3)*6);}return s}
function wallace(x,y,s){return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-60" y="-20" width="120" height="20" fill="#1f4a2a"/><rect x="-44" y="-60" width="88" height="40" fill="#2a6a3a"/>${[-30,-10,10,30].map(cx=>`<rect x="${cx-6}" y="-150" width="12" height="90" rx="6" fill="#2a6a3a"/>`).join('')}<path d="M-50,-150 L50,-150 L36,-190 Q0,-230 -36,-190Z" fill="#2a6a3a"/><circle cx="0" cy="-222" r="10" fill="#2a6a3a"/></g>`}
function syringe(x,y,s){return `<g transform="translate(${x},${y}) scale(${s}) rotate(-30)"><rect x="-120" y="-20" width="180" height="40" rx="8" fill="#e8f6ff" stroke="#9fc7e6" stroke-width="4"/><rect x="-110" y="-12" width="110" height="24" fill="#9fd8ff"/><rect x="60" y="-6" width="80" height="12" fill="#bbb"/><rect x="-160" y="-28" width="40" height="56" rx="6" fill="#9aa"/></g>`}
function render(t){
  let i=0;for(let k=0;k<S.length-1;k++) if(t>=S[k]-0.12) i=k; const lt=t-S[i];
  const blink=(t%3.1)>2.98; let s=DEFS.replace('</defs>',IX+'</defs>'); let shake=0;
  if(i===0){
    s+=`<rect width="1080" height="1920" fill="url(#info)"/>`;for(let k=0;k<60;k++) s+=`<circle cx="${rnd(k)*1080}" cy="${rnd(k+7)*1920}" r="${1+rnd(k+3)*2}" fill="#fff" opacity=".25"/>`;
    s+=hero(540,1900,330,{t,mood:t>2.4?'happy':'wow',look:[0,-0.6],armR:t>2.4?-150:0,blink:false});
    const cs=[['aissou','je boirais du jus d’orange !','#ff8a3a',560],['Jisoo','2 fontaines d’eau propre','#e85aa8',740],['actuMMA','je buverai une piscine','#3a6ad8',920]];
    cs.forEach(([n,tx,c,y],k)=>{const p=back((t-0.25-k*0.35)/0.3);if(p>0.02) s+=comment(540+Math.sin(t*2+k)*8,y,p*0.95,n,tx,c);});
    s+=bigText([["VOUS AVEZ",96,'#ffffff'],["RÉPONDU !",120,'#ffd45a']],200,back((t-2.4)/0.3));
    if(t<2.4) s+=bigText([["LE GÉANT BOIT QUOI ?",80,'#ffffff']],230,back((t-0.05)/0.3));
  } else if(i===1){
    const aa=-150+Math.sin(t*2)*3, ar=aa*Math.PI/180;
    const shx=GX+0.27*GK, shy=GY-1.38*GK, hx=shx-Math.sin(ar)*0.54*GK, hy=shy+Math.cos(ar)*0.54*GK;
    const drink=ease((t-5.0)/1.5);
    let glass=`<g transform="translate(${hx-110},${hy+40}) rotate(${lerp(0,-35,drink)})"><rect x="-90" y="-170" width="180" height="260" rx="14" fill="url(#oj)" opacity=".95"/><rect x="-90" y="${-170+drink*120}" width="180" height="20" fill="#ffd070" opacity=".9"/><rect x="-90" y="-170" width="180" height="260" rx="14" fill="url(#glassG)" stroke="#fff" stroke-width="5"/><circle cx="70" cy="-170" r="40" fill="#ffb020" stroke="#fff3c0" stroke-width="8"/><line x1="-30" y1="-260" x2="10" y2="-140" stroke="#e53935" stroke-width="12"/></g>`;
    s+=wideGiant(t,{h:{mood:drink>0.3?'happy':'wow',armR:aa,look:[0.6,-0.6],blink},mid:glass+`<circle cx="${hx}" cy="${hy}" r="${0.058*GK}" fill="url(#skin)"/>`});
    s+=orangeMountain(260,1915,460,320);
    s+=comment(540,330,0.9,'aissou','je boirais du jus d’orange !','#ff8a3a');
    const n=Math.round(lerp(0,2500000,easeOut((t-7.6)/1.0)));
    if(t>7.6) s+=bigText([[n.toLocaleString('fr-FR').replace(/ /g,' '),110,'#ffb020'],["ORANGES !",90,'#ffffff']],560,back((t-7.6)/0.3));
    else if(t>6.4) s+=bigText([["1 VERRE =",90,'#ffffff']],560,back((t-6.4)/0.3));
  } else if(i===2||i===3){
    const aa=-150+Math.sin(t*2)*3, ar=aa*Math.PI/180;
    const shx=GX+0.27*GK, shy=GY-1.38*GK, hx=shx-Math.sin(ar)*0.54*GK, hy=shy+Math.cos(ar)*0.54*GK;
    let f=wallace(hx-60,hy+60,0.75)+`<path d="M${hx-60},${hy-110} Q${hx-40},${hy-200} ${GX+0.03*GK},${GY-1.52*GK}" stroke="#9fd8ff" stroke-width="3" fill="none"/>`;
    for(let k=0;k<3;k++){const p=((t*2+k*0.33)%1);f+=`<circle cx="${lerp(hx-60,GX+0.03*GK,p)}" cy="${lerp(hy-110,GY-1.52*GK,p)-Math.sin(p*Math.PI)*60}" r="5" fill="#9fd8ff"/>`;}
    s+=wideGiant(t,{h:{mood:'sad',armR:aa,look:[0.6,-0.6],blink},mid:f+`<circle cx="${hx}" cy="${hy}" r="${0.058*GK}" fill="url(#skin)"/>`});
    s+=comment(540,330,0.9,'Jisoo','2 fontaines d’eau propre','#e85aa8');
    if(t>12.9){s+=`<g transform="translate(260,900)"><circle r="150" fill="#fff" opacity=".9"/>${syringe(0,0,1.0)}</g>`;s+=bigText([["= UNE SERINGUE",90,'#ff5a5a']],1220,back((t-12.9)/0.3));}
    if(i===3){s+=button('+ Abonne-toi',1400,lt);const cp=easeOut((lt-0.35)/0.4);s+=cursor(lerp(920,640,cp),lerp(1700,1430,cp),lt>0.8&&lt<1.0);}
  } else if(i===4){
    const aa=-128+Math.sin(t*2)*3, ar=aa*Math.PI/180;
    const shx=GX+0.27*GK, shy=GY-1.38*GK, hx=shx-Math.sin(ar)*0.54*GK, hy=shy+Math.cos(ar)*0.54*GK;
    const gulp=ease((t-19.8)/1.0);
    const poolX=hx-40, poolY=hy-60, tiltP=lerp(0,-40,gulp);
    let pool=`<g transform="translate(${poolX},${poolY}) rotate(${tiltP}) scale(1.35)"><rect x="-170" y="-70" width="300" height="120" rx="12" fill="#e9eef5" stroke="#b8c2cc" stroke-width="8"/><rect x="-156" y="-56" width="272" height="${92*(1-gulp*0.85)}" rx="6" fill="url(#poolW)"/>`;
    for(let k=0;k<3;k++) pool+=`<circle cx="${-110+k*60+Math.sin(t*4+k)*8}" cy="-30" r="9" fill="#eab08c"/>`;
    pool+=`</g>`;
    if(gulp>0.05) pool+=`<path d="M${poolX-150},${poolY-40} Q${GX+0.05*GK},${poolY-120} ${GX+0.02*GK},${GY-1.5*GK}" stroke="#7fd8ff" stroke-width="${30*gulp}" fill="none" opacity=".8"/>`;
    s+=wideGiant(t,{h:{mood:gulp>0.3?'wow':'happy',armR:aa,look:[0.6,-0.6],blink},mid:pool+`<circle cx="${hx}" cy="${hy}" r="${0.058*GK}" fill="url(#skin)"/>`});
    s+=comment(540,330,0.9,'actuMMA','je buverai une piscine','#3a6ad8');
    if(t>20.2) s+=bigText([["1 SEULE GORGÉE !",96,'#4cc3ff']],560,back((t-20.2)/0.3));
  } else {
    s+=wideGiant(t,{sky:'skyGold',h:{mood:'happy',armR:-140+Math.sin(t*9)*20,look:[0,0],blink}});
    const p=back((lt-0.3)/0.35);
    s+=`<g transform="translate(540,600) scale(${p})" filter="url(#ds)"><rect x="-400" y="-70" width="800" height="140" rx="30" fill="#1f1f26" stroke="#ffd45a" stroke-width="6" stroke-dasharray="20 14"/><text x="0" y="16" font-family="IB" font-size="54" text-anchor="middle" fill="#ffd45a">TON IDÉE ICI ?</text></g>`;
    s+=bigText([["ET VOUS, VOUS FERIEZ",72,'#ffffff'],["QUOI EN GÉANT ?",90,'#ffd45a']],200,back(lt/0.35));
    if(lt>2.4) s+=bigText([["DANS LA PROCHAINE VIDÉO !",58,'#5fd35f']],800,back((lt-2.4)/0.3));
    s+=button('Commente !',1330,lt-1.0);
  }
  const dt=t-S[i]; if(i>0&&dt<0.1&&i!==3) s+=`<rect width="1080" height="1920" fill="#fff" opacity="${(1-dt/0.1)*0.55}"/>`;
  s+=`<rect width="1080" height="1920" fill="url(#vig)"/>`;
  if(t>T-0.35) s+=`<rect width="1080" height="1920" fill="#000" opacity="${(t-(T-0.35))/0.35}"/>`;
  const sx=Math.sin(t*61)*24*shake, sy=Math.cos(t*53)*18*shake, kick=1+0.05*Math.exp(-Math.max(0,dt)*6);
  SV.innerHTML=`<g transform="translate(${540+sx},${960+sy}) scale(${kick}) translate(-540,-960)">${s}</g>`;
}
render(0);

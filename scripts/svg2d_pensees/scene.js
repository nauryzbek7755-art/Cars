// ===== Et si tu pouvais lire dans les pensées ? =====
var SNOW=0;
const PX2=`<radialGradient id="mindG"><stop offset="0" stop-color="#c77dff" stop-opacity=".7"/><stop offset="1" stop-color="#7b2cff" stop-opacity="0"/></radialGradient>
<linearGradient id="roomW" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe9d0"/><stop offset="1" stop-color="#f3d2ae"/></linearGradient>
<linearGradient id="roomN" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c1e48"/><stop offset="1" stop-color="#11122e"/></linearGradient>
<linearGradient id="metroW" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8eef4"/><stop offset="1" stop-color="#b8c4d2"/></linearGradient>`;
KIDS.g1={hood:'hPurple',hair:'#e8c040',skin:'skin',long:true};
KIDS.g2={hood:'hTeach',hair:'#2a1a10',skin:'skin2',long:true};
KIDS.b1={hood:'hOrange',hair:'#111',skin:'skin3'};
KIDS.b2={hood:'hGreen',hair:'#5a3a1a',skin:'skin'};
KIDS.b3={hood:'hRed',hair:'#111111',skin:'skin2'};
KIDS.mom={hood:'hTeach',hair:'#6a3a2a',skin:'skin',long:true};
function heartAt(x,y,r,col='#ff3b5c'){return `<path d="M${x},${y+r*0.9} C${x-r*1.6},${y-r*0.2} ${x-r*0.8},${y-r*1.3} ${x},${y-r*0.4} C${x+r*0.8},${y-r*1.3} ${x+r*1.6},${y-r*0.2} ${x},${y+r*0.9}Z" fill="${col}"/>`}
// thought bubble: cloud + little circles toward (tx,ty)
function thought(x,y,w,txt,lt,tx,ty,size=40,col='#ffffff',tcol='#120a1c'){const p=back(lt/0.3);if(p<=0.02)return '';const h=size*2.6;
  let s=`<g transform="translate(${x},${y}) scale(${p})" filter="url(#ds)">`;
  for(let k=0;k<7;k++){const a=k/7*Math.PI*2;s+=`<ellipse cx="${Math.cos(a)*w*0.42}" cy="${Math.sin(a)*h*0.36}" rx="${w*0.24}" ry="${h*0.36}" fill="${col}"/>`;}
  s+=`<rect x="${-w/2}" y="${-h/2}" width="${w}" height="${h}" rx="${h/2}" fill="${col}"/><text y="${size*0.35}" font-family="IB" font-size="${size}" text-anchor="middle" fill="${tcol}">${txt}</text></g>`;
  const dx=tx-x,dy=ty-y;for(let k=1;k<=3;k++){const q=0.45+k*0.14;s+=`<circle cx="${x+dx*q}" cy="${y+dy*q}" r="${(16-k*4)*p}" fill="${col}"/>`;}
  return s}
function mindWaves(x,y,t,n=3){let s=`<circle cx="${x}" cy="${y}" r="160" fill="url(#mindG)"/>`;for(let k=0;k<n;k++){const p=((t*0.9+k/n)%1);s+=`<circle cx="${x}" cy="${y}" r="${60+p*260}" fill="none" stroke="#c77dff" stroke-width="${8*(1-p)+2}" opacity="${1-p}"/>`;}return s}
function glowEyes(x,y,K,o=1){const hc=y-1.64*K;return `<g opacity="${o}"><circle cx="${x-0.06*K}" cy="${hc+0.025*K}" r="${0.05*K}" fill="#c77dff" opacity=".55"/><circle cx="${x+0.06*K}" cy="${hc+0.025*K}" r="${0.05*K}" fill="#c77dff" opacity=".55"/></g>`}
function bedroom(t,night){let s=`<rect width="1080" height="1920" fill="url(#${night?'roomN':'roomW'})"/>`;
  s+=`<rect x="640" y="300" width="340" height="420" rx="10" fill="${night?'#0b1030':'#9fd8ff'}" stroke="#fff" stroke-width="14"/><line x1="810" y1="300" x2="810" y2="720" stroke="#fff" stroke-width="10"/>`;
  if(night) s+=`<circle cx="900" cy="400" r="40" fill="#f4f1ff"/>`;
  s+=`<rect x="80" y="380" width="200" height="140" rx="8" fill="${night?'#3a3e6a':'#fff6e6'}" stroke="#c9946a" stroke-width="8"/>`;
  s+=`<rect x="0" y="1500" width="1080" height="420" fill="${night?'#2a2240':'#c98f62'}"/>`;
  s+=`<rect x="120" y="1250" width="840" height="300" rx="30" fill="${night?'#3a3f7a':'#5a86e6'}"/><rect x="100" y="1100" width="60" height="470" rx="20" fill="${night?'#4a3a5a':'#8a5a3a'}"/><rect x="920" y="1200" width="60" height="370" rx="20" fill="${night?'#4a3a5a':'#8a5a3a'}"/><rect x="160" y="1170" width="220" height="110" rx="50" fill="#fff"/>`;
  return s}
function bedBlanket(night){return `<rect x="120" y="1380" width="840" height="200" rx="40" fill="${night?'#4a5aa8':'#ffb04a'}"/><path d="M120,1380 Q540,1350 960,1380" stroke="#fff" stroke-width="6" fill="none" opacity=".4"/>`}
function alarm(x,y,t,ring){const w=ring?Math.sin(t*60)*8:0;return `<g transform="translate(${x},${y}) rotate(${w})"><circle r="60" fill="#e53935"/><circle r="46" fill="#fff"/><line x1="0" y1="0" x2="0" y2="-30" stroke="#222" stroke-width="6"/><line x1="0" y1="0" x2="22" y2="0" stroke="#222" stroke-width="6"/><circle cx="-40" cy="-52" r="18" fill="#e53935"/><circle cx="40" cy="-52" r="18" fill="#e53935"/></g>`}
function metro(t){let s=`<rect width="1080" height="1920" fill="url(#metroW)"/>`;
  for(let k=0;k<4;k++) s+=`<rect x="${80+k*240}" y="320" width="200" height="300" rx="30" fill="#2a3a5a"/><rect x="${92+k*240}" y="332" width="176" height="276" rx="24" fill="#4a6a98"/>`;
  s+=`<rect x="0" y="640" width="1080" height="20" fill="#c9a030"/>`;for(let k=0;k<8;k++) s+=`<line x1="${80+k*130}" y1="200" x2="${80+k*130}" y2="640" stroke="#9aa3b2" stroke-width="10"/>`;
  s+=`<rect x="0" y="1560" width="1080" height="360" fill="#8a93a6"/>`;return s}
function render(t){
  let i=0;for(let k=0;k<S.length-1;k++) if(t>=S[k]-0.12) i=k; const lt=t-S[i];
  const blink=(t%3.1)>2.98; let s=DEFS.replace('</defs>',EXTRA+PX2+'</defs>'); let shake=0;
  if(i===0){
    s+=bedroom(t,false)+alarm(860,1150,t,t<1.0);
    const K=360, X=470, Y=1360+0.8*K;
    s+=mindWaves(X,Y-1.64*K,t);
    s+=hero(X,Y,K,{t,flag:false,sit:true,mood:t<0.9?'neutral':'wow',blink:t<0.5,look:[Math.sin(t*4)*0.8,-0.3]})+glowEyes(X,Y,K,clamp((t-0.6)/0.3));
    s+=bedBlanket(false);
    s+=thought(320,640,520,'Encore en retard…',t-1.4,X,Y-1.9*K,44);
    s+=thought(760,880,460,'CROQUETTES !',t-1.9,X+80,Y-1.9*K,48,'#fff6c0');
    shake=t<1.0?0.12:0;
    s+=bigText([["TU ENTENDS",104,'#ffffff'],["LES PENSÉES",104,'#c77dff']],200,back((t-0.9)/0.3));
  } else if(i===1){
    s+=classroom(t,1.0);
    const xs=[160,400,680,920],vs=['b1','g2','b2','b3'];
    vs.forEach((v,k)=>{s+=kid(v,xs[k],1420+0.8*230,230,{t,sit:true,mood:'neutral',look:[0,-0.2],blink:(t+k)%3>2.9})+desk(xs[k],1420,230,true,0.3,t);});
    const tx=[["Il est bizarre…",'#ffffff'],["J'ai faim",'#fff6c0'],["Il a copié sur moi !",'#ffd0d0'],["Il est trop cool",'#d0ffd8']];
    tx.forEach(([txt,col],k)=>{s+=thought(Math.min(800,Math.max(280,xs[k])),k%2?1080:820,480,txt,t-3.3-k*0.55,xs[k],1420-0.8*230-60,40,col);});
    s+=bigText([["CE QUE TES POTES",80,'#ffffff'],["PENSENT VRAIMENT",80,'#c77dff']],200,back((lt-0.1)/0.3));
  } else if(i>=2&&i<=4){
    s+=classroom(t,1.25,540,700);
    const K=480;
    s+=kid('g1',720,1420+0.8*K,K,{t,sit:true,mood:i===4?'neutral':'happy',look:[-0.8,0.2],blink:(t%2.6)>2.5})+desk(720,1420,560,true,0.2,t);
    const hk=360;s+=hero(220,1880,hk,{t,flag:false,mood:i===4?'scared':'wow',look:[1,-0.3],blink:false});
    if(i<4){const beat=1+0.15*Math.abs(Math.sin(t*7));s+=heartAt(220,1880-1.25*hk,40*beat);}
    s+=glowEyes(220,1880,hk,1);
    if(i<4){s+=thought(560,560,380,'',t-S[2]-0.9,720,1420-0.8*K+40,90);if(t-S[2]>1.0) for(let d=0;d<3;d++) s+=`<circle cx="${490+d*70}" cy="${560-Math.abs(Math.sin(t*6+d))*18}" r="18" fill="#120a1c"/>`;}
    else{s+=thought(540,560,940,'Il a de la sauce sur son pull',lt+0.05,720,1420-0.8*K+40,50,'#ffffff','#c21e28');
      const p=ease((lt-0.8)/0.4);s+=`<ellipse cx="${220+0.05*hk}" cy="${1880-1.2*hk}" rx="${30*p}" ry="${20*p}" fill="#8a3a1a"/><ellipse cx="${220-0.05*hk}" cy="${1880-1.12*hk}" rx="${14*p}" ry="${10*p}" fill="#8a3a1a"/>`;
      if(lt>0.8) s+=`<circle cx="${220+0.05*hk}" cy="${1880-1.2*hk}" r="${70}" fill="none" stroke="#ff3b3b" stroke-width="8" opacity="${p}"/>`;}
    if(i===2) s+=bigText([["ET TON CRUSH ?",100,'#ff7ab0']],200,back((lt-0.1)/0.3));
    if(i===3){s+=button('+ Abonne-toi',1180,lt);const cp=easeOut((lt-0.35)/0.4);s+=cursor(lerp(900,640,cp),lerp(1400,1210,cp),lt>0.8&&lt<1.0);}
  } else if(i===5){
    const night=t>15.3;
    if(!night){
      s+=metro(t);
      const cx=[100,260,440,640,820,980];cx.forEach((x,k)=>{s+=kid(['b1','g2','b2','b3','g1','mom'][k],x,1880,250+((k*37)%60),{t,mood:'neutral',look:[0,0],blink:(t+k)%3>2.9});});
      const tx=['Réunion à 9h…','J\'ai oublié mes clés','BLA BLA BLA','Il me regarde ?','Pizza ce soir','Encore en retard','Mon chat…','Trop chaud ici','LOL','Il pue ce métro'];
      tx.forEach((txt,k)=>{s+=thought(200+(k*233)%700,520+(k*137)%640,380,txt,t-12.8-k*0.12,540,1500,34,['#fff','#fff6c0','#ffd0d0','#d0ffd8','#e0d8ff'][k%5]);});
      s+=hero(540,1900,380,{t,flag:false,mood:'scared',look:[Math.sin(t*6),0],blink:false,noArms:false,armL:150,armR:-150})+glowEyes(540,1900,380,1);
      s+=mindWaves(540,1900-1.64*380,t,4);
      shake=0.06;
      s+=bigText([["C'EST L'ENFER",104,'#ff5a5a']],200,back((t-13.5)/0.3));
    } else {
      s+=bedroom(t,true);
      const K=360,X=470,Y=1360+0.8*K;
      s+=hero(X,Y,K,{t,flag:false,sit:true,mood:'sad',blink:false,look:[Math.sin(t*3),0]})+glowEyes(X,Y,K,1);
      s+=bedBlanket(true);
      s+=thought(260,600,340,'zzz… zzz…',t-15.4,X,Y-1.9*K,34,'#d8d8ff');
      s+=thought(800,820,360,'Demain lundi…',t-15.7,X+80,Y-1.9*K,34,'#d8d8ff');
      const p=back((t-16.4)/0.3);
      s+=`<g transform="translate(860,1120) scale(${p})"><circle r="70" fill="#1c1c2a" stroke="#ff3b3b" stroke-width="8"/><path d="M0,-34 L0,0" stroke="#fff" stroke-width="10" stroke-linecap="round"/><path d="M-26,-22 A34,34 0 1 0 26,-22" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M-60,-60 L60,60" stroke="#ff3b3b" stroke-width="12"/></g>`;
      s+=bigText([["IMPOSSIBLE",110,'#ff5a5a'],["À ÉTEINDRE",100,'#ffffff']],200,back((t-16.4)/0.3));
    }
  } else {
    s+=`<rect width="1080" height="1920" fill="#1a1440"/>`;
    s+=mindWaves(540,1100,t,3);
    s+=hero(540,1650,330,{t,flag:false,mood:'happy',blink})+glowEyes(540,1650,330,1);
    s+=`<rect x="60" y="1700" width="440" height="160" rx="40" fill="#5fd35f"/><text x="280" y="1805" font-family="IB" font-size="80" text-anchor="middle" fill="#120a1c">OUI</text><rect x="580" y="1700" width="440" height="160" rx="40" fill="#ff5a5a"/><text x="800" y="1805" font-family="IB" font-size="80" text-anchor="middle" fill="#120a1c">NON</text>`;
    s+=bigText([["TU VOUDRAIS",96,'#ffffff'],["CE POUVOIR ?",110,'#c77dff']],200,back(lt/0.35));
    s+=button('Commente !',560,lt-1.2);
  }
  const dt=t-S[i]; const cut=(i===5&&Math.abs(t-15.3)<0.1);
  if((i>0&&dt<0.1&&i!==3&&i!==4)||cut) s+=`<rect width="1080" height="1920" fill="#fff" opacity="${cut?0.5*(1-Math.abs(t-15.3)/0.1):(1-dt/0.1)*0.55}"/>`;
  s+=`<rect width="1080" height="1920" fill="url(#vig)"/>`;
  if(t>T-0.35) s+=`<rect width="1080" height="1920" fill="#000" opacity="${(t-(T-0.35))/0.35}"/>`;
  const sx=Math.sin(t*61)*24*shake, sy=Math.cos(t*53)*18*shake, kick=1+0.05*Math.exp(-Math.max(0,dt)*6);
  SV.innerHTML=`<g transform="translate(${540+sx},${960+sy}) scale(${kick}) translate(-540,-960)">${s}</g>`;
}
render(0);

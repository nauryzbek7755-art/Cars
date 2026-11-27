// Renders proj/index.html frame by frame. Files are served to the page via Playwright request routing (no server).
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');const {spawn}=require('child_process');
const ROOT=path.join(__dirname,'proj');
const MIME={'.html':'text/html','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.js':'text/javascript'};
(async()=>{
  const mode=process.argv[2];const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
  p.on('console',m=>console.log('PAGE',m.text()));p.on('pageerror',e=>console.log('ERR',e.message));
  await p.route('http://local.test/**',async r=>{const u=new URL(r.request().url());const f=path.join(ROOT,decodeURIComponent(u.pathname));
    if(!f.startsWith(ROOT)||!fs.existsSync(f))return r.fulfill({status:404,body:''});
    r.fulfill({status:200,body:fs.readFileSync(f),contentType:MIME[path.extname(f)]||'application/octet-stream'})});
  await p.goto('http://local.test/index.html');const TL=await p.evaluate(()=>init());
  const grab=async t=>{await p.evaluate(t=>draw(t),t);return Buffer.from((await p.evaluate(()=>document.getElementById('c').toDataURL('image/jpeg',0.95))).split(',')[1],'base64')};
  if(mode==='stills'){const ts=process.argv[3].split(',').map(Number);for(const t of ts){fs.writeFileSync(`${process.argv[4]}/s_${t.toFixed(2)}.jpg`,await grab(t))}await b.close();return}
  const fps=60,N=Math.round(TL.total*fps);
  const ff=spawn('ffmpeg',['-y','-v','error','-f','image2pipe','-framerate',String(fps),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','medium','-crf','16','-pix_fmt','yuv420p',process.argv[3]],{stdio:['pipe','inherit','inherit']});
  const t0=Date.now();
  for(let i=0;i<N;i++){const buf=await grab(i/fps);if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));if(i%120==0)console.log('frame',i,'/',N,((Date.now()-t0)/1000).toFixed(0)+'s')}
  ff.stdin.end();await new Promise(r=>ff.on('close',r));await b.close();
})();

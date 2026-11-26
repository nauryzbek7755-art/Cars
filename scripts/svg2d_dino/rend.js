const {chromium}=require('playwright');const {spawn}=require('child_process');
(async()=>{const [,,T,out,preview]=process.argv;const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file://'+__dirname+'/index.html');await p.waitForTimeout(500);
if(preview){for(const t of preview.split(',')){await p.evaluate(`render(${t})`);await p.screenshot({path:`${__dirname}/pv_${t}.png`});}await b.close();return;}
const ff=spawn('ffmpeg',['-y','-v','error','-f','image2pipe','-framerate','30','-c:v','mjpeg','-i','-','-c:v','libx264','-preset','medium','-crf','17','-pix_fmt','yuv420p',out]);
const N=Math.round(parseFloat(T)*30);for(let n=0;n<N;n++){await p.evaluate(`render(${n/30})`);const buf=await p.screenshot({type:'jpeg',quality:94});if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));if(n%60==0)console.log(n,N);}
ff.stdin.end();await new Promise(r=>ff.on('close',r));await b.close();console.log('done');})();

// Renders the stinger frames with Playwright: node render-stingers.cjs <voyager|mda009|unprofessionals|all> <outDir> [fps] [seconds] (the animation stretches to the seconds given; 1.5 default, 2 for the all-three stinger)
// Then: ffmpeg -framerate 60 -i f%03d.png -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 0 -crf 22 -auto-alt-ref 0 Voyager_Stinger_<logo>.webm
const {chromium}=require('playwright');const fs=require('fs');(async()=>{
const [logo,outDir,fpsArg,durArg]=process.argv.slice(2);const fps=Number(fpsArg)||60,dur=Number(durArg)||1.5,n=Math.round(fps*dur);
fs.mkdirSync(outDir,{recursive:true});
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});
await p.goto('file://'+require('path').resolve(__dirname,'stinger.html')+'?logo='+logo+'&t=0&dur='+dur);await p.waitForTimeout(300);await p.evaluate(()=>document.fonts.ready);
for(let i=0;i<n;i++){await p.evaluate(t=>window.render(t),i/fps);await p.screenshot({path:`${outDir}/f${String(i).padStart(3,'0')}.png`,omitBackground:true});}
await b.close();console.log('frames',n);})();

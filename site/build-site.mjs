// Builds the GitHub Pages site: node site/build-site.mjs owner/repo outDir
//   /            viewer website (giveaways, winners, goals, leaderboards) reading the public feed
//   /download/   Voyager app download page
import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {join,resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
export const FEED_BRANCH='public-data';
const ASSETS=[['brand-assets/voyager.png','voyager.png'],['brand-assets/Rajdhani-600.ttf','Rajdhani-600.ttf'],['brand-assets/Rajdhani-700.ttf','Rajdhani-700.ttf'],['desktop/build/icon.png','icon.png']];
export async function buildSite(repo,out){
  if(!/^[A-Za-z0-9-]+\/[A-Za-z0-9_.-]+$/.test(repo||''))throw new Error('Pass the GitHub repository as owner/name.');
  const feed=`https://raw.githubusercontent.com/${repo}/${FEED_BRANCH}/feed.json`;
  for(const dir of [out,join(out,'download')]){
    await mkdir(join(dir,'assets'),{recursive:true});
    for(const [from,to] of ASSETS)await copyFile(join(root,from),join(dir,'assets',to));
  }
  const viewer=(await readFile(join(root,'site','viewer','index.html'),'utf8')).replace('<meta name="voyager-feed" content="feed.json">',`<meta name="voyager-feed" content="${feed}">`);
  if(!viewer.includes(feed))throw new Error('Viewer page is missing its feed placeholder.');
  await writeFile(join(out,'index.html'),viewer);
  await copyFile(join(root,'site','viewer','fair-draw.js'),join(out,'fair-draw.js'));
  await writeFile(join(out,'download','index.html'),(await readFile(join(root,'site','download.html'),'utf8')).replaceAll('__REPO__',repo));
  await writeFile(join(out,'.nojekyll'),'');
  return {out,feed};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  try{const r=await buildSite(process.argv[2],resolve(process.argv[3]||'_site'));console.log('Site written to '+r.out+'\nViewer feed: '+r.feed);}
  catch(e){console.error(e.message);process.exitCode=1;}
}

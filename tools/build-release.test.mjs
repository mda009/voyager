import {test} from 'node:test';
import assert from 'node:assert/strict';
import {inflateRawSync} from 'node:zlib';
import {EXCLUDE,zip,preflight,listFiles} from './build-release.mjs';

const excluded=p=>EXCLUDE.some(rx=>rx.test(p));
test('Live data, copies, build output and secrets folders never reach a release',()=>{
  for(const p of ['Voyager_Versus/local/data/economy.json','points - Copy.js','Voyager_Points_Engine - Copy.cs','.git/HEAD','desktop/node_modules/x/index.js','desktop/release/Voyager Setup.exe','dist-release/a.zip','Voyager_Versus/dist/Voyager-Versus.zip'])assert.ok(excluded(p),p);
  for(const p of ['config.js','Voyager_Versus/local/server.mjs','docs/updates/WHEEL_SETUP.txt','desktop/main.cjs','Voyager_Versus/dist/materials/manifest.json'])assert.ok(!excluded(p),p);
});
test('The ZIP writer produces readable entries with UTF-8 names',()=>{
  const data=Buffer.from('Voyager — rankings '.repeat(50));
  const out=zip([{name:'Voyager_Giveaway/Notes — é.txt',data,mtime:new Date(2026,9,29,11,30)}]);
  assert.equal(out.readUInt32LE(0),0x04034b50);
  const nameLen=out.readUInt16LE(26),size=out.readUInt32LE(18);
  assert.equal(out.subarray(30,30+nameLen).toString('utf8'),'Voyager_Giveaway/Notes — é.txt');
  assert.ok(inflateRawSync(out.subarray(30+nameLen,30+nameLen+size)).equals(data));
  assert.equal(out.readUInt32LE(out.length-22),0x06054b50);assert.equal(out.readUInt16LE(out.length-12),1);
});
test('This folder passes the release checks and contains no live data',async()=>{
  const {problems}=await preflight();assert.deepEqual(problems,[]);
  const files=await listFiles();assert.ok(files.includes('Voyager_System_Check.html'));assert.ok(!files.some(excluded));
});
import {section} from './release-notes.mjs';
test('Release notes come from the matching CHANGELOG section only',()=>{
  const md='# Log\n\n## 2.9.0 (x)\nNew things\n\n### Sub\n- a\n\n## 2.8.2\nOld';
  assert.equal(section(md,'2.9.0'),'New things\n\n### Sub\n- a');assert.equal(section(md,'3.0.0'),null);
});
import {buildSite} from '../site/build-site.mjs';
import {mkdtemp,readFile as rf,rm,access} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
test('The download page is built for the given repository with its assets',async()=>{
  const out=await mkdtemp(join(tmpdir(),'voyager-site-'));
  try{
    const r=await buildSite('mda009/voyager',out);
    const viewer=await rf(join(out,'index.html'),'utf8'),dl=await rf(join(out,'download','index.html'),'utf8');
    assert.equal(r.feed,'https://raw.githubusercontent.com/mda009/voyager/public-data/feed.json');assert.ok(viewer.includes('content="'+r.feed+'"'));
    assert.ok(!dl.includes('__REPO__'));assert.match(dl,/github\.com\/mda009\/voyager\/releases\/latest/);
    for(const f of ['assets/voyager.png','assets/icon.png','assets/Rajdhani-700.ttf','download/assets/voyager.png','.nojekyll'])await access(join(out,f));
    await assert.rejects(buildSite('not a repo',out),/owner\/name/);
  }finally{await rm(out,{recursive:true,force:true});}
});
import {headersFile,wranglerConfig,embedOrigins,DEFAULT_EMBED_ORIGINS,WORKER_NAME} from '../site/cloudflare.mjs';
test('Cloudflare settings: security headers allow only your store to embed the site',()=>{
  assert.deepEqual(embedOrigins(''),DEFAULT_EMBED_ORIGINS);
  assert.deepEqual(embedOrigins('https://Shop.Example.com, https://*.fourthwall.com'),['https://shop.example.com','https://*.fourthwall.com']);
  assert.throws(()=>embedOrigins('http://insecure.com'),/Embed origin/);assert.throws(()=>embedOrigins("https://a.com; script-src *"),/Embed origin/);
  const h=headersFile();
  assert.match(h,/frame-ancestors 'self' https:\/\/theunprofessionalsgroup\.com https:\/\/www\.theunprofessionalsgroup\.com https:\/\/\*\.fourthwall\.com/);
  assert.match(h,/connect-src 'self' https:\/\/raw\.githubusercontent\.com https:\/\/api\.github\.com/);
  const w=wranglerConfig('./_site');assert.equal(w.name,WORKER_NAME);assert.equal(w.assets.directory,'./_site');assert.ok(!('main' in w),'assets-only, no server code');
});

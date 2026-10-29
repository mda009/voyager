// Builds the release zip: node tools/build-release.mjs [--out folder]
// Leaves out live data, copies, secrets and build output, and refuses to build when
// duplicated files have drifted apart.
import {readdir,readFile,stat,mkdir,writeFile} from 'node:fs/promises';
import {join,relative,resolve,dirname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {deflateRawSync,crc32} from 'node:zlib';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const posix=p=>p.split(sep).join('/');

// Paths are relative to the repository root, using forward slashes.
export const EXCLUDE=[
  /^\.git(\/|$)/,/(^|\/)node_modules(\/|$)/,/^dist-release(\/|$)/,
  /^desktop\/release(\/|$)/,/^Voyager_Versus\/local\/data(\/|$)/,
  / - Copy(\.[^/]*)?$/i,/(^|\/)(Thumbs\.db|desktop\.ini|\.DS_Store)$/i,/\.(log|tmp)$/i,
  /^Voyager_Versus\/dist\/Voyager-Versus\.zip$/
];
// Files that exist in two places on purpose (docs refer to both); they must stay identical.
export const MIRRORS=[
  ['Voyager_Versus_Rewards.cs','Voyager_Versus/dist/Voyager-Versus-Rewards.cs'],
  ['Voyager_Versus_Rewards_Install.sb','Voyager_Versus/dist/Voyager-Versus-Rewards-Install.sb'],
  ['Voyager_Pilot_Leaderboard_Update.sb','Voyager_Versus/dist/Voyager_Pilot_Leaderboard_Update.sb'],
  ['docs/updates/PILOT_LEADERBOARD_SETUP.txt','Voyager_Versus/dist/PILOT_LEADERBOARD_SETUP.txt']
];

export async function listFiles(dir=root){
  const out=[];
  async function walk(d){
    for(const entry of await readdir(d,{withFileTypes:true})){
      const full=join(d,entry.name),rel=posix(relative(root,full));
      if(EXCLUDE.some(rx=>rx.test(rel)))continue;
      if(entry.isDirectory())await walk(full);else if(entry.isFile())out.push(rel);
    }
  }
  await walk(dir);return out.sort();
}

export async function preflight(){
  const problems=[];
  for(const [a,b] of MIRRORS){
    try{if(!(await readFile(join(root,a))).equals(await readFile(join(root,b))))problems.push(`${a} and ${b} differ. Update both copies.`);}
    catch(e){problems.push(`Missing ${e.path?posix(relative(root,e.path)):a}.`);}
  }
  const config=await readFile(join(root,'config.js'),'utf8');
  if(!/password:\s*""/.test(config))problems.push('config.js has a password in it. Release config.js must have password: "" so your password is never shared.');
  // A GitHub token pasted into a file by mistake must never be shipped.
  for(const rel of await listFiles()){
    if(!/\.(js|mjs|cjs|json|html|txt|md|cs|yml|css)$/i.test(rel))continue;
    if(/(github_pat_|ghp_)[A-Za-z0-9_]{30,}/.test(await readFile(join(root,rel),'utf8')))problems.push(rel+' contains what looks like a GitHub token. Remove it before releasing.');
  }
  const version=JSON.parse(await readFile(join(root,'Voyager_Versus/package.json'),'utf8')).version;
  const desktop=JSON.parse(await readFile(join(root,'desktop/package.json'),'utf8')).version;
  if(version!==desktop)problems.push(`Version mismatch: Voyager_Versus ${version}, desktop ${desktop}.`);
  if(!(await readFile(join(root,'CHANGELOG.md'),'utf8')).includes('## '+version))problems.push(`CHANGELOG.md has no "## ${version}" section.`);
  return {problems,version};
}

function dosTime(date){
  const d=new Date(Math.max(date.getTime(),Date.UTC(1980,0,1)));
  return {time:(d.getHours()<<11)|(d.getMinutes()<<5)|(d.getSeconds()>>1),date:((d.getFullYear()-1980)<<9)|((d.getMonth()+1)<<5)|d.getDate()};
}
// Small dependency-free ZIP writer (deflate, UTF-8 names). Enough for releases under 4 GB.
export function zip(entries){
  const parts=[],central=[];let offset=0;
  for(const {name,data,mtime} of entries){
    const nameBytes=Buffer.from(name,'utf8'),compressed=deflateRawSync(data,{level:9}),store=compressed.length>=data.length;
    const body=store?data:compressed,{time,date}=dosTime(mtime),crc=crc32(data);
    const local=Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50,0);local.writeUInt16LE(20,4);local.writeUInt16LE(0x0800,6);local.writeUInt16LE(store?0:8,8);
    local.writeUInt16LE(time,10);local.writeUInt16LE(date,12);local.writeUInt32LE(crc,14);local.writeUInt32LE(body.length,18);local.writeUInt32LE(data.length,22);
    local.writeUInt16LE(nameBytes.length,26);local.writeUInt16LE(0,28);
    const head=Buffer.alloc(46);
    head.writeUInt32LE(0x02014b50,0);head.writeUInt16LE(20,4);head.writeUInt16LE(20,6);head.writeUInt16LE(0x0800,8);head.writeUInt16LE(store?0:8,10);
    head.writeUInt16LE(time,12);head.writeUInt16LE(date,14);head.writeUInt32LE(crc,16);head.writeUInt32LE(body.length,20);head.writeUInt32LE(data.length,24);
    head.writeUInt16LE(nameBytes.length,28);head.writeUInt32LE(offset,42);
    parts.push(local,nameBytes,body);central.push(head,nameBytes);offset+=30+nameBytes.length+body.length;
  }
  const dir=Buffer.concat(central),end=Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50,0);end.writeUInt16LE(entries.length,8);end.writeUInt16LE(entries.length,10);end.writeUInt32LE(dir.length,12);end.writeUInt32LE(offset,16);
  return Buffer.concat([...parts,dir,end]);
}

async function entriesFor(files,prefix,strip=''){
  const out=[];
  for(const rel of files){const full=join(root,rel);out.push({name:prefix+rel.slice(strip.length),data:await readFile(full),mtime:(await stat(full)).mtime});}
  return out;
}

export async function buildRelease(outDir=join(root,'dist-release')){
  const {problems,version}=await preflight();
  if(problems.length)throw new Error('Release blocked:\n- '+problems.join('\n- '));
  const files=await listFiles();
  // The standalone Voyager Versus download offered on the Versus page, rebuilt from current files.
  const versusFiles=files.filter(f=>f.startsWith('Voyager_Versus/'));
  const versusZip=zip(await entriesFor(versusFiles,'Voyager-Versus/','Voyager_Versus/'));
  const entries=await entriesFor(files.filter(f=>!f.startsWith('desktop/node_modules')),'Voyager_Giveaway/');
  entries.push({name:'Voyager_Giveaway/Voyager_Versus/dist/Voyager-Versus.zip',data:versusZip,mtime:new Date()});
  entries.sort((a,b)=>a.name.localeCompare(b.name));
  await mkdir(outDir,{recursive:true});
  const file=join(outDir,`Voyager_Giveaway-${version}.zip`);
  await writeFile(file,zip(entries));
  return {file,version,count:entries.length,versusCount:versusFiles.length};
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  try{
    const i=process.argv.indexOf('--out');
    const result=await buildRelease(i>0?resolve(process.argv[i+1]):undefined);
    console.log(`Built ${result.file}\n${result.count} files (Voyager Versus standalone: ${result.versusCount} files). Live data, copies and secrets left out.`);
  }catch(e){console.error(e.message);process.exitCode=1;}
}

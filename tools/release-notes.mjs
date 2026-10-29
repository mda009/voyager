// Prints the CHANGELOG.md section for a version: node tools/release-notes.mjs 2.9.0
import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
export function section(markdown,version){
  const lines=markdown.split(/\r?\n/),start=lines.findIndex(l=>l.startsWith('## '+version));
  if(start<0)return null;
  let end=lines.findIndex((l,i)=>i>start&&/^## /.test(l));if(end<0)end=lines.length;
  return lines.slice(start+1,end).join('\n').trim();
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const version=process.argv[2]||JSON.parse(await readFile(resolve(root,'desktop/package.json'),'utf8')).version;
  const text=section(await readFile(resolve(root,'CHANGELOG.md'),'utf8'),version);
  if(!text){console.error('CHANGELOG.md has no "## '+version+'" section.');process.exitCode=1;}
  else console.log(text+'\n\n---\n**Windows app:** download `Voyager-Setup-'+version+'.exe` and run it. Windows may show "Windows protected your PC" because the installer is not code-signed yet; choose More info > Run anyway.\n\n**Folder version:** download `Voyager_Giveaway-'+version+'.zip` and follow "How to update" above.');
}

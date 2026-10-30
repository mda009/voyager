// Copies the Streamer.bot actions into generated/ with the stand-in base class (CI only).
// The first file keeps the name CPHInline (Test.cs runs it); the others get a numbered name so they compile together.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {join,dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const here=dirname(fileURLToPath(import.meta.url)),root=resolve(here,'../..');
await mkdir(join(here,'generated'),{recursive:true});
for(const [i,file] of process.argv.slice(2).entries()){
  const src=await readFile(join(root,file),'utf8');
  if(!src.includes('public class CPHInline'))throw new Error(file+': no CPHInline class');
  await writeFile(join(here,'generated',file),src.replace('public class CPHInline','public class CPHInline'+(i?'_'+i:'')+' : CphBase'));
}

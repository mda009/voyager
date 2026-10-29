// Cloudflare hosting for the public website (Workers static assets, free plan).
// Usage (run by the "Public website" workflow after build-site.mjs):
//   node site/cloudflare.mjs _site
// Writes _site/_headers (security headers) and wrangler.json (deploy settings) in the current folder.
// Allowed embedding sites come from VOYAGER_EMBED_ORIGINS (comma separated); see DEFAULT_EMBED_ORIGINS.
import {writeFile} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

export const WORKER_NAME='voyager-site';
// Your Fourthwall store (including Fourthwall's own editor preview) may show the site in a frame.
export const DEFAULT_EMBED_ORIGINS=['https://theunprofessionalsgroup.com','https://www.theunprofessionalsgroup.com','https://*.fourthwall.com'];

export function embedOrigins(raw){
  const list=(raw??'').trim()?String(raw).split(','):DEFAULT_EMBED_ORIGINS;
  const out=[];
  for(const item of list.map(s=>s.trim()).filter(Boolean)){
    if(!/^https:\/\/(\*\.)?[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(item))throw new Error('Embed origin must look like https://example.com or https://*.example.com: '+item);
    out.push(item.toLowerCase());
  }
  return [...new Set(out)];
}

export function headersFile(origins=DEFAULT_EMBED_ORIGINS){
  const csp=["default-src 'self'","script-src 'self' 'unsafe-inline'","style-src 'self' 'unsafe-inline'","img-src 'self' data:","font-src 'self'",
    "connect-src 'self' https://raw.githubusercontent.com https://api.github.com","frame-ancestors 'self' "+origins.join(' '),
    "base-uri 'none'","form-action 'none'","object-src 'none'"].join('; ');
  return `/*
  Content-Security-Policy: ${csp}
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
/assets/*
  Cache-Control: public, max-age=604800
`;
}

export function wranglerConfig(assetsDir='./_site'){
  // Assets-only Worker: no server code. Custom domains are added once in the Cloudflare dashboard.
  return {name:WORKER_NAME,compatibility_date:'2025-10-01',assets:{directory:assetsDir},workers_dev:true,observability:{enabled:false}};
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  try{
    const dir=process.argv[2]||'_site';
    await writeFile(join(dir,'_headers'),headersFile(embedOrigins(process.env.VOYAGER_EMBED_ORIGINS)));
    await writeFile('wrangler.json',JSON.stringify(wranglerConfig('./'+dir.replace(/^\.\//,'')),null,2));
    console.log('Cloudflare settings written: '+join(dir,'_headers')+' and wrangler.json');
  }catch(e){console.error(e.message);process.exitCode=1;}
}

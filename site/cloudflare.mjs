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

// object-src 'self' (not 'none'): Chromium will not show the member manual PDF without it.
export function headersFile(origins=DEFAULT_EMBED_ORIGINS){
  const csp=["default-src 'self'","script-src 'self' 'unsafe-inline'","style-src 'self' 'unsafe-inline'","img-src 'self' data: https://robertsspaceindustries.com https://fleetyards.net https://*.fleetyards.net","font-src 'self'",
    "connect-src 'self' https://raw.githubusercontent.com https://api.github.com","frame-ancestors 'self' "+origins.join(' '),
    "frame-src https://player.twitch.tv","worker-src 'self'","base-uri 'none'","form-action 'none'","object-src 'self'"].join('; ');
  return `/*
  Content-Security-Policy: ${csp}
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
/assets/*
  Cache-Control: public, max-age=604800
/*.js
  Cache-Control: public, max-age=0, must-revalidate
/index.html
  Cache-Control: public, max-age=0, must-revalidate
/manual.pdf
  Content-Disposition: inline; filename="Voyager-Member-Manual.pdf"
  Cache-Control: public, max-age=3600
`;
}

export function wranglerConfig(assetsDir='./_site',{pushKv='',feedUrl=''}={}){
  // Without notification storage: an assets-only Worker, no server code. Custom domains are added once in the Cloudflare dashboard.
  const base={name:WORKER_NAME,compatibility_date:'2025-10-01',assets:{directory:assetsDir},workers_dev:true,observability:{enabled:false}};
  if(!/^[0-9a-f]{32}$/.test(pushKv))return base;
  // 2.23.0 notifications: site/worker.mjs answers /api/push/*, reads the public feed once a minute (cron) and sends Web Push.
  // PUSH = the KV namespace with subscriptions and keys; SELF = the Worker calling itself for the next batch of sends.
  return {...base,main:'site/worker.mjs',assets:{directory:assetsDir,binding:'ASSETS'},kv_namespaces:[{binding:'PUSH',id:pushKv}],triggers:{crons:['* * * * *']},
    services:[{binding:'SELF',service:WORKER_NAME}],vars:{FEED_URL:feedUrl,SUBJECT:'https://voyagercommand.com'}};
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  try{
    const dir=process.argv[2]||'_site';
    await writeFile(join(dir,'_headers'),headersFile(embedOrigins(process.env.VOYAGER_EMBED_ORIGINS)));
    const repo=process.env.GITHUB_REPOSITORY||'',pushKv=(process.env.VOYAGER_PUSH_KV||'').trim();
    await writeFile('wrangler.json',JSON.stringify(wranglerConfig('./'+dir.replace(/^\.\//,''),{pushKv,feedUrl:repo?`https://raw.githubusercontent.com/${repo}/public-data/feed.json`:''}),null,2));
    console.log(pushKv?'Notifications: on (storage '+pushKv.slice(0,6)+'…)':'Notifications: off (no storage; the site is deployed without them)');
    console.log('Cloudflare settings written: '+join(dir,'_headers')+' and wrangler.json');
  }catch(e){console.error(e.message);process.exitCode=1;}
}

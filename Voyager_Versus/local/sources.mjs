/* Voyager OBS sources (2.21.0). One catalogue of every browser source Voyager draws, and when OBS (or the stage) last asked
   each page for its data, so Voyager Control › Screen & overlays can show the whole screen set-up in one list with a health
   light per source instead of an "OBS" card on every page.

   How a page is known to be loaded: the host serves its pages with Referrer-Policy: same-origin, so every /api request a page
   makes carries the page's own path in the Referer header. `touch(req)` records that path. Pages that keep an EventSource open
   (the Versus arena, the next-battle timer) count as loaded while the stream is open. Sources that talk to Streamer.bot
   directly (giveaway overlays, banner) cannot be seen from here and say so. */

const seconds=30;

// page: the address to put in OBS (relative to the host). api: the API path the page polls, used when no Referer arrives
// (older cached copies, or a page opened from a file). sb: true = driven by Streamer.bot, Voyager cannot see it.
export const CATALOGUE=[
  {key:'stage',group:'Takeovers',name:'Dreadnought & Versus stage',page:'/control/stage.html',size:'1920 × 1080 (fills a 4K canvas)',note:'Top of every scene you stream from. Transparent until a Dreadnought or Versus call.',api:'/api/stage/overlay',setup:'Voyager_Dreadnought.html#stage'},
  {key:'dreadnought',group:'Takeovers',name:'Dreadnought arena',page:'/dreadnought.html',size:'1920 × 1080',note:'The fight itself. The stage shows it in the middle; keep this source too for scenes without the stage.',api:'/api/boss/overlay',setup:'Voyager_Dreadnought.html'},
  {key:'versus',group:'Takeovers',name:'Versus arena',page:'/index.html?overlay=1',size:'1920 × 1080',note:'Calling splash, ships, countdown and effects.',sse:'/index.html',setup:'Voyager_Versus.html'},
  {key:'moments',group:'Always on',name:'On-screen moments',page:'/control/Voyager_Moments.html',size:'1920 × 1080',note:'Command hints, crew surge, right-now ticker, medal toasts, points chips, promotion ceremony, Dreadnought HUD.',api:'/api/moments/overlay',setup:'Voyager_Moments_Control.html'},
  {key:'card',group:'Always on',name:'Membership cards & promotions',page:'/card.html',size:'1920 × 1080',note:'Welcome aboard, tier-ups and !voyager cards.',api:'/api/cards/overlay',setup:'Voyager_Membership_Cards.html'},
  {key:'medals',group:'Always on',name:'Medal toasts',page:'/medals.html',size:'1920 × 1080',note:'Medal unlock toasts.',api:'/api/medals/overlay',setup:'Voyager_Medals.html'},
  {key:'fleet',group:'Always on',name:'Support alerts (Fleet overlay)',page:'/control/Voyager_Fleet_Overlay.html',size:'1920 × 1080',note:'Follows, subs, gifts, bits and raids.',api:'/api/fleet/overlay',setup:'Voyager_Fleet_Control.html'},
  {key:'camera',group:'Always on',name:'Camera frame',page:'/control/Voyager_Camera_Frame.html',size:'Same size as your camera',note:'Frame and spotlight around your camera.',api:'/api/fleet/overlay',setup:'Voyager_Fleet_Control.html'},
  {key:'engage',group:'Always on',name:'Chat engagement',page:'/engage.html',size:'1920 × 1080',note:'Arrival cards, Bridge Quiz, squadron war panel.',api:'/api/engage/overlay',setup:'Voyager_Engage.html'},
  {key:'goalfx',group:'Always on',name:'Goal FX celebrations',page:'/control/Voyager_Goal_FX.html',size:'1920 × 1080',note:'Silver, Gold and Platinum goal celebrations.',api:'/api/goalfx/overlay',setup:'Voyager_Streamerbot.html'},
  {key:'leaderboard',group:'Panels',name:'Leaderboard panel',page:'/control/Voyager_Leaderboard_Panel.html',size:'1920 × 1080',note:'Ranks and points, shown from Live.',api:'/api/cards/ranks/overlay',setup:'Voyager_Ranks.html'},
  {key:'intel',group:'Panels',name:'SC Intel panel',page:'/control/Voyager_SC_Intel_Panel.html',size:'640 × 400',note:'Star Citizen news, ships in the pledge store, deals and events; cycles every 12 s. Place it where you like.',api:'/api/intel/panel',setup:'Voyager_SC_Intel.html'},
  {key:'community',group:'Panels',name:'Community panel',page:'/control/Voyager_Community_Panel.html',size:'1920 × 1080',note:'Community goals, standings, contributors, missions, Hall of Fame; pick which from Live.',api:'/api/community/overlay',setup:'Voyager_Seasons.html'},
  {key:'christmas',group:'Panels',name:'Christmas goal panel',page:'/control/Voyager_Christmas_Goal.html',size:'1920 × 1080',note:'Shows by itself while a festive goal runs.',api:'/api/community/overlay',setup:'Voyager_Seasons.html'},
  {key:'bucket',group:'Panels',name:'Giveaway goals strip',page:'/control/Voyager_Bucket_Overlay.html',size:'3840 × 480',note:'Silver / Gold / Platinum progress strip; shown and hidden from On-screen moments.',api:'/api/moments/overlay',setup:'Voyager_Moments_Control.html'},
  {key:'live',group:'Panels',name:'Live stats strip',page:'/control/Voyager_Live_Overlay.html',size:'1920 × 64',note:'Viewers and audiences across platforms.',api:'/api/live-overlay',setup:'Voyager_Command_Center.html?page=live'},
  {key:'cooldown',group:'Versus extras',name:'Next-battle timer',page:'/cooldown.html',size:'640 × 240',note:'45-minute countdown; READY when the next live call is available.',sse:'/cooldown.html',setup:'Voyager_Versus.html'},
  {key:'ready',group:'Versus extras',name:'Versus ready alert',page:'/versuscall.html',size:'1000 × 320',note:'!versus banner with your “Are You Ready” audio. Played by Streamer.bot.',sb:true,setup:'Voyager_Versus.html'},
  {key:'giveaway',group:'Giveaways (Streamer.bot)',name:'Giveaway reveal',page:'/control/Voyager_Giveaway_Overlay.html',size:'1920 × 1080',note:'Driven by the Giveaway Engine in Streamer.bot.',sb:true,setup:'Giveaway_Control.html'},
  {key:'ticket',group:'Giveaways (Streamer.bot)',name:'Ticketed giveaway reveal',page:'/control/Voyager_Ticket_Overlay.html',size:'1920 × 1080',note:'Driven by the Giveaway Engine in Streamer.bot.',sb:true,setup:'Voyager_Ticket_Giveaway.html'},
  {key:'entrants',group:'Giveaways (Streamer.bot)',name:'Entrant panel',page:'/control/Voyager_Entrant_Panel.html',size:'1920 × 1080',note:'Who has entered, from Streamer.bot.',sb:true,setup:'Voyager_Entrant_Board.html'},
  {key:'banner',group:'Giveaways (Streamer.bot)',name:'Stream banner',page:'/control/Voyager_Banner_Overlay.html',size:'1920 × 1080',note:'Rotating messages saved in Streamer.bot.',sb:true,setup:'Voyager_Banner_Control.html'}
];

export class Sources{
  constructor({now=Date.now}={}){this.now=now;this.seenPage=new Map();this.seenApi=new Map();this.streams=new Map();}
  // Call for every /api request. Records the page that asked (Referer) and the API path itself.
  touch(req,pathname){
    const at=this.now(),ref=req.headers?.referer;
    // With a Referer the page is known exactly; without one (an old cached copy) only the API path says anything, and a
    // request that did carry a page is not counted against the path, so a page that polls two APIs does not light up another source.
    try{if(ref){const u=new URL(ref);if(u.host===req.headers.host){this.seenPage.set(u.pathname,at);return;}}}catch{}
    this.seenApi.set(pathname,at);
  }
  // An open EventSource from a page: loaded while it stays open.
  stream(req,res){
    const ref=req.headers?.referer;let path='';try{if(ref)path=new URL(ref).pathname;}catch{}
    if(!path)return;this.streams.set(res,path);res.on?.('close',()=>this.streams.delete(res));
  }
  seenAt(entry){
    let at=this.seenPage.get(entry.page.split('?')[0])||0;
    if(entry.sse&&[...this.streams.values()].includes(entry.sse))at=this.now();
    return at;
  }
  // Loaded = asked within the last 30 s. Pages that share an API path (Christmas + Community panel) fall back to the API only
  // when no page has been seen at all, so an old cached copy still reads as loaded rather than missing.
  list(){
    const now=this.now();
    return CATALOGUE.map(e=>{
      if(e.sb)return {...e,state:'sb',seenAt:0};
      let at=this.seenAt(e);let via='page';
      if(!at&&e.api&&!CATALOGUE.some(o=>o!==e&&o.api===e.api&&this.seenAt(o))){at=this.seenApi.get(e.api)||0;via='api';}
      const live=at&&now-at<seconds*1000;
      return {...e,seenAt:at,state:live?'ok':at?'stale':'off',via};
    });
  }
  summary(){const l=this.list().filter(e=>!e.sb);return {total:l.length,loaded:l.filter(e=>e.state==='ok').length,stale:l.filter(e=>e.state==='stale').length};}
}

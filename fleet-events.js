/* Voyager Fleet 1.5: shared platform names, event choices and safe caption text. */
(()=>{'use strict';
const events=[
 ['TwitchFollow','twitch',1,'Follow'],['TwitchSub','twitch',2,'Subscription'],['TwitchGiftSub','twitch',3,'Gift subscription'],['TwitchGiftBomb','twitch',3,'Gift subscriptions'],['TwitchReSub','twitch',4,'Resubscription'],['TwitchCheer','twitch',5,'Bits'],['TwitchRaid','twitch',6,'Incoming raid'],
 ['YouTubeNewSubscriber','youtube',1,'New subscriber'],['YouTubeNewSponsor','youtube',2,'New membership'],['YouTubeMembershipGift','youtube',3,'Membership gift'],['YouTubeGiftMembershipReceived','youtube',2,'Gift membership received'],['YouTubeMemberMileStone','youtube',4,'Member milestone'],['YouTubeSuperChat','youtube',5,'Super Chat'],['YouTubeSuperSticker','youtube',5,'Super Sticker'],['YouTubeJewelsGifted','youtube',5,'Jewels gifted'],
 ['KickFollow','kick',1,'Follow'],['KickSubscription','kick',2,'Subscription'],['KickGiftSubscription','kick',3,'Gift subscription'],['KickMassGiftSubscription','kick',3,'Mass gift subscriptions'],['KickResubscription','kick',4,'Resubscription'],['KickKicksGifted','kick',5,'Kicks gifted']
].map(([source,platform,stage,label])=>({source,platform,stage,label}));
const platformName=p=>({youtube:'YouTube',kick:'Kick',twitch:'Twitch'}[p]||'Twitch'),fmt=n=>Number(n||0).toLocaleString();
function definition(e){return events.find(x=>x.source===e.source)||events.find(x=>x.platform===(e.platform||'twitch')&&x.stage===Number(e.stage))||events[0];}
function caption(e){const d=definition(e),stage=d.stage,yt=d.platform==='youtube',amount=Number(e.amount||1),months=Number(e.months||1);let label=d.label,headline='',detail='';
if(stage===1)headline=yt?'Thank you for subscribing!':'Thank you for the follow!';
if(stage===2){headline=yt?'Thank you for becoming a member!':'Thank you for the subscription!';detail=e.tier||(yt?'Channel member':'Subscriber');}
if(stage===3){const unit=yt?'membership':'subscription';headline='Thank you for the gift '+unit+(amount===1?'':'s')+'!';detail=fmt(amount)+' gifted '+unit+(amount===1?'':'s')+(e.recipient?' · To '+e.recipient:'');}
if(stage===4){headline=yt?'Thank you for your continued membership!':'Thank you for resubscribing!';detail=fmt(months)+' '+(months===1?'month':'months')+' of support';}
if(stage===5){headline='Thank you for the '+d.label.replace(' gifted','')+'!';detail=d.source==='YouTubeSuperChat'||d.source==='YouTubeSuperSticker'?[e.displayAmount,e.currencyCode].filter(Boolean).join(' ')||d.label:fmt(amount)+' '+(d.source==='TwitchCheer'?'bits':d.source==='KickKicksGifted'?'Kicks':'Jewels');if(e.supportName)detail+=' · '+e.supportName;}
if(stage===6){headline='The base is under attack!';detail=fmt(amount)+' '+(amount===1?'raider':'raiders')+' incoming';}
if(d.source==='TwitchCheer')headline='Thank you for the bits!';
if(d.source==='YouTubeGiftMembershipReceived'){headline='Welcome to the fleet!';detail='Gifted membership'+(e.gifter?' · From '+e.gifter:'');}
if(d.source==='YouTubeNewSponsor'&&e.isUpgrade){label='Membership upgrade';headline='Thank you for upgrading your membership!';}
return {platform:platformName(d.platform),label,eyebrow:platformName(d.platform).toUpperCase()+' / '+label.toUpperCase(),headline,detail};}
function support(u){const parts=[];for(const [key,label]of [['bits','bits'],['kicks','Kicks'],['jewels','Jewels'],['superChat','Super Chats'],['superSticker','Super Stickers']])if(Number(u[key]))parts.push(fmt(u[key])+' '+label);return parts.join(' · ')||'—';}
window.VoyagerFleetEvents={events,definition,caption,platformName,support};
})();

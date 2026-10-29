/* Shared by the OBS source and both control previews. Text is never interpreted as HTML. */
(()=>{'use strict';
class BannerRenderer{
 constructor(stage){this.stage=stage;this.track=stage.querySelector('.banner-track');this.current=null;this.width=0;this.baseWidth=0;this.resize=()=>this.layout();if(typeof ResizeObserver!=='undefined'){this.observer=new ResizeObserver(this.resize);this.observer.observe(stage);}else window.addEventListener('resize',this.resize);document.fonts?.ready.then(()=>this.layout(true));}
 render(raw){const next=window.VoyagerBannerModel.settings(raw),prior=this.current;this.current=next;const s=this.stage.style;for(const [key,value]of Object.entries({'--banner-text':next.textColor,'--banner-border':next.borderColor,'--banner-glow-rgb':[1,3,5].map(i=>parseInt(next.glowColor.slice(i,i+2),16)).join(','),'--banner-opacity':next.opacity/100,'--banner-font':next.fontSize+'px','--banner-height':next.height+'px','--banner-spacing':next.letterSpacing+'px'}))s.setProperty(key,String(value));this.stage.dataset.visible=String(next.visible);this.stage.dataset.running=String(next.visible&&!next.paused);this.stage.dataset.uppercase=String(next.uppercase);this.stage.dataset.scanlines=String(next.scanlines);
  if(!prior||!window.VoyagerBannerModel.same(prior.messages,next.messages)||['fontSize','letterSpacing','uppercase','separator'].some(k=>prior[k]!==next[k]))this.layout(true);else if(prior.speed!==next.speed)this.duration();
 }
 layout(force=false){if(!this.current)return;const width=this.stage.clientWidth||1920;if(!force&&this.width===width)return;this.width=width;this.track.style.animation='none';this.track.replaceChildren();const first=document.createElement('div');first.className='banner-group';
  const add=()=>{for(const message of this.current.messages){const text=document.createElement('span');text.className='banner-message';text.textContent=message;const sep=document.createElement('span');sep.className='banner-separator';sep.setAttribute('aria-hidden','true');if(this.current.separator==='⯁')sep.dataset.shape='diamond';else sep.textContent=this.current.separator;first.append(text,sep);}};add();this.track.append(first);
  // Fill at least one viewport so short announcements also loop without a blank screen.
  let count=1;while(first.scrollWidth>0&&first.scrollWidth<width&&count++<256)add();
  this.baseWidth=Math.max(1,first.scrollWidth||width);const duplicate=first.cloneNode(true);duplicate.setAttribute('aria-hidden','true');this.track.append(duplicate);this.stage.style.setProperty('--banner-travel',this.baseWidth+'px');this.duration();void this.track.offsetWidth;this.track.style.animation='';
 }
 duration(){if(this.current)this.stage.style.setProperty('--banner-duration',(this.baseWidth/this.current.speed)+'s');}
 destroy(){this.observer?.disconnect();window.removeEventListener('resize',this.resize);}
}
window.VoyagerBannerRenderer=BannerRenderer;
})();

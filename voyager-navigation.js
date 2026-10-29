/* Consistent dashboard links across Voyager, including offline previews. */
(()=>{'use strict';
const params=new URLSearchParams(location.search),demo=params.get('demo')==='1',page=window.VOYAGER_PAGE||'';
const isHome=a=>{try{const u=new URL(a.getAttribute('href'),location.href);return u.pathname.split('/').pop()==='Voyager_Command_Center.html'&&!u.searchParams.has('page');}catch{return false;}};
for(const home of [...document.querySelectorAll('aside.sidebar > a[href]')].filter(a=>isHome(a)&&!a.classList.contains('brand'))){const nav=document.createElement('nav');nav.setAttribute('aria-label','Voyager dashboards');home.before(nav);nav.append(home);}
for(const nav of document.querySelectorAll('nav')){
 const home=[...nav.querySelectorAll('a[href]')].find(isHome);if(!home)continue;
 if(!nav.querySelector('[data-dashboard-page="live"]')){
  for(const [key,label,symbol]of [['reporting','Reporting','▥'],['live','Live dashboard','◉']]){const a=document.createElement('a');a.href='Voyager_Command_Center.html?page='+key;a.dataset.dashboardPage=key;a.textContent=symbol+'  '+label;if(home.classList.contains('help-link'))a.className='help-link';home.after(a);}
 }
 if(!nav.querySelector('a[href*="Voyager_Ticket_Giveaway.html"]')){const a=document.createElement('a');a.href='Voyager_Ticket_Giveaway.html';a.textContent='◇  Ticketed giveaway';if(home.classList.contains('help-link'))a.className='help-link';nav.append(a);}
 if(!nav.querySelector('a[href*="Voyager_Fleet_Control.html"]')){const a=document.createElement('a');a.href='Voyager_Fleet_Control.html';a.textContent='✧  Fleet alerts';if(home.classList.contains('help-link'))a.className='help-link';nav.append(a);}
 if(!demo&&!nav.querySelector('a[href*="Voyager_Public_Site.html"]')){const a=document.createElement('a');a.href='Voyager_Public_Site.html';a.textContent='◎  Public website';if(home.classList.contains('help-link'))a.className='help-link';nav.append(a);}
 if(!demo&&!nav.querySelector('a[href*="Voyager_System_Check.html"]')){const a=document.createElement('a');a.href='Voyager_System_Check.html';a.textContent='✓  System check';if(home.classList.contains('help-link'))a.className='help-link';nav.append(a);}
 if(page){for(const a of nav.querySelectorAll('a')){const target=a.dataset.dashboardPage||'home';a.classList.toggle('active',a===home?page==='home':a.hasAttribute('data-dashboard-page')&&target===page);if(a.classList.contains('active'))a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');}}
}
if(demo)for(const a of document.querySelectorAll('a[href]')){
 const raw=a.getAttribute('href');if(!raw||/^(?:[a-z]+:|#|\/)/i.test(raw))continue;
 const target=new URL(raw,location.href),name=target.pathname.split('/').pop();
 if(['Voyager_Fleet_Control.html','Voyager_Ticket_Giveaway.html','Voyager_Command_Center.html','Voyager_Live_Dashboard.html','Voyager_Reporting.html','Voyager_Points.html','Giveaway_Control.html','Voyager_Banner_Control.html','Voyager_Security.html','Voyager_Versus.html'].includes(name)&&!a.closest('#demo-banner')){target.searchParams.set('demo','1');a.href=target.href;}
}
})();

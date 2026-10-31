// Voyager membership card markup (2.19), generated from the approved "tier glass" design (Membership cards canvas).
// cardHTML(t, v, c, d): t = tier look (TIERS), v = which side/banner shows, c = text bits, d = lists (fields, stats, ...).
export const TIERS = {
      blue: { title: 'BLUE EXPLORER', tier: 'TIER 1', role: 'Explorer of the Voyager fleet', accent: '#3fb2ff', edgeSoft: 'rgba(63,178,255,.5)', glow: 'rgba(20,120,255,.75)', rim: 'rgba(90,185,255,.95)',
        tint: 'radial-gradient(ellipse at 80% 20%, rgba(25,110,255,.46), rgba(15,65,190,.28) 45%, rgba(8,36,120,.16) 80%)', iconBg: 'rgba(40,140,255,.26)', plate: 'rgba(25,110,255,.34)',
        metal: 'linear-gradient(180deg,#ffffff 0%,#cdeaff 20%,#6cc0ff 44%,#0b4fd0 50%,#1f7cf0 60%,#8fd2ff 82%,#e6f5ff 100%)', c1: '#eef8ff', c2: '#5fb8ff', c3: '#0a49c4', c4: '#bfe3ff', p1: '#1f66e8', p2: '#0a2466', rimHex: '#5cb6ff', nebula: '#1d6cff',
        space: 'radial-gradient(ellipse at 75% 25%, #0b3384 0%, #061a40 45%, #02060f 100%)', planet: 'radial-gradient(ellipse at 40% 10%, #1f62d6 0%, #0b2c6e 30%, #030a18 62%)',
        next: 'SILVER SENTINEL', pct: '62%', need: 'Silver at 3 months subscribed or 5 gifted subs · 2 gifts to go',
        motto: 'EXPLORE • EARN • EXCEL', line: 'EVERY JOURNEY BEGINS WITH EXPLORATION.' },
      silver: { title: 'SILVER SENTINEL', tier: 'TIER 2', role: 'Sentinel of the Voyager fleet', accent: '#eef3f9', edgeSoft: 'rgba(232,240,248,.48)', glow: 'rgba(214,228,244,.48)', rim: 'rgba(245,249,253,.95)',
        tint: 'radial-gradient(ellipse at 80% 20%, rgba(220,232,246,.30), rgba(150,165,184,.18) 45%, rgba(90,102,120,.12) 80%)', iconBg: 'rgba(230,238,248,.2)', plate: 'rgba(205,218,234,.26)',
        metal: 'linear-gradient(180deg,#ffffff 0%,#f6f9fc 20%,#c8d2de 44%,#3a4552 50%,#7f8c9b 60%,#e2e9f1 82%,#ffffff 100%)', c1: '#ffffff', c2: '#d5dde7', c3: '#3f4a57', c4: '#f2f6fa', p1: '#8a95a3', p2: '#2a313b', rimHex: '#f0f5fb', nebula: '#b0bccc',
        space: 'radial-gradient(ellipse at 75% 25%, #333b47 0%, #161b22 45%, #040507 100%)', planet: 'radial-gradient(ellipse at 40% 10%, #818b98 0%, #2f353e 30%, #07080a 62%)',
        next: 'GOLD COMMANDER', pct: '68%', need: 'Gold at 9 months subscribed or 20 gifted subs · 3 months to go',
        motto: 'LOYALTY • SUPPORT • STRENGTH IN NUMBERS', line: 'TOGETHER WE EXPLORE. TOGETHER WE EXCEL.' },
      gold: { title: 'GOLD COMMANDER', tier: 'TIER 3', role: 'Commander of the Voyager fleet', accent: '#ffc53d', edgeSoft: 'rgba(255,197,61,.52)', glow: 'rgba(255,165,20,.7)', rim: 'rgba(255,200,80,.95)',
        tint: 'radial-gradient(ellipse at 80% 20%, rgba(255,170,30,.42), rgba(190,115,10,.26) 45%, rgba(110,62,5,.15) 80%)', iconBg: 'rgba(255,180,40,.26)', plate: 'rgba(240,160,25,.34)',
        metal: 'linear-gradient(180deg,#fffbea 0%,#ffe48a 20%,#ffbf2e 44%,#6e4300 50%,#c08000 60%,#ffd25a 82%,#fff1b8 100%)', c1: '#fff5cf', c2: '#ffc53d', c3: '#7a4d00', c4: '#ffe08a', p1: '#d08a12', p2: '#55330a', rimHex: '#ffc74a', nebula: '#ff8a12',
        space: 'radial-gradient(ellipse at 75% 25%, #5c3a04 0%, #241503 45%, #080401 100%)', planet: 'radial-gradient(ellipse at 40% 10%, #c4861a 0%, #57370a 30%, #0d0802 62%)',
        next: 'PLATINUM VANGUARD', pct: '81%', need: 'Vanguard at 18 months subscribed or 50 gifted subs · 4 months to go',
        motto: 'LEAD • PROTECT • INSPIRE', line: 'LEADING THE WAY THROUGH THE STARS.' },
      platinum: { title: 'PLATINUM VANGUARD', tier: 'TIER VANGUARD', role: 'Vanguard of the Voyager fleet', accent: '#c08bff', edgeSoft: 'rgba(185,130,255,.55)', glow: 'rgba(140,60,255,.8)', rim: 'rgba(215,180,255,.98)',
        tint: 'radial-gradient(ellipse at 80% 20%, rgba(150,80,255,.36), rgba(100,40,220,.22) 45%, rgba(60,20,150,.14) 80%)', iconBg: 'rgba(160,100,255,.24)', plate: 'rgba(140,70,255,.3)',
        metal: 'linear-gradient(180deg,#ffffff 0%,#faf5ff 16%,#e2ccff 36%,#a87cf0 46%,#1a0b3a 50%,#5a32b0 57%,#d06bff 68%,#e8d6ff 82%,#ffffff 94%,#f3eaff 100%)', c1: '#ffffff', c2: '#d2b2ff', c3: '#3a1a8a', c4: '#f4ecff', p1: '#7a3cf0', p2: '#1c0b48', rimHex: '#b57cff', nebula: '#8a3cff',
        space: 'radial-gradient(ellipse at 75% 25%, #2a0f5c 0%, #0f0624 45%, #000000 100%)', planet: 'radial-gradient(ellipse at 40% 10%, #7a3cf0 0%, #24104e 30%, #030108 62%)',
        next: 'MAX TIER REACHED', pct: '100%', need: 'Vanguard of the fleet · 14 months subscribed · 31 subs gifted',
        motto: 'LEAD • DEFEND • INSPIRE', line: 'VANGUARD IN PURPOSE. UNITED IN THE VERSE.' }
    };
const e=x=>String(x??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
export function cardHTML(t,v,c,d){
  return `<div style="width: 1360px; height: 880px; position: relative; overflow: hidden; font-family: Rajdhani, 'Segoe UI', sans-serif; color: #f4f7fb; background: ${e(t.space)}">
  <div style="position: absolute; inset: 0; background-image: radial-gradient(1px 1px at 8% 14%, rgba(255,255,255,.8) 50%, transparent 51%), radial-gradient(.8px .8px at 18% 40%, rgba(255,255,255,.6) 50%, transparent 51%), radial-gradient(.8px .8px at 38% 22%, rgba(255,255,255,.5) 50%, transparent 51%), radial-gradient(1.8px 1.8px at 64% 12%, #fff 50%, transparent 51%), radial-gradient(.8px .8px at 86% 8%, rgba(255,255,255,.6) 50%, transparent 51%), radial-gradient(.8px .8px at 44% 94%, rgba(255,255,255,.5) 50%, transparent 51%), radial-gradient(1px 1px at 27% 86%, rgba(255,255,255,.6) 50%, transparent 51%), radial-gradient(1.4px 1.4px at 52% 6%, rgba(255,255,255,.8) 50%, transparent 51%), radial-gradient(1px 1px at 74% 30%, rgba(255,255,255,.6) 50%, transparent 51%), radial-gradient(1px 1px at 95% 52%, rgba(255,255,255,.7) 50%, transparent 51%), radial-gradient(1.4px 1.4px at 4% 64%, rgba(255,255,255,.7) 50%, transparent 51%)"></div>
  <svg viewBox="0 0 1360 880" aria-hidden="true" style="position: absolute; inset: 0; width: 1360px; height: 880px">
    <defs>
      <filter id="neb" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".0026 .0042" numOctaves="5" seed="7"></feTurbulence><feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1.6 -0.75"></feColorMatrix></filter>
      <filter id="surf" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".004 .022" numOctaves="6" seed="3"></feTurbulence><feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .9 -0.2"></feColorMatrix></filter>
      <radialGradient id="planetLight" cx=".38" cy=".06" r=".75"><stop offset="0" stop-color="${e(t.p1)}"></stop><stop offset=".35" stop-color="${e(t.p2)}"></stop><stop offset=".75" stop-color="#020408"></stop></radialGradient>
      <radialGradient id="atmo" cx=".5" cy=".5" r=".5"><stop offset=".9" stop-color="${e(t.p1)}" stop-opacity="0"></stop><stop offset=".965" stop-color="${e(t.rimHex)}" stop-opacity=".9"></stop><stop offset="1" stop-color="${e(t.rimHex)}" stop-opacity="0"></stop></radialGradient>
      <clipPath id="planetClip"><circle cx="1110" cy="1330" r="720"></circle></clipPath>
    </defs>
    <rect width="1360" height="880" fill="${e(t.nebula)}" filter="url(#neb)" opacity=".42"></rect>
    <circle cx="1110" cy="1330" r="760" fill="url(#atmo)"></circle>
    <circle cx="1110" cy="1330" r="720" fill="url(#planetLight)"></circle>
    <g clip-path="url(#planetClip)"><rect x="380" y="600" width="1460" height="740" fill="${e(t.p1)}" filter="url(#surf)" opacity=".35" style="mix-blend-mode: soft-light"></rect></g>
    <circle cx="1110" cy="1330" r="720" fill="none" stroke="${e(t.rimHex)}" stroke-opacity=".9" stroke-width="2" style="filter: drop-shadow(0 0 10px ${e(t.glow)})"></circle>
  </svg>
  <div style="position: absolute; left: 150px; top: 790px; width: 1060px; height: 56px; border-radius: 50%; background: rgba(0,0,0,.6); filter: blur(30px)"></div>
  <div style="position: absolute; left: 60px; top: 70px; width: 1240px; height: 760px; background: ${e(t.glow)}; filter: blur(80px); opacity: .22"></div>

  <div style="position: absolute; left: 80px; top: 80px; width: 1200px; height: 720px">
    <div style="position: absolute; inset: 0; clip-path: polygon(40px 0, 1160px 0, 1200px 40px, 1200px 680px, 1160px 720px, 40px 720px, 0 680px, 0 40px); background: linear-gradient(160deg, rgba(255,255,255,.10), rgba(255,255,255,.02) 35%, rgba(255,255,255,0) 60%), ${e(t.tint)}, rgba(5,9,17,.76); backdrop-filter: blur(36px) saturate(150%); -webkit-backdrop-filter: blur(36px) saturate(150%)"></div>
    <div style="position: absolute; inset: 0; clip-path: polygon(40px 0, 1160px 0, 1200px 40px, 1200px 680px, 1160px 720px, 40px 720px, 0 680px, 0 40px); pointer-events: none">
      <svg viewBox="0 0 1200 720" aria-hidden="true" style="position: absolute; inset: 0; width: 1200px; height: 720px; mix-blend-mode: overlay; opacity: .16">
        <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" stitchTiles="stitch"></feTurbulence><feColorMatrix type="saturate" values="0"></feColorMatrix></filter>
        <rect width="1200" height="720" filter="url(#grain)"></rect>
      </svg>
      <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(255,255,255,.09) 0, rgba(255,255,255,0) 14%, rgba(0,0,0,0) 70%, rgba(0,0,0,.28) 100%)"></div>
      <div style="position: absolute; left: -5%; top: -30%; width: 55%; height: 75%; background: radial-gradient(ellipse at center, rgba(255,255,255,.10), transparent 65%); transform: rotate(-12deg)"></div>
    </div>
    <svg viewBox="0 0 1200 720" aria-hidden="true" style="position: absolute; inset: 0; width: 1200px; height: 720px; overflow: visible">
      <defs>
        <linearGradient id="edge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${e(t.c1)}" stop-opacity=".95"></stop>
          <stop offset=".5" stop-color="${e(t.accent)}" stop-opacity=".45"></stop>
          <stop offset="1" stop-color="${e(t.c1)}" stop-opacity=".9"></stop>
        </linearGradient>
      </defs>
      <linearGradient id="bevel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".75"></stop><stop offset=".08" stop-color="#ffffff" stop-opacity=".18"></stop><stop offset=".9" stop-color="#ffffff" stop-opacity=".04"></stop><stop offset="1" stop-color="#000000" stop-opacity=".5"></stop></linearGradient>
      <polygon points="40,0.75 1160,0.75 1199.25,40 1199.25,680 1160,719.25 40,719.25 0.75,680 0.75,40" fill="none" stroke="#000000" stroke-opacity=".55" stroke-width="3"></polygon>
      <polygon points="40,0.75 1160,0.75 1199.25,40 1199.25,680 1160,719.25 40,719.25 0.75,680 0.75,40" fill="none" stroke="url(#edge)" stroke-width="1.5"></polygon>
      <polygon points="41,2.5 1159,2.5 1197.5,41 1197.5,679 1159,717.5 41,717.5 2.5,679 2.5,41" fill="none" stroke="url(#bevel)" stroke-width="2"></polygon>
      <path d="M44 1.6 L1156 1.6" stroke="#5fd0ff" stroke-opacity=".45" stroke-width="1" transform="translate(0,1)"></path>
      <path d="M44 1.6 L1156 1.6" stroke="#ff6fa8" stroke-opacity=".25" stroke-width="1" transform="translate(0,2.4)"></path>
      <polygon points="50,12 1150,12 1188,50 1188,670 1150,708 50,708 12,670 12,50" fill="none" stroke="${e(t.accent)}" stroke-opacity=".16" stroke-width="1"></polygon>
      <path d="M12 96 L12 50 L50 12 L150 12" fill="none" stroke="${e(t.accent)}" stroke-width="3" stroke-linecap="square" style="filter: drop-shadow(0 0 6px ${e(t.glow)})"></path>
      <path d="M1050 12 L1150 12 L1188 50 L1188 96" fill="none" stroke="${e(t.accent)}" stroke-width="3" stroke-linecap="square" style="filter: drop-shadow(0 0 6px ${e(t.glow)})"></path>
      <path d="M12 624 L12 670 L50 708 L150 708" fill="none" stroke="${e(t.accent)}" stroke-width="3" stroke-linecap="square" style="filter: drop-shadow(0 0 6px ${e(t.glow)})"></path>
      <path d="M1188 624 L1188 670 L1150 708 L1050 708" fill="none" stroke="${e(t.accent)}" stroke-width="3" stroke-linecap="square" style="filter: drop-shadow(0 0 6px ${e(t.glow)})"></path>
      <g stroke="${e(t.accent)}" stroke-opacity=".5" stroke-width="1.5"><path d="M560 12 L560 20"></path><path d="M580 12 L580 24"></path><path d="M600 12 L600 20"></path><path d="M620 12 L620 24"></path><path d="M640 12 L640 20"></path></g>
      <path d="M0 616 L1200 616" stroke="#ffffff" stroke-opacity=".10" stroke-width="1"></path>
    </svg>

    <div style="position: absolute; inset: 0; display: ${e(v.front)}">
    <div style="position: absolute; left: 100px; top: 28px; width: 232px; height: 232px; border-radius: 50%; background: conic-gradient(from 210deg, ${e(t.c1)}, ${e(t.c3)} 18%, ${e(t.c2)} 32%, #1a1f27 46%, ${e(t.c3)} 60%, ${e(t.c1)} 74%, ${e(t.c3)} 88%, ${e(t.c1)}); box-shadow: 0 10px 30px rgba(0,0,0,.6), 0 0 50px -10px ${e(t.glow)}"></div>
    <div style="position: absolute; left: 100px; top: 28px; width: 232px; height: 232px; border-radius: 50%; background: repeating-conic-gradient(rgba(255,255,255,.06) 0 1deg, rgba(0,0,0,.06) 1deg 2deg); mix-blend-mode: overlay"></div>
    <div style="position: absolute; left: 106px; top: 34px; width: 220px; height: 220px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: radial-gradient(circle at 50% 30%, #1a2434, #080c14 62%, #04060a); box-shadow: inset 0 3px 6px rgba(0,0,0,.8), inset 0 -1px 0 rgba(255,255,255,.12), inset 0 0 0 10px rgba(255,255,255,.02)">
      <svg viewBox="0 0 220 220" aria-hidden="true" style="position: absolute; inset: 0; width: 220px; height: 220px">
        <defs>
          <path id="ringTop" d="M110 110 m-88 0 a88 88 0 1 1 176 0"></path>
          <path id="ringBottom" d="M22 110 a88 88 0 0 0 176 0"></path>
        </defs>
        <circle cx="110" cy="110" r="72" fill="none" stroke="${e(t.accent)}" stroke-opacity=".35" stroke-width="1"></circle>
        <text fill="${e(t.accent)}" style="font: 700 15px Rajdhani, sans-serif; letter-spacing: 4px"><textPath href="#ringTop" startOffset="50%" text-anchor="middle">EXPLORE • EARN • EXCEL</textPath></text>
        <text fill="#e9f1fb" fill-opacity=".8" style="font: 700 12px Rajdhani, sans-serif; letter-spacing: 4px"><textPath href="#ringBottom" startOffset="50%" text-anchor="middle">MEMBERSHIP PROGRAM</textPath></text>
      </svg>
      <img src="brand/voyager.png" alt="Voyager emblem" style="width: 128px; height: 128px; object-fit: contain">
    </div>

    <div style="position: absolute; left: 36px; top: 300px; width: 380px; display: flex; flex-direction: column; gap: 12px">
      ${(d.fields||[]).map(f=>`
        <div style="display: flex; align-items: center; gap: 14px">
          <div style="width: 48px; height: 48px; flex: none; display: flex; align-items: center; justify-content: center; clip-path: polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%); background: radial-gradient(circle at 50% 25%, rgba(255,255,255,.18), rgba(255,255,255,0) 60%), ${e(t.iconBg)}, rgba(4,8,14,.6); box-shadow: inset 0 0 0 1.5px ${e(t.edgeSoft)}">
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="${e(t.accent)}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${e(f.icon)}"></path></svg>
          </div>
          <div style="flex: 1; display: flex; flex-direction: column; gap: 3px; padding: 9px 16px; clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px); background: linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,0) 45%), rgba(3,6,12,.42); border-left: 2px solid ${e(t.accent)}; box-shadow: inset 0 1px 0 rgba(255,255,255,.12)">
            <span style="font: 600 11px/1 Inter, 'Segoe UI', Arial, sans-serif; letter-spacing: 1.4px; color: rgba(235,242,250,.66)">${e(f.label)}</span>
            <span style="font: 700 24px/1.05 Rajdhani, sans-serif; letter-spacing: .5px; color: #ffffff">${e(f.value)}</span>
          </div>
        </div>
      `).join('')}
    </div>

    <div style="position: absolute; left: 452px; top: 40px; width: 712px; display: flex; flex-direction: column; gap: 8px">
      <div style="display: flex; align-items: center; gap: 12px; font: 700 14px/1 Rajdhani, sans-serif; letter-spacing: 5px; color: rgba(235,242,250,.82)">
        <span style="width: 34px; height: 1.5px; background: ${e(t.accent)}"></span>VOYAGER MEMBERSHIP PROGRAM<span style="flex: 1; height: 1px; background: linear-gradient(90deg, ${e(t.accent)}, transparent); opacity: .5"></span>
      </div>
      <div style="font: 700 66px/0.95 Rajdhani, sans-serif; letter-spacing: 2px; background: ${e(t.metal)}; -webkit-background-clip: text; background-clip: text; color: transparent; filter: drop-shadow(0 -1px 0 rgba(255,255,255,.35)) drop-shadow(0 2px 0 rgba(0,0,0,.65)) drop-shadow(0 6px 10px rgba(0,0,0,.45)) drop-shadow(0 0 26px ${e(t.glow)})">${e(t.title)}</div>
      <div style="display: flex; align-items: center; gap: 14px; margin-top: 4px">
        <span style="display: inline-flex; align-items: center; height: 34px; padding: 0 18px; clip-path: polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%); font: 700 16px/1 Rajdhani, sans-serif; letter-spacing: 3px; color: #07101c; background: ${e(t.metal)}">${e(t.tier)}</span>
        <span style="display: inline-flex; align-items: center; gap: 8px; height: 34px; padding: 0 14px; clip-path: polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%); font: 700 15px/1 Rajdhani, sans-serif; letter-spacing: 2.4px; color: #ffffff; background: ${e(t.iconBg)}; box-shadow: inset 0 0 0 1px ${e(t.edgeSoft)}"><span style="color: ${e(t.accent)}">★</span>${e(c.callsign)}</span>
        <span style="font: 600 14px/1 Inter, 'Segoe UI', Arial, sans-serif; color: rgba(235,242,250,.7)">${e(t.role)}</span>
      </div>
    </div>

    <div style="position: absolute; left: 452px; top: 214px; width: 460px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px">
      ${(d.stats||[]).map(s=>`
        <div style="display: flex; flex-direction: column; gap: 5px; padding: 15px 18px; clip-path: polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px); background: linear-gradient(180deg, rgba(255,255,255,.07), rgba(255,255,255,0) 40%), linear-gradient(0deg, rgba(0,0,0,.25), rgba(0,0,0,0) 30%), rgba(3,6,12,.42); box-shadow: inset 0 1px 0 rgba(255,255,255,.14), inset 0 -1px 0 rgba(0,0,0,.6)">
          <span style="display: flex; align-items: center; gap: 8px; font: 600 11px/1 Inter, 'Segoe UI', Arial, sans-serif; letter-spacing: 1.4px; color: rgba(235,242,250,.66)"><span style="width: 6px; height: 6px; background: ${e(t.accent)}; transform: rotate(45deg)"></span>${e(s.label)}</span>
          <span style="font: 700 40px/1 Rajdhani, sans-serif; font-variant-numeric: tabular-nums; color: #ffffff">${e(s.value)}</span>
          <span style="font: 500 13px/1.25 Inter, 'Segoe UI', Arial, sans-serif; color: rgba(235,242,250,.72)">${e(s.sub)}</span>
        </div>
      `).join('')}
    </div>

    <svg viewBox="0 0 400 360" aria-hidden="true" style="position: absolute; left: 920px; top: 176px; width: 258px; height: 232px; overflow: visible; filter: drop-shadow(0 14px 18px rgba(0,0,0,.6)) drop-shadow(0 0 22px ${e(t.glow)})">
      <defs>
        <linearGradient id="metal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${e(t.c1)}"></stop><stop offset=".42" stop-color="${e(t.c2)}"></stop><stop offset=".5" stop-color="${e(t.c3)}"></stop><stop offset=".62" stop-color="${e(t.c2)}"></stop><stop offset="1" stop-color="${e(t.c4)}"></stop></linearGradient>
        <linearGradient id="feather" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${e(t.c1)}"></stop><stop offset=".5" stop-color="${e(t.c2)}"></stop><stop offset=".52" stop-color="${e(t.c3)}"></stop><stop offset="1" stop-color="${e(t.c2)}"></stop></linearGradient>
        <radialGradient id="flare" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffffff"></stop><stop offset=".25" stop-color="#ffffff" stop-opacity=".6"></stop><stop offset="1" stop-color="${e(t.accent)}" stop-opacity="0"></stop></radialGradient>
      </defs>
      <g stroke="${e(t.c1)}" stroke-opacity=".8" stroke-width="1">
        <g><path d="M300 92 L388 60 L380 92 L296 120 Z" fill="url(#feather)"></path><path d="M300 92 L388 60 L384 76 Z" fill="#ffffff" fill-opacity=".38" stroke="none"></path><path d="M296 120 L380 92 L384 76 Z" fill="#000000" fill-opacity=".28" stroke="none"></path><path d="M298 132 L380 106 L370 138 L294 160 Z" fill="url(#feather)"></path><path d="M298 132 L380 106 L375 122 Z" fill="#ffffff" fill-opacity=".38" stroke="none"></path><path d="M294 160 L370 138 L375 122 Z" fill="#000000" fill-opacity=".28" stroke="none"></path><path d="M296 172 L368 152 L356 184 L290 198 Z" fill="url(#feather)"></path><path d="M296 172 L368 152 L362 168 Z" fill="#ffffff" fill-opacity=".38" stroke="none"></path><path d="M290 198 L356 184 L362 168 Z" fill="#000000" fill-opacity=".28" stroke="none"></path><path d="M290 210 L352 196 L338 226 L284 234 Z" fill="url(#feather)"></path><path d="M290 210 L352 196 L345 211 Z" fill="#ffffff" fill-opacity=".38" stroke="none"></path><path d="M284 234 L338 226 L345 211 Z" fill="#000000" fill-opacity=".28" stroke="none"></path><path d="M282 246 L332 238 L316 264 L274 268 Z" fill="url(#feather)"></path><path d="M282 246 L332 238 L324 251 Z" fill="#ffffff" fill-opacity=".38" stroke="none"></path><path d="M274 268 L316 264 L324 251 Z" fill="#000000" fill-opacity=".28" stroke="none"></path></g>
        <g transform="translate(400,0) scale(-1,1)"><path d="M300 92 L388 60 L380 92 L296 120 Z" fill="url(#feather)"></path><path d="M300 92 L388 60 L384 76 Z" fill="#ffffff" fill-opacity=".38" stroke="none"></path><path d="M296 120 L380 92 L384 76 Z" fill="#000000" fill-opacity=".28" stroke="none"></path><path d="M298 132 L380 106 L370 138 L294 160 Z" fill="url(#feather)"></path><path d="M298 132 L380 106 L375 122 Z" fill="#ffffff" fill-opacity=".38" stroke="none"></path><path d="M294 160 L370 138 L375 122 Z" fill="#000000" fill-opacity=".28" stroke="none"></path><path d="M296 172 L368 152 L356 184 L290 198 Z" fill="url(#feather)"></path><path d="M296 172 L368 152 L362 168 Z" fill="#ffffff" fill-opacity=".38" stroke="none"></path><path d="M290 198 L356 184 L362 168 Z" fill="#000000" fill-opacity=".28" stroke="none"></path><path d="M290 210 L352 196 L338 226 L284 234 Z" fill="url(#feather)"></path><path d="M290 210 L352 196 L345 211 Z" fill="#ffffff" fill-opacity=".38" stroke="none"></path><path d="M284 234 L338 226 L345 211 Z" fill="#000000" fill-opacity=".28" stroke="none"></path><path d="M282 246 L332 238 L316 264 L274 268 Z" fill="url(#feather)"></path><path d="M282 246 L332 238 L324 251 Z" fill="#ffffff" fill-opacity=".38" stroke="none"></path><path d="M274 268 L316 264 L324 251 Z" fill="#000000" fill-opacity=".28" stroke="none"></path></g>
      </g>
      <path d="M200 30 L296 70 L290 188 Q278 268 200 322 Q122 268 110 188 L104 70 Z" fill="url(#metal)" stroke="#ffffff" stroke-opacity=".7" stroke-width="2"></path>
      <path d="M200 30 L104 70 L110 188 Q122 268 200 322 Z" fill="#000000" fill-opacity=".18"></path>
      <path d="M200 30 L296 70 L200 104 Z" fill="#ffffff" fill-opacity=".30"></path>
      <path d="M200 30 L104 70 L200 104 Z" fill="#ffffff" fill-opacity=".12"></path>
      <path d="M200 62 L270 92 L265 186 Q256 248 200 290 Q144 248 135 186 L130 92 Z" fill="#05080f" fill-opacity=".92" stroke="${e(t.c2)}" stroke-opacity=".9" stroke-width="2.5"></path>
      <path d="M200 66 L266 94 L262 184" fill="none" stroke="#ffffff" stroke-opacity=".35" stroke-width="1"></path>
      <path d="M200 104 L213 176 L262 190 L213 204 L200 268 L187 204 L138 190 L187 176 Z" fill="url(#metal)"></path>
      <path d="M200 190 L200 104 L213 176 Z M200 190 L262 190 L213 204 Z M200 190 L200 268 L187 204 Z M200 190 L138 190 L187 176 Z" fill="#ffffff" fill-opacity=".42"></path>
      <path d="M200 190 L213 176 L262 190 Z M200 190 L213 204 L200 268 Z M200 190 L187 204 L138 190 Z M200 190 L187 176 L200 104 Z" fill="#000000" fill-opacity=".30"></path>
      <path d="M200 104 L213 176 L262 190 L213 204 L200 268 L187 204 L138 190 L187 176 Z" fill="none" stroke="#ffffff" stroke-opacity=".75" stroke-width="1.2"></path>
      <circle cx="200" cy="190" r="34" fill="url(#flare)" opacity=".75"></circle>
      <path d="M200 140 L201.5 188.5 L250 190 L201.5 191.5 L200 240 L198.5 191.5 L150 190 L198.5 188.5 Z" fill="#ffffff" opacity=".9"></path>
      <circle cx="200" cy="34" r="20" fill="url(#flare)"></circle>
      <path d="M200 10 L201 33 L224 34 L201 35 L200 58 L199 35 L176 34 L199 33 Z" fill="#ffffff"></path>
      <circle cx="288" cy="74" r="10" fill="url(#flare)" opacity=".8"></circle>
    </svg>

    <div style="position: absolute; left: 452px; top: 480px; width: 712px; display: flex; gap: 0; align-items: stretch">
      ${(d.extras||[]).map(x=>`
        <div style="flex: 1; display: flex; flex-direction: column; gap: 5px; padding: 4px 18px; border-left: 1px solid ${e(t.edgeSoft)}">
          <span style="font: 600 11px/1 Inter, 'Segoe UI', Arial, sans-serif; letter-spacing: 1.4px; color: rgba(235,242,250,.62)">${e(x.label)}</span>
          <span style="font: 700 22px/1.1 Rajdhani, sans-serif; color: #f4f7fb">${e(x.value)}</span>
        </div>
      `).join('')}
    </div>

    <div style="position: absolute; left: 36px; top: 516px; width: 380px; display: flex; flex-direction: column; gap: 9px">
      <span style="display: flex; align-items: center; gap: 8px; font: 600 11px/1 Inter, 'Segoe UI', Arial, sans-serif; letter-spacing: 1.4px; color: rgba(235,242,250,.66)"><span style="width: 6px; height: 6px; background: ${e(t.accent)}; transform: rotate(45deg)"></span>${e(c.badgeCount)}<span style="flex: 1; height: 1px; background: linear-gradient(90deg, ${e(t.edgeSoft)}, transparent)"></span></span>
      <div style="display: flex; gap: 12px">
        ${(d.equipped||[]).map(b=>`
          <div style="width: 52px; height: 52px; flex: none; display: flex; align-items: center; justify-content: center; clip-path: polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%); background: ${e(t.metal)}"><div style="width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; clip-path: polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%); background: radial-gradient(circle at 50% 22%, rgba(255,255,255,.18), rgba(255,255,255,0) 60%), ${e(t.iconBg)}, #070b13"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="${e(t.accent)}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${e(b.icon)}"></path></svg></div></div>
        `).join('')}
      </div>
    </div>

    <div style="position: absolute; left: 452px; top: 546px; width: 712px; display: flex; flex-direction: column; gap: 8px">
      <div style="display: flex; justify-content: space-between; align-items: baseline">
        <span style="display: flex; align-items: center; gap: 8px; font: 600 11px/1 Inter, 'Segoe UI', Arial, sans-serif; letter-spacing: 1.4px; color: rgba(235,242,250,.66)"><span style="width: 6px; height: 6px; background: ${e(t.accent)}; transform: rotate(45deg)"></span>NEXT TIER<span style="font: 700 16px/1 Rajdhani, sans-serif; letter-spacing: 2px; color: ${e(t.accent)}">${e(t.next)}</span></span>
        <span style="font: 700 22px/1 Rajdhani, sans-serif; color: #ffffff; font-variant-numeric: tabular-nums">${e(t.pct)}</span>
      </div>
      <div style="position: relative; height: 10px; clip-path: polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%); background: rgba(3,6,12,.75); box-shadow: inset 0 1px 2px rgba(0,0,0,.8)">
        <div style="position: absolute; left: 0; top: 0; bottom: 0; width: ${e(t.pct)}; background: linear-gradient(90deg, ${e(t.c3)}, ${e(t.accent)} 75%, #ffffff); box-shadow: 0 0 14px ${e(t.glow)}"></div>
        <div style="position: absolute; inset: 0; background: repeating-linear-gradient(90deg, transparent 0 177px, rgba(0,0,0,.7) 177px 179px)"></div>
      </div>
      <span style="font: 500 13px/1 Inter, 'Segoe UI', Arial, sans-serif; color: rgba(235,242,250,.72)">${e(t.need)}</span>
    </div>
    </div>

    <div style="position: absolute; inset: 0; display: ${e(v.stats)}">
      <div style="position: absolute; left: 36px; top: 30px; width: 1128px; display: flex; align-items: flex-end; justify-content: space-between">
        <div style="display: flex; flex-direction: column; gap: 8px">
          <div style="display: flex; align-items: center; gap: 12px; font: 700 14px/1 Rajdhani, sans-serif; letter-spacing: 4px; color: rgba(235,242,250,.82)"><span style="width: 34px; height: 1.5px; background: ${e(t.accent)}"></span>${e(c.statsEyebrow)}</div>
          <div style="font: 700 60px/0.95 Rajdhani, sans-serif; letter-spacing: 2px; background: ${e(t.metal)}; -webkit-background-clip: text; background-clip: text; color: transparent; filter: drop-shadow(0 -1px 0 rgba(255,255,255,.35)) drop-shadow(0 2px 0 rgba(0,0,0,.65)) drop-shadow(0 0 24px ${e(t.glow)})">FLEET RECORD</div>
        </div>
        <div style="display: flex; align-items: center; gap: 14px">
          <span style="display: inline-flex; align-items: center; height: 34px; padding: 0 18px; clip-path: polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%); font: 700 16px/1 Rajdhani, sans-serif; letter-spacing: 3px; color: #07101c; background: ${e(t.metal)}">${e(t.tier)}</span>
          <img src="brand/voyager.png" alt="Voyager emblem" style="width: 76px; height: 76px; object-fit: contain; filter: drop-shadow(0 0 14px ${e(t.glow)})">
        </div>
      </div>
      <div style="position: absolute; left: 36px; top: 152px; width: 1128px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px">
        <div style="display: flex; flex-direction: column; padding: 16px 20px 10px; clip-path: polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px); background: linear-gradient(180deg, rgba(255,255,255,.07), rgba(255,255,255,0) 40%), rgba(3,6,12,.58); box-shadow: inset 0 1px 0 rgba(255,255,255,.14), inset 0 -1px 0 rgba(0,0,0,.6)">
          <span style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px; font: 700 16px/1 Rajdhani, sans-serif; letter-spacing: 3px; color: ${e(t.accent)}"><span style="width: 7px; height: 7px; background: ${e(t.accent)}; transform: rotate(45deg)"></span>DREADNOUGHT</span>
          ${(d.dread||[]).map(r=>`
            <div style="display: flex; justify-content: space-between; align-items: baseline; padding: 7px 0; border-top: 1px solid rgba(255,255,255,.07)">
              <span style="font: 500 13px/1 Inter, 'Segoe UI', Arial, sans-serif; color: rgba(235,242,250,.7)">${e(r.label)}</span>
              <span style="font: 700 25px/1 Rajdhani, sans-serif; font-variant-numeric: tabular-nums; color: #ffffff">${e(r.value)}</span>
            </div>
          `).join('')}
        </div>
        <div style="display: flex; flex-direction: column; padding: 16px 20px 10px; clip-path: polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px); background: linear-gradient(180deg, rgba(255,255,255,.07), rgba(255,255,255,0) 40%), rgba(3,6,12,.58); box-shadow: inset 0 1px 0 rgba(255,255,255,.14), inset 0 -1px 0 rgba(0,0,0,.6)">
          <span style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px; font: 700 16px/1 Rajdhani, sans-serif; letter-spacing: 3px; color: ${e(t.accent)}"><span style="width: 7px; height: 7px; background: ${e(t.accent)}; transform: rotate(45deg)"></span>VOYAGER VERSUS</span>
          ${(d.versus||[]).map(r=>`
            <div style="display: flex; justify-content: space-between; align-items: baseline; padding: 7px 0; border-top: 1px solid rgba(255,255,255,.07)">
              <span style="font: 500 13px/1 Inter, 'Segoe UI', Arial, sans-serif; color: rgba(235,242,250,.7)">${e(r.label)}</span>
              <span style="font: 700 25px/1 Rajdhani, sans-serif; font-variant-numeric: tabular-nums; color: #ffffff">${e(r.value)}</span>
            </div>
          `).join('')}
        </div>
        <div style="display: flex; flex-direction: column; padding: 16px 20px 10px; clip-path: polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px); background: linear-gradient(180deg, rgba(255,255,255,.07), rgba(255,255,255,0) 40%), rgba(3,6,12,.58); box-shadow: inset 0 1px 0 rgba(255,255,255,.14), inset 0 -1px 0 rgba(0,0,0,.6)">
          <span style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px; font: 700 16px/1 Rajdhani, sans-serif; letter-spacing: 3px; color: ${e(t.accent)}"><span style="width: 7px; height: 7px; background: ${e(t.accent)}; transform: rotate(45deg)"></span>MISSIONS &amp; SEASONS</span>
          ${(d.missions||[]).map(r=>`
            <div style="display: flex; justify-content: space-between; align-items: baseline; padding: 7px 0; border-top: 1px solid rgba(255,255,255,.07)">
              <span style="font: 500 13px/1 Inter, 'Segoe UI', Arial, sans-serif; color: rgba(235,242,250,.7)">${e(r.label)}</span>
              <span style="font: 700 25px/1 Rajdhani, sans-serif; font-variant-numeric: tabular-nums; color: #ffffff">${e(r.value)}</span>
            </div>
          `).join('')}
        </div>
      </div>
      <div style="position: absolute; left: 36px; top: 446px; width: 1128px; display: flex; flex-direction: column; gap: 10px; padding: 16px 20px; box-sizing: border-box; clip-path: polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px); background: linear-gradient(180deg, rgba(255,255,255,.07), rgba(255,255,255,0) 40%), rgba(3,6,12,.58); box-shadow: inset 0 1px 0 rgba(255,255,255,.14), inset 0 -1px 0 rgba(0,0,0,.6)">
        <span style="display: flex; align-items: center; gap: 10px; font: 700 16px/1 Rajdhani, sans-serif; letter-spacing: 3px; color: ${e(t.accent)}"><span style="width: 7px; height: 7px; background: ${e(t.accent)}; transform: rotate(45deg)"></span>CREW &amp; COMMUNITY</span>
        <div style="display: flex">
          ${(d.community||[]).map(x=>`
            <div style="flex: 1; display: flex; flex-direction: column; gap: 5px; padding: 2px 16px; border-left: 1px solid ${e(t.edgeSoft)}">
              <span style="font: 600 11px/1 Inter, 'Segoe UI', Arial, sans-serif; letter-spacing: 1.4px; color: rgba(235,242,250,.62)">${e(x.label)}</span>
              <span style="font: 700 24px/1.05 Rajdhani, sans-serif; color: #ffffff">${e(x.value)}</span>
              <span style="font: 500 12px/1.2 Inter, 'Segoe UI', Arial, sans-serif; color: rgba(235,242,250,.62)">${e(x.sub)}</span>
            </div>
          `).join('')}
        </div>
      </div>
      <span style="position: absolute; left: 36px; top: 586px; font: 500 12px/1 Inter, 'Segoe UI', Arial, sans-serif; color: rgba(235,242,250,.55)">Members can type !voyager private to hide time watched and months subscribed. Giveaway tickets are never shown.</span>
    </div>

    <div style="position: absolute; inset: 0; display: ${e(v.badges)}">
      <div style="position: absolute; left: 36px; top: 30px; width: 1128px; display: flex; align-items: flex-end; justify-content: space-between">
        <div style="display: flex; flex-direction: column; gap: 8px">
          <div style="display: flex; align-items: center; gap: 12px; font: 700 14px/1 Rajdhani, sans-serif; letter-spacing: 4px; color: rgba(235,242,250,.82)"><span style="width: 34px; height: 1.5px; background: ${e(t.accent)}"></span>${e(c.badgesEyebrow)}</div>
          <div style="font: 700 60px/0.95 Rajdhani, sans-serif; letter-spacing: 2px; background: ${e(t.metal)}; -webkit-background-clip: text; background-clip: text; color: transparent; filter: drop-shadow(0 -1px 0 rgba(255,255,255,.35)) drop-shadow(0 2px 0 rgba(0,0,0,.65)) drop-shadow(0 0 24px ${e(t.glow)})">MEDAL WALL</div>
        </div>
        <div style="display: flex; align-items: center; gap: 14px">
          <span style="display: inline-flex; align-items: center; height: 34px; padding: 0 18px; clip-path: polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%); font: 700 16px/1 Rajdhani, sans-serif; letter-spacing: 3px; color: #07101c; background: ${e(t.metal)}">${e(t.tier)}</span>
          <img src="brand/voyager.png" alt="Voyager emblem" style="width: 76px; height: 76px; object-fit: contain; filter: drop-shadow(0 0 14px ${e(t.glow)})">
        </div>
      </div>
      <div style="position: absolute; left: 36px; top: 150px; width: 1128px; display: grid; grid-template-columns: repeat(8, minmax(0, 1fr)); row-gap: 14px; column-gap: 12px">
        ${(d.badges||[]).map(b=>`
          <div style="display: flex; flex-direction: column; align-items: center; gap: 6px; text-align: center; opacity: ${e(b.op)}; filter: ${e(b.filter)}">
            <div style="width: 62px; height: 62px; flex: none; display: flex; align-items: center; justify-content: center; clip-path: polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%); background: ${e(t.metal)}"><div style="width: 52px; height: 52px; display: flex; align-items: center; justify-content: center; clip-path: polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%); background: radial-gradient(circle at 50% 22%, rgba(255,255,255,.18), rgba(255,255,255,0) 60%), ${e(t.iconBg)}, #070b13"><svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" fill="none" stroke="${e(t.accent)}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${e(b.icon)}"></path></svg></div></div>
            <span style="font: 700 15px/1 Rajdhani, sans-serif; letter-spacing: .6px; color: #ffffff">${e(b.name)}</span>
            <span style="font: 500 11px/1.25 Inter, 'Segoe UI', Arial, sans-serif; color: rgba(235,242,250,.66)">${e(b.sub)}</span>
          </div>
        `).join('')}
      </div>
      <div style="position: absolute; left: 36px; top: 538px; width: 1128px; display: flex; align-items: center; gap: 14px; padding: 12px 18px; box-sizing: border-box; clip-path: polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px); background: linear-gradient(180deg, rgba(255,255,255,.07), rgba(255,255,255,0) 40%), rgba(3,6,12,.58); box-shadow: inset 0 1px 0 rgba(255,255,255,.14), inset 0 -1px 0 rgba(0,0,0,.6)">
        <span style="font: 600 11px/1 Inter, 'Segoe UI', Arial, sans-serif; letter-spacing: 1.4px; color: rgba(235,242,250,.66)">EQUIPPED CALLSIGN</span>
        <span style="font: 700 20px/1 Rajdhani, sans-serif; letter-spacing: 2.4px; color: #ffffff"><span style="color: ${e(t.accent)}">★</span> ${e(c.callsign)}</span>
        <span style="flex: 1"></span>
        <span style="font: 500 13px/1 Inter, 'Segoe UI', Arial, sans-serif; color: rgba(235,242,250,.7)">${e(c.alsoEarned)} · switch with <b style="color: ${e(t.accent)}">!voyager title</b></span>
      </div>
    </div>

    <div style="position: absolute; left: 36px; top: 636px; width: 700px; height: 64px; display: flex; align-items: center; gap: 18px">
      <div style="width: 52px; height: 52px; flex: none; display: flex; align-items: center; justify-content: center; clip-path: polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%); background: radial-gradient(circle at 50% 25%, rgba(255,255,255,.18), rgba(255,255,255,0) 60%), ${e(t.iconBg)}, rgba(4,8,14,.6); box-shadow: inset 0 0 0 1.5px ${e(t.edgeSoft)}">
        <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="M12 2 L13.8 10.2 L22 12 L13.8 13.8 L12 22 L10.2 13.8 L2 12 L10.2 10.2 Z" fill="${e(t.accent)}"></path></svg>
      </div>
      <div style="display: flex; flex-direction: column; gap: 5px">
        <span style="font: 700 21px/1 Rajdhani, sans-serif; letter-spacing: 3.5px; color: ${e(t.accent)}">${e(t.motto)}</span>
        <span style="font: 600 14px/1 Rajdhani, sans-serif; letter-spacing: 2.4px; color: rgba(235,242,250,.78)">${e(t.line)}</span>
      </div>
    </div>
    <div style="position: absolute; right: 0; top: 616px; width: 470px; height: 104px">
      <div style="position: absolute; left: 0; top: 18px; display: flex; gap: 8px">
        <span style="width: 14px; height: 68px; transform: skewX(-32deg); background: ${e(t.accent)}; opacity: .55"></span>
        <span style="width: 14px; height: 68px; transform: skewX(-32deg); background: ${e(t.accent)}; opacity: .35"></span>
        <span style="width: 14px; height: 68px; transform: skewX(-32deg); background: ${e(t.accent)}; opacity: .2"></span>
      </div>
      <div style="position: absolute; left: 70px; right: 0; top: 0; bottom: 0; clip-path: polygon(48px 0, 100% 0, 100% calc(100% - 40px), calc(100% - 40px) 100%, 0 100%); background: linear-gradient(180deg, rgba(255,255,255,.16), rgba(255,255,255,0) 35%, rgba(0,0,0,.25)), repeating-linear-gradient(90deg, rgba(255,255,255,.035) 0 1px, rgba(0,0,0,.03) 1px 3px), ${e(t.plate)}, rgba(6,10,18,.55); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; padding-left: 30px">
        <span style="font: 700 34px/1 Rajdhani, sans-serif; letter-spacing: 1.5px; background: ${e(t.metal)}; -webkit-background-clip: text; background-clip: text; color: transparent">${e(t.title)}</span>
        <span style="font: 700 14px/1 Rajdhani, sans-serif; letter-spacing: 4px; color: ${e(t.accent)}">— ${e(t.tier)} —</span>
      </div>
    </div>
  </div>
  <div style="position: absolute; left: 0; top: 330px; width: 1360px; height: 170px; display: ${e(v.banner)}; flex-direction: column; align-items: center; justify-content: center; gap: 10px; background: linear-gradient(90deg, rgba(3,5,10,0), rgba(3,5,10,.9) 18%, rgba(3,5,10,.92) 82%, rgba(3,5,10,0))">
    <div style="position: absolute; left: 10%; right: 10%; top: 0; height: 2px; background: linear-gradient(90deg, transparent, ${e(t.accent)}, #ffffff, ${e(t.accent)}, transparent); box-shadow: 0 0 18px ${e(t.glow)}"></div>
    <div style="position: absolute; left: 10%; right: 10%; bottom: 0; height: 2px; background: linear-gradient(90deg, transparent, ${e(t.accent)}, #ffffff, ${e(t.accent)}, transparent); box-shadow: 0 0 18px ${e(t.glow)}"></div>
    <div style="position: absolute; left: 30%; top: 0; width: 22%; height: 100%; background: linear-gradient(100deg, transparent, rgba(255,255,255,.14), transparent)"></div>
    <span style="font: 700 16px/1 Rajdhani, sans-serif; letter-spacing: 9px; color: ${e(t.accent)}">★ TIER UP ★</span>
    <span style="font: 700 54px/1 Rajdhani, sans-serif; letter-spacing: 3px; background: ${e(t.metal)}; -webkit-background-clip: text; background-clip: text; color: transparent; filter: drop-shadow(0 0 22px ${e(t.glow)})">${e(v.bannerText)}</span>
    <span style="font: 600 15px/1 Inter, 'Segoe UI', Arial, sans-serif; color: rgba(235,242,250,.78)">${e(c.promoted)}</span>
  </div>
</div>`;
}

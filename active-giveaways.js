/* Live dashboard status only. No draws, entry changes, points or visibility writes. */
(() => {
  'use strict';
  const M = window.VoyagerActiveGiveaways, $ = id => document.getElementById(id);
  const node = (tag, text, cls) => { const e = document.createElement(tag); if (text !== undefined) e.textContent = text; if (cls) e.className = cls; return e; };
  const fmt = n => Number(n || 0).toLocaleString();
  class GiveawayFeed extends window.VoyagerConnection {
    command(operation) { return operation === 'sync' ? this.sync() : Promise.reject(Error('The active giveaways dashboard only reads saved status.')); }
    refreshMembers() { return Promise.resolve(null); }
    scheduleSync(gen, delay) { super.scheduleSync(gen, Math.min(delay, 15000)); }
  }
  let host, client, timer, generation = 0, connectionKey = '', busy = false;
  let engine = {state: null, connected: false, receivedAt: 0, offset: 0, message: 'Connecting…'};
  let engineCounts = null, engineCountState = null, ticketCounts = null, ticketCountState = null;
  const cards = new Map();
  const demo = () => host?.getState().demo === true;
  const settings = () => ({...window.VOYAGER_CONFIG, ...host.getState().settings.connection});
  function fresh(feed) { return demo() || !!feed.state && feed.connected && Date.now() - feed.receivedAt < 45000; }
  function date(at) { return at ? new Date(at).toLocaleString('en-AU', {timeZone: 'Australia/Sydney', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit'}) + ' Sydney' : ''; }
  function feedLabel(id, title, feed) {
    const isFresh = fresh(feed), el = $(id);
    el.dataset.fresh = String(isFresh && !!feed.state);
    el.textContent = title + ' · ' + (demo() ? 'Sample data' : isFresh ? 'Live' : feed.state ? 'Last known · reconnecting' : feed.connected ? 'Loading saved state' : feed.message || 'Connecting…');
  }
  function makeCard(key) {
    const element = node('article', undefined, 'ag-card');
    const top = node('div', undefined, 'ag-card-top'), kind = node('span', '', 'ag-kind'), badge = node('span', '', 'ag-badge');
    const title = node('h3', '', 'ag-title'), tags = node('div', undefined, 'ag-tags'), metrics = node('div', undefined, 'ag-metrics');
    const detail = node('p', '', 'ag-detail'), winner = node('p', undefined, 'ag-winner'), winnerName = node('strong', '');
    winner.append(node('small', 'Latest winner'), winnerName);
    const timing = node('p', '', 'ag-timing'), platforms = node('p', '', 'ag-platforms'), warning = node('p', '', 'ag-warning');
    const bottom = node('div', undefined, 'ag-card-bottom'), link = node('a', ''), freshness = node('span', '', 'ag-freshness');
    top.append(kind, badge); bottom.append(link, freshness);
    element.append(top, title, tags, metrics, detail, winner, timing, platforms, warning, bottom);
    const card = {element, kind, badge, title, tags, metrics, detail, winner, winnerName, timing, platforms, warning, link, freshness};
    cards.set(key, card); return card;
  }
  function cardFor(value, feed) {
    const c = cards.get(value.key) || makeCard(value.key), stale = !fresh(feed);
    c.element.dataset.source = value.source; c.element.dataset.stale = String(stale);
    c.element.dataset.giveawayId = value.key; c.kind.textContent = value.type; c.badge.textContent = value.label;
    c.badge.dataset.status = value.status; c.title.textContent = value.title; c.detail.textContent = value.detail;
    c.winner.hidden = !value.winner; c.winnerName.textContent = value.winner;
    const tagsKey = JSON.stringify(value.tags);
    if (tagsKey !== c.tagsKey) { c.tagsKey = tagsKey; c.tags.replaceChildren(...value.tags.map(t => node('span', t))); }
    const fields = value.source === 'ticket' ? [[value.totals.entrants, 'Registered'], [value.totals.tickets, 'Total tickets'], [value.totals.eligibleTickets, 'Eligible tickets']] : [[value.totals.entrants, 'In the pool'], [value.totals.eligible, 'Eligible now'], [value.totals.draws, 'Draws made']];
    const metricsKey = JSON.stringify(fields);
    if (metricsKey !== c.metricsKey) { c.metricsKey = metricsKey; c.metrics.replaceChildren(...fields.map(([n, label]) => { const item = node('div', undefined, 'ag-metric'); item.append(node('b', fmt(n)), node('span', label)); return item; })); }
    c.platforms.textContent = Object.entries(value.totals.platforms).map(([p, n]) => M.platforms[p] + ' ' + fmt(n)).join(' · ');
    c.timing.textContent = (value.timing.at ? value.timing.label + ' ' + date(value.timing.at) : '') + (value.remaining ? ' · ' + value.remaining : '');
    c.warning.hidden = !value.warning; c.warning.textContent = value.warning;
    c.link.href = value.link + (demo() ? '?demo=1' : ''); c.link.textContent = value.linkText + ' ↗';
    c.freshness.textContent = demo() ? 'Sample giveaway' : (stale ? 'Last received ' : 'Updated ') + M.duration(Math.max(0, Date.now() - feed.receivedAt)) + ' ago';
    c.element.setAttribute('aria-label', value.type + ': ' + value.title + ', ' + value.label + (stale ? ', last known status' : ''));
    const parent = value.active ? $('ag-grid') : $('ag-completed-grid');
    if (c.element.parentElement !== parent) parent.append(c.element);
  }
  function render() {
    if (!host) return;
    const ticket = window.VoyagerLiveTicketControl?.getSnapshot() || {state: null, connected: false, receivedAt: 0, offset: 0, message: 'Ticket connection unavailable'};
    feedLabel('ag-engine-feed', 'Tiered / impromptu', engine); feedLabel('ag-ticket-feed', 'Ticketed', ticket);
    if (engineCountState !== engine.state) { engineCountState = engine.state; engineCounts = M.counts(engine.state); }
    if (ticketCountState !== ticket.state) { ticketCountState = ticket.state; ticketCounts = M.counts(ticket.state, true); }
    const values = [M.giveaway(engine.state, Date.now() + engine.offset, engineCounts || M.counts(null)), M.ticket(ticket.state, Date.now() + (ticket.offset || 0), ticketCounts || M.counts(null, true))].filter(Boolean);
    const keys = new Set(values.map(v => v.key));
    for (const [key, c] of cards) if (!keys.has(key)) { c.element.remove(); cards.delete(key); }
    for (const value of values) cardFor(value, value.source === 'ticket' ? ticket : engine);
    const active = values.filter(v => v.active).length, complete = values.some(v => !v.active), fullyCurrent = fresh(engine) && fresh(ticket) && !!engine.state && !!ticket.state;
    $('ag-count').textContent = active + (fullyCurrent ? ' active' : ' last known');
    $('ag-grid').hidden = !active; $('ag-completed').hidden = !complete; $('ag-empty').hidden = active > 0;
    $('ag-empty-status').textContent = fullyCurrent ? 'No active giveaways. Start one using the controls below.' : 'Checking saved giveaways. A missing connection does not mean there are no active giveaways.';
    $('ag-refresh').disabled = busy;
  }
  function connect() {
    const gen = ++generation; client?.stop();
    engine.connected = false; engine.message = 'Connecting…';
    const next = client = new GiveawayFeed(settings());
    next.addEventListener('state', e => {
      if (gen !== generation) return;
      const packet = e.detail, state = packet.state;
      if (!state || state.schema !== 1 || !Number.isSafeInteger(state.revision)) return;
      const pool = state.session || state.preview;
      if (pool && (!Array.isArray(pool.pool) || !Array.isArray(pool.draws) || typeof pool.id !== 'string')) return;
      if (engine.state && state.revision < engine.state.revision) return;
      engine.state = state; engine.receivedAt = Date.now();
      if (Number.isFinite(packet.serverAt)) engine.offset = packet.serverAt - Date.now();
      render();
    });
    next.addEventListener('status', e => { if (gen === generation) { engine.connected = e.detail.state === 'live'; engine.message = e.detail.message; render(); } });
    next.addEventListener('notice', e => { if (gen === generation) { engine.connected = false; engine.message = e.detail; render(); } });
    next.connect();
  }
  async function refresh() {
    if (busy || !host) return; busy = true; render();
    try {
      if (demo()) return;
      const work = [window.VoyagerLiveTicketControl?.refreshState()];
      if (client?.transportReady) work.push(client.sync()); else connect();
      await Promise.allSettled(work);
    } finally { busy = false; render(); }
  }
  function update() {
    if (!host) return;
    const key = JSON.stringify(settings());
    if (!demo() && key !== connectionKey) {
      connectionKey = key; engine = {state: null, connected: false, receivedAt: 0, offset: 0, message: 'Connecting…'}; connect();
    }
    render();
  }
  function init(controller) {
    if (!$('ag-panel')) return;
    host = controller; $('ag-refresh').onclick = refresh;
    if (demo()) {
      const now = Date.now(), users = Object.values(window.VoyagerTickets.demo().campaign.users).map(u => ({...u, groups: ['silver', 'gold', 'platinum']}));
      engine = {connected: true, receivedAt: now, offset: 0, state: {schema: 1, revision: 1, session: null, view: 'pool',
        preview: {id: 'sample-silver', mode: 'groups', title: 'Silver Voyager ship giveaway', groups: ['silver', 'gold', 'platinum'], createdAt: now - 120000, pool: users, draws: []}}};
      for (const link of $('ag-empty').querySelectorAll('a')) link.href += '?demo=1';
    }
    update(); timer = setInterval(render, 1000);
    window.addEventListener('pagehide', () => { ++generation; clearInterval(timer); client?.stop(); });
  }
  window.VoyagerActiveGiveawaysControl = {init, update};
})();

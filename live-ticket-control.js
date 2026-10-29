/* Live dashboard controls for the existing independent ticket giveaway action. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id), M = window.VoyagerTickets;
  let host, client, panel, state = null, connected = false, busy = false, receivedAt = 0;
  let offset = 0, connectionKey = '', generation = 0, timer, previewKey = '';
  let statusText = 'Connecting to ticket giveaway…', errorText = '';
  const demo = () => host.getState().demo === true;
  const config = () => ({...window.VOYAGER_CONFIG, ...host.getState().settings.connection});
  const fresh = () => !!state && (demo() || connected && Date.now() - receivedAt < 90000);

  function preview() {
    // A read-only draft preview; it never opens a second control connection or plays audio.
    $('lt-preview').contentWindow?.postMessage({
      type: 'voyager.leaderboard.preview', config: {...(panel?.state?.config || window.VoyagerLeaderboardPanel.defaults), kind: 'tickets', platform: 'all'}, sourceSettings: panel?.state?.sourceSettings || window.VoyagerLeaderboardPanel.sourceSettings({}), ticketState: state, ticketOffset: offset, sample: demo()
    }, '*');
  }

  function render() {
    const campaign = state?.campaign, ready = fresh() && panel?.ready && !busy;
    const status = M.status(campaign, Date.now() + offset), totals = M.totals(state);
    $('lt-title').textContent = campaign?.title || 'No ticketed giveaway loaded';
    $('lt-campaign-status').textContent = campaign ? status : 'No giveaway';
    $('lt-campaign-status').dataset.status = status;
    $('lt-accounts').textContent = campaign ? totals.accounts.toLocaleString() : '—';
    $('lt-tickets').textContent = campaign ? totals.tickets.toLocaleString() : '—';
    $('lt-show').disabled = !ready || !campaign;
    $('lt-hide').disabled = !ready || !campaign || !panel?.active;
    $('lt-refresh').disabled = busy;
    const mode = panel?.active ? 'Tickets are showing in the shared OBS panel.' : 'Tickets are hidden. Show ticket panel replaces the current leaderboard.';
    $('lt-status').textContent = busy ? 'Updating ticket panel…' : errorText || (!fresh() || !panel?.ready ? statusText || 'Ticket state is out of date. Refresh to reconnect.'
      : !campaign ? 'Create a giveaway in Ticket controls to show its panel.'
      : (demo() ? 'Demo only · ' : '') + mode + ' Collection is ' + status + '.');
    if (!busy && !errorText && connected && state && !fresh()) $('lt-status').textContent = 'Ticket state is out of date. Refresh ticket status before showing the panel.';
    $('lt-status').dataset.error = String(!!errorText);
    const key = JSON.stringify([state?.revision, state?.campaign?.id, offset, panel?.state?.revision]);
    if (key !== previewKey) { previewKey = key; preview(); }
  }

  function accept(next, clock = offset) {
    if (!next || next.schema !== 1 || !Number.isSafeInteger(next.revision)) return;
    if (state && next.revision < state.revision) return;
    state = next;
    if (Number.isFinite(clock)) offset = clock;
    receivedAt = Date.now();
    render();
  }

  function connectPanel() {
    panel = new window.VoyagerTicketPanel(config(), demo());
    panel.addEventListener('change', render);
    panel.addEventListener('status', e => { if (e.detail.state !== 'live') statusText = e.detail.message; render(); });
    panel.connect();
  }

  function connect() {
    const gen = ++generation;
    client?.stop(); panel?.stop(); state = null; connected = false; receivedAt = 0;
    statusText = 'Connecting to ticket giveaway…'; errorText = ''; previewKey = '';
    connectPanel();
    const next = client = new window.VoyagerTicketConnection({...config(), readOnly: true});
    next.addEventListener('status', e => {
      if (gen !== generation) return;
      connected = e.detail.state === 'live'; statusText = e.detail.message; render();
    });
    next.addEventListener('tickets', e => {
      if (gen === generation) accept(e.detail.state, e.detail.offset);
    });
    next.addEventListener('notice', e => {
      if (gen !== generation) return;
      receivedAt = 0; statusText = e.detail; render();
    });
    render(); next.connect();
  }

  async function write(operation) {
    if (!fresh() || !panel?.ready || busy || !state.campaign || !['show', 'hide'].includes(operation)) return;
    const gen = generation;
    busy = true; errorText = ''; render();
    try {
      await panel.select(operation);
      if (gen === generation) render();
    } catch (e) {
      if (gen !== generation) return;
      errorText = 'Update not confirmed: ' + e.message;
      receivedAt = 0;
      // Recover saved state only. Never repeat a visibility command automatically.
      if (client?.transportReady) client.sync().catch(() => {});
    } finally {
      busy = false;
      if (gen === generation) render();
    }
  }

  function update() {
    if (!host) return;
    const key = JSON.stringify(config());
    if (!demo() && key !== connectionKey) { connectionKey = key; connect(); }
    render();
  }

  function init(controller) {
    if (!$('lt-panel')) return;
    host = controller;
    const overlay = new URL('Voyager_Leaderboard_Panel.html', location.href);
    $('lt-url').value = overlay.href;
    $('lt-open').href = overlay.href + (demo() ? '?preview=1&tickets=1' : '');
    if (demo()) $('lt-manage').href += '?demo=1';
    $('lt-show').onclick = () => write('show');
    $('lt-hide').onclick = () => write('hide');
    $('lt-refresh').onclick = async () => {
      errorText = '';
      if (demo()) { render(); return; }
      if (!client?.transportReady) { connect(); return; }
      try { await client.sync(); await panel.refresh(); } catch (e) { errorText = e.message; }
      render();
    };
    $('lt-copy').onclick = async () => {
      try { await navigator.clipboard.writeText(overlay.href); $('lt-copy-note').textContent = 'OBS URL copied.'; }
      catch { $('lt-url').focus(); $('lt-url').select(); $('lt-copy-note').textContent = 'Select and copy the OBS URL above.'; }
    };
    $('lt-preview').addEventListener('load', preview);
    window.addEventListener('message', e => {
      if (e.source === $('lt-preview').contentWindow && e.data?.type === 'voyager.leaderboard.preview.ready') preview();
    });
    if (demo()) { connectPanel(); connected = true; state = {...M.demo(), view: 'hidden'}; receivedAt = Date.now(); }
    update(); timer = setInterval(render, 1000);
    window.addEventListener('pagehide', () => { ++generation; clearInterval(timer); client?.stop(); panel?.stop(); });
  }
  window.VoyagerLiveTicketControl = {init, update, getState: () => state,
    getSnapshot: () => ({state, connected, receivedAt, offset, message: statusText}),
    refreshState: async () => {
      if (demo()) return state;
      if (!client?.transportReady) { connect(); return null; }
      return client.sync();
    }};
})();

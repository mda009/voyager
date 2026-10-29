/* Ticket controls select the same persisted OBS slot as community leaderboards.
   This client only writes display settings; it never touches the ticket ledger. */
(() => {
  'use strict';
  const M = window.VoyagerLeaderboardPanel;
  class TicketPanel extends EventTarget {
    constructor(config = {}, demo = false) {
      super(); this.config = config; this.demo = demo; this.state = null;
      this.offset = 0; this.connected = false; this.receivedAt = 0; this.busy = false; this.generation = 0;
    }
    emit(type, detail) { this.dispatchEvent(new CustomEvent(type, {detail})); }
    get ready() { return !!this.state && (this.demo || this.connected && Date.now() - this.receivedAt < 90000); }
    get active() { return this.state?.config.kind === 'tickets' && M.showing(this.state, Date.now() + this.offset); }
    accept(detail) {
      const next = M.state(detail.state);
      if (this.state && !detail.authoritative && next.epoch === this.state.epoch && next.revision < this.state.revision) return;
      this.state = next; this.receivedAt = Date.now();
      if (Number.isFinite(detail.serverAt)) this.offset = detail.serverAt - Date.now();
      this.emit('change', next);
    }
    connect() {
      this.stop(); const gen = this.generation;
      if (this.demo) {
        this.connected = true;
        this.accept({state: {schema: 1, epoch: '33333333-4444-4555-8666-777777777777', revision: 0,
          visible: false, expiresAt: 0, updatedAt: 0, config: M.defaults, sourceSettings: M.sourceSettings({})}});
        return;
      }
      const client = this.client = new window.VoyagerLeaderboardPanelConnection(this.config);
      client.addEventListener('leaderboard-panel', e => { if (gen === this.generation) this.accept(e.detail); });
      client.addEventListener('status', e => {
        if (gen !== this.generation) return;
        this.connected = e.detail.state === 'live'; this.emit('status', e.detail);
      });
      client.addEventListener('notice', e => {
        if (gen !== this.generation) return;
        this.receivedAt = 0; this.emit('status', {state: 'error', message: e.detail});
      });
      client.connect();
    }
    async refresh() {
      if (this.demo) return this.state;
      if (!this.client?.transportReady) throw Error('Connect the Voyager - Leaderboard Panel action first.');
      return this.client.sync();
    }
    async select(operation) {
      if (!['show', 'hide'].includes(operation)) throw Error('Unknown ticket panel display command.');
      if (this.busy) throw Error('The shared panel is still updating.');
      this.busy = true; const gen = this.generation;
      try {
        const state = await this.refresh();
        if (gen !== this.generation || !state) throw Error('The panel connection changed. Try again once connected.');
        // Hiding tickets must never hide a leaderboard selected in another dock.
        if (operation === 'hide' && state.config.kind !== 'tickets') return state;
        const config = M.config({...state.config, kind: 'tickets', platform: 'all'});
        let next;
        if (this.demo) next = {...state, config, revision: state.revision + 1, updatedAt: Date.now(),
          visible: operation === 'show', expiresAt: operation === 'show' && config.duration ? Date.now() + config.duration * 1000 : 0};
        else next = await this.client.call(operation, {baseEpoch: state.epoch, baseRevision: state.revision,
          ...(operation === 'show' ? {panelPayload: JSON.stringify({config, sourceSettings: state.sourceSettings})} : {})});
        if (gen === this.generation) this.accept({state: next});
        return next;
      } catch (e) {
        if (gen === this.generation && this.client?.transportReady) this.client.sync().catch(() => {});
        throw Error(e.message + (e.message === 'Choose a leaderboard.' ? ' Compile the updated Voyager_Leaderboard_Panel.cs in your existing panel action.' : ''));
      } finally { this.busy = false; }
    }
    stop() { ++this.generation; this.client?.stop(); this.client = null; this.connected = false; }
  }
  window.VoyagerTicketPanel = TicketPanel;
})();

/* Display-only projections of the two existing saved giveaway engines. */
((root, factory) => {
  const model = factory();
  if (typeof module === 'object' && module.exports) module.exports = model;
  else root.VoyagerActiveGiveaways = model;
})(typeof window === 'object' ? window : globalThis, () => {
  'use strict';
  const groups = {blue: 'Blue', silver: 'Silver', gold: 'Gold', platinum: 'Platinum', vip: 'Ruby VIP'};
  const platforms = {twitch: 'Twitch', youtube: 'YouTube', kick: 'Kick'};
  const number = n => Number.isFinite(Number(n)) ? Math.max(0, Number(n)) : 0;
  const list = v => Array.isArray(v) ? v : [];
  const current = s => list(s?.draws).find(d => d.id === s.currentDrawId) || null;
  function duration(ms) {
    const seconds = Math.max(0, Math.ceil(ms / 1000));
    if (seconds >= 86400) return Math.floor(seconds / 86400) + 'd ' + Math.floor(seconds % 86400 / 3600) + 'h';
    if (seconds >= 3600) return Math.floor(seconds / 3600) + 'h ' + Math.floor(seconds % 3600 / 60) + 'm';
    return seconds >= 60 ? Math.floor(seconds / 60) + 'm ' + seconds % 60 + 's' : seconds + 's';
  }
  function counts(state, ticket = false) {
    const session = ticket ? state?.campaign : state?.session || state?.preview;
    const rows = ticket ? Object.values(session?.users || {}) : list(session?.pool);
    const used = new Set(list(session?.draws).map(d => d.winner?.key));
    const totals = {entrants: rows.length, eligible: 0, tickets: 0, eligibleTickets: 0, platforms: {}, draws: list(session?.draws).length};
    for (const user of rows) {
      const value = ticket ? number(user.tickets) : 1;
      totals.tickets += value;
      if (!user.blocked && !used.has(user.key) && value > 0) { totals.eligible++; totals.eligibleTickets += value; }
      if (platforms[user.platform]) totals.platforms[user.platform] = (totals.platforms[user.platform] || 0) + 1;
    }
    return totals;
  }
  function result(draw, reveal, now, ticket = false) {
    if (!draw) return null;
    const revealing = reveal && reveal.test !== true && (ticket ? reveal.id === draw.id : reveal.drawId === draw.id);
    const revealAt = revealing ? number(reveal.at) : number(draw.at);
    if (revealAt && now < revealAt + 20000 && now >= revealAt - 5000) return {
      status: 'drawing', label: 'Drawing', detail: 'Winner reveal in ' + duration(revealAt + 20000 - now), winner: ''
    };
    const winner = draw.winner?.name || 'Saved winner';
    const account = platforms[draw.winner?.platform] || draw.winner?.platform || '';
    if (draw.status === 'confirmed') return {status: 'confirmed', label: 'Winner confirmed', detail: 'Result saved' + (account ? ' · ' + account : ''), winner};
    if (draw.status !== 'selected') return {status: 'drawn', label: 'Drawn', detail: String(draw.status || 'Result saved').replaceAll('_', ' '), winner};
    const deadline = number(draw.claimDeadline);
    if (!ticket && deadline) {
      if (now >= deadline) return {status: 'expired', label: 'Claim expired', detail: 'Awaiting a manual reroll', winner};
      const claimStarts = number(draw.at) + 30000;
      return {status: 'claim', label: 'Awaiting claim', detail: now < claimStarts ? 'Claim timer starts in ' + duration(claimStarts - now) : 'Claim closes in ' + duration(deadline - now), winner};
    }
    return {status: 'drawn', label: 'Awaiting confirmation', detail: 'Confirm the saved winner in giveaway controls' + (account ? ' · ' + account : ''), winner};
  }
  function giveaway(state, now = Date.now(), totals = counts(state)) {
    const session = state?.session || state?.preview;
    if (!session) return null;
    const preview = !state.session;
    const chat = session.mode === 'chat';
    const draw = current(session);
    const summary = result(draw, state.reveal, now) || {
      status: preview || chat && session.entriesOpen ? 'open' : 'locked',
      label: preview ? 'Open pool' : chat && session.entriesOpen ? 'Entries open' : 'Locked',
      detail: preview ? 'Membership updates until the pool is locked' : chat && session.entriesOpen ? 'Enter with !ticket or !enter' : 'Pool saved · ready to draw', winner: ''
    };
    return {key: 'giveaway:' + session.id, source: 'giveaway', type: chat ? 'Impromptu giveaway' : 'Tiered giveaway',
      title: session.title || 'Untitled giveaway', active: true, ...summary, totals,
      tags: chat ? ['Twitch', 'YouTube', 'Kick'] : list(session.groups).map(g => groups[g] || g),
      warning: preview && session.error ? 'Member pool could not refresh: ' + session.error : '',
      timing: {label: preview ? 'Opened' : chat ? 'Started' : 'Pool locked', at: number(session.createdAt)},
      link: 'Giveaway_Control.html', linkText: 'Open giveaway controls', preview};
  }
  function ticket(state, now = Date.now(), totals = counts(state, true)) {
    const campaign = state?.campaign;
    if (!campaign) return null;
    const savedStatus = campaign.status || 'unknown';
    const status = ['open', 'paused'].includes(savedStatus) && number(campaign.endsAt) > 0 && now >= campaign.endsAt ? 'locked' : savedStatus;
    const draw = list(campaign.draws).at(-1);
    const summary = status === 'completed' ? {status: 'completed', label: 'Completed', detail: 'Collection ended · saved results retained', winner: draw?.winner?.name || ''} : result(draw, state.reveal, now, true) || {
      status, label: {open: 'Entries open', paused: 'Paused', locked: 'Locked', drawn: 'Drawn'}[status] || 'Check status',
      detail: status === 'open' ? 'Enter with !entergiveaway' : status === 'paused' ? 'Ticket collection paused' : status === 'locked' ? 'Collection locked · ready to draw' : 'Open ticket controls for details', winner: ''
    };
    return {key: 'ticket:' + campaign.id, source: 'ticket', type: 'Ticketed giveaway', title: campaign.title || 'Untitled giveaway',
      active: status !== 'completed', ...summary, totals, tags: list(campaign.platforms).map(p => platforms[p] || p), warning: '',
      timing: {label: status === 'completed' ? 'Collection deadline' : 'Closes', at: number(campaign.endsAt)},
      remaining: ['open', 'paused'].includes(status) && campaign.endsAt > now ? duration(campaign.endsAt - now) + ' remaining' : '',
      link: 'Voyager_Ticket_Giveaway.html', linkText: 'Open ticket controls'};
  }
  return {groups, platforms, duration, counts, current, giveaway, ticket};
});

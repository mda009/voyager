/* Read-only summaries. Never add daily unique counts or overlapping sub categories. */
((root, factory) => {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.VoyagerReportInsightsModel = api;
})(typeof window === 'object' ? window : globalThis, () => {
  'use strict';
  const number = n => typeof n === 'number' && Number.isFinite(n) ? n : null;
  const metric = (report, key) => number(report?.metrics?.[key]);
  const hours = (report, minutes, hoursKey) => metric(report, minutes) !== null ? metric(report, minutes) / 60 : metric(report, hoursKey);
  const readers = {
    watched: r => hours(r, 'minutesWatched', 'hoursWatched'),
    streamed: r => hours(r, 'minutesStreamed', 'hoursStreamed'),
    follows: r => metric(r, 'follows'),
    subscriptions: r => metric(r, 'subscriptions'),
    paid: r => metric(r, 'paidSubscriptions'),
    prime: r => metric(r, 'primeSubscriptions'),
    gifted: r => metric(r, 'giftedSubscriptions')
  };
  function build(context, M) {
    const view = context?.reportView || {}, report = view.report || null, selected = context?.selected || 'range:30';
    const start = report?.start || view.start || '', end = report?.end || view.end || '';
    const windowDays = start && end ? Math.round((Date.parse(end) - Date.parse(start)) / 86400000) + 1 : 0;
    const isWindow = selected.startsWith('range:') && selected !== 'range:latest';
    // reportSetKey includes source, time zone and currency: never mix report sets.
    const setKey = report ? M.reportSetKey(report) : view.setId || context?.reportSetId;
    const candidates = (context?.reports || []).filter(r => M.reportSetKey(r) === setKey);
    let exact = !isWindow ? view.sourceReport || report : view.exact ? candidates.filter(r => r.start === start && r.end === end).sort((a, b) => b.updatedAt - a.updatedAt || M.key(a).localeCompare(M.key(b)))[0] || null : null;
    if (!selected.startsWith('range:')) exact = report;
    const daily = !isWindow && exact?.start === exact?.end ? [exact] : M.dailyReports(candidates, end || '9999-12-31').rows.filter(r => r.start >= start && r.end <= end);
    const readTotal = key => {
      const read = readers[key], whole = read(exact), supplied = daily.filter(r => read(r) !== null);
      return {value: whole !== null ? whole : supplied.length ? supplied.reduce((sum, r) => sum + read(r), 0) : null,
        exact: whole !== null, days: supplied.length,
        note: whole !== null ? 'Source total for the selected dates' : supplied.length ? supplied.length + ' / ' + windowDays + ' dates supplied' : 'Not supplied in the selected reports'};
    };
    const totals = Object.fromEntries(Object.keys(readers).map(k => [k, readTotal(k)]));
    const dailyMap = new Map(daily.map(r => [r.start, r]));
    const series = key => {
      const result = [], count = Math.min(60, Math.max(0, windowDays));
      for (let i = count - 1; i >= 0; i--) { const day = M.shiftDay(end, -i); result.push({date: day, value: readers[key](dailyMap.get(day))}); }
      return result;
    };
    const watchedKey = totals.watched.value !== null ? 'watched' : 'streamed';
    const subscriptionKey = ['subscriptions', 'paid', 'prime', 'gifted'].find(k => totals[k].value !== null) || 'subscriptions';
    const labels = {subscriptions: 'Reported subscriptions', paid: 'Paid subscriptions', prime: 'Prime subscriptions', gifted: 'Gifted subscriptions'};
    const followDays = daily.filter(r => readers.follows(r) !== null).sort((a, b) => readers.follows(b) - readers.follows(a) || b.start.localeCompare(a.start));
    return {start, end, windowDays, source: report?.source || '', timezone: report?.timezone || '',
      updatedAt: report?.updatedAt || 0, loaded: !!report, limited: windowDays > 60,
      viewing: {...totals[watchedKey], key: watchedKey, label: watchedKey === 'watched' ? 'Hours watched' : 'Hours streamed',
        series: series(watchedKey), streamed: totals.streamed.value, average: metric(report, 'averageViewers')},
      follows: {...totals.follows, label: 'Reported follows', series: series('follows'), best: followDays.length ? {date: followDays[0].start, value: readers.follows(followDays[0])} : null},
      subscriptions: {...totals[subscriptionKey], label: labels[subscriptionKey], key: subscriptionKey,
        categories: ['paid', 'prime', 'gifted'].filter(k => totals[k].value !== null).map(k => ({key: k, label: labels[k], ...totals[k]}))}
    };
  }
  return {build};
});

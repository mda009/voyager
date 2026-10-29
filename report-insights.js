/* Replaces unavailable audience breakdowns with existing uploaded report metrics. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id), M = window.VoyagerReportInsightsModel;
  const format = (n, digits = 0) => n === null || n === undefined ? '—' : Number(n).toLocaleString('en-AU', {maximumFractionDigits: digits});
  const date = d => d ? new Date(d + 'T12:00:00Z').toLocaleDateString('en-AU', {day: 'numeric', month: 'short', timeZone: 'UTC'}) : '';
  const el = (tag, text, cls) => { const n = document.createElement(tag); if (text !== undefined) n.textContent = text; if (cls) n.className = cls; return n; };
  function metricCard(id, data, digits) {
    $(id + '-value').textContent = format(data.value, digits);
    $(id + '-label').textContent = data.label;
    $(id + '-coverage').textContent = data.note;
    $(id).dataset.available = String(data.value !== null);
  }
  function chart(id, rows, unit) {
    const svg = $(id), NS = 'http://www.w3.org/2000/svg'; svg.replaceChildren();
    const make = (tag, attrs, text, parent = svg) => { const n = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v); if (text !== undefined) n.textContent = text; parent.append(n); return n; };
    const available = rows.filter(r => r.value !== null);
    if (!available.length) {
      make('text', {x: 180, y: 68, 'text-anchor': 'middle', fill: '#8faac1', 'font-size': 12}, 'Daily detail not supplied for these dates');
      svg.setAttribute('aria-label', 'No daily ' + unit + ' supplied for these dates.'); return;
    }
    const min = Math.min(0, ...available.map(r => r.value)), max = Math.max(1, ...available.map(r => r.value));
    const left = 30, right = 352, top = 10, bottom = 107, height = bottom - top, range = max - min;
    const y = value => bottom - (value - min) / range * height, zero = y(0), cell = (right - left) / rows.length;
    make('line', {x1: left, y1: zero, x2: right, y2: zero, stroke: '#607d94', 'stroke-width': 1});
    make('text', {x: left - 6, y: top + 4, 'text-anchor': 'end', fill: '#86a3bb', 'font-size': 9}, format(max, 1));
    if (min < 0) make('text', {x: left - 6, y: bottom, 'text-anchor': 'end', fill: '#cead9e', 'font-size': 9}, format(min));
    rows.forEach((r, i) => {
      const x = left + (i + .5) * cell, missing = r.value === null;
      const group = make('g', {'data-date': r.date, 'data-value': missing ? 'missing' : r.value});
      make('title', {}, date(r.date) + ' · ' + (missing ? 'Not supplied' : format(r.value, 2) + ' ' + unit), group);
      if (missing) {
        make('path', {d: 'M' + (x - 2) + ',' + (zero - 3) + 'l4,4m0,-4l-4,4', stroke: '#c4aa79', 'stroke-width': 1}, undefined, group);
      } else if (r.value === 0) make('circle', {cx: x, cy: zero, r: 2, fill: '#9cc4df'}, undefined, group);
      else make('rect', {x: x - cell * .32, y: Math.min(zero, y(r.value)), width: Math.max(1, cell * .64), height: Math.max(.8, Math.abs(zero - y(r.value))), rx: 1.5, fill: r.value < 0 ? '#dca99c' : '#9ed8f5'}, undefined, group);
      if (rows.length <= 5 || i === 0 || i === rows.length - 1 || i === Math.floor(rows.length / 2)) make('text', {x, y: 128, fill: '#99b4c9', 'font-size': 9, 'text-anchor': 'middle'}, date(r.date));
    });
    svg.setAttribute('aria-label', 'Daily ' + unit + ', ' + date(rows[0].date) + ' to ' + date(rows.at(-1).date) + '. ' + available.length + ' dates supplied. Crosses indicate missing data, dots are reported zero.');
  }
  function render() {
    if (!$('ri-panels')) return;
    const value = M.build(window.VoyagerReports?.chartContext(), window.VoyagerTwitchAnalyticsModel);
    metricCard('ri-viewing', value.viewing, 1); metricCard('ri-follows', value.follows, 0); metricCard('ri-subscriptions', value.subscriptions, 0);
    chart('ri-viewing-chart', value.viewing.series, value.viewing.label.toLowerCase());
    chart('ri-follows-chart', value.follows.series, 'reported follows');
    const subline = [];
    if (value.viewing.key === 'watched' && value.viewing.streamed !== null) subline.push(format(value.viewing.streamed, 1) + ' hours streamed');
    if (value.viewing.average !== null) subline.push(format(value.viewing.average, 1) + ' average viewers');
    $('ri-viewing-detail').textContent = subline.join(' · ') || 'Minutes are converted to hours where supplied.';
    $('ri-follows-detail').textContent = value.follows.best ? 'Best reported day: ' + date(value.follows.best.date) + ' · ' + format(value.follows.best.value) + ' follows' : 'Source figures retain any negative corrections.';
    const list = $('ri-subscription-bars'); list.replaceChildren();
    const categories = value.subscriptions.categories, signed = categories.some(r => r.value < 0), max = Math.max(1, ...categories.map(r => Math.abs(r.value)));
    for (const row of categories) {
      const item = el('li'), label = el('div', undefined, 'ri-bar-label'), track = el('div', undefined, 'ri-bar-track'), fill = el('i');
      label.append(el('span', row.label), el('b', format(row.value)));
      fill.style.width = (Math.abs(row.value) / max * (signed ? 50 : 100)) + '%';
      fill.style.left = (signed ? row.value < 0 ? 50 - Math.abs(row.value) / max * 50 : 50 : 0) + '%';
      track.dataset.signed = String(signed); fill.dataset.negative = String(row.value < 0); track.setAttribute('aria-hidden', 'true'); track.append(fill);
      item.append(label, track, el('small', row.note)); list.append(item);
    }
    $('ri-subscription-note').textContent = categories.length ? 'Reported categories can overlap; they are not added together.' : value.subscriptions.value !== null ? 'Subscription total supplied; category breakdown not included.' : 'No subscription figures in the selected reports.';
    $('ri-period-note').textContent = value.loaded ? value.source + ' · ' + value.start + ' to ' + value.end + ' · ' + value.timezone + '. Updates when you import reports or change the reporting window. × = missing date; dot = reported zero.' + (value.limited ? ' Charts show the last 60 dates; totals cover the whole selection.' : '') : 'These panels use your saved Twitch reports. Upload a CSV or select an individual saved report to see figures.';
  }
  window.addEventListener('voyager:reports-updated', render);
  render();
})();

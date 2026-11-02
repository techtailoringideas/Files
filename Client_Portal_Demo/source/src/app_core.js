'use strict';
/* Clickable prototype of the customer site and the team dashboard.
   One state object drives both sides, so what a customer does shows up for the team and back. */

const KEY = 'tt-portal-demo-v4';
const SCALES = [[1, 'Normal', 'Standard size'], [1.125, 'Large', 'A little bigger'], [1.25, 'Larger', 'Easiest to read']];
const SAMPLES = {
  market: [{ pic: 'mr_cover', title: 'Market entry, Chile', note: 'Report cover' }, { pic: 'mr_slide', title: 'What competitors charge', note: 'Slide inside the summary' }, { pic: 'mr_action', title: 'Action plan', note: 'Cover' }, { pic: 'mr_deck', title: 'Slide summary', note: 'First slide' }],
  manuals: [{ pic: 'pm_cover', title: 'Purchasing manual', note: 'Cover' }, { pic: 'pm_flow', title: 'Receiving goods', note: 'One of the flowcharts' }],
  courses: [{ pic: 'co_cover', title: 'Leading teams', note: 'Session 1 cover' }, { pic: 'co_slide', title: 'Sales visits, in Spanish', note: 'Inside slide' }],
  economy: [{ pic: 'me_cover', title: 'Mexico outlook, in Spanish', note: 'Report cover' }, { pic: 'me_summary', title: 'The study at a glance', note: 'Summary page' }],
  reels: [{ pic: 'reel_a', title: 'Norte Coffee', note: '15-second film' }, { pic: 'reel_b', title: 'Luma Skin', note: '15-second film' }],
};
const DEMO_ME = { name: 'María Fernández', contact: '+977 980 123 4521', via: 'phone' };
const DEMO_ANSWERS = { goal: ['comp', 'price'], country: 'Colombia', city: '', company: 'Northwind Foods', industry: 'Food and drink',
  tell: { voice: 18, transcript: 'We make eye-health supplements and want to start selling in Colombia. We need to know who the competitors are and what they charge.' }, lang: 'English', when: 'Within a week' };
const CODES = [['+977', 'Nepal'], ['+52', 'Mexico'], ['+57', 'Colombia'], ['+56', 'Chile'], ['+51', 'Peru'], ['+34', 'Spain'], ['+1', 'United States'], ['+91', 'India']];

function blank() {
  return {
    v: 4, mode: 'c', device: 'desktop', scale: 1, me: null, team: null, seq: 1042,
    reqs: seedRequests(Date.now()),
    catalog: Object.fromEntries(SERVICES.map(id => [id, { visible: true, promise: SVC[id].promise, ready: SVC[id].ready, samples: SAMPLES[id].map(s => ({ ...s })) }])),
    drafts: {}, notifs: [], seen: {}, flags: {}, inbox: { c: [], t: [] },
    last: { c: '#c-home', t: '#t-requests' },
    settings: { reply: '2 working hours', hours: 'Sunday to Friday, 9:00 to 18:00', wa: '+977 980 000 0000' },
  };
}
// Browser storage can be blocked (private windows, file:// rules); the demo must still run without it.
function load() { try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.v === 4) return s; } catch (e) {} return blank(); }
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }

let S = load();
const U = { modal: null, lb: null, toast: null, sms: null, pop: null, tab: {}, gal: {}, way: {}, rec: null, crec: null, err: null, next: null, tnext: null, tf: 'open', scrollTo: null,
  contact: newContact(), tlog: { email: 'sam@team.example', sent: false, code: '', want: '' }, blobs: {}, drawer: null, picks: [], need: null, dir: 'fwd', played: {} };
function newContact() { return { via: 'phone', cc: '+977', value: '', sent: false, want: '', code: '', until: 0, tries: 3, verified: false, name: '', agree: false, err: null }; }

/* ---------- helpers ---------- */
const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ic = (n, s = 20, x = '') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${x}>${ICONS[n] || ''}</svg>`;
const arr = (s = 18) => ic('arrowR', s, 'class="arr"');
const H = (...p) => '#' + p.join('-');
const initials = (n) => String(n || '?').split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();
const first = (n) => String(n || '').split(/\s+/)[0];
const hm = (t) => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
function day(t) { const d = new Date(t), n = new Date(); const k = (x) => x.toDateString(); if (k(d) === k(n)) return 'today'; n.setDate(n.getDate() - 1); if (k(d) === k(n)) return 'yesterday'; return d.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' }); }
function ago(t) { const s = (Date.now() - t) / 1000; if (s < 60) return 'just now'; if (s < 3600) return `${Math.round(s / 60)} min ago`; if (s < 86400) return `${Math.round(s / 3600)} h ago`; const d = Math.round(s / 86400); return d === 1 ? 'yesterday' : `${d} days ago`; }
const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;
const mask = (c) => c.includes('@') ? c.replace(/^(.{2}).*(@.*)$/, '$1•••$2') : c.replace(/\d(?=[\d\s]{4})/g, (d, i) => (i < 6 ? d : '•'));
const findReq = (id) => S.reqs.find(r => r.id === id);
const mine = () => S.reqs.filter(r => r.mine).sort((a, b) => b.updated - a.updated);
const myLatest = () => mine()[0];
const member = (id) => TEAM.find(m => m.id === id);
const visibleSvcs = () => SERVICES.filter(id => S.catalog[id].visible);
const KW = { pdf: 'PDF', word: 'DOC', excel: 'XLS', ppt: 'PPT', video: 'MP4', zip: 'ZIP' };
const fbadge = (k, lg) => `<span class="fbadge k-${k}${lg ? ' lg' : ''}" aria-hidden="true">${k === 'flow' ? ic('flow', lg ? 16 : 11, 'stroke-width="2.4"') : KW[k]}</span>`;
const KIND = { pdf: 'PDF', word: 'Word', excel: 'Excel', ppt: 'PowerPoint', video: 'Video', zip: 'ZIP', flow: 'Flowcharts' };
const avc = (name) => ['', ' c2', ' c3', ' c4', ' c5'][[...String(name)].reduce((n, c) => n + c.charCodeAt(0), 0) % 5];
const av = (name, size = '') => `<span class="avatar${size ? ' ' + size : ''}${avc(name)}" aria-hidden="true">${esc(initials(name))}</span>`;
const tav = (m, size = '') => `<span class="avatar staff${size ? ' ' + size : ''}" aria-hidden="true">${esc(initials(m.name))}</span>`;

const logoMark = (dark) => `<svg class="logo-mark" viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="11" fill="${dark ? '#24387A' : '#192A58'}"/><rect x="4.6" y="4.6" width="30.8" height="30.8" rx="7.4" fill="none" stroke="#F7C041" stroke-width="1.15" stroke-dasharray="2.4 2.1" stroke-linecap="round"/><path d="M12.6 12.4h14.8v3.1h-5.8v13.1h-3.2V15.5h-5.8z" fill="#fff"/></svg>`;
function logo(sub = 'Made to measure', href = '#c-home', dark = false) { return `<a class="logo" href="${href}" aria-label="Tech Tailoring, home">${logoMark(dark)}<span class="logo-word">Tech Tailoring<small>${sub}</small></span></a>`; }

let reelN = 0;
function reel(v) {
  const id = 'rg' + (++reelN);
  if (v === 'a') return `<svg class="reel" viewBox="0 0 180 320" role="img" aria-label="Example film: Norte Coffee"><defs><linearGradient id="${id}a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#24160F"/><stop offset="1" stop-color="#94532C"/></linearGradient><radialGradient id="${id}b" cx=".5" cy=".55" r=".5"><stop offset="0" stop-color="#F6BE84" stop-opacity=".6"/><stop offset="1" stop-color="#F6BE84" stop-opacity="0"/></radialGradient></defs><rect width="180" height="320" fill="url(#${id}a)"/><circle cx="90" cy="168" r="96" fill="url(#${id}b)"/><path d="M76 118c-7-9 7-14 0-25M90 113c-7-9 7-14 0-25M104 118c-7-9 7-14 0-25" stroke="#fff" stroke-opacity=".5" stroke-width="2.4" fill="none" stroke-linecap="round"/><ellipse cx="90" cy="203" rx="50" ry="8" fill="#E8D9C7"/><path d="M57 136h66v36a28 28 0 0 1-28 28H85a28 28 0 0 1-28-28z" fill="#F8F0E6"/><path d="M123 145h5a12 12 0 0 1 0 24h-6" stroke="#F8F0E6" stroke-width="6" fill="none"/><rect x="57" y="150" width="66" height="10" fill="#C2573A"/><rect x="16" y="14" width="148" height="2.4" rx="1.2" fill="#fff" fill-opacity=".25"/><rect x="16" y="14" width="64" height="2.4" rx="1.2" fill="#fff"/><text x="90" y="44" text-anchor="middle" font-family="Instrument Sans,Segoe UI,sans-serif" font-weight="700" font-size="9.5" letter-spacing="3" fill="#F3D3B0">NORTE COFFEE</text><text x="90" y="246" text-anchor="middle" font-family="Newsreader,Georgia,serif" font-size="22" font-weight="500" fill="#fff">Slow roasted.</text><text x="90" y="271" text-anchor="middle" font-family="Newsreader,Georgia,serif" font-size="22" font-style="italic" fill="#F6C98F">Fast mornings.</text><rect x="58" y="287" width="64" height="19" rx="9.5" fill="#F7C041"/><text x="90" y="299.8" text-anchor="middle" font-family="Instrument Sans,Segoe UI,sans-serif" font-size="8" font-weight="700" letter-spacing="1" fill="#24160F">SHOP NOW</text></svg>`;
  return `<svg class="reel" viewBox="0 0 180 320" role="img" aria-label="Example film: Luma Skin"><defs><linearGradient id="${id}a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FCE8DD"/><stop offset="1" stop-color="#EC9F86"/></linearGradient><linearGradient id="${id}b" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#F4E3DA"/></linearGradient></defs><rect width="180" height="320" fill="url(#${id}a)"/><circle cx="90" cy="160" r="70" fill="#fff" fill-opacity=".45"/><rect x="77" y="88" width="26" height="24" rx="5" fill="#B9502F"/><rect x="66" y="110" width="48" height="98" rx="14" fill="url(#${id}b)"/><rect x="74" y="142" width="32" height="34" rx="4" fill="#F5D6C8"/><text x="90" y="163" text-anchor="middle" font-family="Newsreader,Georgia,serif" font-size="9" font-weight="600" fill="#5A2A1C">LUMA</text><path d="M132 92l3 8 8 3-8 3-3 8-3-8-8-3 8-3zM46 196l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#fff"/><rect x="16" y="14" width="148" height="2.4" rx="1.2" fill="#3E1C12" fill-opacity=".18"/><rect x="16" y="14" width="98" height="2.4" rx="1.2" fill="#3E1C12" fill-opacity=".7"/><text x="90" y="44" text-anchor="middle" font-family="Instrument Sans,Segoe UI,sans-serif" font-weight="700" font-size="9.5" letter-spacing="3" fill="#7A3A27">LUMA SKIN</text><text x="90" y="246" text-anchor="middle" font-family="Newsreader,Georgia,serif" font-size="22" font-weight="500" fill="#3E1C12">Glow that lasts</text><text x="90" y="271" text-anchor="middle" font-family="Newsreader,Georgia,serif" font-size="22" font-style="italic" fill="#8A3B22">all day.</text><rect x="56" y="287" width="68" height="19" rx="9.5" fill="#3E1C12"/><text x="90" y="299.8" text-anchor="middle" font-family="Instrument Sans,Segoe UI,sans-serif" font-size="8" font-weight="700" letter-spacing="1" fill="#fff">DISCOVER</text></svg>`;
}
function pic(key, cls = '') {
  const p = PICS[key];
  if (!p) return '';
  if (p.shape === 'r') return `<div class="reelbox phoneish ${cls}">${reel(key === 'reel_a' ? 'a' : 'b')}</div>`;
  return `<div class="page ${p.shape}${p.screen ? ' screenish' : ''} ${cls}"><img src="${IMG[key]}" alt="${esc(p.label)}" decoding="async"></div>`;
}
function miniCover(title, kind) {
  const c = { word: '#2F5FD0', excel: '#1E7A4E', pdf: '#8E2B23', ppt: '#C8562A', flow: '#13706F' }[kind] || '#192A58';
  return `<div class="page mc"><div class="mini-cover" style="--mc:${c}"><div class="mc-top"><i></i><b>${esc(title)}</b></div><div class="mc-bot"><i></i><i></i><i></i></div></div></div>`;
}
const fileTitle = (name) => name.replace(/\.[a-z]+$/i, '');

/* ---------- the modern dropdown: a button and a listbox, opened in place ---------- */
function dd({ id, label, value, valueLabel, placeholder, options, act, data = {}, search, block, right, head, inner, cls = '' }) {
  const attrs = Object.entries(data).map(([k, v]) => ` data-${k}="${esc(v)}"`).join('');
  const shown = valueLabel != null ? valueLabel : (options.find(o => String(o.v) === String(value)) || {}).l;
  return `<div class="dd${block ? ' block' : ''}${right ? ' right' : ''}${cls ? ' ' + cls : ''}" data-dd="${esc(id)}">
    <button type="button" class="dd-btn" data-act="dd" aria-haspopup="listbox" aria-expanded="false"${label ? ` aria-label="${esc(label)}"` : ''}>${inner || `<span class="val${shown ? '' : ' ph'}">${esc(shown || placeholder || '')}</span>`}${ic('chevD', 16, 'class="chev"')}</button>
    <div class="dd-menu" role="listbox"${label ? ` aria-label="${esc(label)}"` : ''}>
      ${head ? `<div class="dd-head">${head}</div>` : ''}
      ${search ? `<div class="dd-search">${ic('search', 16)}<input type="text" placeholder="${esc(search)}" data-dd-search aria-label="${esc(search)}" autocomplete="off"></div>` : ''}
      <div class="dd-list">${options.map(o => `<button type="button" role="option" class="dd-opt" aria-selected="${String(o.v) === String(value)}" data-act="${act}" data-v="${esc(o.v)}"${attrs} data-q="${esc((o.l + ' ' + (o.sub || '') + ' ' + (o.code || '')).toLowerCase())}">${o.lead || ''}<span class="grow"><b style="font-weight:500">${esc(o.l)}</b>${o.sub ? `<span>${esc(o.sub)}</span>` : ''}</span>${ic('check', 16, 'class="ck"')}</button>`).join('')}<div class="dd-empty" hidden>No match. Try another spelling.</div></div>
    </div></div>`;
}
function closeDDs(except) { document.querySelectorAll('.dd.open').forEach(d => { if (d !== except) { d.classList.remove('open', 'up'); const b = d.querySelector('.dd-btn'); if (b) b.setAttribute('aria-expanded', 'false'); } }); }
function openDD(w) {
  closeDDs(w); w.classList.add('open'); w.querySelector('.dd-btn').setAttribute('aria-expanded', 'true');
  const menu = w.querySelector('.dd-menu'), r = menu.getBoundingClientRect(), box = $screen.getBoundingClientRect();
  if (r.bottom > box.bottom - 8 && r.top - box.top > r.height + 60) w.classList.add('up');
  const s = w.querySelector('[data-dd-search]');
  setTimeout(() => { (s || w.querySelector('.dd-opt[aria-selected="true"]') || w.querySelector('.dd-opt'))?.focus({ preventScroll: true }); }, 40);
}
function tsizeDD() {
  return dd({ id: 'tsize', label: 'Text size', value: S.scale, act: 'setscale', right: true, cls: 'tsize-btn',
    inner: `<span class="aa">Aa</span><span class="lbl">Text size</span>`,
    head: `<b>Text size</b><span>Makes every word on the site bigger</span>`,
    options: SCALES.map(([s, l, sub], i) => ({ v: s, l, sub, lead: `<span class="aa-prev" style="font-size:${.95 + i * .2}rem">Aa</span>` })) });
}

/* ---------- answers in plain words ---------- */
function fieldsOf(svc) { return ASK[svc].flatMap(s => s.fields.map(f => ({ ...f, step: s.title }))); }
function valueText(f, v) {
  if (v == null || v === '' || (Array.isArray(v) && !v.length)) return '';
  if (f.t === 'cards') { const a = [].concat(v); return a.map(x => (f.opts.find(o => o[0] === x) || [])[1] || x).join(', '); }
  if (f.t === 'chips') return [].concat(v).join(', ');
  if (f.t === 'logo') return v.name;
  if (f.t === 'photos') return v.map(p => p.name).join(', ');
  if (f.t === 'tell') { const p = []; if (v.voice) p.push(`Voice message (${mmss(v.voice)})`); if ((v.text || '').trim()) p.push(`“${v.text.trim()}”`); if ((v.files || []).length) p.push(`${v.files.length} file${v.files.length > 1 ? 's' : ''}: ${v.files.map(x => x.name).join(', ')}`); return p.join(' · '); }
  return String(v);
}
function answerRows(svc, a) {
  return fieldsOf(svc).map(f => {
    const label = f.label || ({ country: 'Country', logo: 'Logo', tell: 'Your notes', photos: 'Product photos', cards: f.step }[f.t]) || f.step;
    return [label, valueText(f, a[f.k]), f];
  });
}
function summary(r) {
  const a = r.answers, f = Object.fromEntries(fieldsOf(r.svc).map(x => [x.k, x]));
  const pick = { market: () => [valueText(f.goal, a.goal), [a.city, a.country].filter(Boolean).join(', ')], manuals: () => [valueText(f.area, a.area), a.company],
    courses: () => [valueText(f.aim, a.aim), a.sessions && `${a.sessions} session${a.sessions > 1 ? 's' : ''}`], economy: () => [a.country, valueText(f.decision, a.decision)], reels: () => [a.brand, [].concat(a.mood || []).join(', ')] }[r.svc];
  return pick().filter(Boolean).join(' · ');
}
const checks = (r) => CHECKS[r.svc](r.answers).filter(Boolean);

/* ---------- status words, customer and team ---------- */
const CSTEP = { new: 1, reviewing: 2, question: 2, making: 3, changes: 3, preview: 4, delivered: 5, cancelled: 0 };
const CLABEL = { new: ['Sent', 'p-new'], reviewing: ['We are checking it', 'p-work'], question: ['We need a detail', 'p-question'], making: ['Being prepared', 'p-work'], changes: ['Making your changes', 'p-work'], preview: ['Cover pages ready', 'p-preview'], delivered: ['Delivered', 'p-done'], cancelled: ['Cancelled', 'p-off'] };
const TLABEL = { new: ['New', 'p-new'], reviewing: ['Checking', 'p-work'], question: ['Waiting for customer', 'p-question'], making: ['In progress', 'p-work'], changes: ['Change requested', 'p-question'], preview: ['Ready to approve', 'p-preview'], delivered: ['Delivered', 'p-done'], cancelled: ['Cancelled', 'p-off'] };
const pill = (r, side) => { const [l, c] = (side === 't' ? TLABEL : CLABEL)[r.status]; return `<span class="pill ${c}">${l}</span>`; };

/* ---------- state changes (both sides call these) ---------- */
function notify(r, title, text, icon = 'bell') { if (r.mine) S.notifs.unshift({ id: Date.now() + Math.random(), req: r.id, title, text, icon, t: Date.now(), read: false }); }
function post(r, m) { r.msgs.push({ t: Date.now(), ...m }); r.updated = Date.now(); }
function tell(side, text) { S.inbox[side].push(text); }
function teamName(r) { return (member(r.assignee) || member(S.team) || TEAM[0]).name; }

function submitRequest(svc, answers, me) {
  const r = { id: 'R-' + (S.seq++), svc, status: 'new', created: Date.now(), updated: Date.now(), assignee: null, mine: true, answers, customer: { ...me }, msgs: [], files: [], notes: [] };
  post(r, { from: 'sys', text: 'Request sent' });
  S.reqs.unshift(r);
  notify(r, 'Request sent', `${SVC[svc].name}. We will reply within ${S.settings.reply}.`, 'check');
  tell('t', `New request from ${me.name}: ${SVC[svc].name}`);
  S.drafts[svc] = null;
  return r;
}
function askCustomer(r, text, who) {
  if (r.status === 'new' || r.status === 'reviewing') r.status = 'question';
  if (!r.assignee) r.assignee = S.team || 'sam';
  post(r, { from: 'team', who: who || teamName(r), text });
  notify(r, `${who || teamName(r)} asked you a question`, text, 'chat');
  tell('c', `${who || teamName(r)} sent you a message about your ${SVC[r.svc].name} request`);
  S.flags.asked = true;
}
function customerSays(r, m) {
  post(r, { from: 'c', ...m });
  if (r.status === 'question') { r.status = 'reviewing'; S.flags.answered = true; }
  tell('t', `${first(r.customer.name)} replied on ${r.id}`);
}
function startWork(r) {
  if (!r.assignee) r.assignee = S.team || 'sam';
  r.status = 'making'; r.started = Date.now();
  post(r, { from: 'sys', text: `${teamName(r)} started working on your request` });
  notify(r, 'We started on your request', 'We will show you the cover pages as soon as they are ready.', 'sparkle');
  tell('c', `Your ${SVC[r.svc].name} request is being prepared`);
  S.flags.started = true;
}
function attachFiles(r) {
  r.files = SVC[r.svc].deliver.map(f => ({ name: f[0], kind: f[1], size: f[2], pic: f[3] }));
  r.previews = true; r.status = 'preview'; r.feedback = null; r.attachedAt = Date.now();
  post(r, { from: 'sys', text: 'Cover pages are ready to see' });
  notify(r, 'Your cover pages are ready', 'Take a look. Our team does a final check, then sends you the files.', 'eye');
  tell('c', `The cover pages of your ${SVC[r.svc].name} are ready to see`);
  S.flags.attached = true;
}
function approve(r) {
  r.status = 'delivered'; r.sentAt = Date.now();
  post(r, { from: 'sys', text: `Files sent to ${first(r.customer.name)}` });
  notify(r, 'Your files are ready', `${r.files.length} files, ready to download.`, 'download');
  tell('c', `Your ${SVC[r.svc].name} files are ready to download`);
  S.flags.sent = true;
}

/* Fast-forward for the guided tour, so any step can be shown without doing the ones before it. */
const STAGES = ['submit', 'asked', 'answered', 'started', 'attached', 'sent'];
function ensure(stage) {
  const upto = STAGES.indexOf(stage);
  let r = myLatest();
  if (upto >= 0 && !r) { if (!S.me) S.me = { ...DEMO_ME }; r = submitRequest('market', JSON.parse(JSON.stringify(DEMO_ANSWERS)), S.me); }
  if (!S.team) S.team = 'sam';
  const done = { asked: () => r.msgs.some(m => m.from === 'team'), answered: () => r.msgs.some(m => m.from === 'c'), started: () => !!r.started, attached: () => r.files.length > 0, sent: () => r.status === 'delivered' };
  const run = { asked: () => askCustomer(r, 'Hello! Which city or region should we focus on? If you are not sure, we can cover the whole country.', 'Sam'),
    answered: () => customerSays(r, { text: 'Medellín, please. That is where we will open first.' }), started: () => startWork(r), attached: () => attachFiles(r), sent: () => approve(r) };
  for (const st of STAGES.slice(1, upto + 1)) if (!done[st]()) run[st]();
  if (upto >= 1) { S.inbox.c = []; S.inbox.t = []; }
  return r;
}

/* ---------- routing: plain hash names like #c-home or #t-req-R-1042 ---------- */
const $screen = $('#screen'), $layer = $('#layer'), $stage = $('#stage'), $drawer = $('#drawer');
const ROUTES = [
  [/^c-home$/, () => vHome()], [/^c-s-([a-z]+)$/, (id) => vService(id)], [/^c-ask-([a-z]+)-(\w+)$/, (s, st) => vAsk(s, st)], [/^c-done-(R-\d+)$/, (id) => vDone(id)],
  [/^c-signin$/, () => vSignin()], [/^c-requests$/, () => vMine()], [/^c-req-(R-\d+)$/, (id) => vReq(id)], [/^c-messages$/, () => vMsgs()], [/^c-account$/, () => vAccount()], [/^c-help$/, () => vHelp()],
  [/^t-login$/, () => tLogin()], [/^t-requests$/, () => tRequests()], [/^t-req-(R-\d+)$/, (id) => tReq(id)], [/^t-messages(?:-(R-\d+))?$/, (id) => tMsgs(id)],
  [/^t-catalogue$/, () => tCatalogue()], [/^t-customers$/, () => tCustomers()], [/^t-people$/, () => tPeople()], [/^t-settings$/, () => tSettings()],
];
function go(h) { if (location.hash === h) render(true); else location.hash = h; }
function setMode(m) { go(S.last[m] || (m === 'c' ? '#c-home' : '#t-requests')); }
let lastPath = '';
function render(top) {
  const hash = location.hash || '#c-home', path = hash.slice(1);
  const mode = path.startsWith('t-') ? 't' : 'c';
  if (mode === 't' && !S.team && path !== 't-login') { U.tnext = hash; return go('#t-login'); }
  if (mode === 'c' && /^c-(requests|req|messages|account)/.test(path) && !S.me) { U.next = hash; return go('#c-signin'); }
  const fresh = top || path !== lastPath;
  if (path !== lastPath) { U.err = null; U.pop = null; }
  lastPath = path; S.mode = mode; S.last[mode] = hash;
  const keep = $screen.scrollTop;
  let html = '';
  for (const [re, fn] of ROUTES) { const m = path.match(re); if (m) { html = fn(...m.slice(1)); break; } }
  // Entrance animations only on a new page; a re-render after a tap must not replay them.
  $screen.innerHTML = `<div class="shell${fresh ? '' : ' no-anim'}">${html || vHome()}</div>`;
  $screen.scrollTop = fresh ? 0 : keep;
  if (U.scrollTo) { const el = document.getElementById(U.scrollTo); U.scrollTo = null; if (el) el.scrollIntoView({ block: 'start', behavior: fresh ? 'auto' : 'smooth' }); }
  $screen.querySelectorAll('.chat-body').forEach(b => { b.scrollTop = b.scrollHeight; });
  afterRender();
  if (S.inbox[mode].length && !U.toast && (mode === 'c' || S.team)) toast(S.inbox[mode].shift(), 'bell');
  U.dir = 'fwd';
  chrome(); layer(); drawer(); observe(); save();
}
window.addEventListener('hashchange', () => render(true));

/* Plays the "how it works" seam once the section scrolls into view. Content is visible before and after. */
let io;
function observe() {
  if (io) io.disconnect();
  const els = $screen.querySelectorAll('[data-play]');
  if (!els.length || !('IntersectionObserver' in window)) return;
  io = new IntersectionObserver((list) => list.forEach(e => { if (e.isIntersecting && !U.played[e.target.dataset.play]) { U.played[e.target.dataset.play] = 1; e.target.classList.add('play'); io.unobserve(e.target); } }), { root: $screen, threshold: .35 });
  els.forEach(el => { if (U.played[el.dataset.play]) el.classList.add('done'); else io.observe(el); });
}

/* ---------- prototype chrome ---------- */
function chrome() {
  document.querySelectorAll('[data-act="mode"]').forEach(b => b.setAttribute('aria-pressed', b.dataset.m === S.mode));
  document.querySelectorAll('[data-act="device"]').forEach(b => b.setAttribute('aria-pressed', b.dataset.d === S.device));
  $stage.className = 'stage ' + S.device;
  document.documentElement.style.fontSize = (16 * S.scale) + 'px';
  const doneN = TOUR.filter(t => t.done()).length, c = 2 * Math.PI * 7;
  $('#tourCount').textContent = doneN === TOUR.length ? 'done' : `${doneN}/${TOUR.length}`;
  $('#tourRing').style.strokeDashoffset = (c * (1 - doneN / TOUR.length)).toFixed(2);
  fit();
}
function fit() {
  if (S.device !== 'phone') return;
  const s = Math.min(1, ($stage.clientHeight - 32) / 844, ($stage.clientWidth - 32) / 390);
  $('#device').style.setProperty('--fit', s.toFixed(3));
}
window.addEventListener('resize', fit);

/* ---------- overlays ---------- */
let toastTimer;
function toast(text, icon = 'info') { U.toast = { text, icon }; clearTimeout(toastTimer); toastTimer = setTimeout(() => { U.toast = null; layer(); }, 4200); layer(); }
function openModal(fn) { U.modal = fn; layer(); setTimeout(() => { const f = $layer.querySelector('.modal input, .modal textarea, .modal button.btn-primary, .modal button'); if (f) f.focus(); }, 30); }
function closeAll() { U.modal = null; U.lb = null; U.pop = null; U.modalWide = false; layer(); }
let shown = {};
function layer() {
  // An overlay that was already on screen keeps still when the layer is redrawn.
  const was = shown, st = (k) => was[k] ? ' settled' : '';
  shown = { pop: !!U.pop, modal: !!U.modal, lb: U.lb ? U.lb.pics.join() + U.lb.i : false, sms: !!U.sms, toast: U.toast && U.toast.text };
  let h = '';
  if (U.pop === 'notifs') h += `<div class="pop-catch" data-act="close"></div>${notifPop().replace('class="popover"', `class="popover${st('pop')}"`)}`;
  if (U.modal) h += `<div class="backdrop${st('modal')}" data-act="backdrop"><div class="modal${U.modalWide ? ' wide' : ''}" role="dialog" aria-modal="true">${U.modal()}</div></div>`;
  if (U.lb) h += lightbox().replace('class="lightbox"', `class="lightbox${was.lb ? ' settled' : ''}"`);
  if (U.sms) h += `<button class="sms${st('sms')}" data-act="sms-fill"><span class="app${U.sms.mail ? ' mail' : ''}">${ic(U.sms.mail ? 'mail' : 'chat', 20)}</span><span class="body"><span class="hd">${U.sms.mail ? 'Mail' : 'Messages'} <em>now</em></span><p>${esc(U.sms.text)}</p><span class="tap">Tap to fill in the code</span></span></button>`;
  if (U.welcome && !U.drawer && !U.modal && !U.lb) h += welcomeCard();
  if (U.toast) h += `<div class="toast${was.toast === U.toast.text ? ' settled' : ''}" role="status"><span class="ti">${ic(U.toast.icon, 16)}</span><span>${esc(U.toast.text)}</span></div>`;
  $layer.innerHTML = h;
}
function lightbox() {
  const { pics, i, title } = U.lb, key = pics[i], many = pics.length > 1;
  return `<div class="lightbox" role="dialog" aria-modal="true" aria-label="Page viewer"><div class="lb-top"><div class="grow"><b>${esc(title || PICS[key].label)}</b><span class="s">${many ? `${i + 1} / ${pics.length} · ` : ''}${esc(PICS[key].label)}</span></div><button class="btn btn-light btn-sm" data-act="close">${ic('x', 18)} Close</button></div>
  <div class="lb-img">${PICS[key].shape === 'r' ? reel(key === 'reel_a' ? 'a' : 'b') : `<img src="${IMG[key]}" alt="${esc(PICS[key].label)}">`}${many ? `<button class="lb-arrow l" data-act="lb" data-d="-1" aria-label="Previous page">${ic('arrowL', 20)}</button><button class="lb-arrow r" data-act="lb" data-d="1" aria-label="Next page">${ic('arrowR', 20)}</button>` : ''}</div>
  <div class="lb-nav">${many ? `<span class="lb-dots" aria-hidden="true">${pics.map((_, n) => `<i class="${n === i ? 'on' : ''}"></i>`).join('')}</span>` : ''}</div></div>`;
}
function notifPop() {
  const list = S.notifs.slice(0, 8);
  return `<div class="popover" role="dialog" aria-label="Notifications"><div class="popover-head"><b>Notifications</b><button class="link" data-act="close">Close</button></div>
  ${list.length ? list.map(n => `<button class="notif${n.read ? '' : ' unread'}" data-act="notif" data-id="${n.id}"><span class="ni">${ic(n.icon, 18)}</span><span class="grow"><b>${esc(n.title)}</b><span class="s">${esc(n.text)}</span><span class="t">${ago(n.t)}</span></span></button>`).join('') : `<p class="small" style="padding:20px 16px">Nothing yet. We will let you know here, and by message, when something changes.</p>`}</div>`;
}
const mHead = (title, sub, icon) => `<div class="modal-head">${icon ? `<span class="mi">${ic(icon)}</span>` : ''}<div class="grow"><h2>${title}</h2>${sub ? `<p class="txt">${sub}</p>` : ''}</div><button class="iconbtn plain" data-act="close" aria-label="Close">${ic('x')}</button></div>`;

/* Smooth open and close for the question lists. */
function toggleDetails(d) {
  const ans = d.querySelector('.ans');
  if (!ans || !ans.animate || matchMedia('(prefers-reduced-motion: reduce)').matches) { d.open = !d.open; return; }
  if (d.open) { const h = ans.offsetHeight; ans.animate([{ height: h + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 260, easing: 'cubic-bezier(.2,.8,.2,1)' }).onfinish = () => { d.open = false; }; d.querySelector('.chev').style.transform = 'rotate(0deg)'; setTimeout(() => d.querySelector('.chev').style.transform = '', 270); }
  else { d.open = true; const h = ans.offsetHeight; ans.animate([{ height: '0px', opacity: 0 }, { height: h + 'px', opacity: 1 }], { duration: 320, easing: 'cubic-bezier(.2,.8,.2,1)' }); }
}


/* ---------- actions ---------- */
const A = {
  mode: (el) => setMode(el.dataset.m),
  device: (el) => { S.device = el.dataset.d; render(); },
  setscale: (el) => { const s = +(el.dataset.s || el.dataset.v); if (s === S.scale) { closeDDs(); return; } S.scale = s; render(); toast(`Text size: ${(SCALES.find(x => x[0] === s) || SCALES[0])[1]}`, 'type'); },
  dd: (el) => { const w = el.closest('.dd'); if (w.classList.contains('open')) closeDDs(); else openDD(w); },
  scrollto: (el, e) => { e.preventDefault(); U.scrollTo = el.dataset.to; if (lastPath !== 'c-home') go('#c-home'); else render(); },
  need: (el) => { const v = el.dataset.v || null; U.need = U.need === v ? null : v; render(); if (U.need && $screen.clientWidth < 700) setTimeout(() => { const m = $screen.querySelector('.svc.match'); if (m) m.scrollIntoView({ block: 'center', behavior: 'smooth' }); }, 60); },
  faq: (el, e) => { e.preventDefault(); toggleDetails(el.closest('details')); },
  'nav-back': () => { U.dir = 'back'; },
  zoom: (el) => { U.lb = { pics: el.dataset.pics.split(','), i: +(el.dataset.i || 0), title: el.dataset.title }; layer(); },
  lb: (el) => { const n = U.lb.pics.length; U.lb.i = (U.lb.i + +el.dataset.d + n) % n; layer(); },
  gal: (el) => { U.gal[el.dataset.svc] = +el.dataset.i; render(); },
  close: () => closeAll(),
  backdrop: (el, e) => { if (e.target === el) closeAll(); },
  'pop-notifs': () => { U.pop = U.pop ? null : 'notifs'; layer(); },
  notif: (el) => { const n = S.notifs.find(x => String(x.id) === el.dataset.id); S.notifs.forEach(x => { x.read = true; }); U.pop = null; layer(); if (n) go(H('c', 'req', n.req)); },
  wa: (el) => {
    const r = el.dataset.cust && findReq(el.dataset.cust);
    if (r || el.dataset.name) { const c = r ? r.customer : S.reqs.find(x => x.customer.name === el.dataset.name).customer; openModal(() => waModal(c.name, c.contact.includes('@') ? 'No phone number yet' : c.contact, `Hello ${first(c.name)}, this is ${(member(S.team) || TEAM[0]).name} from Tech Tailoring${r ? ` about your request ${r.id}` : ''}.`, true, r && r.id)); }
    else openModal(() => waModal('', S.settings.wa, 'Hello Tech Tailoring, I have a question about your services.', false));
  },
  'wa-go': (el) => { closeAll(); toast(`Opens WhatsApp: wa.me/${el.dataset.num.replace(/\D/g, '')} with the message ready. Nothing is sent until you press send.`, 'wa'); },
  'wa-share': (el) => { const r = findReq(el.dataset.id); post(r, { from: 'team', who: (member(S.team) || TEAM[0]).name, text: 'Prefer WhatsApp? You can reach us here too.', wa: S.settings.wa }); tell('c', 'Our team shared their WhatsApp number'); closeAll(); render(); },
  soon: () => toast('In the real site this opens a short form.', 'info'),
  noprev: () => toast('Word and Excel files open in the same viewer the Studio uses today.', 'info'),
  copy: () => toast('Copied. Paste it into Studio if you prefer.', 'check'),
  flip: (el) => el.setAttribute('aria-checked', el.getAttribute('aria-checked') !== 'true'),

  pick: (el) => {
    const d = draft(el.dataset.svc), k = el.dataset.k, v = el.dataset.v;
    if (el.dataset.multi) { const a = [].concat(d[k] || []); d[k] = a.includes(v) ? a.filter(x => x !== v) : [...a, v]; } else d[k] = d[k] === v && !ASK[el.dataset.svc].some(s => s.fields.some(f => f.k === k && f.req)) ? null : v;
    U.err = null; U.errKeys = null; render();
  },
  unset: (el) => { const d = draft(el.dataset.svc); if (el.dataset.i != null) d[el.dataset.k].splice(+el.dataset.i, 1); else d[el.dataset.k] = null; render(); },
  way: (el) => { U.way[el.dataset.svc] = el.dataset.w; render(); if (el.dataset.w === 'type') setTimeout(() => $(`#tell-${el.dataset.svc}`)?.focus(), 30); },
  'rec-start': (el) => { U.rec = { svc: el.dataset.svc, start: Date.now() }; render(); },
  'rec-stop': (el) => { const d = draft(el.dataset.svc), t = d[el.dataset.k] = { ...(d[el.dataset.k] || {}) }; t.voice = Math.max(3, Math.round((Date.now() - U.rec.start) / 1000)); t.transcript = DEMO_ANSWERS.tell.transcript; U.rec = null; U.err = null; render(); toast('Voice message saved. Our team will listen to it.', 'check'); },
  'voice-del': (el) => { const t = draft(el.dataset.svc)[el.dataset.k]; delete t.voice; delete t.transcript; render(); },
  'tellfile-del': (el) => { draft(el.dataset.svc)[el.dataset.k].files.splice(+el.dataset.i, 1); render(); },
  play: (el) => { const k = el.dataset.key; if (U.playing === k) { U.playing = null; render(); return; } U.playing = k; render(); setTimeout(() => { if (U.playing === k) { U.playing = null; render(); } }, Math.min(+el.dataset.s, 5) * 1000); },
  next: (el) => {
    const svc = el.dataset.svc, step = el.dataset.step, list = stepList(svc), d = draft(svc);
    if (step !== 'review') {
      const st = ASK[svc][+step - 1], bad = st.fields.filter(f => f.req && !filled(f, d[f.k]));
      if (bad.length) { U.err = bad[0].t === 'tell' ? 'Please tell us a little, by voice, text or a file, so we can help.' : bad[0].t === 'text' ? `Please fill in “${bad[0].label}” to continue.` : bad[0].t === 'photos' ? 'Please add at least one photo to continue.' : 'Please choose an option to continue.'; U.errKeys = bad.map(f => f.k); render(); return; }
    }
    U.err = null; U.errKeys = null; U.dir = 'fwd'; go(H('c', 'ask', svc, list[list.indexOf(step) + 1]));
  },
  submit: (el) => {
    const svc = el.dataset.svc || lastPath.split('-')[2];
    if (!S.me) { const c = U.contact; if (!c.name.trim()) { c.err = 'Please tell us your name.'; render(); return; } if (!c.agree) { c.err = 'Please tick the box to agree to the terms.'; render(); return; } S.me = { name: c.name.trim(), contact: c.via === 'phone' ? `${c.cc} ${c.value}` : c.value, via: c.via }; U.contact = newContact(); }
    const r = submitRequest(svc, JSON.parse(JSON.stringify(draft(svc))), S.me); U.tape = null; go(H('c', 'done', r.id));
  },
  via: (el) => { U.contact.via = el.dataset.v; U.contact.err = null; U.contact.value = ''; render(); },
  cc: (el) => { U.contact.cc = el.dataset.v; render(); setTimeout(() => $('#contact-phone')?.focus(), 30); },
  'via-email': () => { Object.assign(U.contact, { via: 'email', sent: false, value: '', code: '', err: null }); render(); },
  'change-contact': () => { Object.assign(U.contact, { sent: false, code: '', err: null }); U.sms = null; render(); },
  'send-code': (el) => {
    const c = U.contact, v = c.value.trim();
    if (!el.dataset.again) {
      if (c.via === 'phone' && v.replace(/\D/g, '').length < 7) { c.err = v ? 'This number looks too short. Please check it.' : 'Please type your mobile number.'; render(); return; }
      if (c.via === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) { c.err = v ? 'This email does not look right. Please check it.' : 'Please type your email.'; render(); return; }
    }
    c.err = null; c.sent = true; c.code = ''; c.tries = 3; c.until = Date.now() + 30000; c.want = String(Math.floor(100000 + Math.random() * 900000));
    U.sms = { text: `Tech Tailoring: your code is ${c.want}. It works for 10 minutes. Never share it.`, mail: c.via === 'email', field: 'contact' };
    render(); setTimeout(() => { const i = $('#codein'); if (i) i.focus(); }, 50);
  },
  'sms-fill': () => { const s = U.sms; U.sms = null; if (s.field === 'contact') U.contact.code = U.contact.want; else U.tlog.code = U.tlog.want; render(); },
  verify: () => {
    const c = U.contact;
    if (c.code.trim() !== c.want) { c.tries--; if (c.tries <= 0) { A['send-code']({ dataset: { again: 1 } }); U.contact.err = 'Too many tries. We sent you a new code.'; render(); return; } c.err = `That code does not match. Please check the message and try again. ${c.tries} ${c.tries === 1 ? 'try' : 'tries'} left.`; render(); return; }
    c.err = null; c.verified = true; U.sms = null; render(); setTimeout(() => $('#contact-name')?.focus(), 40);
  },
  'signin-done': () => { const c = U.contact; if (!c.name.trim()) { c.err = 'Please tell us your name.'; render(); return; } S.me = { name: c.name.trim(), contact: c.via === 'phone' ? `${c.cc} ${c.value}` : c.value, via: c.via }; U.contact = newContact(); const n = U.next; U.next = null; go(n || '#c-requests'); toast(`Welcome, ${first(S.me.name)}!`, 'check'); },
  signout: () => { S.me = null; U.contact = newContact(); go('#c-home'); toast('You are signed out.', 'logout'); },
  pref: (el) => { S.me.prefs[el.dataset.k] = !S.me.prefs[el.dataset.k]; render(); },

  tab: (el) => { U.tab[el.dataset.k] = el.dataset.v; render(); },
  'tab-chat': (el) => { U.tab['c' + el.dataset.id] = 'c'; },
  answer: (el) => { U.tab['c' + el.dataset.id] = 'c'; render(); setTimeout(() => { const i = $(`[data-chatin="${el.dataset.id}"]`); if (i) { i.focus(); i.scrollIntoView({ block: 'center', behavior: 'smooth' }); } }, 30); },
  'chat-send': (el) => { const i = $(`[data-chatin="${el.dataset.id}"]`), text = i.value.trim(); if (!text) { i.focus(); return; } sendMsg(el.dataset.id, el.dataset.side, { text }); },
  quick: (el) => { const r = findReq(el.dataset.id); if (['new', 'reviewing', 'question'].includes(r.status)) askCustomer(r, el.dataset.q, (member(S.team) || TEAM[0]).name); else post(r, { from: 'team', who: (member(S.team) || TEAM[0]).name, text: el.dataset.q }); U.tab['tc' + r.id] = 'chat'; render(); toast(`Sent to ${first(r.customer.name)}. They are told by message.`, 'send'); },
  'crec-start': (el) => { U.crec = { id: el.dataset.id, side: el.dataset.side, start: Date.now() }; render(); },
  'crec-cancel': () => { U.crec = null; render(); },
  'crec-send': (el) => { const secs = Math.max(2, Math.round((Date.now() - U.crec.start) / 1000)); U.crec = null; sendMsg(el.dataset.id, el.dataset.side, { voice: secs, text: '' }); },
  'fb-good': (el) => { const r = findReq(el.dataset.id); r.feedback = 'good'; customerSays(r, { text: 'The cover pages look good, thank you!' }); render(); },
  'fb-change': (el) => openModal(() => `${mHead('What should we change?', 'Tell us in a few words. We will fix it and show you again.', 'edit')}<textarea class="textarea" id="chgin" placeholder="For example: please use our green colour on the cover."></textarea><div class="modal-actions"><button class="btn btn-secondary" data-act="close">Cancel</button><button class="btn btn-primary" data-act="fb-change-send" data-id="${el.dataset.id}">${ic('send', 17)} Send</button></div>`),
  'fb-change-send': (el) => { const r = findReq(el.dataset.id), t = ($('#chgin').value || '').trim() || 'Please use our green colour on the cover.'; r.status = 'changes'; r.feedback = 'change'; customerSays(r, { text: t, change: true }); tell('t', `${first(r.customer.name)} asked for a change on ${r.id}`); closeAll(); render(); toast('Thank you. Our team will fix it and show you again.', 'check'); },
  cancel: (el) => openModal(() => `${mHead('Cancel this request?', 'Our team stops working on it. You can always send a new request later.', 'alert')}<div class="modal-actions"><button class="btn btn-secondary" data-act="close">Keep it</button><button class="btn btn-danger" data-act="cancel-yes" data-id="${el.dataset.id}">Yes, cancel it</button></div>`),
  'cancel-yes': (el) => { const r = findReq(el.dataset.id); r.status = 'cancelled'; post(r, { from: 'sys', text: 'Cancelled by the customer' }); tell('t', `${first(r.customer.name)} cancelled ${r.id}`); closeAll(); render(); },
  zip: (el) => { S.flags.downloaded = true; toast(`Downloading ${el.dataset.id}-${SVC[findReq(el.dataset.id).svc].name.replace(/\s/g, '-')}.zip`, 'download'); save(); drawer(); chrome(); },
  dl: (el) => { const f = findReq(el.dataset.id).files[+el.dataset.i]; S.flags.downloaded = true; toast(`Downloading ${f.name}`, 'download'); save(); drawer(); chrome(); },
  'open-file': (el) => { const f = findReq(el.dataset.id).files[+el.dataset.i]; if (f.pic) { U.lb = { pics: [f.pic], i: 0, title: f.name }; layer(); } else A.noprev(); },

  tsend: () => { const c = U.tlog; c.sent = true; c.want = String(Math.floor(100000 + Math.random() * 900000)); U.sms = { text: `Your Tech Tailoring team code is ${c.want}.`, mail: true, field: 'tlog' }; render(); setTimeout(() => $('#tcodein')?.focus(), 50); },
  tverify: () => { const c = U.tlog; if (c.code.trim() !== c.want) { c.err = 'That code does not match.'; render(); return; } S.team = 'sam'; U.sms = null; U.tlog = { email: 'sam@team.example', sent: false, code: '', want: '' }; const n = U.tnext; U.tnext = null; go(n && n !== '#t-login' ? n : '#t-requests'); },
  tsignout: () => { S.team = null; go('#t-login'); },
  tf: (el) => { U.tf = U.tf === el.dataset.v ? 'open' : el.dataset.v; render(); },
  assign: (el) => { const r = findReq(el.dataset.id), v = el.dataset.v || null; if ((r.assignee || null) === v) { closeDDs(); return; } r.assignee = v; r.notes.push({ who: (member(S.team) || TEAM[0]).name, text: `Assigned to ${v ? member(v).name : 'nobody'}.`, t: Date.now() }); render(); toast(v ? `Assigned to ${member(v).name}` : 'Unassigned', 'user'); },
  studio: (el) => { const r = findReq(el.dataset.id); U.modalWide = true; openModal(() => studioModal(r)); },
  'studio-go': (el) => { const r = findReq(el.dataset.id); if (r.status !== 'changes') startWork(r); closeAll(); render(); toast('In the real site, Studio opens in a new tab with these answers filled in.', 'external'); },
  'attach-open': (el) => { const r = findReq(el.dataset.id); openModal(() => attachModal(r)); },
  'wrong-run': () => toast('That run is for a different customer. Pick the one marked “Matches”.', 'alert'),
  attach: (el) => { attachFiles(findReq(el.dataset.id)); closeAll(); render(); toast('Files attached. The customer can now see the cover pages.', 'check'); },
  'toggle-prev': (el) => { const r = findReq(el.dataset.id); r.previews = !r.previews; render(); },
  approve: (el) => { const r = findReq(el.dataset.id); if (r.files.length) openModal(() => approveModal(r)); },
  'approve-yes': (el) => { approve(findReq(el.dataset.id)); closeAll(); render(); toast('Sent. The customer has been told.', 'send'); },
  note: (el) => { const t = ($('#notein').value || '').trim(); if (!t) return; findReq(el.dataset.id).notes.push({ who: (member(S.team) || TEAM[0]).name, text: t, t: Date.now() }); render(); },
  'cat-vis': (el) => { const c = S.catalog[el.dataset.svc]; c.visible = !c.visible; render(); toast(`${SVC[el.dataset.svc].name} is now ${c.visible ? 'shown on' : 'hidden from'} the customer site.`, 'eye'); },
  'cat-rm': (el) => { S.catalog[el.dataset.svc].samples.splice(+el.dataset.i, 1); render(); },
  'cat-view': (el) => go(H('c', 's', el.dataset.svc)),
  'cat-add-open': (el) => { U.picks = []; U.modalWide = true; openModal(() => pickModal(el.dataset.svc)); },
  pick2: (el) => { const k = el.dataset.k; U.picks = U.picks.includes(k) ? U.picks.filter(x => x !== k) : [...U.picks, k]; layer(); },
  'cat-add': (el) => { const c = S.catalog[el.dataset.svc]; U.picks.forEach(k => c.samples.push({ pic: k, title: PICS[k].label, note: 'Added by Sam' })); closeAll(); render(); toast('Samples added. Customers see them now.', 'check'); },
  'cat-edit': (el) => { const c = S.catalog[el.dataset.svc]; openModal(() => `${mHead(`Change the words: ${SVC[el.dataset.svc].name}`, 'Short and plain works best.', 'edit')}<label class="fieldset"><span class="label">One-line promise</span><input class="input" id="cat-promise" value="${esc(c.promise)}"></label><label class="fieldset"><span class="label">Ready in</span><input class="input" id="cat-ready" value="${esc(c.ready)}"></label><div class="modal-actions"><button class="btn btn-secondary" data-act="close">Cancel</button><button class="btn btn-primary" data-act="cat-save" data-svc="${el.dataset.svc}">Save</button></div>`); },
  'cat-save': (el) => { const c = S.catalog[el.dataset.svc]; c.promise = $('#cat-promise').value.trim() || c.promise; c.ready = $('#cat-ready').value.trim() || c.ready; closeAll(); render(); toast('Saved. The customer site is updated.', 'check'); },
  invite: () => openModal(() => `${mHead('Invite a team member', 'They get an email with a sign-in link. You choose what they can do.', 'user')}<label class="fieldset"><span class="label">Their email</span><input class="input" id="invite-email" type="email" placeholder="name@company.com"></label><fieldset class="fieldset"><legend>Role</legend><div class="chips"><button class="chip" aria-pressed="true" data-act="flip-chip"><span class="ck">${ic('check', 15)}</span>Worker</button><button class="chip" aria-pressed="false" data-act="flip-chip"><span class="ck">${ic('check', 15)}</span>Admin</button></div></fieldset><div class="modal-actions"><button class="btn btn-secondary" data-act="close">Cancel</button><button class="btn btn-primary" data-act="invite-send">Send invite</button></div>`),
  'flip-chip': (el) => { el.parentElement.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', c === el)); },
  'invite-send': () => { closeAll(); toast('Invite sent.', 'send'); },
  'settings-save': () => { S.settings.reply = $('#set-reply').value.trim() || S.settings.reply; S.settings.hours = $('#set-hours').value.trim() || S.settings.hours; S.settings.wa = $('#set-wa').value.trim() || S.settings.wa; render(); toast('Saved. The customer site uses the new words.', 'check'); },

  'tour-open': () => { U.welcome = false; U.drawer = U.drawer === 'tour' ? null : 'tour'; drawer(); layer(); },
  'notes-open': () => { U.welcome = false; U.drawer = U.drawer === 'notes' ? null : 'notes'; drawer(); layer(); },
  'drawer-close': () => { U.drawer = null; drawer(); },
  'welcome-close': () => { U.welcome = false; layer(); },
  'tour-go': (el) => { const t = TOUR[+el.dataset.n]; if (t.need) ensure(t.need); if (window.innerWidth < 900) { U.drawer = null; } t.go(); },
  'tour-ff': (el) => { const t = TOUR[+el.dataset.n]; ensure(t.ff); if (window.innerWidth < 900) { U.drawer = null; } (t.after || t.go)(); },
  reset: () => openModal(() => `${mHead('Start the demo again?', 'Everything you did in this demo is cleared: requests, messages and sign-ins.', 'refresh')}<div class="modal-actions"><button class="btn btn-secondary" data-act="close">Keep going</button><button class="btn btn-primary" data-act="reset-yes">Start again</button></div>`),
  'reset-yes': () => { const dev = S.device; S = blank(); S.device = dev; U.contact = newContact(); U.tab = {}; U.way = {}; U.sms = null; U.need = null; U.tape = null; U.played = {}; closeAll(); save(); go('#c-home'); toast('Fresh start.', 'refresh'); },
};
const filled = (f, v) => f.t === 'tell' ? hasTell(v) : Array.isArray(v) ? v.length > 0 : !!(v && String(v).trim());
function sendMsg(id, side, m) {
  const r = findReq(id);
  if (side === 'c') customerSays(r, m);
  else { const who = (member(S.team) || TEAM[0]).name; if (['new', 'reviewing'].includes(r.status) && m.text && m.text.includes('?')) askCustomer(r, m.text, who); else { post(r, { from: 'team', who, ...m }); tell('c', `${who} sent you a message`); } }
  render(); setTimeout(() => { const i = $(`[data-chatin="${id}"]`); if (i) i.focus(); }, 20);
}
/* After each render: the tape measure grows from where it was to the new step. */
function afterRender() {
  $screen.querySelectorAll('.tape[data-to]').forEach(t => requestAnimationFrame(() => requestAnimationFrame(() => t.style.setProperty('--p', t.dataset.to + '%'))));
}
function welcomeCard() {
  return `<div class="welcome${shownWelcome ? ' settled' : ''}" role="dialog" aria-label="Welcome"><span class="wi">${ic('play', 16)}</span><div class="grow"><b>Welcome to the prototype</b><p>Follow one request from the customer’s first look to the download, in 12 short steps.</p><div class="row" style="gap:8px;margin-top:10px"><button class="btn btn-tape btn-sm" data-act="tour-open">Start the guided tour</button><button class="btn btn-light btn-sm" data-act="welcome-close">Not now</button></div></div><button class="iconbtn plain" data-act="welcome-close" aria-label="Close" style="color:#fff">${ic('x', 18)}</button></div>`;
}
let shownWelcome = false;

document.addEventListener('click', (e) => {
  if (!e.target.closest('.dd')) closeDDs();
  const el = e.target.closest('[data-act]');
  if (!el || !A[el.dataset.act]) return;
  if (el.tagName === 'BUTTON') e.preventDefault();
  A[el.dataset.act](el, e);
  if (el.classList.contains('dd-opt')) closeDDs();
});
document.addEventListener('keydown', (e) => {
  const open = document.querySelector('.dd.open');
  if (open) {
    if (e.key === 'Escape') { e.preventDefault(); closeDDs(); open.querySelector('.dd-btn').focus(); return; }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const opts = [...open.querySelectorAll('.dd-opt:not([hidden])')], i = opts.indexOf(document.activeElement);
      const n = i < 0 ? 0 : e.key === 'ArrowDown' ? (i + 1) % opts.length : (i - 1 + opts.length) % opts.length;
      if (opts[n]) opts[n].focus();
      return;
    }
    if (e.key === 'Enter' && e.target.matches('[data-dd-search]')) { e.preventDefault(); const o = open.querySelector('.dd-opt:not([hidden])'); if (o) o.click(); return; }
    if (e.key === 'Tab') closeDDs();
  }
  if ((e.key === 'ArrowDown' || e.key === ' ') && e.target.matches('.dd-btn') && !e.target.closest('.dd').classList.contains('open')) { e.preventDefault(); openDD(e.target.closest('.dd')); return; }
  if (e.key === 'Escape' && (U.lb || U.modal || U.pop)) { closeAll(); return; }
  if (e.key === 'Escape' && U.drawer) { U.drawer = null; drawer(); return; }
  if (e.key === 'Escape' && U.welcome) { U.welcome = false; layer(); return; }
  if (e.key === 'Enter' && e.target.dataset.chatin) { e.preventDefault(); const b = e.target.parentElement.querySelector('[data-act="chat-send"]'); if (b) A['chat-send'](b); return; }
  if (e.key === 'Enter' && e.target.id === 'codein') { e.preventDefault(); A.verify(); return; }
  if (e.key === 'Enter' && e.target.id === 'tcodein') { e.preventDefault(); A.tverify(); return; }
  if (e.key === 'Enter' && !e.shiftKey && /^c-ask-/.test(lastPath) && !U.modal) {
    const t = e.target;
    if (!['TEXTAREA', 'BUTTON', 'A', 'SELECT'].includes(t.tagName) && !t.closest('.dd') && !(t.type === 'checkbox')) { const b = $('#ask-next'); if (b) { e.preventDefault(); b.click(); } }
  }
  if (e.key === '/' && S.mode === 't' && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { const s = $('#tsearch'); if (s && s.offsetParent) { e.preventDefault(); s.focus(); } }
  if (U.lb && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) A.lb({ dataset: { d: e.key === 'ArrowRight' ? 1 : -1 } });
});
document.addEventListener('input', (e) => {
  if (e.target.matches('[data-dd-search]')) {
    const w = e.target.closest('.dd'), q = e.target.value.trim().toLowerCase(); let n = 0;
    w.querySelectorAll('.dd-opt').forEach(o => { const hit = !q || o.dataset.q.includes(q); o.hidden = !hit; if (hit) n++; });
    w.querySelector('.dd-empty').hidden = n > 0;
    return;
  }
  const b = e.target.dataset.bind; if (!b) return;
  const [scope, a, k] = b.split(':'), val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
  if (scope === 'd') { draft(a)[k] = val; if (U.errKeys && U.errKeys.includes(k)) { e.target.classList.remove('invalid'); } }
  else if (scope === 'tell') { const d = draft(a); d[k] = { ...(d[k] || {}), text: val }; }
  else if (scope === 'contact') { U.contact[a] = val; if (U.contact.err) { U.contact.err = null; e.target.classList.remove('invalid'); } }
  else if (scope === 'tlog') U.tlog[a] = val;
  save();
});
document.addEventListener('change', (e) => {
  const t = e.target;
  if (t.dataset.rerender) render();
  if (t.type === 'checkbox' && t.dataset.bind) { const [, a] = t.dataset.bind.split(':'); U.contact[a] = t.checked; }
  if (!t.dataset.file || !t.files.length) return;
  const files = [...t.files], kind = t.dataset.file;
  const tooBig = files.find(f => f.size > 20 * 1024 * 1024);
  if (tooBig) { toast(`${tooBig.name} is over 20 MB. Please choose a smaller file, or send it on WhatsApp.`, 'alert'); return; }
  const meta = files.map(f => { if (f.type.startsWith('image/')) U.blobs[f.name] = URL.createObjectURL(f); return { name: f.name, size: f.size > 1048576 ? (f.size / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(f.size / 1024)) + ' KB' }; });
  if (kind === 'logo') draft(t.dataset.svc)[t.dataset.k] = meta[0];
  if (kind === 'photos') { const d = draft(t.dataset.svc); d[t.dataset.k] = [...(d[t.dataset.k] || []), ...meta].slice(0, 5); U.err = null; }
  if (kind === 'tellfiles') { const d = draft(t.dataset.svc); d[t.dataset.k] = { ...(d[t.dataset.k] || {}), files: [...((d[t.dataset.k] || {}).files || []), ...meta] }; }
  if (kind === 'chat') { sendMsg(t.dataset.id, t.dataset.side, { file: meta[0].name }); return; }
  if (kind === 'upload-files') { attachFiles(findReq(t.dataset.id)); closeAll(); toast('Files uploaded and attached.', 'check'); }
  render();
});

/* ---------- guided tour and owner notes (prototype only) ---------- */
const cust = (h) => () => go(h), team = (h) => () => { if (!S.team) S.team = 'sam'; go(typeof h === 'function' ? h() : h); };
const myId = () => (myLatest() || {}).id;
const TOUR = [
  { who: 'Customer', title: 'Browse the services', text: 'The catalogue of your five services, with real pages from past work and a finder for people who do not know the service names. No sign-in needed.', go: cust('#c-home'), done: () => S.flags.sawHome },
  { who: 'Customer', title: 'Open one service', text: 'A gallery of real pages, what you get, how long it takes and what we will ask.', go: cust('#c-s-market'), done: () => S.flags.sawService },
  { who: 'Customer', title: 'Ask for it, mostly by tapping', text: 'One question per screen, a measuring-tape progress bar, and a voice message instead of typing.', go: cust('#c-ask-market-1'), done: () => S.flags.askedStep2 },
  { who: 'Customer', title: 'Sign in at the very end, with a code', text: 'Phone or email, then a 6-digit code. No password, and the answers are never lost.', go: () => { if (S.me) return go('#c-account'); Object.assign(draft('market'), JSON.parse(JSON.stringify(DEMO_ANSWERS))); go('#c-ask-market-contact'); }, done: () => !!S.me },
  { who: 'Customer', title: 'Request sent', text: 'A calm “what happens next” and a page they can always come back to.', need: 'submit', go: () => go(H('c', 'req', myId())), done: () => !!myLatest() },
  { who: 'Team', title: 'The request arrives', text: 'It shows as New on the team dashboard. Missing details are already flagged.', need: 'submit', go: team('#t-requests'), done: () => S.flags.teamSawNew },
  { who: 'Team', title: 'Ask the customer one question', text: 'Tap a ready-made question. The customer is told by message.', need: 'submit', ff: 'asked', go: team(() => H('t', 'req', myId())), done: () => S.flags.asked },
  { who: 'Customer', title: 'Answer in the chat', text: 'Like WhatsApp: type, or send a voice message.', need: 'asked', ff: 'answered', go: () => { U.tab['c' + myId()] = 'c'; go(H('c', 'req', myId())); }, done: () => S.flags.answered },
  { who: 'Team', title: 'Make it in Studio, attach the files', text: 'Studio opens with the answers filled in. The finished files attach back to the request.', need: 'answered', ff: 'attached', go: team(() => H('t', 'req', myId())), done: () => S.flags.attached },
  { who: 'Customer', title: 'See the cover pages', text: 'Covers only, marked PREVIEW. “Looks good” or “Ask for a change”.', need: 'attached', go: () => { U.tab['c' + myId()] = 'p'; go(H('c', 'req', myId())); }, done: () => S.flags.sawPreview },
  { who: 'Team', title: 'Approve and send', text: 'Only now do the full files and the ZIP reach the customer.', need: 'attached', ff: 'sent', go: team(() => H('t', 'req', myId())), done: () => S.flags.sent },
  { who: 'Customer', title: 'Download the files', text: 'One ZIP, or each file on its own. They stay in the account.', need: 'sent', go: () => { U.tab['c' + myId()] = 'p'; go(H('c', 'req', myId())); }, done: () => S.flags.downloaded },
];
const SWATCH_ROW = SERVICES.map(id => `<i style="background:var(--sw-${id})" title="${SVC[id].name}"></i>`).join('');
const NOTES = [
  ['The design story', 'Why the site looks the way it does.', [
    ['Cut from the same cloth as your documents', 'The navy and the measuring-tape yellow come from the covers your team already makes, so the site and the files feel like one brand from the first click to the download.', '', 'story'],
    ['A tailor’s workroom, not a template', 'Real pages are laid out on a navy cutting mat with a ruler. The request form shows progress on a measuring tape. Each request is written up like a tailor’s order ticket. Every detail points back to “made to measure”.', '', 'story'],
    ['Five fabric swatches', 'Each service has its own colour, cut with a pinked edge like a real fabric sample. The five colours share the same perceived lightness, so no service looks more important than another.', '', 'story swatch'],
    ['Real pages first', 'People judge a product by its pictures before they read. Every service card leads with real pages and says how big each file is: 25–45 pages, 15–20 slides.'],
    ['One bright thing per screen', 'The main button is always navy and the yellow is kept for progress and highlights, so the next step stands out on every screen.'],
    ['A finder for people who do not know the service names', '“What do you need help with?” points to the right service in one tap and keeps the others on the page.'],
    ['Motion with a job', 'Questions slide in the direction you are going, the tape fills as you answer, and the seam in “How it works” stitches the four steps together. Nothing moves on its own.'],
    ['Type with character', 'Newsreader for headings, an editorial serif that sits well next to the reports. Instrument Sans for everything else, compact and crisp. A mono face for request numbers, file sizes and page counts, like the labels on a garment.'],
    ['Comfortable for everyone', 'A text-size menu in the header, text colours that pass the WCAG AA contrast check, and the same layout working on a phone.'],
  ]],
  ['What I added to your brief', '', [
    ['Ask first, sign in last', 'People fill in the form before giving a phone or email. Nothing is lost, and it feels lighter than “create an account”.'],
    ['Voice messages everywhere', 'In the form and in the chat. Your team sees an automatic transcript next to each voice message.'],
    ['Status in plain words', '5 steps and a “Right now” sentence, so the customer never wonders what is happening.'],
    ['Missing-information checks', 'The dashboard flags what is missing and offers the question to ask, so the team asks once, not five times.'],
    ['Bridge to Studio', 'One button opens the right Studio tool with the customer’s answers filled in. The finished run attaches back to the request. Customers never touch the tools.'],
    ['Covers locked until Approve', 'Customers see only the first page of each file, marked PREVIEW. The full files and the ZIP are released only by Approve and send.'],
    ['Ask for a change', 'After the preview the customer can ask for a change. It goes back to the team as “Change requested”.'],
    ['Team notes and assigning', 'Notes only the team sees, and each request can be given to a worker.'],
    ['Catalogue manager', 'Show or hide a service, change its words, add or remove sample pages. No developer needed.'],
  ]],
  ['Decisions only you can make', '', [
    ['Price and payment', 'When does the customer pay: before work starts, or before the download? From Nepal, Stripe is not available, so the plan is Paddle. The old price list ($2 to $6.50 a job) was for self-service and does not pay for your team’s time.', 'Agree the price in the chat, then a payment link before the files are released.'],
    ['Cost of login codes', 'Email codes are free. Text-message (SMS) codes cost money for each message, and delivery to some countries is unreliable. WhatsApp codes also cost per message.', 'Start with email and SMS. Add WhatsApp codes later if customers ask.'],
    ['Promises shown on the site', 'The demo says “first reply within 2 working hours” and “about 1 working day”. Only promise what the team can always keep.'],
    ['How many changes are included', 'One round, two rounds, or unlimited? It changes what the “Ask for a change” button says.'],
    ['Site language', 'Most of your sample clients write in Spanish. A Spanish version of the site means double the wording work, but likely many more requests from Latin America.'],
    ['One WhatsApp number or many', 'Sharing workers’ own numbers exposes their private phones, and the chats leave with them.', 'One WhatsApp Business number for the whole team.'],
    ['Who can press Approve and send', 'Only the admin, or any worker too?', 'Workers prepare, the admin approves.'],
    ['Samples you are allowed to show', 'The Market Research and Process Manual samples use made-up companies. The Economic Study pages show a real client name (IOSA Health). Replace them or get permission before going live.'],
    ['How long files are kept', 'For example 90 days in the account, then removed, with a warning first.'],
    ['Privacy notice', 'Customers upload documents and voice messages that are processed by AI services. The privacy notice must say so in plain words.'],
  ]],
  ['How the real build would work', '', [
    ['Same website, new pages', 'Public pages for the catalogue, and a customer sign-in that is separate from the Studio team sign-in.'],
    ['Same database, new section', 'Requests, messages, files and samples in their own section of the same Supabase project, private like the Studio files.'],
    ['Your 5 workflows do not change', 'The team runs them from Studio as today. Only the result is attached to the request.'],
    ['Built and tested first, at no cost', 'Every step tested on a local copy before anything goes live, as with every change so far.'],
  ]],
];
function drawer() {
  if (!U.drawer) { $drawer.classList.remove('open'); return; }
  const firstOpen = TOUR.findIndex(t => !t.done()), doneN = TOUR.filter(t => t.done()).length;
  const head = U.drawer === 'tour'
    ? `<div class="between"><div style="display:grid;gap:6px"><span class="kick">Prototype guide</span><h2>Guided tour</h2></div><button class="iconbtn plain" data-act="drawer-close" aria-label="Close">${ic('x')}</button></div>
       <div class="tprog"><div class="bar"><i style="--p:${Math.round(doneN / TOUR.length * 100)}%"></i></div><div class="meta"><span>${doneN} of ${TOUR.length} steps seen</span><span>“Show me” opens a step · “Do it for me” does the steps before it</span></div></div>`
    : `<div class="between"><div style="display:grid;gap:6px"><span class="kick">For the owner</span><h2>Notes for you</h2></div><button class="iconbtn plain" data-act="drawer-close" aria-label="Close">${ic('x')}</button></div>`;
  const body = U.drawer === 'tour'
    ? TOUR.map((t, i) => `<div class="tour-step${t.done() ? ' done' : i === firstOpen ? ' next' : ''}"><span class="num">${t.done() ? ic('check', 14) : i + 1}</span><div class="card-ish"><span class="who${t.who === 'Team' ? ' tm' : ''}">${t.who}</span><b>${t.title}</b><p>${t.text}</p><div class="row" style="gap:6px"><button class="btn ${i === firstOpen ? 'btn-primary' : 'btn-secondary'} btn-sm" data-act="tour-go" data-n="${i}">Show me</button>${t.ff ? `<button class="btn btn-ghost btn-sm" data-act="tour-ff" data-n="${i}">Do it for me</button>` : ''}</div></div></div>`).join('')
    : NOTES.map(([h, sub, list]) => `<section class="note-sec"><h3>${h}</h3>${sub ? `<p>${sub}</p>` : ''}${list.map(([t, p, rec, kind]) => `<div class="dnote${kind && kind.includes('story') ? ' story' : ''}"><b>${t}</b><p>${p}</p>${kind && kind.includes('swatch') ? `<span class="sw-row">${SWATCH_ROW}</span>` : ''}${rec ? `<p class="rec">My advice: ${rec}</p>` : ''}</div>`).join('')}</section>`).join('');
  const keep = $drawer.querySelector('.drawer-body') ? $drawer.scrollTop : 0, same = $drawer.dataset.view === U.drawer;
  $drawer.innerHTML = `<div class="drawer-head">${head}</div><div class="drawer-body">${body}</div>`;
  $drawer.dataset.view = U.drawer;
  $drawer.scrollTop = same ? keep : 0;
  $drawer.classList.add('open');
}

if (!/^#[ct]-/.test(location.hash)) { const start = S.last[S.mode] && /^#[ct]-/.test(S.last[S.mode]) ? S.last[S.mode] : '#c-home'; try { history.replaceState(null, '', start); } catch (e) { location.hash = start; } }
if (!S.flags.welcomed) { S.flags.welcomed = true; U.welcome = true; }
render(true);
shownWelcome = true;

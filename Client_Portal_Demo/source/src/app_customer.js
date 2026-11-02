
/* ================= CUSTOMER SITE ================= */
const NUMW = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six'];
const STITCH = `<svg viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true" style="color:var(--tape-deep)"><path d="M3 8 Q 52 2 100 7 T 197 5" stroke="currentColor" stroke-width="2.6" fill="none" stroke-dasharray="7 6" stroke-linecap="round"/></svg>`;
const PROOF = [['shield', 'Checked by a person', 'Every file is read by our team before it reaches you.'], ['eye', 'See it before you get it', 'The cover page of every file is shown to you first.'], ['tag', 'Price agreed first', 'We confirm the price in the chat before any work starts.'], ['lock', 'Private by default', 'Only you and our team see your request and files.']];
const HOW = [
  ['Choose a service', 'Browse real pages from past work. No account needed.', 'Any time', 'choose'],
  ['Tell us what you need', 'A few taps, or a voice message. Skip anything you are not sure about.', 'About 3 minutes', 'tell'],
  ['See the cover first', 'We prepare your files and show you the cover pages. Ask for a change if something is off.', 'Usually 1 working day', 'see'],
  ['Get your files', 'After a final check by our team, everything arrives in your account.', 'Right after the check', 'get'],
];

function cHead(active) {
  const unread = S.notifs.filter(n => !n.read).length;
  const links = [['home', 'Services', '#c-home', 'services'], ...(S.me ? [['requests', 'My requests', '#c-requests'], ['messages', 'Messages', '#c-messages']] : [['how', 'How it works', '#c-home', 'how']]), ['help', 'Help', '#c-help']];
  return `<header class="c-head"><div class="wrap">${logo()}
    <nav class="c-nav" aria-label="Main">${links.map(([k, l, h, to]) => `<a href="${h}"${k === active ? ' aria-current="page"' : ''}${to ? ` data-act="scrollto" data-to="${to}"` : ''}>${l}</a>`).join('')}</nav>
    <span class="spacer"></span>
    ${tsizeDD()}
    ${S.me ? `<button class="iconbtn" data-act="pop-notifs" aria-label="Notifications, ${unread} new">${ic('bell')}${unread ? `<span class="badge">${unread}</span>` : ''}</button>
      <a class="who-chip" href="#c-account">${av(S.me.name)}${esc(first(S.me.name))}</a>`
    : `<a class="btn btn-secondary btn-sm" href="#c-signin">Sign in</a>`}
  </div></header>`;
}
function cBnav(active) {
  const unread = mine().reduce((n, r) => n + unreadFor(r, 'c'), 0);
  const items = [['home', 'Services', 'grid', '#c-home'], ['requests', 'My requests', 'inbox', '#c-requests'], ['messages', 'Messages', 'chat', '#c-messages'], ['account', S.me ? 'Account' : 'Sign in', 'user', S.me ? '#c-account' : '#c-signin']];
  return `<nav class="bnav" aria-label="Sections">${items.map(([k, l, i, h]) => `<a href="${h}"${k === active ? ' aria-current="page"' : ''}>${ic(i, 22)}${l}${k === 'messages' && unread ? `<span class="badge">${unread}</span>` : ''}</a>`).join('')}</nav>`;
}
function cFoot() {
  return `<footer class="foot"><div class="wrap"><div class="stack" style="gap:12px">${logo()}<p class="small" style="max-width:46ch">Business documents and films, prepared by our team and checked by a person before they reach you.</p></div>
  <div class="stack" style="gap:10px"><nav aria-label="Footer"><a href="#c-home">Services</a><a href="#c-help">Help</a><a href="#c-help">Privacy</a><a href="#c-help">Terms</a></nav><span class="legal">© 2026 Tech Tailoring · Made to measure</span></div></div></footer>`;
}
const cShell = (active, body, opts = {}) => `${opts.noHead ? '' : cHead(active)}<main class="grow-main">${body}</main>${opts.noFoot ? '' : cFoot()}${opts.noNav ? '' : cBnav(active)}`;

function vHome() {
  S.flags.sawHome = true;
  const svcs = visibleSvcs();
  return cShell('home', `
  <section class="hero"><div class="wrap">
    <div class="hero-copy page-in">
      <span class="hero-kicker"><span class="avs">${TEAM.map(m => tav(m)).join('')}</span>${svcs.length} services · every file checked by a person</span>
      <h1 class="t-display">Business documents, <span class="stitch">tailored${STITCH}</span> to you.</h1>
      <p class="lead">Tell us what you need in a few taps, or send a voice message. You see the cover pages first, and the finished files arrive in your account.</p>
      <div class="hero-cta"><button class="btn btn-primary btn-lg" data-act="scrollto" data-to="services">Explore the services ${arr()}</button><button class="btn btn-secondary btn-lg" data-act="scrollto" data-to="how">How it works</button></div>
      <ul class="assure"><li>${ic('check', 16)}No password</li><li>${ic('check', 16)}See it before you get it</li><li>${ic('check', 16)}Price agreed first</li></ul>
    </div>
    ${heroMat()}
  </div></section>

  <section class="proof" aria-label="What every request includes"><div class="wrap"><ul class="proof-list">${PROOF.map(([i, t, p]) => `<li><span class="pi">${ic(i, 18)}</span><span><b>${t}</b><span class="t">${p}</span></span></li>`).join('')}</ul></div></section>

  <section class="sec cat-sec" id="services"><div class="wrap">
    <div class="sec-head"><span class="eyebrow">Our services</span><h2 class="t-h2">${NUMW[svcs.length] || svcs.length} services, each one made to measure.</h2><p class="lead">Every card shows real pages from our work. Open one to see more pages, what you get and what we will ask you.</p></div>
    ${svcs.length ? `${finder(svcs)}<div class="svc-grid">${svcs.map(svcCard).join('')}</div>` : `<div class="empty"><span class="ei">${ic('grid', 32)}</span><h3 class="t-h3">New services are on the way</h3><p class="txt">Message us on WhatsApp and tell us what you need.</p></div>`}
  </div></section>

  ${howSection()}
  ${workSection()}

  <section class="sec" id="faq"><div class="wrap faq-grid">
    <div class="faq-side"><span class="eyebrow">Questions</span><h2 class="t-h2">Good to know</h2><p class="lead">Short answers to what people ask us most.</p>
      <div class="help-card"><span class="svc-ic" style="background:var(--wa-soft);color:var(--wa)">${ic('wa', 20)}</span><span class="grow"><b>Talk to a person</b><span>WhatsApp · we reply within ${esc(S.settings.reply)}</span></span><button class="btn btn-wa btn-sm" data-act="wa">Chat</button></div></div>
    ${faq(FAQ.concat([['Do you use AI?', 'Yes. Our own research tools do the heavy lifting, and our team checks every file before you see it.']]))}
  </div></section>

  <section class="cta-wrap"><div class="wrap"><div class="cta">
    <div class="stack" style="gap:12px"><span class="eyebrow on-dark">Not sure yet?</span><h2 class="t-h2">Tell us your situation. We will suggest the right service.</h2><p class="lead">Send a voice message on WhatsApp. A real person replies within ${esc(S.settings.reply)}.</p></div>
    <div class="cta-actions"><button class="btn btn-tape btn-lg" data-act="wa">${ic('wa', 20)} Chat on WhatsApp</button><span class="micro mono">${esc(S.settings.wa)}</span></div>
  </div></div></section>`);
}
function heroMat() {
  const nums = Array.from({ length: 9 }, (_, i) => `<span style="left:${(i + 1) * 10}%">${i + 1}</span>`).join('');
  const bars = [40, 72, 55, 92, 60, 82, 46, 68, 36, 76, 52, 30].map(h => `<i style="height:${h}%"></i>`).join('');
  return `<div class="hero-mat page-in" aria-hidden="true" style="animation-delay:.08s">
    <div class="ruler">${nums}</div><div class="ruler-v"></div>
    <div class="mat-doc md1">${pic('pm_cover')}</div><div class="mat-doc md3">${pic('me_cover')}</div><div class="mat-doc md2">${pic('mr_cover')}</div><div class="mat-doc md4">${pic('reel_a')}</div>
    <div class="mat-chip chip-voice"><span class="ci">${ic('mic', 14)}</span><span class="wv">${bars}</span><span class="mono" style="font-size:2.3cqw">0:18</span></div>
    <div class="mat-chip chip-ready"><span class="ci">${ic('check', 16)}</span><span><b>Your cover pages are ready</b><span class="s">3 files · checked by Sam</span></span></div>
  </div>`;
}
function finder(svcs) {
  const need = U.need && NEEDS.find(n => n[0] === U.need);
  const list = NEEDS.filter(n => n[2].some(x => svcs.includes(x)));
  const matches = need ? need[2].filter(x => svcs.includes(x)) : [];
  return `<div class="finder"><span class="finder-label" id="finder-l">What do you need help with?</span>
    <div class="finder-chips" role="group" aria-labelledby="finder-l">${list.map(([k, l, ids]) => `<button class="fchip sw-${ids[0]}" aria-pressed="${U.need === k}" data-act="need" data-v="${k}"><i></i>${l}</button>`).join('')}</div>
    <div class="finder-note" aria-live="polite">${need ? `${ic('sparkle', 16)}<span>Best match: <b>${matches.map(x => SVC[x].name).join(' and ')}</b></span><button class="link" data-act="need" data-v="">Show all equally</button>` : `<span class="micro">Tap one to see which service fits. All services stay on the page.</span>`}</div></div>`;
}
function svcCard(id) {
  const s = SVC[id], c = S.catalog[id], need = U.need && NEEDS.find(n => n[0] === U.need);
  const st = need ? (need[2].includes(id) ? ' match' : ' dim') : '';
  const files = s.deliver.length;
  return `<article class="svc sw-${id}${s.big ? ' big' : ''}${st}">
    <a class="svc-link" href="${H('c', 's', id)}" aria-label="${s.name}: see samples and details"></a>
    <div class="svc-stage twill pinked ${s.comp}" aria-hidden="true"><span class="hangtag">${files} file${files > 1 ? 's' : ''}</span>${pic(s.pics[0], 'v va')}${pic(s.pics[1], 'v vb')}</div>
    <span class="match-badge"><i></i>Best match</span>
    <div class="svc-body">
      <span class="svc-cat">${s.cat}</span>
      <h3>${s.name}</h3>
      <p class="txt">${esc(c.promise)}</p>
      <ul class="svc-files">${s.gets.map(g => `<li>${fbadge(g[0])}<span class="nm">${g[1]}</span><em>${g[3]}</em></li>`).join('')}</ul>
      <div class="svc-foot"><span class="when">${ic('clock', 15)} ${esc(c.ready)}</span><span class="go">See samples ${ic('arrowR', 16)}</span></div>
    </div></article>`;
}
function howArt(kind) {
  if (kind === 'choose') return `${[['market', 'mr_cover', 1], ['manuals', 'pm_cover'], ['economy', 'me_cover'], ['reels', 'reel_b']].map(([sw, k, on]) => `<span class="tile twill sw-${sw}${on ? ' on' : ''}">${pic(k)}</span>`).join('')}<svg class="cursor" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3.2l13.2 7.1-5.9 1.6-2.6 5.6z" fill="currentColor" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/></svg>`;
  if (kind === 'tell') return `<span class="rec"><span class="mic">${ic('mic', 20)}</span><span class="bars">${[45, 80, 60, 95, 50, 75, 40, 85, 55, 70].map(h => `<i style="height:${h}%"></i>`).join('')}</span><span class="t">0:18</span></span><span class="chips"><span>${ic('check', 12)} Prices</span><span>${ic('check', 12)} Competitors</span><span class="off">Customers</span></span>`;
  if (kind === 'see') return `<span class="pv">${pic('mr_cover')}<span class="stamp">PREVIEW</span></span><span class="acts"><span class="a1">${ic('thumb', 14)} Looks good</span><span class="a2">${ic('edit', 14)} Ask for a change</span></span>`;
  return `${[['pdf', 'Market report', '2.1 MB'], ['ppt', 'Slide summary', '3.4 MB'], ['pdf', 'Action plan', '0.6 MB']].map(([k, n, s]) => `<span class="f">${fbadge(k)}${n}<em>${s}</em>${ic('download', 16)}</span>`).join('')}<span class="ok">${ic('check', 14)} Checked by Sam</span>`;
}
function howSection() {
  return `<section class="sec how-sec" id="how"><div class="wrap">
    <div class="sec-head"><span class="eyebrow">How it works</span><h2 class="t-h2">Four steps. No surprises.</h2><p class="lead">You can follow every step in your account, and talk to a person at any point.</p></div>
    <ol class="how" data-play="how">${HOW.map(([t, p, time, art], i) => `<li class="how-step"><div class="how-art" aria-hidden="true"><div class="art-in art-${art}">${howArt(art)}</div></div><div class="how-dotrow"><span class="how-n">${i + 1}</span></div><span class="how-time">${ic('clock', 12)} ${time}</span><h3>${t}</h3><p class="small">${p}</p></li>`).join('')}</ol>
  </div></section>`;
}
function workSection() {
  const items = [['mr_cover', 'Market report', 'Food company, Chile', 'w1 tall'], ['pm_flow', 'Process flowchart', 'Receiving goods', 'w2 wide'], ['co_cover', 'Course slides', 'Leading teams', 'w3 wide'], ['me_summary', 'Economic study', 'Mexico, in Spanish', 'w4 tall']];
  return `<section class="sec work-sec matbg"><div class="wrap">
    <div class="sec-head"><span class="eyebrow on-dark">Real work</span><h2 class="t-h2">Real pages from real projects</h2><p class="lead">Tap any page to see it up close.</p></div>
    <div class="work-grid">${items.map(([k, t, s, cls]) => `<button class="work ${cls}" data-act="zoom" data-pics="${k}" data-title="${t}"><span class="work-frame">${pic(k)}</span><span class="work-cap"><span><b>${t}</b><span>${s}</span></span><span class="zi">${ic('zoom', 16)}</span></span></button>`).join('')}</div>
  </div></section>`;
}
const faq = (list) => `<div class="faq">${list.map(([q, a]) => `<details><summary data-act="faq">${q}<span class="chev">${ic('plus', 16)}</span></summary><div class="ans"><p>${a}</p></div></details>`).join('')}</div>`;

function vService(id) {
  const s = SVC[id], c = s && S.catalog[id];
  if (!s || !c.visible) return cShell('home', `<div class="wrap" style="padding-block:40px 80px"><div class="empty"><span class="ei">${ic('info', 32)}</span><h1 class="t-h3">This service is not available right now</h1><a class="btn btn-primary" href="#c-home">See all services</a></div></div>`);
  S.flags.sawService = true;
  const gal = [...new Set([...s.pics, ...c.samples.map(x => x.pic)])];
  const gi = Math.min(U.gal[id] || 0, gal.length - 1), key = gal[gi];
  const labelOf = (k) => (c.samples.find(x => x.pic === k) || {}).title || PICS[k].label;
  const kinds = [...new Set(s.gets.map(g => KIND[g[0]]))].join(', ');
  return cShell('home', `<div class="wrap sw-${id}">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="#c-home" data-act="scrollto" data-to="services">${ic('arrowL', 16)} All services</a><span aria-hidden="true">/</span><span>${s.name}</span></nav>
    <div class="detail">
      <div class="gallery page-in">
        <div class="gal-stage twill">${PICS[key].shape === 'r' ? `<div class="reelbox phoneish" data-act="zoom" data-pics="${gal.join(',')}" data-i="${gi}" data-title="${s.name}">${reel(key === 'reel_a' ? 'a' : 'b')}</div>` : pic(key).replace('<div class="page', `<div data-act="zoom" data-pics="${gal.join(',')}" data-i="${gi}" data-title="${s.name}" class="page`)}
          <span class="gal-count">${gi + 1} / ${gal.length}</span><div class="gal-tools"><button class="iconbtn" data-act="zoom" data-pics="${gal.join(',')}" data-i="${gi}" data-title="${s.name}" aria-label="Look closer">${ic('zoom', 18)}</button></div></div>
        <div class="gal-strip" role="group" aria-label="Sample pages">${gal.map((k, i) => `<button class="gal-thumb" aria-pressed="${i === gi}" data-act="gal" data-svc="${id}" data-i="${i}"><span class="tn">${PICS[k].shape === 'r' ? reel(k === 'reel_a' ? 'a' : 'b') : `<img src="${IMG[k]}" alt="">`}</span><span class="l">${esc(labelOf(k))}</span></button>`).join('')}</div>
        <p class="caption">${ic('info', 15)}${esc(s.sampleNote)}</p>
      </div>
      <div class="svc-info page-in" style="animation-delay:.06s">
        <span class="svc-cat">${s.cat}</span>
        <div class="stack" style="gap:12px"><h1 class="t-h1">${s.name}</h1><p class="lead">${esc(s.lead)}</p></div>
        <dl class="spec"><div><dt>Ready in</dt><dd>${esc(c.ready)}</dd></div><div><dt>Price</dt><dd>Agreed with you before we start</dd></div><div><dt>You get</dt><dd>${s.gets.length} file${s.gets.length > 1 ? 's' : ''} · ${kinds}</dd></div><div><dt>Languages</dt><dd>${LANGS.join(', ')}</dd></div></dl>
        <div class="detail-cta"><a class="btn btn-primary btn-lg" href="${H('c', 'ask', id, '1')}">Start my request ${arr()}</a><button class="btn btn-secondary btn-lg" data-act="wa">${ic('wa', 18)} Ask a question</button></div>
        <p class="micro">${ic('lock', 13, 'style="vertical-align:-2px;margin-right:4px"')}No account needed to look. You confirm your phone or email at the end, with a code.</p>
      </div>
    </div>
    <div class="below">
      <section><h2>Good for</h2><div class="goodfor">${s.goodFor.map(g => `<div><span class="tk">${ic('check', 13)}</span>${g}</div>`).join('')}</div></section>
      <section><h2>What you get</h2><div class="files">${s.gets.map(g => `<div class="frow">${fbadge(g[0], true)}<span class="grow"><b>${g[1]}</b><span class="s">${g[2]}</span></span></div>`).join('')}</div></section>
      <section><h2>What we will ask you</h2><p class="micro" style="margin-top:-6px">${ASK[id].length} short questions · about 3 minutes · mostly taps</p><div class="asklist">${ASK[id].map(st => `<div>${st.title}</div>`).join('')}</div></section>
    </div>
  </div>
  <div class="stickybar"><a class="btn btn-primary btn-lg" href="${H('c', 'ask', id, '1')}">Start my request ${arr()}</a><button class="iconbtn" data-act="wa" aria-label="Ask a question on WhatsApp" style="width:48px;height:48px;color:var(--wa)">${ic('wa', 22)}</button></div>`, { noNav: true });
}

/* ---------- request form ---------- */
function draft(svc) { return S.drafts[svc] || (S.drafts[svc] = { ...DEFAULTS }); }
function stepList(svc) { return [...ASK[svc].map((s, i) => String(i + 1)), 'review', ...(S.me ? [] : ['contact'])]; }
function vAsk(svc, step) {
  if (!SVC[svc]) return vHome();
  const list = stepList(svc), idx = list.indexOf(step);
  if (idx < 0) { setTimeout(() => go(H('c', 'ask', svc, 'review'))); return ''; }
  const d = draft(svc), n = list.length, qn = ASK[svc].length;
  if (+step >= 2) S.flags.askedStep2 = true;
  let body;
  if (step === 'review') body = askReview(svc, d);
  else if (step === 'contact') body = contactBlock('ask', svc);
  else { const st = ASK[svc][+step - 1]; body = `<div class="q-head"><span class="q-n">Question ${step} of ${qn}</span><h1 class="t-h1">${st.title}</h1>${st.help ? `<p class="lead">${st.help}</p>` : ''}</div>${U.err ? `<div class="errline" role="alert">${ic('alert', 18)}${esc(U.err)}</div>` : ''}${st.fields.map(f => field(svc, f, d)).join('')}`; }
  const prev = idx === 0 ? H('c', 's', svc) : H('c', 'ask', svc, list[idx - 1]);
  const nextLabel = step === 'review' ? (S.me ? `${ic('send', 18)} Send request` : `Continue ${arr()}`) : `Continue ${arr()}`;
  const actions = step === 'contact' ? '' : `<div class="ask-actions"><div class="wrap"><a class="btn btn-secondary btn-lg" href="${prev}" data-act="nav-back">${ic('arrowL', 18)} Back</a><span class="kbd">Press <kbd>Enter</kbd> to continue</span><button class="btn btn-primary btn-lg" id="ask-next" data-act="${step === 'review' && S.me ? 'submit' : 'next'}" data-svc="${svc}" data-step="${step}">${nextLabel}</button></div></div>`;
  const pct = Math.round(((idx + .5) / n) * 100), from = U.tape && U.tape.svc === svc ? U.tape.p : Math.max(0, pct - 8);
  U.tape = { svc, p: pct };
  const left = Math.max(1, Math.round((n - idx) * .5));
  return `<header class="ask-top"><div class="wrap">${logoMark()}<span class="what"><span class="svc-ic sm sw-${svc}">${ic(SVC[svc].icon, 17)}</span><span class="stk"><span class="k">New request</span><span class="nm">${SVC[svc].name}</span></span></span><span style="flex:1"></span><a class="btn btn-ghost btn-sm" href="${H('c', 's', svc)}" aria-label="Save and leave">${ic('x', 16)} <span>Save and leave</span></a></div></header>
  <main class="grow-main"><div class="wrap">
    <div class="tapebox" role="progressbar" aria-valuemin="1" aria-valuemax="${n}" aria-valuenow="${idx + 1}" aria-label="Step ${idx + 1} of ${n}"><div class="lbl"><span><b>Step ${idx + 1}</b> of ${n}</span><span>About ${left} min left</span></div><div class="tape" style="--p:${from}%" data-to="${pct}"><span class="fill"></span><span class="stops">${list.map(() => '<i></i>').join('')}</span></div></div>
    <div class="ask-grid"><div class="ask-main q-anim${U.dir === 'back' ? ' q-back' : ''}">${body}</div>${askSide(svc, d)}</div>
  </div></main>${actions}`;
}
function askSide(svc, d) {
  const rows = answerRows(svc, d).filter(r => r[1]).slice(0, 7);
  return `<aside class="ask-side"><div class="docket"><div class="docket-head"><span>Request draft</span><span>No. R-${S.seq}</span></div>
    <div class="docket-svc"><span class="svc-ic sm sw-${svc}">${ic(SVC[svc].icon, 17)}</span><b>${SVC[svc].name}</b></div>
    ${rows.length ? rows.map(([l, v]) => `<div class="sum-row"><span>${esc(l)}</span><b>${esc(v)}</b></div>`).join('') : `<p class="empty-note">Your answers appear here as you go.</p>`}
    <p class="caption">${ic('lock', 14)}Saved on this device until you send it. You can change anything later in the chat.</p></div></aside>`;
}
function field(svc, f, d) {
  const v = d[f.k], opt = f.opt ? ' <span class="opt">(optional)</span>' : '';
  const on = (x) => [].concat(v || []).includes(x);
  const errCls = U.errKeys && U.errKeys.includes(f.k) ? ' invalid' : '';
  if (f.t === 'cards') return `<fieldset class="fieldset"><legend class="sr">Choices</legend><div class="choices">${f.opts.map(([val, l, sub, i]) => `<button type="button" class="choice${f.multi ? ' multi' : ''}${errCls}" aria-pressed="${on(val)}" data-act="pick" data-svc="${svc}" data-k="${f.k}" data-v="${val}"${f.multi ? ' data-multi="1"' : ''}><span class="ci">${ic(i, 20)}</span><span><b>${l}</b><span class="cs">${sub}</span></span><i class="tick">${ic('check', 13)}</i></button>`).join('')}</div></fieldset>`;
  if (f.t === 'chips') return `<fieldset class="fieldset"><legend>${f.label}${opt}${f.multi ? ' <span class="opt">· choose any</span>' : ''}</legend><div class="chips">${f.opts.map(o => `<button type="button" class="chip${errCls}" aria-pressed="${on(o)}" data-act="pick" data-svc="${svc}" data-k="${f.k}" data-v="${esc(o)}"${f.multi ? ' data-multi="1"' : ''}><span class="ck">${ic('check', 15)}</span>${esc(o)}</button>`).join('')}</div></fieldset>`;
  if (f.t === 'country') {
    const more = COUNTRIES_MORE.includes(v) ? v : '';
    return `<fieldset class="fieldset"><legend>Country</legend><div class="chips">${COUNTRIES_TOP.map(o => `<button type="button" class="chip${errCls}" aria-pressed="${v === o}" data-act="pick" data-svc="${svc}" data-k="${f.k}" data-v="${o}"><span class="ck">${ic('check', 15)}</span>${o}</button>`).join('')}</div>
    <div class="fieldset" style="gap:8px;margin-top:6px;max-width:420px"><span class="hint">Not in the list?</span>${dd({ id: 'cty-' + svc, label: 'Choose another country', value: more, placeholder: 'Choose another country', options: COUNTRIES_MORE.map(c => ({ v: c, l: c })), act: 'pick', data: { svc, k: f.k }, search: 'Type a country', block: true })}</div></fieldset>`;
  }
  if (f.t === 'text') return `<label class="fieldset"><span class="label">${f.label}${opt}</span><input class="input${errCls}" id="f-${svc}-${f.k}" data-bind="d:${svc}:${f.k}" value="${esc(v || '')}" placeholder="${esc(f.ph || '')}" autocomplete="${f.k === 'company' ? 'organization' : 'off'}"></label>`;
  if (f.t === 'logo') return `<div class="fieldset"><span class="label">Your logo <span class="opt">(optional)</span></span>${v ? fileThumb(v, `data-act="unset" data-svc="${svc}" data-k="${f.k}"`) : `<label class="drop"><input type="file" accept="image/*" data-file="logo" data-svc="${svc}" data-k="${f.k}"><span class="di">${ic('image', 22)}</span><span><b>Add your logo</b><span class="hint">A photo or picture file. We put it on the cover.</span></span></label>`}</div>`;
  if (f.t === 'photos') return `<div class="fieldset">${(v || []).length ? `<div class="thumbs">${v.map((p, i) => fileThumb(p, `data-act="unset" data-svc="${svc}" data-k="${f.k}" data-i="${i}"`)).join('')}</div>` : ''}<label class="drop${errCls}"><input type="file" accept="image/*" multiple data-file="photos" data-svc="${svc}" data-k="${f.k}"><span class="di">${ic('upload', 22)}</span><span><b>${(v || []).length ? 'Add another photo' : 'Choose a photo'}</b><span class="hint">From your phone or computer. Up to 5 photos.</span></span></label></div>`;
  if (f.t === 'tell') return tellField(svc, f, v || {}, errCls);
  return '';
}
function fileThumb(p, rm) {
  const url = U.blobs[p.name];
  return `<div class="thumb">${url ? `<img src="${url}" alt="">` : `<span class="ph">${ic('image', 20)}</span>`}<span class="tt"><b>${esc(p.name)}</b><span>${esc(p.size || '')}</span></span><button class="iconbtn plain" ${rm} aria-label="Remove ${esc(p.name)}">${ic('trash', 18)}</button></div>`;
}
function tellField(svc, f, t, errCls) {
  const way = U.way[svc] || (t.text ? 'type' : null);
  const rec = U.rec && U.rec.svc === svc;
  return `<div class="fieldset"><div class="ways">${[['voice', 'mic', 'Talk', 'Record a voice message', true], ['type', 'type', 'Type', 'Write a few words'], ['files', 'clip', 'Add files', 'Documents or pictures']]
    .map(([k, i, l, sub, rc]) => `<button type="button" class="way${errCls}" aria-pressed="${way === k}" data-act="way" data-svc="${svc}" data-w="${k}"><span class="wi">${ic(i, 20)}</span><b>${l}</b><span class="ws">${sub}</span>${rc ? '<span class="rec">Easiest</span>' : ''}</button>`).join('')}</div>
  ${way === 'voice' ? (rec ? `<div class="recorder rise"><div class="timer" id="rectimer">0:00</div><div class="wave" aria-hidden="true">${'<i></i>'.repeat(18)}</div><button class="recbtn on" data-act="rec-stop" data-svc="${svc}" data-k="${f.k}" aria-label="Stop recording">${ic('stop', 28)}</button><p class="hint">Recording. Tap the square when you finish.</p></div>`
    : `<div class="recorder rise"><button class="recbtn" data-act="rec-start" data-svc="${svc}" data-k="${f.k}" aria-label="Start recording">${ic('mic', 30)}</button><p class="hint"><b style="color:var(--ink);font-weight:600">Tap the button and talk.</b><br>Any language is fine. Our team listens to every message.</p></div>`) : ''}
  ${way === 'type' ? `<textarea class="textarea rise" id="tell-${svc}" data-bind="tell:${svc}:${f.k}" placeholder="Write as much or as little as you like.">${esc(t.text || '')}</textarea>` : ''}
  ${way === 'files' ? `<label class="drop rise"><input type="file" multiple data-file="tellfiles" data-svc="${svc}" data-k="${f.k}"><span class="di">${ic('clip', 22)}</span><span><b>Choose files</b><span class="hint">Word, PDF, Excel or pictures. Up to 20 MB each.</span></span></label>` : ''}
  ${t.voice ? `<div class="voice">${voicePlayer(t.voice, `v-${svc}`)}<button class="iconbtn plain" data-act="voice-del" data-svc="${svc}" data-k="${f.k}" aria-label="Delete voice message">${ic('trash', 18)}</button></div>` : ''}
  ${(t.files || []).length ? `<div class="thumbs">${t.files.map((p, i) => fileThumb(p, `data-act="tellfile-del" data-svc="${svc}" data-k="${f.k}" data-i="${i}"`)).join('')}</div>` : ''}
  ${t.voice && t.transcript ? `<div class="transcript"><span class="tk">What we heard</span>${esc(t.transcript)}</div>` : ''}
  ${way !== 'type' && (t.text || '').trim() ? `<div class="transcript">${esc(t.text)}</div>` : ''}</div>`;
}
function voicePlayer(secs, key) {
  const playing = U.playing === key;
  return `<button class="play" data-act="play" data-key="${key}" data-s="${secs}" aria-label="${playing ? 'Pause' : 'Play'} voice message">${ic(playing ? 'pause' : 'play', 16)}</button><span class="bars2" aria-hidden="true">${Array.from({ length: 30 }, (_, i) => `<i style="height:${5 + Math.round(Math.abs(Math.sin(i * 1.7 + secs)) * 18)}px${playing && i < 12 ? ';background:var(--navy)' : ''}"></i>`).join('')}</span><span class="len">${mmss(secs)}</span>`;
}
function askReview(svc, d) {
  return `<div class="q-head"><span class="q-n">Almost done</span><h1 class="t-h1">Check your request</h1><p class="lead">Is everything right? Tap “Change” to fix anything.</p></div>
  <div class="review sw-${svc}">${ASK[svc].map((st, i) => { const v = st.fields.map(f => valueText(f, d[f.k])).filter(Boolean).join(' · '); return `<div class="rv"><span class="n">${i + 1}</span><div class="grow"><span class="k">${st.title}</span><b>${v ? esc(v) : '<span class="skip">Skipped</span>'}</b></div><a class="btn btn-ghost btn-sm" href="${H('c', 'ask', svc, String(i + 1))}" data-act="nav-back">${ic('edit', 15)} Change</a></div>`; }).join('')}</div>
  <div class="price-note"><span class="pi">${ic('tag', 18)}</span><div><b>About the price</b><p class="small">We confirm the price with you in the chat before we start. Nothing is charged now.</p></div></div>`;
}

/* ---------- sign-in by code (used in the form and on the sign-in page) ---------- */
function contactBlock(where, svc) {
  const c = U.contact, verified = c.verified || (S.me && where === 'ask');
  const title = where === 'ask' ? 'Where should we send updates?' : 'Sign in';
  const help = where === 'ask' ? 'We send you a 6-digit code to confirm it is you. No password needed.' : 'Use your phone number or email. We send you a 6-digit code. No password needed.';
  let inner;
  if (!c.sent) inner = `<div class="seg2" role="group" aria-label="Phone or email"><button aria-pressed="${c.via === 'phone'}" data-act="via" data-v="phone">${ic('phone', 17)} Phone</button><button aria-pressed="${c.via === 'email'}" data-act="via" data-v="email">${ic('mail', 17)} Email</button></div>
    ${c.via === 'phone' ? `<div class="fieldset"><span class="label">Your mobile number</span><div class="phone-in">${dd({ id: 'cc', label: 'Country code', value: c.cc, valueLabel: c.cc, options: CODES.map(([cc, nm]) => ({ v: cc, l: nm, code: cc, lead: `<span class="code">${cc}</span>` })), act: 'cc', block: true, search: 'Type a country' })}<input class="input${c.err ? ' invalid' : ''}" id="contact-phone" type="tel" inputmode="numeric" autocomplete="tel-national" data-bind="contact:value" value="${esc(c.value)}" placeholder="980 123 4567" aria-label="Mobile number"></div></div>`
    : `<label class="fieldset"><span class="label">Your email</span><input class="input${c.err ? ' invalid' : ''}" id="contact-email" type="email" inputmode="email" autocomplete="email" data-bind="contact:value" value="${esc(c.value)}" placeholder="name@company.com"></label>`}
    ${c.err ? `<div class="errline" role="alert">${ic('alert', 18)}${esc(c.err)}</div>` : ''}
    <button class="btn btn-primary btn-lg btn-block" data-act="send-code">Send me a code ${arr()}</button>
    <p class="caption">${ic('shield', 15)}We only use it to send you updates about your requests. Never for adverts.</p>`;
  else if (!verified) inner = `<div class="sent-to"><span class="small">We sent a code to</span><b>${esc(c.via === 'phone' ? c.cc + ' ' + c.value : c.value)}</b><button class="link" data-act="change-contact" style="justify-self:start">Wrong ${c.via === 'phone' ? 'number' : 'email'}? Change it</button></div>
    <label class="fieldset"><span class="label">Enter the 6-digit code</span><input class="input code-in${c.err ? ' invalid' : ''}" id="codein" inputmode="numeric" autocomplete="one-time-code" maxlength="6" data-bind="contact:code" value="${esc(c.code)}" placeholder="••••••"></label>
    ${c.err ? `<div class="errline" role="alert">${ic('alert', 18)}${esc(c.err)}</div>` : ''}
    <button class="btn btn-primary btn-lg btn-block" data-act="verify" data-where="${where}">Confirm ${ic('check', 18)}</button>
    <div class="between"><span class="small" id="resend">${resendText()}</span>${c.via === 'phone' ? `<button class="link" data-act="via-email">Send it by email instead</button>` : ''}</div>`;
  else inner = `<div class="alertline ok">${ic('check', 18)} Thank you, that is confirmed.</div>
    <label class="fieldset"><span class="label">What should we call you?</span><input class="input${c.err ? ' invalid' : ''}" id="contact-name" data-bind="contact:name" value="${esc(c.name)}" autocomplete="name" placeholder="Your name"></label>
    ${where === 'ask' ? `<label class="check"><input type="checkbox" id="contact-agree" data-bind="contact:agree"${c.agree ? ' checked' : ''}><span>I agree to the <a href="#c-help">terms</a> and the <a href="#c-help">privacy notice</a>.</span></label>` : ''}
    ${c.err ? `<div class="errline" role="alert">${ic('alert', 18)}${esc(c.err)}</div>` : ''}
    <button class="btn btn-primary btn-lg btn-block" data-act="${where === 'ask' ? 'submit' : 'signin-done'}" data-svc="${svc || ''}">${where === 'ask' ? `${ic('send', 18)} Send request` : `Continue ${arr()}`}</button>`;
  return `<div class="q-head">${where === 'ask' ? '<span class="q-n">Last step</span>' : ''}<h1 class="t-h1">${title}</h1><p class="lead">${help}</p></div><div class="stack" style="gap:14px;max-width:480px">${inner}</div>`;
}
function resendText() { const s = Math.ceil((U.contact.until - Date.now()) / 1000); return s > 0 ? `Didn’t get it? You can ask again in <span class="mono">${mmss(s)}</span>` : `<button class="link" data-act="send-code" data-again="1">Send a new code</button>`; }
setInterval(() => { const el = $('#resend'); if (el) el.innerHTML = resendText(); if (U.rec) { const t = $('#rectimer'); if (t) t.textContent = mmss((Date.now() - U.rec.start) / 1000); } if (U.crec) { const t = $('#crectimer'); if (t) t.textContent = mmss((Date.now() - U.crec.start) / 1000); } }, 500);

function vSignin() {
  if (S.me) { setTimeout(() => go('#c-requests')); return ''; }
  return cShell('account', `<div class="wrap narrow" style="padding-block:40px 72px"><div class="card pad page-in" style="max-width:560px">${contactBlock('signin')}</div>
  <p class="small" style="margin-top:20px;max-width:560px">New here? Signing in creates your account. You can also <a href="#c-home">look at our services</a> first. You only need to sign in to send a request.</p></div>`, { noFoot: true });
}
function vDone(id) {
  const r = findReq(id); if (!r) return vMine();
  return cShell('requests', `<div class="wrap narrow" style="padding-bottom:72px">
    <div class="done-hero page-in"><span class="done-badge"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><h1 class="t-h1">Request sent. Thank you!</h1><span class="stub"><span>Request no.</span><b>${r.id}</b></span><p class="lead" style="max-width:520px">We sent a copy to ${esc(mask(r.customer.contact))}. You can follow every step in your account.</p></div>
    <div class="card pad stack page-in" style="gap:18px;animation-delay:.1s"><h2 class="t-h3">What happens next</h2><div class="next-list">${[['check', 'Request sent', 'Just now.', true], ['chat', `Within ${S.settings.reply}`, 'Our team reads your request. If something is missing, we ask you in the chat.'], ['sparkle', 'We prepare your files', 'Usually within 1 working day.'], ['eye', 'You see the cover pages', 'We let you know by message. You can ask for changes.'], ['download', 'Your files arrive', 'After our final check, ready to download.']]
      .map(([i, t, p, on]) => `<div class="next-item${on ? ' on' : ''}"><span class="nd">${ic(i, 17)}</span><div><b>${t}</b><p>${p}</p></div></div>`).join('')}</div></div>
    <div class="row" style="gap:10px;margin-top:24px"><a class="btn btn-primary btn-lg" href="${H('c', 'req', r.id)}">See my request ${arr()}</a><a class="btn btn-secondary btn-lg" href="#c-home">Back to services</a></div></div>`);
}

function unreadFor(r, side) { const seen = S.seen[side + r.id] || 0; return r.msgs.filter(m => m.t > seen && (side === 'c' ? m.from === 'team' : m.from === 'c')).length; }
function vMine() {
  const list = mine();
  return cShell('requests', `<div class="wrap"><div class="acc-head between"><div class="stack" style="gap:6px"><span class="eyebrow">Your account</span><h1 class="t-h1">My requests</h1><p class="txt">Hello ${esc(first(S.me.name))}. Here is everything you asked us for.</p></div><a class="btn btn-primary" href="#c-home" data-act="scrollto" data-to="services">${ic('plus', 18)} New request</a></div>
  ${list.length ? `<div class="req-list">${list.map(reqCard).join('')}</div>` : `<div class="empty" style="margin-bottom:64px"><span class="ei">${ic('inbox', 30)}</span><h2 class="t-h3">No requests yet</h2><p class="txt" style="max-width:420px">When you ask for a service, you can follow every step here and chat with our team.</p><a class="btn btn-primary btn-lg" href="#c-home" data-act="scrollto" data-to="services">Choose a service</a></div>`}</div>`);
}
function reqCard(r) {
  const st = CSTEP[r.status], un = unreadFor(r, 'c'), lastQ = [...r.msgs].reverse().find(m => m.from === 'team');
  return `<a class="req-card page-in" href="${H('c', 'req', r.id)}"><div class="top"><span class="svc-ic sw-${r.svc}">${ic(SVC[r.svc].icon, 20)}</span><div class="grow"><h3>${SVC[r.svc].name}</h3><span class="sub">${esc(summary(r))}</span></div>${pill(r, 'c')}</div>
    <div class="minibar" aria-hidden="true">${[1, 2, 3, 4, 5].map(i => `<i class="${i < st || (i === st && st === 5) ? 'on' : i === st ? 'now' : ''}"></i>`).join('')}</div>
    ${r.status === 'question' && lastQ ? `<div class="alertline">${ic('chat', 17)} ${esc(lastQ.who)} asked: “${esc(lastQ.text.length > 70 ? lastQ.text.slice(0, 70) + '…' : lastQ.text)}”</div>` : r.status === 'preview' ? `<div class="alertline violet">${ic('eye', 17)} Your cover pages are ready to see</div>` : r.status === 'delivered' ? `<div class="alertline ok">${ic('download', 17)} Your files are ready to download</div>` : ''}
    <div class="meta"><span><span class="mono">${r.id}</span> · updated ${ago(r.updated)}</span>${un ? `<span class="flag msgs">${ic('chat', 13)} ${un} new message${un > 1 ? 's' : ''}</span>` : ''}</div></a>`;
}

function vReq(id) {
  const r = findReq(id); if (!r || !r.mine) return vMine();
  const tab = U.tab['c' + id] || 'p';
  S.seen['c' + id] = Date.now();
  if (r.status === 'preview') S.flags.sawPreview = true;
  const lastQ = [...r.msgs].reverse().find(m => m.from === 'team');
  const nowCard = {
    new: ['', 'We have your request', `Our team will read it within ${S.settings.reply} and may ask a quick question. Nothing to do for now.`],
    reviewing: ['', 'We are checking your request', 'Thank you for your answer. We are getting everything ready to start.'],
    question: ['honey', 'We need one detail from you', lastQ ? `${lastQ.who} asked: “${lastQ.text}”` : ''],
    making: ['', 'Your files are being prepared', 'We will show you the cover pages as soon as they are ready. Usually within 1 working day.'],
    changes: ['', 'We are making your changes', 'Thank you for telling us. We will show you the new cover pages soon.'],
    preview: ['violet', 'Your cover pages are ready to see', 'Take a look below. Our team does a final check, then sends you the full files.'],
    delivered: ['ok', 'Your files are ready', `Sent ${day(r.sentAt || r.updated)} at ${hm(r.sentAt || r.updated)}. Download them all at once, or open each one.`],
    cancelled: ['', 'This request was cancelled', 'Nothing more will happen. You can always send a new request.'],
  }[r.status];
  const steps = [['Sent', hm(r.created)], ['Checked', ''], ['Being prepared', ''], ['Cover ready', ''], ['Delivered', '']];
  const cur = CSTEP[r.status];
  const zipSize = (r.files.reduce((n, f) => n + parseFloat(f.size), 0) * 0.92).toFixed(1);
  return cShell('requests', `<div class="wrap"><div style="padding-top:16px"><a class="back" href="#c-requests">${ic('arrowL', 16)} My requests</a></div>
  <div class="rq-head"><div class="who-blk"><span class="svc-ic lg sw-${r.svc}">${ic(SVC[r.svc].icon, 24)}</span><div class="grow"><h1 class="t-h3" style="font-size:1.625rem">${SVC[r.svc].name}</h1><p class="micro"><span class="mono">${r.id}</span> · sent ${day(r.created)} at ${hm(r.created)}</p></div></div>${pill(r, 'c')}</div>
  <div class="tabs only-narrow" style="margin-bottom:16px"><button aria-pressed="${tab === 'p'}" data-act="tab" data-k="c${id}" data-v="p">${ic('layout', 17)} Progress</button><button aria-pressed="${tab === 'c'}" data-act="tab" data-k="c${id}" data-v="c">${ic('chat', 17)} Messages${unreadFor(r, 'c') ? `<span class="cnt">${unreadFor(r, 'c')}</span>` : ''}</button></div>
  <div class="rq-layout">
    <div class="stack${tab === 'c' ? ' pane-hidden' : ''}" style="gap:16px;align-content:start;min-width:0">
      <div class="now-card ${nowCard[0]} page-in"><span class="k">Right now</span><h2>${nowCard[1]}</h2><p class="txt">${esc(nowCard[2])}</p>
        ${r.status === 'question' ? `<div class="row"><button class="btn btn-primary" data-act="answer" data-id="${id}">${ic('chat', 17)} Answer now</button></div>` : ''}
        ${r.status === 'preview' ? (r.feedback === 'good' ? `<div class="alertline ok">${ic('thumb', 17)} You said it looks good. Thank you!</div>` : `<div class="row"><button class="btn btn-primary" data-act="fb-good" data-id="${id}">${ic('thumb', 17)} Looks good</button><button class="btn btn-secondary" data-act="fb-change" data-id="${id}">${ic('edit', 17)} Ask for a change</button></div>`) : ''}
        ${r.status === 'delivered' ? `<div class="row"><button class="btn btn-primary btn-lg" data-act="zip" data-id="${id}">${ic('download', 18)} Download all · ZIP ${zipSize} MB</button></div>` : ''}</div>
      ${r.status !== 'cancelled' ? `<div class="card pad"><div class="track">${steps.map(([l, t], i) => { const n = i + 1, cls = n < cur || (n === cur && n === 5) ? 'done' : n === cur ? 'now' : 'todo'; return `<div class="tstep ${cls}"><span class="tdot">${cls === 'done' ? ic('check', 15) : n}</span><div><b>${l}</b><span>${cls === 'now' ? 'Now' : t}</span></div></div>`; }).join('')}</div></div>` : ''}
      ${filesSection(r)}
      <div class="card pad asked"><details><summary>What you asked for ${ic('chevD', 18, 'class="chev"')}</summary><div style="margin-top:6px">${answerRows(r.svc, r.answers).filter(x => x[1]).map(([l, v]) => `<div class="kv"><span class="k">${esc(l)}</span><b>${esc(v)}</b></div>`).join('')}</div></details></div>
      ${['new', 'question', 'reviewing'].includes(r.status) ? `<div><button class="link" style="color:var(--err);text-decoration-color:rgba(180,50,31,.3)" data-act="cancel" data-id="${id}">Cancel this request</button></div>` : ''}
    </div>
    <div class="chatcol${tab === 'p' ? ' pane-hidden' : ''}">${chat(r, 'c')}</div>
  </div></div>`, { noFoot: true });
}
function filesSection(r) {
  if (r.status === 'preview') return `<section class="card pad stack" style="gap:16px"><div class="between"><h2 class="t-h3" style="font-size:1.1875rem">Cover pages</h2><span class="micro">${ic('lock', 13, 'style="vertical-align:-2px"')} Full files after our final check</span></div>
    <div class="prev-grid sw-${r.svc}">${r.files.map(f => `<button class="prev" ${f.pic ? `data-act="zoom" data-pics="${f.pic}" data-title="${esc(fileTitle(f.name))} (preview)"` : 'data-act="noprev"'}><span class="frame twill">${f.pic ? pic(f.pic) : miniCover(fileTitle(f.name), f.kind)}<span class="wm"><span>PREVIEW</span></span><span class="lockline">${ic('lock', 12)} Cover only</span></span><b>${esc(fileTitle(f.name))}</b><span class="s">${KIND[f.kind]}</span></button>`).join('')}</div></section>`;
  if (r.status === 'delivered') return `<section class="card pad stack" style="gap:14px"><h2 class="t-h3" style="font-size:1.1875rem">Your files</h2><div class="files">${r.files.map((f, i) => `<div class="frow">${fbadge(f.kind, true)}<span class="grow"><b>${esc(f.name)}</b><span class="s">${KIND[f.kind]} · ${f.size}</span></span><button class="btn btn-secondary btn-sm" data-act="open-file" data-id="${r.id}" data-i="${i}">${ic('eye', 15)} Open</button><button class="iconbtn" data-act="dl" data-id="${r.id}" data-i="${i}" aria-label="Download ${esc(f.name)}">${ic('download', 17)}</button></div>`).join('')}</div><p class="caption">${ic('info', 15)}Your files stay in your account. You can download them again any time.</p></section>`;
  if (r.status === 'cancelled') return '';
  return `<section class="card pad stack" style="gap:12px;justify-items:center;text-align:center;border-style:dashed;border-color:var(--line-2)"><span class="svc-ic sw-${r.svc}">${ic('file', 22)}</span><h2 class="t-h3" style="font-size:1.1875rem">Your cover pages will appear here</h2><p class="small" style="max-width:420px">${SVC[r.svc].deliver.length} file${SVC[r.svc].deliver.length > 1 ? 's' : ''}: ${SVC[r.svc].deliver.map(f => fileTitle(f[0])).join(', ')}.</p></section>`;
}

/* ---------- chat, the same component on both sides ---------- */
function chat(r, side, tall) {
  const them = side === 'c' ? { name: r.assignee ? `${teamName(r)} · Tech Tailoring` : 'Tech Tailoring team', sub: `<span class="online"></span>Usually replies within ${esc(S.settings.reply)}`, av: r.assignee ? tav(member(r.assignee), 'lg') : `<span class="avatar staff lg">TT</span>` } : { name: r.customer.name, sub: esc(r.customer.contact), av: av(r.customer.name, 'lg') };
  const rec = U.crec && U.crec.id === r.id && U.crec.side === side;
  let lastDay = '';
  const body = r.msgs.map(m => {
    const d = day(m.t), sep = d !== lastDay ? `<div class="sys day">${d}</div>` : ''; lastDay = d;
    if (m.from === 'sys') return sep + `<div class="sys">${esc(m.text)} · ${hm(m.t)}</div>`;
    const mineMsg = side === 'c' ? m.from === 'c' : m.from !== 'c';
    const who = side === 't' && m.from !== 'c' && m.who && m.who !== teamName({ assignee: S.team }) ? `<span class="from">${esc(m.who)}</span>` : side === 'c' && m.from !== 'c' ? `<span class="from">${esc(m.who || 'Tech Tailoring')}</span>` : '';
    let content = esc(m.text || '');
    if (m.voice) content = `<span class="vplayer">${voicePlayer(m.voice, 'm' + m.t)}</span>`;
    if (m.file) content = `<span class="row" style="gap:10px;flex-wrap:nowrap">${fbadge('pdf')}<b style="font-weight:600">${esc(m.file)}</b></span>`;
    if (m.wa) content = `${esc(m.text)}<div class="wacard"><b>${ic('wa', 16, 'style="vertical-align:-3px;color:var(--wa)"')} ${esc(m.wa)}</b><button class="btn btn-wa btn-sm" data-act="wa"${side === 't' ? ` data-cust="${r.id}"` : ''}>Open WhatsApp</button></div>`;
    return sep + `<div class="msg ${mineMsg ? 'me' : 'them'}">${who}${content}<span class="meta">${hm(m.t)}${mineMsg ? ' · ✓✓' : ''}</span></div>`;
  }).join('');
  const qs = side === 't' && !['delivered', 'cancelled'].includes(r.status) ? [...new Set(checks(r).filter(c => c[0] === 'ask').map(c => c[2]).concat(QUICK_ASK))].slice(0, 4) : [];
  const quick = qs.length ? `<div class="quick-k">Quick replies</div><div class="quick">${qs.map(q => `<button data-act="quick" data-id="${r.id}" data-q="${esc(q)}">${esc(q)}</button>`).join('')}</div>` : '';
  const composer = r.status === 'cancelled' ? '' : rec
    ? `<div class="composer"><span class="dotnew" style="animation:recpulse 1.4s infinite;margin-left:6px"></span><b class="timer" id="crectimer" style="font-size:1rem">0:00</b><span class="small" style="flex:1">Recording…</span><button class="btn btn-secondary btn-sm" data-act="crec-cancel">Cancel</button><button class="send" data-act="crec-send" data-id="${r.id}" data-side="${side}" aria-label="Send voice message">${ic('send', 19)}</button></div>`
    : `${quick}<div class="composer"><label class="iconbtn" aria-label="Attach a file" style="cursor:pointer">${ic('clip', 19)}<input type="file" hidden data-file="chat" data-id="${r.id}" data-side="${side}"></label><input class="input" id="chatin-${side}-${r.id}" data-chatin="${r.id}" placeholder="Write a message…" aria-label="Message" enterkeyhint="send"><button class="iconbtn" data-act="crec-start" data-id="${r.id}" data-side="${side}" aria-label="Record a voice message" style="color:var(--coral)">${ic('mic', 19)}</button><button class="send" data-act="chat-send" data-id="${r.id}" data-side="${side}" aria-label="Send">${ic('send', 19)}</button></div>`;
  return `<div class="chat"><div class="chat-head">${them.av}<div class="grow"><b>${esc(them.name)}</b><span class="s">${them.sub}</span></div><button class="iconbtn wa-ic" data-act="wa"${side === 't' ? ` data-cust="${r.id}"` : ''} aria-label="Open WhatsApp">${ic('wa', 18)}</button></div>
  <div class="chat-body${tall ? ' tall' : ''}" aria-live="polite">${body}</div>${composer}</div>`;
}

function vMsgs() {
  const list = mine().filter(r => r.msgs.length);
  return cShell('messages', `<div class="wrap" style="padding-bottom:64px"><div class="acc-head"><span class="eyebrow">Your account</span><h1 class="t-h1">Messages</h1><p class="txt">One conversation for each request. We reply within ${esc(S.settings.reply)}.</p></div>
  ${list.length ? `<div class="threads">${list.map(r => { const last = r.msgs[r.msgs.length - 1], un = unreadFor(r, 'c'); return `<a class="thread" href="${H('c', 'req', r.id)}" data-act="tab-chat" data-id="${r.id}"><span class="svc-ic sw-${r.svc}">${ic(SVC[r.svc].icon, 20)}</span><span class="grow"><b>${SVC[r.svc].name} · <span class="mono" style="font-weight:500">${r.id}</span></b><span class="last">${esc(last.voice ? 'Voice message' : last.text || last.file)}</span></span><span class="when">${ago(last.t)}</span>${un ? '<span class="dotnew" aria-label="New messages"></span>' : ''}</a>`; }).join('')}</div>
    <div class="help-card" style="margin-top:24px"><span class="svc-ic" style="background:var(--wa-soft);color:var(--wa)">${ic('wa', 20)}</span><span class="grow"><b>Prefer WhatsApp?</b><span>You can also reach our team at <span class="mono">${esc(S.settings.wa)}</span></span></span><button class="btn btn-wa btn-sm" data-act="wa">Open WhatsApp</button></div>`
  : `<div class="empty"><span class="ei">${ic('chat', 30)}</span><h2 class="t-h3">No messages yet</h2><p class="txt" style="max-width:420px">When you ask for a service, you can chat with our team here. Or message us on WhatsApp any time.</p><button class="btn btn-wa btn-lg" data-act="wa">${ic('wa', 20)} Chat on WhatsApp</button></div>`}</div>`);
}
function vAccount() {
  const me = S.me;
  me.prefs = me.prefs || { sms: true, email: true, wa: false };
  return cShell('account', `<div class="wrap narrow" style="padding-bottom:64px"><div class="profile">${av(me.name, 'xl')}<div class="grow"><h1 class="t-h1">${esc(me.name)}</h1><p class="small"><span class="mono">${esc(me.contact)}</span> ${ic('check', 15, 'style="vertical-align:-3px;color:var(--ok)"')} confirmed</p></div></div>
  <div class="settings">
    <section class="card pad"><h2 class="t-h3" style="font-size:1.1875rem;margin-bottom:4px">Text size</h2><p class="small" style="margin-bottom:14px">Make every word on this site bigger. You can also change it from the top bar.</p><div class="tsize-seg">${SCALES.map(([s, l], i) => `<button aria-pressed="${S.scale === s}" data-act="setscale" data-s="${s}"><span class="aa" style="font-size:${1.1 + i * .3}rem">Aa</span><span class="l">${l}</span></button>`).join('')}</div></section>
    <section class="card pad"><h2 class="t-h3" style="font-size:1.1875rem;margin-bottom:4px">How we tell you about updates</h2>${[['sms', 'Text message', 'To your phone'], ['email', 'Email', me.contact.includes('@') ? me.contact : 'Add an email below'], ['wa', 'WhatsApp', 'Messages from our business number']].map(([k, l, s]) => `<div class="set-row"><span class="grow"><b>${l}</b><span class="s">${esc(s)}</span></span><button class="switch" role="switch" aria-checked="${!!me.prefs[k]}" aria-label="${l}" data-act="pref" data-k="${k}"></button></div>`).join('')}</section>
    <section class="card pad"><h2 class="t-h3" style="font-size:1.1875rem;margin-bottom:4px">Your details</h2><div class="set-row"><span class="grow"><b>Name</b><span class="s">${esc(me.name)}</span></span><button class="btn btn-ghost btn-sm" data-act="soon">Change</button></div><div class="set-row"><span class="grow"><b>${me.contact.includes('@') ? 'Email' : 'Phone'}</b><span class="s">${esc(me.contact)}</span></span><button class="btn btn-ghost btn-sm" data-act="soon">Change</button></div><div class="set-row"><span class="grow"><b>${me.contact.includes('@') ? 'Phone' : 'Email'}</b><span class="s">Add one, so you can sign in with either</span></span><button class="btn btn-ghost btn-sm" data-act="soon">${ic('plus', 16)} Add</button></div></section>
    <div><button class="btn btn-secondary btn-lg" data-act="signout">${ic('logout', 18)} Sign out</button></div>
  </div></div>`);
}
function vHelp() {
  return cShell('help', `<div class="wrap" style="padding-block:28px 72px"><div class="faq-grid">
    <div class="faq-side"><span class="eyebrow">Help</span><h1 class="t-h1">How can we help?</h1><p class="lead">Answers to common questions. Or talk to us: we reply within ${esc(S.settings.reply)}, ${esc(S.settings.hours)}.</p>
      <div class="row" style="gap:10px;margin-top:6px"><button class="btn btn-wa btn-lg" data-act="wa">${ic('wa', 20)} WhatsApp us</button><a class="btn btn-secondary btn-lg" href="${S.me ? '#c-messages' : '#c-signin'}">${ic('chat', 18)} Message us here</a></div></div>
    ${faq(FAQ)}</div></div>`);
}

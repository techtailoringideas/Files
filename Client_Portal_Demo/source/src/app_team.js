
/* ================= TEAM DASHBOARD ================= */
function tShell(active, title, body, right = '', crumb = 'Team dashboard') {
  const open = S.reqs.filter(r => !['delivered', 'cancelled'].includes(r.status));
  const newN = S.reqs.filter(r => r.status === 'new').length;
  const unread = S.reqs.reduce((n, r) => n + unreadFor(r, 't'), 0), me = member(S.team) || TEAM[0];
  const items = [['requests', 'Requests', 'inbox', '#t-requests', open.length, newN ? 'hot' : ''], ['messages', 'Messages', 'chat', '#t-messages', unread, 'coral'], ['catalogue', 'Catalogue', 'grid', '#t-catalogue'], ['customers', 'Customers', 'users', '#t-customers'], ['people', 'Team', 'user', '#t-people'], ['settings', 'Settings', 'sliders', '#t-settings']];
  const nav = ([k, l, i, h, n, cls]) => `<a href="${h}"${k === active ? ' aria-current="page"' : ''}>${ic(i, 19)} ${l}${n ? `<span class="cnt ${cls || ''}">${n}</span>` : ''}</a>`;
  return `<div class="team"><aside class="side">${logo('Team dashboard', '#t-requests', true)}
    <span class="sl">Work</span>${items.slice(0, 2).map(nav).join('')}
    <span class="sl">Manage</span>${items.slice(2).map(nav).join('')}
    <div class="sep"></div><button class="navb" data-act="mode" data-m="c">${ic('external', 19)} View customer site</button>
    <div class="me"><span class="avatar" aria-hidden="true">${initials(me.name)}</span><div class="grow"><b>${me.name}</b><span class="s">${me.role}</span></div><button class="iconbtn" data-act="tsignout" aria-label="Sign out">${ic('logout', 17)}</button></div></aside>
  <div class="tmain"><div class="ttop"><div class="in"><span class="tmark">${logoMark()}</span><div class="tl"><span class="crumb">${crumb}</span><h1>${title}</h1></div>${right}</div></div><div class="tbody page-in">${body}</div></div>
  <nav class="tnav" aria-label="Sections">${items.slice(0, 5).map(([k, l, i, h, n]) => `<a href="${h}"${k === active ? ' aria-current="page"' : ''}>${ic(i, 21)}${l}${n && k !== 'requests' ? `<span class="badge">${n}</span>` : ''}</a>`).join('')}</nav></div>`;
}
function tLogin() {
  if (S.team) { setTimeout(() => go('#t-requests')); return ''; }
  const c = U.tlog, open = S.reqs.filter(r => !['delivered', 'cancelled'].includes(r.status)).length;
  return `<div class="login-wrap"><div class="login-art matbg"><div>${logo('Team dashboard', '#t-login', true).replace('class="logo"', 'class="logo" style="color:#fff"')}</div>
    <div class="q"><span class="eyebrow on-dark">For the Tech Tailoring team</span><h2>Every request, from first message to final file.</h2><p>Check what came in, ask the customer one clear question, make it in Studio and send it, all from one place.</p></div>
    <div class="stats"><div><b>${open}</b><span>open requests</span></div><div><b>${S.settings.reply.replace(' working hours', ' h')}</b><span>reply promise</span></div><div><b>${TEAM.length}</b><span>people on the team</span></div></div></div>
  <div class="login-side"><div class="card login-card page-in"><div class="stack" style="gap:8px"><span class="eyebrow">Team sign in</span><h1 class="t-h3" style="font-size:1.625rem">Welcome back</h1><p class="small">For Tech Tailoring staff only. New team members are invited by an admin.</p></div>
  ${!c.sent ? `<label class="fieldset"><span class="label">Work email</span><input class="input" id="tlog-email" type="email" data-bind="tlog:email" value="${esc(c.email)}" autocomplete="email"></label><button class="btn btn-primary btn-lg btn-block" data-act="tsend">Send me a code ${arr()}</button>`
  : `<div class="sent-to"><span class="small">We sent a code to</span><b>${esc(c.email)}</b></div><label class="fieldset"><span class="label">6-digit code</span><input class="input code-in" id="tcodein" inputmode="numeric" autocomplete="one-time-code" maxlength="6" data-bind="tlog:code" value="${esc(c.code)}" placeholder="••••••"></label>${c.err ? `<div class="errline">${ic('alert', 18)}${esc(c.err)}</div>` : ''}<button class="btn btn-primary btn-lg btn-block" data-act="tverify">Sign in</button>`}
  <p class="caption">${ic('shield', 15)}Customers never see this page. They sign in on the customer site.</p></div></div></div>`;
}
const TGROUPS = [['new', 'New', 'var(--tape-deep)', ['new']], ['question', 'Waiting for customer', 'var(--coral)', ['question']], ['work', 'In progress', 'var(--navy)', ['reviewing', 'making', 'changes']], ['preview', 'Ready to approve', 'var(--violet)', ['preview']], ['delivered', 'Delivered', 'var(--ok)', ['delivered']]];
function tRequests() {
  if (myLatest()) S.flags.teamSawNew = true;
  const f = U.tf, inG = (r, g) => (TGROUPS.find(x => x[0] === g) || [, , , []])[3].includes(r.status);
  const counts = TGROUPS.map(g => S.reqs.filter(r => inG(r, g[0])).length), total = counts.reduce((a, b) => a + b, 0);
  const list = S.reqs.filter(r => f === 'open' ? !['delivered', 'cancelled'].includes(r.status) : inG(r, f)).sort((a, b) => b.created - a.created);
  const me = member(S.team) || TEAM[0], h = new Date().getHours();
  const late = S.reqs.filter(r => r.status === 'new' && Date.now() - r.created > 2 * 3600e3).length;
  return tShell('requests', 'Requests', `
  <div class="greet"><div class="grow"><span class="micro mono">${new Date().toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' })}</span><h2>${h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'}, ${me.name}.</h2><p class="txt">${counts[0]} new, ${counts[3]} ready to approve and ${counts[1]} waiting for a customer.</p></div><span class="promise">${ic('clock', 15)} First reply within <b>${esc(S.settings.reply)}</b></span></div>
  <div class="pipe"><div class="kpis">${TGROUPS.map(([k, l, c], i) => `<button class="kpi" aria-pressed="${f === k}" data-act="tf" data-v="${k}"><span class="l"><i style="background:${c}"></i>${l}</span><span class="v">${counts[i]}</span></button>`).join('')}</div>
    <div class="share" role="img" aria-label="Requests by status: ${TGROUPS.map((g, i) => `${g[1]} ${counts[i]}`).join(', ')}">${TGROUPS.map(([, l, c], i) => counts[i] ? `<i style="flex:${counts[i]} 1 0;background:${c}" title="${l}: ${counts[i]} of ${total} (${Math.round(counts[i] / total * 100)}%)"></i>` : '').join('')}</div></div>
  <div class="list-head"><div class="t">${f === 'open' ? 'All open requests' : TGROUPS.find(g => g[0] === f)[1]} <span class="c">${list.length}</span>${f !== 'open' ? `<button class="link" data-act="tf" data-v="open" style="font-weight:500;font-size:.875rem">Show all open</button>` : ''}</div>${late ? `<span class="flag slow">${ic('clock', 13)} ${late} waiting over 2 h</span>` : ''}</div>
  <div class="rq-table" role="table" aria-label="Requests"><div class="rq-headrow" role="row"><span>Request</span><span>Customer</span><span>Received</span><span>Assigned</span><span>Status</span></div>
  ${list.length ? list.map(rqRow).join('') : `<div class="empty" style="border:0;border-radius:0">${ic('inbox', 30)}<b style="font-size:1rem">Nothing here</b><p class="small">All caught up.</p></div>`}</div>`,
  `<label class="tsearch">${ic('search', 16)}<input class="input" id="tsearch" placeholder="Search name, number, R-…" aria-label="Search requests"><kbd>/</kbd></label>`, 'Today');
}
function rqRow(r) {
  const miss = checks(r).filter(c => c[0] === 'ask').length, un = unreadFor(r, 't'), m = member(r.assignee);
  const late = r.status === 'new' && Date.now() - r.created > 2 * 3600e3;
  return `<a class="rq-row${r.status === 'new' ? ' fresh' : ''}" role="row" href="${H('t', 'req', r.id)}">
    <div class="rq-cell" role="cell"><span class="svc-ic sm sw-${r.svc}">${ic(SVC[r.svc].icon, 17)}</span><span class="cell-t"><b>${SVC[r.svc].name}</b><span class="cell-s"><span class="mono">${r.id}</span> · ${esc(summary(r))}</span></span></div>
    <div class="rq-cell" role="cell">${av(r.customer.name)}<span class="cell-t"><b>${esc(r.customer.name)}</b><span class="cell-s">${esc(r.customer.contact)}</span></span></div>
    <div class="rq-cell desk-only" role="cell"><span class="when">${ago(r.created)}</span></div>
    <div class="rq-cell desk-only" role="cell">${m ? `${tav(m, 'sm')}<span class="cell-t"><b style="font-weight:500">${m.name}</b></span>` : '<span class="muted">Not assigned</span>'}</div>
    <div class="rq-cell" role="cell" style="flex-wrap:wrap;gap:6px">${pill(r, 't')}<span class="flags">${miss && ['new', 'reviewing'].includes(r.status) ? `<span class="flag">${ic('alert', 12)} Info missing</span>` : ''}${un ? `<span class="flag msgs">${ic('chat', 12)} ${un} new</span>` : ''}${late ? `<span class="flag slow">${ic('clock', 12)} Reply soon</span>` : ''}</span></div>
    <div class="mobile-only">${ic('clock', 13)} ${ago(r.created)} · ${m ? m.name : 'Not assigned'}</div></a>`;
}
function tReq(id) {
  const r = findReq(id); if (!r) return tRequests();
  S.seen['t' + id] = Date.now();
  const tab = U.tab['t' + id] || 'w', ctab = U.tab['tc' + id] || 'chat';
  const ck = checks(r), asks = ck.filter(c => c[0] === 'ask');
  const lastChange = [...r.msgs].reverse().find(m => m.change);
  const nextHint = {
    new: asks.length ? ['honey', 'alert', 'Something is missing', `Ask ${first(r.customer.name)} before you start: ${asks[0][1].toLowerCase()}`] : ['', 'sparkle', 'Ready to start', 'Everything we need is here. Open it in Studio.'],
    question: ['', 'hourglass', `Waiting for ${first(r.customer.name)}`, 'You will see the answer here and in Messages.'],
    reviewing: ['', 'chat', 'Customer answered', 'Read the answer in the chat, then open it in Studio.'],
    making: ['', 'layers', 'Being made in Studio', 'When the run finishes, attach the files here.'],
    changes: ['honey', 'edit', 'Change requested', lastChange ? `“${lastChange.text}”` : 'Read the chat, fix it in Studio and attach the new files.'],
    preview: ['violet', 'eye', 'Ready to approve', 'Check the files, then approve and send them to the customer.'],
    delivered: ['ok', 'check', 'Delivered', `Sent ${day(r.sentAt || r.updated)} at ${hm(r.sentAt || r.updated)}.`],
    cancelled: ['', 'x', 'Cancelled by the customer', 'Nothing to do.'],
  }[r.status];
  const stage = { new: 1, question: 1, reviewing: 2, making: 2, changes: 2, preview: 3, delivered: 5, cancelled: 0 }[r.status];
  const ws = (n) => n < stage || stage === 5 ? 'done' : n === stage ? 'now' : 'todo';
  const answers = answerRows(r.svc, r.answers).filter(x => x[1]);
  const am = member(r.assignee);
  const assign = dd({ id: 'assign-' + id, label: 'Assigned to', value: r.assignee || '', right: true, act: 'assign', data: { id },
    inner: `${am ? tav(am, 'sm') : '<span class="avatar sm" style="background:var(--paper-2);color:var(--ink-3)">—</span>'}<span>${am ? am.name : 'Nobody yet'}</span>`,
    options: [{ v: '', l: 'Nobody yet', sub: 'Leave it open', lead: '<span class="avatar sm" style="background:var(--paper-2);color:var(--ink-3)">—</span>' }, ...TEAM.map(m => ({ v: m.id, l: m.name + (m.id === S.team ? ' (you)' : ''), sub: m.role, lead: tav(m, 'sm') }))] });
  return tShell('requests', `${SVC[r.svc].name} <span class="mono" style="font-family:var(--f-mono);font-size:.78em;color:var(--ink-3);letter-spacing:0">${r.id}</span>`, `
  <div class="td-head"><a class="back" href="#t-requests">${ic('arrowL', 16)} All requests</a>${pill(r, 't')}<span class="assign">Assigned to ${assign}</span></div>
  <div class="next-hint ${nextHint[0]}"><span class="nh-i">${ic(nextHint[1], 19)}</span><div class="grow"><span class="k">Next step</span><b>${nextHint[2]}</b><p>${esc(nextHint[3])}</p></div></div>
  <div class="tabs only-narrow"><button aria-pressed="${tab === 'd'}" data-act="tab" data-k="t${id}" data-v="d">Details</button><button aria-pressed="${tab === 'w'}" data-act="tab" data-k="t${id}" data-v="w">Work</button><button aria-pressed="${tab === 'c'}" data-act="tab" data-k="t${id}" data-v="c">Chat${unreadFor(r, 't') ? `<span class="cnt">${unreadFor(r, 't')}</span>` : ''}</button></div>
  <div class="td-grid">
    <div class="stack${tab !== 'd' ? ' pane-hidden' : ''}" style="gap:16px;min-width:0">
      <section class="panel"><div class="cust">${av(r.customer.name, 'lg')}<div class="grow"><b>${esc(r.customer.name)}</b><span class="micro mono">${esc(r.customer.contact)}</span></div></div>
        <div class="row" style="gap:8px"><button class="btn btn-wa btn-sm" data-act="wa" data-cust="${id}">${ic('wa', 15)} WhatsApp</button><button class="btn btn-secondary btn-sm" data-act="soon">${ic(r.customer.via === 'email' ? 'mail' : 'phone', 15)} ${r.customer.via === 'email' ? 'Email' : 'Call'}</button></div>
        <div><div class="kv"><span class="k">Received</span><b>${day(r.created)} at ${hm(r.created)} · ${ago(r.created)}</b></div><div class="kv"><span class="k">Requests from this customer</span><b>${S.reqs.filter(x => x.customer.name === r.customer.name).length}</b></div></div></section>
      <section class="panel"><h2>What they asked for</h2><div>${answers.map(([l, v, fd]) => `<div class="kv"><span class="k">${esc(l)}</span>${fd.t === 'tell' && r.answers[fd.k].voice ? `<div class="voice" style="margin:6px 0">${voicePlayer(r.answers[fd.k].voice, 'tv' + id)}</div>${r.answers[fd.k].transcript ? `<div class="transcript"><span class="tk">Automatic transcript</span>${esc(r.answers[fd.k].transcript)}</div>` : ''}${(r.answers[fd.k].text || '').trim() ? `<b>“${esc(r.answers[fd.k].text)}”</b>` : ''}` : `<b>${esc(v)}</b>`}</div>`).join('')}</div></section>
      <section class="panel"><h2>Checks before you start</h2><div class="miss">${ck.length ? ck.map(([k, t]) => `<div class="${k}">${ic(k === 'ask' ? 'alert' : 'info', 16)}<span>${esc(t)}</span></div>`).join('') : `<div class="good">${ic('check', 16)}<span>Everything we need is here.</span></div>`}</div></section>
    </div>
    <div class="stack${tab !== 'w' ? ' pane-hidden' : ''}" style="gap:16px;min-width:0">
      <section class="panel"><div class="ph"><h2>Work</h2><span class="micro mono">${stage === 5 ? 'Done' : stage ? `Step ${Math.min(stage, 4)} of 4` : ''}</span></div><div class="wsteps">
        <div class="wstep ${ws(1)}"><span class="wd">${ws(1) === 'done' ? ic('check', 15) : 1}</span><div class="wb"><h3>Check the request</h3>${stage === 1 ? `<p>${asks.length ? `${asks.length} thing${asks.length > 1 ? 's' : ''} to ask. Send a ready-made question, or start anyway.` : 'All good. You can start.'}</p><div class="row" style="gap:8px">${asks.length ? `<button class="btn btn-primary btn-sm" data-act="quick" data-id="${id}" data-q="${esc(asks[0][2])}">${ic('chat', 15)} Ask: ${esc(asks[0][2].length > 34 ? asks[0][2].slice(0, 34) + '…' : asks[0][2])}</button>` : ''}<button class="btn btn-secondary btn-sm" data-act="studio" data-id="${id}">Start anyway</button></div>` : `<p>Checked${r.assignee ? ` by ${teamName(r)}` : ''}.</p>`}</div></div>
        <div class="wstep ${ws(2)}"><span class="wd">${ws(2) === 'done' ? ic('check', 15) : 2}</span><div class="wb"><h3>Make it in Studio</h3>${stage === 2 ? (r.status === 'making' ? `<p>Started ${ago(r.started || r.updated)}. When the run finishes, attach its files.</p><div class="row" style="gap:8px"><button class="btn btn-primary btn-sm" data-act="attach-open" data-id="${id}">${ic('clip', 15)} Attach the finished files</button><button class="btn btn-ghost btn-sm" data-act="studio" data-id="${id}">${ic('external', 15)} Open Studio again</button></div>` : `<p>${r.status === 'changes' ? 'Fix it, then attach the new files.' : `The ${SVC[r.svc].name} tool opens with the answers filled in.`}</p><div class="row" style="gap:8px"><button class="btn btn-primary btn-sm" data-act="studio" data-id="${id}">${ic('external', 15)} Open in Studio</button>${r.status === 'changes' ? `<button class="btn btn-secondary btn-sm" data-act="attach-open" data-id="${id}">${ic('clip', 15)} Attach new files</button>` : ''}</div>`) : stage > 2 ? `<p>${r.files.length} files attached.</p>` : '<p>After the check.</p>'}</div></div>
        <div class="wstep ${ws(3)}"><span class="wd">${ws(3) === 'done' ? ic('check', 15) : 3}</span><div class="wb"><h3>Customer sees the cover pages</h3>${r.files.length ? `<div class="samples">${r.files.map(f => `<div class="sample sw-${r.svc}"><button class="sf" style="cursor:zoom-in" ${f.pic ? `data-act="zoom" data-pics="${f.pic}" data-title="${esc(fileTitle(f.name))}"` : 'data-act="noprev"'}>${f.pic ? pic(f.pic) : miniCover(fileTitle(f.name), f.kind)}</button><span class="l">${esc(fileTitle(f.name))}</span></div>`).join('')}</div>
          ${stage === 3 ? `<div class="set-row" style="padding:4px 0"><span class="grow"><b>Show cover pages to the customer</b><span class="s">Full files stay locked until you approve.</span></span><button class="switch" role="switch" aria-checked="${!!r.previews}" data-act="toggle-prev" data-id="${id}" aria-label="Show cover pages"></button></div>${r.feedback === 'good' ? `<div class="alertline ok">${ic('thumb', 16)} ${esc(first(r.customer.name))} says it looks good</div>` : ''}` : ''}` : '<p>Made from the first page of each file, with a PREVIEW mark.</p>'}</div></div>
        <div class="wstep ${ws(4)}"><span class="wd">${ws(4) === 'done' ? ic('check', 15) : 4}</span><div class="wb"><h3>Approve and send</h3>${r.status === 'delivered' ? `<p>Sent to ${esc(first(r.customer.name))} ${ago(r.sentAt || r.updated)}: ${r.files.length} files and one ZIP.</p>` : `<p>Only now do the full files reach the customer.</p><div><button class="btn btn-primary" data-act="approve" data-id="${id}"${stage === 3 ? '' : ' disabled title="Attach the finished files first"'}>${ic('send', 17)} Approve and send</button></div>${stage < 3 ? '<p class="micro">Attach the finished files first.</p>' : ''}`}</div></div>
      </div></section>
    </div>
    <div class="chatcol stack${tab !== 'c' ? ' pane-hidden' : ''}" style="gap:12px;min-width:0">
      <div class="tabs"><button aria-pressed="${ctab === 'chat'}" data-act="tab" data-k="tc${id}" data-v="chat">${ic('chat', 16)} Customer chat</button><button aria-pressed="${ctab === 'notes'}" data-act="tab" data-k="tc${id}" data-v="notes">${ic('note', 16)} Team notes${r.notes.length ? ` <span class="mono" style="font-weight:500">${r.notes.length}</span>` : ''}</button></div>
      ${ctab === 'chat' ? chat(r, 't') : `<div class="panel"><p class="micro">${ic('lock', 13, 'style="vertical-align:-2px"')} Only your team sees these notes.</p>${r.notes.map(n => `<div class="msg note"><span class="from">${esc(n.who)} · ${ago(n.t)}</span>${esc(n.text)}</div>`).join('') || '<p class="small">No notes yet.</p>'}<textarea class="textarea" id="notein" style="min-height:96px" placeholder="Write a note for the team…"></textarea><div><button class="btn btn-secondary btn-sm" data-act="note" data-id="${id}">${ic('plus', 15)} Add note</button></div></div>`}
    </div>
  </div>`, '', 'Requests');
}
function tMsgs(id) {
  const list = S.reqs.filter(r => r.msgs.some(m => m.from !== 'sys')).sort((a, b) => b.updated - a.updated);
  const cur = id ? findReq(id) : null;
  if (cur) S.seen['t' + cur.id] = Date.now();
  const threads = `<div class="threads">${list.map(r => { const last = [...r.msgs].reverse().find(m => m.from !== 'sys') || r.msgs[0], un = unreadFor(r, 't'); return `<a class="thread" href="${H('t', 'messages', r.id)}"${cur && cur.id === r.id ? ' aria-current="true"' : ''}>${av(r.customer.name)}<span class="grow"><b>${esc(r.customer.name)}</b><span class="last">${SVC[r.svc].name} · ${esc(last.voice ? 'Voice message' : last.text || last.file || '')}</span></span><span class="when">${ago(last.t)}</span>${un ? '<span class="dotnew"></span>' : ''}</a>`; }).join('')}</div>`;
  return tShell('messages', cur ? esc(cur.customer.name) : 'Messages', `<div class="msg-grid${cur ? '' : ' solo'}">
    <div class="${cur ? 'pane-hidden' : ''}" style="min-width:0">${threads}</div>
    ${cur ? `<div class="stack" style="gap:12px;min-width:0"><div class="between"><a class="back only-narrow" href="#t-messages">${ic('arrowL', 16)} All messages</a><a class="btn btn-secondary btn-sm" href="${H('t', 'req', cur.id)}">Open request <span class="mono">${cur.id}</span> ${ic('arrowR', 15)}</a></div>${chat(cur, 't', true)}</div>` : ''}
  </div>`, '', 'Inbox');
}
function tCatalogue() {
  const shown = SERVICES.filter(id => S.catalog[id].visible).length;
  return tShell('catalogue', 'Catalogue', `<div class="greet"><div class="grow"><h2>What customers see</h2><p class="txt" style="max-width:640px">Turn a service on or off, change its words and choose which sample pages to show. Changes go live straight away. No developer needed.</p></div><span class="promise">${ic('eye', 15)} <b>${shown} of ${SERVICES.length}</b> shown on the site</span></div>
  <div class="cat-list">${SERVICES.map(id => { const s = SVC[id], c = S.catalog[id]; return `<div class="cat sw-${id}${c.visible ? '' : ' off'}">
    <div class="vis twill ${s.comp}"><span class="status-tag">${c.visible ? 'Live' : 'Hidden'}</span>${pic(s.pics[0], 'v va')}${pic(s.pics[1], 'v vb')}</div>
    <div class="cat-body"><div class="ph"><div class="row" style="gap:12px"><span class="svc-ic sm">${ic(s.icon, 17)}</span><div style="display:grid;gap:4px"><h2 class="t-h3" style="font-size:1.25rem">${s.name}</h2><span class="svc-cat">${s.cat}</span></div></div><label class="vis-toggle">${c.visible ? 'Shown on the site' : 'Hidden'}<button class="switch" role="switch" aria-checked="${c.visible}" aria-label="Show ${s.name} on the site" data-act="cat-vis" data-svc="${id}"></button></label></div>
    <div class="cat-words"><span class="q">“${esc(c.promise)}”</span><span class="r">${ic('clock', 13)} ${esc(c.ready)}</span></div>
    <div><b style="display:block;margin-bottom:10px;font-size:.875rem;font-weight:600">Sample pages customers can open <span class="mono" style="color:var(--ink-3);font-weight:400">${c.samples.length}</span></b><div class="samples">${c.samples.map((x, i) => `<div class="sample"><span class="sf">${pic(x.pic)}</span><span class="l">${esc(x.title)}</span><button class="rm" data-act="cat-rm" data-svc="${id}" data-i="${i}" aria-label="Remove ${esc(x.title)}">${ic('x', 13)}</button></div>`).join('')}<div class="sample add"><button class="sf" data-act="cat-add-open" data-svc="${id}" aria-label="Add a sample">${ic('plus', 22)}</button><span class="l">Add a sample</span></div></div></div>
    <div class="row" style="gap:8px"><button class="btn btn-secondary btn-sm" data-act="cat-edit" data-svc="${id}">${ic('edit', 15)} Change the words</button><button class="btn btn-ghost btn-sm" data-act="cat-view" data-svc="${id}">${ic('eye', 15)} See it as a customer</button></div></div></div>`; }).join('')}</div>`, '', 'Customer site');
}
function tCustomers() {
  const by = {};
  S.reqs.forEach(r => { const k = r.customer.name; (by[k] = by[k] || { c: r.customer, n: 0, last: 0, open: 0 }); by[k].n++; if (!['delivered', 'cancelled'].includes(r.status)) by[k].open++; by[k].last = Math.max(by[k].last, r.updated); });
  const rows = Object.values(by).sort((a, b) => b.last - a.last);
  return tShell('customers', 'Customers', `<div class="greet"><div class="grow"><h2>${rows.length} customers</h2><p class="txt">Everyone who has sent a request, newest activity first.</p></div></div>
  <div class="people cols">${rows.map(x => `<div class="person">${av(x.c.name, 'lg')}<div class="grow"><b>${esc(x.c.name)}</b><span class="s"><span class="mono">${esc(x.c.contact)}</span> · last ${ago(x.last)}</span></div><div class="stat"><b>${x.n}</b><span>${x.open ? `${x.open} open` : 'request' + (x.n > 1 ? 's' : '')}</span></div><button class="btn btn-wa-soft btn-sm" data-act="wa" data-name="${esc(x.c.name)}">${ic('wa', 15)}<span>WhatsApp</span></button></div>`).join('')}</div>`, '', 'People');
}
function tPeople() {
  return tShell('people', 'Team', `<div class="greet"><div class="grow"><h2>Your team</h2><p class="txt" style="max-width:640px">Admins can approve and send files. Workers prepare requests and chat with customers.</p></div><button class="btn btn-primary" data-act="invite">${ic('plus', 17)} Invite a team member</button></div>
  <div class="people">${TEAM.map(m => { const n = S.reqs.filter(r => r.assignee === m.id && !['delivered', 'cancelled'].includes(r.status)).length; return `<div class="person">${tav(m, 'lg')}<div class="grow"><b>${m.name}${m.id === S.team ? ' <span class="micro">(you)</span>' : ''}</b><span class="s mono">${m.email}</span></div><div class="stat"><b>${n}</b><span>open request${n === 1 ? '' : 's'}</span></div><span class="pill ${m.role === 'Admin' ? 'p-preview' : 'p-work'}">${m.role}</span></div>`; }).join('')}</div>`, '', 'People');
}
function tSettings() {
  const st = S.settings;
  return tShell('settings', 'Settings', `<div class="panel" style="max-width:720px"><div><h2>What customers are promised</h2><p class="small" style="margin-top:4px">These words appear on the customer site.</p></div>
    <label class="fieldset"><span class="label">First reply within</span><input class="input" id="set-reply" value="${esc(st.reply)}"></label>
    <label class="fieldset"><span class="label">Working hours</span><input class="input" id="set-hours" value="${esc(st.hours)}"></label>
    <label class="fieldset"><span class="label">WhatsApp business number</span><input class="input" id="set-wa" value="${esc(st.wa)}" inputmode="tel"></label>
    <div><button class="btn btn-primary" data-act="settings-save">Save changes</button></div></div>
  <div class="panel" style="max-width:720px"><h2>How customers are told about updates</h2><div>${[['Email', 'Free. Always on.', true], ['Text message (SMS)', 'Costs a little per message.', true], ['WhatsApp', 'Needs a WhatsApp Business account.', false]].map(([l, s, on]) => `<div class="set-row"><span class="grow"><b>${l}</b><span class="s">${s}</span></span><button class="switch" role="switch" aria-checked="${on}" aria-label="${l}" data-act="flip"></button></div>`).join('')}</div></div>`, '', 'Manage');
}

/* ---------- modals ---------- */
function studioModal(r) {
  const a = r.answers, rows = answerRows(r.svc, a).filter(x => x[1]);
  const lastC = [...r.msgs].reverse().find(m => m.from === 'c' && m.text);
  const goals = { new: 'demand in a new market', comp: 'competitors', cust: 'customers', price: 'prices' };
  const g = [].concat(a.goal || []).map(x => goals[x]), place = [a.city || (lastC ? lastC.text.replace(/[,.].*$/, '') : ''), a.country].filter(Boolean).join(', ');
  const brief = r.svc === 'market' ? `${g.join(' and ').replace(/^./, c => c.toUpperCase())}${a.industry ? ` for ${a.industry.toLowerCase()}` : ''} in ${place}.${a.company ? ` Prepared for ${a.company}.` : ''}` : summary(r);
  return `${mHead(`Open in Studio: ${SVC[r.svc].name}`, 'The tool opens with these answers filled in. Check them and press Start, as you do today. The customer never sees Studio.', 'external')}
  <div class="fields-map">${rows.map(([l, v]) => `<div><span>${esc(l)}</span><b style="font-weight:500">${esc(v)}</b></div>`).join('')}${lastC ? `<div><span>From the chat</span><b style="font-weight:500">“${esc(lastC.text)}”</b></div>` : ''}</div>
  <label class="fieldset"><span class="label">Brief for the tool <span class="opt">(you can edit it)</span></span><textarea class="textarea brief" id="studio-brief">${esc(brief)}</textarea></label>
  <div class="modal-actions"><button class="btn btn-secondary" data-act="copy">${ic('file', 16)} Copy all</button><button class="btn btn-primary" data-act="studio-go" data-id="${r.id}">${ic('external', 17)} Open ${SVC[r.svc].name} in Studio</button></div>`;
}
function attachModal(r) {
  const other = { market: 'Andes Pharma', manuals: 'Grupo Sol', courses: 'Banco Sur', economy: 'Clínica Norte', reels: 'Café Alto' }[r.svc];
  return `${mHead('Attach the finished files', 'Pick the Studio run for this request. Its files are attached and cover pages are made from them.', 'clip')}
  <div class="runs"><button class="run" data-act="attach" data-id="${r.id}"><span class="svc-ic sm sw-${r.svc}">${ic(SVC[r.svc].icon, 17)}</span><span class="grow"><b>${SVC[r.svc].name} · ${esc(r.answers.company || r.answers.brand || r.customer.name)}</b><span class="s">Finished just now · ${SVC[r.svc].deliver.length} files</span></span><span class="run-match">Matches</span></button>
  <button class="run" data-act="wrong-run"><span class="svc-ic sm sw-${r.svc}">${ic(SVC[r.svc].icon, 17)}</span><span class="grow"><b>${SVC[r.svc].name} · ${other}</b><span class="s">Finished yesterday · ${SVC[r.svc].deliver.length} files</span></span></button></div>
  <label class="drop"><input type="file" multiple data-file="upload-files" data-id="${r.id}"><span class="di">${ic('upload', 22)}</span><span><b>Or upload files from your computer</b><span class="hint">If you made or fixed a file by hand.</span></span></label>`;
}
function approveModal(r) {
  return `${mHead(`Send the files to ${esc(first(r.customer.name))}?`, `${esc(r.customer.name)} gets a message${r.customer.via === 'email' ? ' and an email' : ' and a text message'}. The files appear in their account and can be downloaded as one ZIP.`, 'send')}
  <div class="files">${r.files.map(f => `<div class="frow">${fbadge(f.kind, true)}<span class="grow"><b>${esc(f.name)}</b><span class="s">${KIND[f.kind]} · ${f.size}</span></span></div>`).join('')}</div>
  ${r.feedback === 'good' ? `<div class="alertline ok">${ic('thumb', 16)} The customer said the covers look good.</div>` : `<div class="alertline">${ic('info', 16)} The customer has not commented on the covers yet. You can still send.</div>`}
  <div class="modal-actions"><button class="btn btn-secondary" data-act="close">Not yet</button><button class="btn btn-primary" data-act="approve-yes" data-id="${r.id}">${ic('send', 17)} Approve and send</button></div>`;
}
function waModal(name, number, text, team, id) {
  return `${mHead(team ? `WhatsApp ${esc(name)}` : 'Chat with us on WhatsApp', team ? 'Opens WhatsApp on this computer or phone with a message ready. You press send.' : 'Opens WhatsApp with a message ready. You press send.', 'wa')}
  <div class="card pad stack" style="gap:8px;background:var(--wa-soft);border-color:var(--wa-line);box-shadow:none"><span class="micro">${team ? 'Their number' : 'Our number'}</span><b class="mono" style="font-size:1.125rem">${esc(number)}</b><span class="micro" style="margin-top:6px">Message ready to send</span><b style="font-weight:500">“${esc(text)}”</b></div>
  <div class="modal-actions">${team && id ? `<button class="btn btn-secondary" data-act="wa-share" data-id="${id}">${ic('chat', 16)} Share our number in the chat</button>` : ''}<button class="btn btn-wa" data-act="wa-go" data-num="${esc(number)}" data-text="${esc(text)}">${ic('wa', 17)} Open WhatsApp</button></div>`;
}
function pickModal(svc) {
  const have = S.catalog[svc].samples.map(s => s.pic);
  return `${mHead('Add sample pages', 'Choose pages from finished work. In the real site you can also upload your own pictures.', 'image')}
  <div class="pick-grid">${Object.keys(PICS).filter(k => !have.includes(k)).map(k => `<button class="pick" aria-pressed="${U.picks.includes(k)}" data-act="pick2" data-k="${k}"><span class="sf">${pic(k)}</span><span class="l">${esc(PICS[k].label)}</span></button>`).join('')}</div>
  <div class="modal-actions"><button class="btn btn-secondary" data-act="close">Cancel</button><button class="btn btn-primary" data-act="cat-add" data-svc="${svc}">${ic('plus', 17)} Add ${U.picks.length || ''} selected</button></div>`;
}

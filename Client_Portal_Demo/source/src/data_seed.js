const hasTell = (t) => t && (t.voice || (t.text || '').trim().length > 20 || (t.files || []).length);

const TEAM = [
  { id: 'sam', name: 'Sam', role: 'Admin', email: 'sam@team.example' },
  { id: 'rohan', name: 'Rohan', role: 'Worker', email: 'rohan@team.example' },
  { id: 'priya', name: 'Priya', role: 'Worker', email: 'priya@team.example' },
];

const QUICK_ASK = ['Which city or region should we focus on?', 'Could you send us your logo?', 'Who will read this document?', 'Thanks! We have started on your request.'];

/* Seed requests from other customers, so the team side looks like a working day. */
function seedRequests(now) {
  const m = 60e3, h = 60 * m, d = 24 * h;
  return [
    { id: 'R-1041', svc: 'courses', status: 'new', created: now - 52 * m, updated: now - 52 * m, assignee: null, mine: false,
      customer: { name: 'Daniel Pérez', contact: '+52 55 1234 5678', via: 'phone' },
      answers: { aim: 'sell', who: ['Sales team'], level: 'Some experience', sessions: '2', length: '1½ hours', lang: 'Spanish', company: 'Grupo Andino' },
      msgs: [{ from: 'sys', text: 'Request sent', t: now - 52 * m }], files: [], notes: [] },
    { id: 'R-1040', svc: 'reels', status: 'question', created: now - 5 * h, updated: now - 3 * h, assignee: 'priya', mine: false,
      customer: { name: 'Sofía Reyes', contact: 'sofia@luma.example', via: 'email' },
      answers: { photos: [{ name: 'serum-bottle.jpg', size: '2.4 MB' }], mood: ['Premium', 'Calm'], where: ['Instagram'], brand: 'Luma Skin', lang: 'Spanish', when: 'Within a week' },
      msgs: [{ from: 'sys', text: 'Request sent', t: now - 5 * h }, { from: 'team', who: 'Priya', text: 'Hi Sofía! Could you send a photo of the serum on a plain background? It gives a much cleaner film.', t: now - 3 * h }], files: [], notes: [] },
    { id: 'R-1039', svc: 'economy', status: 'making', created: now - 1 * d, updated: now - 2 * h, assignee: 'sam', mine: false,
      customer: { name: 'Andrés Molina', contact: '+57 300 555 0199', via: 'phone' },
      answers: { country: 'Colombia', industry: 'Health and pharma', company: 'Clínica Norte', decision: ['budget', 'prices'], lang: 'Spanish', when: 'Within a week' },
      msgs: [{ from: 'sys', text: 'Request sent', t: now - 1 * d }, { from: 'team', who: 'Sam', text: 'Thanks Andrés, we have started on your study.', t: now - 2 * h }], files: [], notes: [{ who: 'Sam', text: 'Run started in Studio, check sources section before approving.', t: now - 2 * h }] },
    { id: 'R-1037', svc: 'manuals', status: 'preview', created: now - 2 * d, updated: now - 40 * m, assignee: 'rohan', mine: false, previews: true,
      customer: { name: 'Laura Gómez', contact: 'laura@northwind.example', via: 'email' },
      answers: { area: 'buy', tell: { voice: 74, transcript: 'We receive purchase requests by email, the manager approves anything over 5,000...' }, team: '6 to 20', depth: 'Very detailed, for audits', company: 'Northwind Industrial', lang: 'English' },
      msgs: [{ from: 'sys', text: 'Request sent', t: now - 2 * d }, { from: 'team', who: 'Rohan', text: 'Your manual is ready for a last check. You can see the cover pages now.', t: now - 40 * m }],
      files: SVC.manuals.deliver.map(f => ({ name: f[0], kind: f[1], size: f[2], pic: f[3] })), notes: [] },
    { id: 'R-1033', svc: 'market', status: 'delivered', created: now - 4 * d, updated: now - 3 * d, assignee: 'sam', mine: false, previews: true,
      customer: { name: 'Carmen Ruiz', contact: '+56 9 8765 4321', via: 'phone' },
      answers: { goal: ['new'], country: 'Chile', city: 'Concepción', company: 'Norte Foods', lang: 'English', when: 'No rush' },
      msgs: [{ from: 'sys', text: 'Request sent', t: now - 4 * d }, { from: 'sys', text: 'Files sent to Carmen', t: now - 3 * d }],
      files: SVC.market.deliver.map(f => ({ name: f[0], kind: f[1], size: f[2], pic: f[3] })), notes: [] },
  ];
}

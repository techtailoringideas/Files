/* Content and seed data for the prototype. Real pages come from past runs; the
   images are inlined at build time so the demo is one file that works offline. */

const IMG = {
/*__IMG__*/
};

/* Every picture the site can show, with its shape: 'p' portrait page, 'w' wide slide/chart, 'r' 9:16 film.
   'screen' marks a slide, shown inside a thin presentation frame. */
const PICS = {
  mr_cover: { shape: 'p', label: 'Market report, cover' },
  mr_action: { shape: 'p', label: 'Action plan, cover' },
  mr_deck: { shape: 'w', label: 'Slide summary, first slide', screen: true },
  mr_slide: { shape: 'w', label: 'Slide with a price chart', screen: true },
  co_cover: { shape: 'w', label: 'Session 1 slides, cover', screen: true },
  co_slide: { shape: 'w', label: 'Inside slide, a 3-step model', screen: true },
  pm_cover: { shape: 'p', label: 'Process manual, cover' },
  pm_flow: { shape: 'w', label: 'Flowchart from the manual' },
  me_cover: { shape: 'p', label: 'Impact report, cover' },
  me_summary: { shape: 'p', label: 'The study at a glance' },
  reel_a: { shape: 'r', label: 'Coffee brand film' },
  reel_b: { shape: 'r', label: 'Skincare film' },
};

const SERVICES = ['market', 'manuals', 'courses', 'economy', 'reels'];

/* gets: [file kind, name, long description, short size for the catalogue card] */
const SVC = {
  market: {
    name: 'Market Research', icon: 'chart', comp: 'comp-mixed', pics: ['mr_cover', 'mr_deck'], big: true, cat: 'Plan and grow',
    promise: 'Know your market before you spend money on it.',
    lead: 'A researched report on any market or city, a short slide summary for your team, and a clear plan of what to do next.',
    goodFor: ['Opening in a new city or country', 'Checking what competitors sell and charge', 'Preparing a plan for partners, a bank or your board'],
    gets: [['pdf', 'Market report', 'PDF · about 25 to 45 pages', '25–45 pages'], ['ppt', 'Slide summary', 'PowerPoint · about 15 to 20 slides', '15–20 slides'], ['pdf', 'Action plan', 'PDF · 5 to 8 pages', '5–8 pages']],
    ready: 'About 1 working day',
    sampleNote: 'Real pages from a report we made for a sample company.',
    deliver: [['Market report.pdf', 'pdf', '2.1 MB', 'mr_cover'], ['Slide summary.pptx', 'ppt', '3.4 MB', 'mr_deck'], ['Action plan.pdf', 'pdf', '0.6 MB', 'mr_action']],
  },
  manuals: {
    name: 'Process Manuals', icon: 'flow', comp: 'comp-mixed', pics: ['pm_cover', 'pm_flow'], big: true, cat: 'Organise',
    promise: 'Put the way your company works on paper.',
    lead: 'A professional procedures manual with flowcharts, roles, risks and controls. Ready for audits, training and new staff.',
    goodFor: ['Getting ready for an audit or ISO', 'Training new staff faster', 'Making sure work is done the same way every time'],
    gets: [['pdf', 'Procedures manual', 'PDF and Word · about 30 to 45 pages', '30–45 pages'], ['excel', 'Review workbook', 'Excel · to check and approve', 'Excel'], ['flow', 'Flowcharts', 'One for every procedure', 'One per step']],
    ready: 'About 1 working day',
    sampleNote: 'Real pages from a manual we made for a sample company.',
    deliver: [['Process manual.pdf', 'pdf', '1.2 MB', 'pm_cover'], ['Process manual.docx', 'word', '0.4 MB', null], ['Review workbook.xlsx', 'excel', '0.1 MB', null], ['Flowcharts.zip', 'flow', '0.4 MB', 'pm_flow']],
  },
  courses: {
    name: 'Course Builder', icon: 'book', comp: 'comp-wide', pics: ['co_cover', 'co_slide'], cat: 'Train',
    promise: 'Train your team with a course that is ready to teach.',
    lead: 'A complete training course: designed slides for every session, a workbook for each participant and a plan for the trainer.',
    goodFor: ['Onboarding new staff', 'Training sales or customer teams', 'Building leadership skills'],
    gets: [['ppt', 'Slides for each session', 'PowerPoint', 'PowerPoint'], ['word', 'Participant workbooks', 'Word', 'Word'], ['word', 'Course plan', 'Word · for the trainer', 'For the trainer']],
    ready: 'About 1 working day',
    sampleNote: 'Real slides from courses we made.',
    deliver: [['Session 1 slides.pptx', 'ppt', '4.8 MB', 'co_cover'], ['Session 2 slides.pptx', 'ppt', '4.5 MB', 'co_slide'], ['Workbooks.docx', 'word', '0.7 MB', null], ['Course plan.docx', 'word', '0.3 MB', null]],
  },
  economy: {
    name: 'Economic Study', icon: 'globe', comp: 'comp-portrait', pics: ['me_cover', 'me_summary'], cat: 'Plan ahead',
    promise: 'What the economy means for your business.',
    lead: 'A country’s economic outlook from official sources, and what it means for your prices, costs and plans.',
    goodFor: ['Planning next year’s budget', 'Setting prices when costs move', 'Deciding whether to enter a country'],
    gets: [['pdf', 'Impact report', 'PDF and Word · about 40 pages', '≈ 40 pages'], ['pdf', 'Risks and opportunities', 'PDF and Word', 'PDF + Word'], ['excel', 'Key figures', 'Excel workbook', 'Excel']],
    ready: 'About 1 working day',
    sampleNote: 'Real pages from a study we made.',
    deliver: [['Impact report.pdf', 'pdf', '3.0 MB', 'me_cover'], ['Risks and opportunities.pdf', 'pdf', '0.9 MB', null], ['Key figures.xlsx', 'excel', '0.2 MB', null]],
  },
  reels: {
    name: 'Ad Reels', icon: 'film', comp: 'comp-phone', pics: ['reel_a', 'reel_b'], cat: 'Promote',
    promise: 'A short video ad from one photo of your product.',
    lead: 'Send us a photo of your product. We turn it into a vertical video ad, ready for Instagram, TikTok, Facebook and WhatsApp Status.',
    goodFor: ['Launching a new product', 'Posting more often without a film crew', 'Ads for social media'],
    gets: [['video', 'Vertical video', 'MP4 · 9:16, ready to post', '15 s · 9:16']],
    ready: 'Usually the same day',
    sampleNote: 'Example films. Your real films will be shown here.',
    deliver: [['Video ad.mp4', 'video', '6.2 MB', 'reel_a']],
  },
};

/* "What do you need help with?" on the services page: each need points at the services that fit it. */
const NEEDS = [
  ['newplace', 'Selling in a new place', ['market', 'economy']],
  ['rivals', 'Checking my competitors', ['market']],
  ['process', 'Writing down how we work', ['manuals']],
  ['train', 'Training my team', ['courses']],
  ['budget', 'Planning next year', ['economy']],
  ['promo', 'Promoting a product', ['reels']],
];

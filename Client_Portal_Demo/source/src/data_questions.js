/* Words the customer understands, in order of how often older buyers ask them. */
const FAQ = [
  ['Do I need to create an account?', 'No password, ever. When you send your first request we text or email you a 6-digit code. That is your sign-in.'],
  ['How much does it cost?', 'We confirm the price with you in the chat before we start any work. You never pay for something you did not agree to.'],
  ['How long does it take?', 'Most documents are ready in about one working day. Films are usually ready the same day. You can follow every step in your account.'],
  ['Can I see it before I get it?', 'Yes. You see the cover page of every file first. If something is not right, ask for a change and we fix it.'],
  ['I don’t like typing. Can I just talk?', 'Yes. Every question has a big microphone button. Record a voice message, like on WhatsApp, and our team listens to it.'],
  ['Is my information private?', 'Only you and our team can see your request, your files and your messages. We never show your documents to anyone else.'],
];

/* The request form, one question per screen. Field types: cards, chips, country, text, logo, tell, photos. */
const COUNTRIES_TOP = ['Mexico', 'Colombia', 'Chile', 'Peru', 'Spain', 'United States', 'Nepal', 'India'];
const COUNTRIES_MORE = ['Argentina', 'Australia', 'Brazil', 'Canada', 'Costa Rica', 'Dominican Republic', 'Ecuador', 'France', 'Germany', 'Guatemala', 'Italy', 'Panama', 'Paraguay', 'Portugal', 'United Arab Emirates', 'United Kingdom', 'Uruguay'];
const LANGS = ['English', 'Spanish', 'Portuguese', 'French'];
const WHEN = ['No rush', 'Within a week', 'Urgent'];
const INDUSTRIES = ['Health and pharma', 'Food and drink', 'Retail', 'Manufacturing', 'Technology', 'Services', 'Other'];

const ASK = {
  market: [
    { title: 'What would you like to find out?', help: 'Choose one or more.', fields: [
      { t: 'cards', k: 'goal', multi: true, req: true, opts: [
        ['new', 'A new market', 'Is there demand for my product in a new place?', 'pin'],
        ['comp', 'My competitors', 'Who they are, what they sell and what they charge', 'users'],
        ['cust', 'My customers', 'Who buys, why they buy and how much they spend', 'user'],
        ['price', 'Prices', 'What people pay in this market today', 'tag']] }] },
    { title: 'Which place should we study?', help: 'Pick a country. Add a city if your business is local.', fields: [
      { t: 'country', k: 'country', req: true },
      { t: 'text', k: 'city', label: 'City or region', ph: 'For example: Medellín', opt: true }] },
    { title: 'About your business', help: 'This goes on the cover and shapes the advice. You can skip it.', fields: [
      { t: 'text', k: 'company', label: 'Company name', ph: 'For example: Northwind Foods', opt: true },
      { t: 'chips', k: 'industry', label: 'What does your business do?', opts: INDUSTRIES, opt: true },
      { t: 'logo', k: 'logo' }] },
    { title: 'Anything else we should know?', help: 'Talk, type or add files. You can also skip this step.', fields: [{ t: 'tell', k: 'tell' }] },
    { title: 'Language and timing', help: 'We picked the most common choices for you.', fields: [
      { t: 'chips', k: 'lang', label: 'Language of the report', opts: LANGS, req: true },
      { t: 'chips', k: 'when', label: 'When do you need it?', opts: WHEN, req: true }] },
  ],
  manuals: [
    { title: 'Which part of your company is it for?', help: 'Choose one. You can ask for more areas later.', fields: [
      { t: 'cards', k: 'area', req: true, opts: [
        ['buy', 'Purchasing', 'Buying, suppliers and orders', 'cart'], ['sell', 'Sales', 'Quotes, orders and customers', 'tag'],
        ['fin', 'Finance', 'Payments, invoices and budgets', 'coins'], ['hr', 'People and HR', 'Hiring, onboarding and leave', 'users'],
        ['wh', 'Warehouse', 'Receiving, storing and shipping', 'box'], ['other', 'Something else', 'Tell us in the next step', 'dots']] }] },
    { title: 'How is the work done today?', help: 'Explain it the way you would to a new employee: who does what, and in what order. A voice message is perfect.', fields: [{ t: 'tell', k: 'tell', req: true }] },
    { title: 'How detailed should it be?', help: '', fields: [
      { t: 'chips', k: 'team', label: 'How many people do this work?', opts: ['1 to 5', '6 to 20', '21 to 50', 'More than 50'], req: true },
      { t: 'chips', k: 'depth', label: 'Level of detail', opts: ['Simple', 'Standard', 'Very detailed, for audits'], req: true }] },
    { title: 'Final details', help: 'The company name appears on every page.', fields: [
      { t: 'text', k: 'company', label: 'Company name', ph: 'For example: Northwind Industrial', req: true },
      { t: 'logo', k: 'logo' },
      { t: 'chips', k: 'lang', label: 'Language of the manual', opts: LANGS, req: true }] },
  ],
  courses: [
    { title: 'What should people be able to do after the course?', help: 'Choose the closest one.', fields: [
      { t: 'cards', k: 'aim', req: true, opts: [
        ['lead', 'Lead a team', 'Managers and team leaders', 'users'], ['sell', 'Sell better', 'Sales conversations and closing', 'tag'],
        ['serve', 'Serve customers well', 'Service, complaints and care', 'heart'], ['safe', 'Work safely', 'Safety rules and habits', 'shield'],
        ['tool', 'Use a new process or system', 'Step by step, with practice', 'flow'], ['other', 'Something else', 'Tell us in your own words', 'dots']] }] },
    { title: 'Who is the course for?', help: '', fields: [
      { t: 'chips', k: 'who', label: 'The people taking it', opts: ['New staff', 'Team leaders', 'Managers', 'Sales team', 'Everyone'], multi: true, req: true },
      { t: 'chips', k: 'level', label: 'What do they already know?', opts: ['Beginners', 'Some experience', 'Experienced'], req: true }] },
    { title: 'How long should it be?', help: '', fields: [
      { t: 'chips', k: 'sessions', label: 'Number of sessions', opts: ['1', '2', '3', '4'], req: true },
      { t: 'chips', k: 'length', label: 'Length of each session', opts: ['1 hour', '1½ hours', '2 hours'], req: true }] },
    { title: 'Anything else we should know?', help: 'Topics to include, real situations from your company, anything. Talk, type or add files.', fields: [{ t: 'tell', k: 'tell' }] },
    { title: 'Final details', help: '', fields: [
      { t: 'text', k: 'company', label: 'Company name', ph: 'For the slides', opt: true }, { t: 'logo', k: 'logo' },
      { t: 'chips', k: 'lang', label: 'Language of the course', opts: LANGS, req: true }] },
  ],
  economy: [
    { title: 'Which country should we study?', help: '', fields: [{ t: 'country', k: 'country', req: true }] },
    { title: 'What does your business do?', help: '', fields: [
      { t: 'chips', k: 'industry', label: 'Your industry', opts: INDUSTRIES, req: true },
      { t: 'text', k: 'company', label: 'Company name', ph: 'Goes on the cover', opt: true }] },
    { title: 'What decision should the study help with?', help: 'Choose one or more.', fields: [
      { t: 'cards', k: 'decision', multi: true, req: true, opts: [
        ['budget', 'Next year’s budget', 'Sales, costs and growth to plan for', 'calendar'], ['prices', 'Setting prices', 'When inflation and the currency move', 'tag'],
        ['enter', 'Entering the country', 'Is now a good time?', 'pin'], ['board', 'A board or bank meeting', 'Clear figures from official sources', 'briefcase']] }] },
    { title: 'Do you have your own questions?', help: 'Optional. For example: “Will prices keep rising next year?”', fields: [{ t: 'tell', k: 'tell' }] },
    { title: 'Language and timing', help: 'We picked the most common choices for you.', fields: [
      { t: 'chips', k: 'lang', label: 'Language of the study', opts: LANGS, req: true },
      { t: 'chips', k: 'when', label: 'When do you need it?', opts: WHEN, req: true }] },
  ],
  reels: [
    { title: 'Add a photo of your product', help: 'A clear photo on a plain background works best. A phone photo is fine.', fields: [{ t: 'photos', k: 'photos', req: true }] },
    { title: 'How should the video feel?', help: 'Choose one or more.', fields: [
      { t: 'chips', k: 'mood', label: 'The feeling', opts: ['Premium', 'Fun', 'Calm', 'Bold', 'Trustworthy'], multi: true, req: true },
      { t: 'chips', k: 'where', label: 'Where will you post it?', opts: ['Instagram', 'TikTok', 'Facebook', 'WhatsApp Status'], multi: true, opt: true }] },
    { title: 'What should the video say?', help: 'Your brand name, and one message. For example: “New flavour, out now”.', fields: [
      { t: 'text', k: 'brand', label: 'Brand name', ph: 'For example: Norte Coffee', req: true },
      { t: 'tell', k: 'tell' }] },
    { title: 'Language and timing', help: '', fields: [
      { t: 'chips', k: 'lang', label: 'Language of the words in the video', opts: LANGS, req: true },
      { t: 'chips', k: 'when', label: 'When do you need it?', opts: WHEN, req: true }] },
  ],
};

const DEFAULTS = { lang: 'English', when: 'No rush' };

/* What the team should check before starting, per service. 'ask' = ask the customer, 'info' = fine to go ahead. */
const CHECKS = {
  market: (a) => [
    !a.city && ['ask', 'No city given. The study will cover the whole country unless you ask.', 'Which city or region should we focus on?'],
    !a.company && ['info', 'No company name. The cover will be generic.', 'What name should go on the cover?'],
    !a.logo && ['info', 'No logo. The cover will use the company name only.', 'Could you send us your logo?'],
  ],
  manuals: (a) => [
    !hasTell(a.tell) && ['ask', 'Very little detail about how the work is done.', 'Could you tell us, step by step, how the work is done today? A voice message is perfect.'],
    !a.logo && ['info', 'No logo. Pages will show the company name only.', 'Could you send us your logo?'],
  ],
  courses: (a) => [
    !hasTell(a.tell) && ['ask', 'No details about what the course must cover.', 'Which topics or real situations should the course include?'],
    !a.logo && ['info', 'No logo. Slides will use our neutral design.', 'Could you send us your logo?'],
  ],
  economy: (a) => [
    !a.company && ['info', 'No company name. The study will speak to the industry in general.', 'What name should go on the cover?'],
  ],
  reels: (a) => [
    ['info', 'Check the photo: a plain background gives a cleaner film.', 'Could you send a photo of the product on a plain background?'],
  ],
};

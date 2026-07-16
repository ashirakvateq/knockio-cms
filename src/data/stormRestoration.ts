const base = '/assets/storm-restoration-roofing';
const shared = '/assets/canvassing-app';

export const stormHero = {
  title: 'Close More Storm Jobs',
  titleBreak1: 'Before Your Rep Leaves',
  titleBreak2: 'The Driveway',
  description:
    'Jobs are lost after the rep leaves, photos stuck in camera rolls, agreements buried in texts, and the pipeline goes dark the moment the rep drives away.',
  image: `${base}/restoration-hero.webp`,
  imageWidth: 2560,
  imageHeight: 2044,
  imageAlt: 'Knockio storm restoration roofing workflow dashboard showing territory mapping, damage documentation, and payment tracking',
};

export const stormTrustLogos = [
  { src: `${shared}/google.png`, alt: 'Google reviews' },
  { src: `${shared}/capterra.webp`, alt: 'Capterra reviews' },
  { src: `${shared}/advice.webp`, alt: 'Software Advice reviews' },
  { src: `${shared}/review.webp`, alt: 'Review platform rating' },
];

export const stormCycleCards = [
  {
    title: 'Territory',
    copy: 'Assign streets before reps leave the lot. Zero overlap, any neighborhood, any storm market. When a rep moves on, every door they knocked stays with you.',
    image: `${base}/storm-territory.webp`,
    width: 365,
    height: 285,
  },
  {
    title: 'Damage Documentation',
    copy: 'Photos, notes, and door outcome logged in seconds tied to the lead, not a camera roll or a WhatsApp thread.',
    image: `${base}/storm-document.webp`,
    width: 290,
    height: 272,
  },
  {
    title: 'Sign the Contingency',
    copy: 'Contingency agreed and signed at the door, before the homeowner cools down.',
    image: `${base}/storm-contract.webp`,
    width: 325,
    height: 254,
  },
  {
    title: 'Track Payments / Completion',
    copy: 'ACV received. Depreciation pending. Know exactly where every dollar stands without a spreadsheet on the side.',
    image: `${base}/storm-payment.webp`,
    width: 300,
    height: 245,
  },
];

export const stormTestimonial = {
  quote:
    'The mapping feature is a game changer, it helps us plan routes smarter and cover more ground in less time.',
  name: 'Michael Palmer',
  role: 'Sales Manager \u2013 Modern Roofing',
  image: `${base}/testi.png`,
};

export const workflowGroups = [
  {
    title: 'Field Sales',
    items: [
      { icon: 'MapPin', title: 'Territory Assignment', copy: 'Assign streets and neighborhoods before your reps leave the lot.' },
      { icon: 'Radio', title: 'Live Rep Tracking', copy: 'See every rep\u2019s real-time location and activity on the map.' },
      { icon: 'BarChart3', title: 'Rep Performance', copy: 'Measure doors knocked, leads, conversations, and jobs.' },
      { icon: 'MessageSquare', title: 'Communications', copy: 'Text, call, and email homeowners from one place. All conversations are logged.' },
    ],
  },
  {
    title: 'Restoration Workflow',
    items: [
      { icon: 'Camera', title: 'Damage Documentation', copy: 'Capture photos, videos, notes, and homeowner details in seconds.' },
      { icon: 'FileSignature', title: 'Contingency Signing', copy: 'Legally binding e-signatures captured on-site, even offline.' },
      { icon: 'ClipboardList', title: 'Work Order Creation', copy: 'Convert signed agreements into work orders and jobs with one tap.' },
      { icon: 'FolderOpen', title: 'Document Storage', copy: 'Store photos, contracts, invoices, and all job files tied to one record.' },
    ],
  },
  {
    title: 'Business Control',
    items: [
      { icon: 'DollarSign', title: 'ACV Tracking', copy: 'Track Actual Cash Value payments as soon as they\u2019re received.' },
      { icon: 'TrendingDown', title: 'Depreciation Tracking', copy: 'Track depreciation and final recoverable amounts separately.' },
      { icon: 'LayoutDashboard', title: 'Campaign Reporting', copy: 'Dashboards. See what\u2019s winning campaigns, reps, markets.' },
      { icon: 'CreditCard', title: 'Payment Processing', copy: 'Pay vendors. Collect payments. Every transaction tied to the job.' },
    ],
  },
];

export const stormWorkSteps = [
  {
    image: `${shared}/work-img1.webp`,
    title: 'Guided onboarding on day one',
    copy: 'Most teams are running live campaigns within the hour. We walk you through territory setup, rep accounts, and your first campaign, no consultant needed.',
    width: 713,
    height: 376,
  },
  {
    image: `${shared}/work-img2.webp`,
    title: 'Import your existing data',
    copy: "Bring over lead lists, pre-knocked address data, and customer records via CSV or direct migration. Your history doesn\u2019t disappear when you switch, and it\u2019s never held hostage.",
    width: 713,
    height: 376,
  },
  {
    image: `${shared}/work-img3.webp`,
    title: 'Real support from real people',
    copy: 'Direct access to the team, including the founder. No ticket queues, no offshore tiers, no chatbot. You talk to a person. Most issues are resolved the same day.',
    width: 713,
    height: 376,
  },
];

export const stormPricingPlans = [
  {
    id: 'prospect',
    icon: 'Map',
    packageId: '4',
    title: 'Prospect',
    description: 'For canvassing teams that need territories, routes, presentations, tracking, and field lead capture.',
    price: '$20',
    discountNote: '$25/user for 1\u20134 users',
    cta: 'Start Prospect',
    featured: false,
    features: [
      'Unlimited Territories & Campaigns',
      'Route Planning & Optimization',
      'Pre-Knocked Data (15\u00a2 per address)',
      'Presentations & Real-time Tracking',
      'Digital Contracts & E-Signature',
      'Engage Add-On ($15/number/mo)',
      'Zapier & FlowChef integrations',
    ],
  },
  {
    id: 'growth',
    icon: 'ChartLine',
    packageId: '6',
    title: 'Growth',
    description: 'Canvassing, CRM, jobs, estimates, invoices, payments, and reporting in one platform.',
    price: '$45',
    discountNote: '$60/user for 1\u20134 users',
    cta: 'Start Growth',
    featured: true,
    features: [
      'Full sales-to-payment workflow',
      'Unlimited workspaces',
      'Prospect + full CRM in one platform',
      'Estimates, invoices & vendor billing',
      'Dedicated success manager',
      'Engage Add-On ($15/number/mo)',
      'Zapier & FlowChef integrations',
    ],
  },
  {
    id: 'organize',
    icon: 'Boxes',
    packageId: '5',
    title: 'Organize',
    description: 'For teams that need CRM, pipelines, estimates, work orders, invoices, contracts, and customer records.',
    price: '$30',
    discountNote: '$35/user for 1\u20134 users',
    cta: 'Start Organize',
    featured: false,
    features: [
      'Pipelines & Lead Management',
      'Estimates & Work Orders',
      'Invoices & Payments',
      'Digital Contracts & E-Signature',
      'Email Communication & Permissions',
      'Engage Add-On ($15/number/mo)',
      'Zapier & FlowChef integrations',
    ],
  },
];

export const stormFaqs = [
  {
    question: 'How fast can we go live?',
    answer:
      'Most teams are running live campaigns within the hour \u2014 territory setup, rep accounts, and first campaign included. No consultant, no implementation process.',
  },
  {
    question: 'Will my reps actually use it?',
    answer:
      'Logging a door takes under 10 seconds \u2014 outcome, photo, done. Built for reps moving fast between houses. Most teams have reps logging live the same day.',
  },
  {
    question: 'Is there a contract?',
    answer:
      'No. All plans are month-to-month. No annual commitment, no cancellation fees. No auto-renewal surprises.',
  },
  {
    question: 'How is Knockio different from JobNimbus or AccuLynx?',
    answer:
      'JobNimbus and AccuLynx handle the office side of roofing well \u2014 production, project management, invoicing. Neither owns the door. Knockio starts at the knock: territory assignment, live rep tracking, damage documentation, contingency signing, adjuster gap follow-up, and payment tracking \u2014 all in one platform. JobNimbus outsources canvassing to a separate tool. Knockio builds it natively.',
  },
  {
    question: 'Does Knockio track both insurance payments \u2014 ACV and depreciation?',
    answer:
      'Yes. ACV and depreciation are logged separately against the same job record \u2014 what\u2019s been received, what\u2019s still pending, all in one place. When it\u2019s time to release the depreciation, the completion photos and final invoice are already attached to the job. Submit directly from Knockio. No separate spreadsheet, no chasing reps for payment status.',
  },
  {
    question: 'What happens to our data if a rep leaves mid-season?',
    answer:
      'Every door they knocked, every lead they captured, every note and photo \u2014 it stays in your account. Your pipeline doesn\u2019t walk out the door when they do.',
  },
];

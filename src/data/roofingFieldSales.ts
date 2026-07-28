
const base = '/assets/storm-restoration-roofing';
const shared = '/assets/canvassing-app';
const baseGlob = '/assets/cfw';

export const roofingHero = {
  title: 'The Field Sales',
  titleBreak1: 'Platform Built for',
  titleBreak2: 'Roofing Teams',
  description:
    'You want your first estimate & signed contingency to win. Knockio keeps your team & the job organized. Territory to door to signed agreement. Nothing slows down the close.',
  image: `${base}/restoration-hero.webp`,
  imageWidth: 2560,
  imageHeight: 2044,
  imageAlt: 'Knockio storm restoration roofing workflow dashboard showing territory mapping, damage documentation, and payment tracking',
};

export const roofingTrustLogos = [
  { src: `${baseGlob}/google.webp`, alt: 'Google reviews' },
  { src: `${baseGlob}/capterra.webp`, alt: 'Capterra reviews' },
  { src: `${baseGlob}/advice.webp`, alt: 'Software Advice reviews' },
  { src: `${baseGlob}/review.webp`, alt: 'Review platform rating' },
];

export const roofingCycleCards = [
  {
    title: 'Territory Intelligence',
    copy: 'Know which streets to knock before reps leave the lot. Assign boundaries. Eliminate overlap. Put every rep exactly where the opportunity is. When a rep moves on, every door they knocked stays with you.',
    image: `${baseGlob}/022.webp`,
    width: 365,
    height: 285,
  },
  {
    title: 'Door-to-Commitment Speed',
    copy: 'Log the door and capture damage photos. Secure the signed agreement, a retail estimate or a contingency, before another contractor knocks tomorrow. The window between yes and gone is shorter than most teams think.',
    image: `${baseGlob}/04_3.webp`,
    width: 290,
    height: 272,
  },
  {
    title: 'Full Team Visibility',
    copy: 'Every rep live on the map. Every door logged. Every follow-up tracked. Know who\'s working and who\'s sitting in their car. No need to pick up the phone.',
    image: `${baseGlob}/03_1.webp`,
    width: 325,
    height: 254,
  },
  {
    title: 'Track Payments / Completion',
    copy: 'Retail invoice or split insurance payment, both tracked against the same job, start to finish. ACV received, depreciation pending. Because the second check doesn\'t release itself.',
    image: `${baseGlob}/09.webp`,
    width: 300,
    height: 245,
  },
];

export const roofingTestimonial = {
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

export const roofingWorkSteps = [
  {
    image: `${shared}/work-img1.webp`,
    title: 'Guided onboarding on day one',
    copy: 'Most teams are running live campaigns within the hour. Territory setup, rep accounts, and your first campaign. No consultant, no implementation project. Not days. Not weeks. Within the hour.',
    width: 713,
    height: 376,
  },
  {
    image: `${shared}/work-img2.webp`,
    title: 'Your data comes with you',
    copy: "Lead lists, customer records, and canvassing history import via CSV or direct migration. Your pipeline doesn't restart at zero when you switch. Your data is never held hostage.",
    width: 713,
    height: 376,
  },
  {
    image: `${shared}/work-img3.webp`,
    title: 'Real support from real people',
    copy: 'Direct access to the team, including the founder. No ticket queues, no offshore tiers, no chatbot. You talk to a person. Most issues resolved the same day.',
    width: 713,
    height: 376,
  },
];

export const roofingPricingPlans = [
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

export const roofingFaqs = [
  {
    question: 'Does Knockio work for both retail and insurance roofing jobs?',
    answer:
      'Yes. Retail estimates, invoices, and contingency agreements all run on the same platform. ACV and recoverable depreciation are tracked separately on insurance jobs. Your reps don\'t switch tools based on job type.',
  },
  {
    question: 'How fast can we go live?',
    answer:
      'Most teams are running live campaigns within the hour. Territory setup, rep accounts, and first campaign included. No consultant, no implementation process.',
  },
  {
    question: 'Will my reps actually use it?',
    answer:
      'Logging a door takes under 10 seconds. Outcome, photo, done. Built for reps moving fast between houses. Most teams have reps logging live the same day.',
  },
  {
    question: 'How is Knockio different from JobNimbus or AccuLynx?',
    answer:
      'JobNimbus and AccuLynx manage the production and project side of roofing well. Neither starts at the door. Knockio is built from the knock forward. Territory assignment, live rep tracking, door logging, damage documentation, contingency signing, and payment tracking. One platform. No handoff to a separate canvassing tool.',
  },
  {
    question: 'Is there a contract?',
    answer:
      'No. All plans are month-to-month. No annual commitment, no cancellation fees. No auto-renewal surprises.',
  },
  {
    question: 'What happens to our data if a rep leaves mid-season?',
    answer:
      'Every door they knocked, every lead they captured, every note and photo. It all stays in your account. Your pipeline doesn\'t walk out the door when they do.',
  },
];

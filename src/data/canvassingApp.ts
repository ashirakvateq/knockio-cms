export const assetBaseGlob = '/assets/cfw';
export const assetBase = '/assets/canvassing-app';

export const trustLogos = [
  { src: `${assetBaseGlob}/google.webp`, alt: 'Google reviews' },
  { src: `${assetBaseGlob}/capterra.webp`, alt: 'Capterra reviews' },
  { src: `${assetBaseGlob}/advice.webp`, alt: 'Software Advice reviews' },
  { src: `${assetBaseGlob}/review.webp`, alt: 'Review platform rating' },
];

export const stats = [
  ['1000+', 'Field sales teams running on Knockio'],
  ['12+', 'Verticals built for D2D field sales'],
  ['10 min', 'From signup to your first live campaign.'],
  ['One', 'Platform from the first knock to the payment'],
];

export const featureCards = [
  {
    title: 'No Overlapping Territory. Ever',
    copy: 'Draw unlimited territories and assign streets before reps leave the lot. Run one market or ten from the same account. When a rep moves on, every door they knocked stays with you.',
    image: `${assetBaseGlob}/011.webp`,
    width: 603,
    height: 527,
  },
  {
    title: 'Full Field Visibility.',
    copy: "See every rep's exact location in real time. Every lead shows how far the rep was from the door when they logged it. Know who's working and who's sitting in their car, without picking up the phone.",
    image: `${assetBaseGlob}/03_1.webp`,
    width: 843,
    height: 561,
  },
  {
    title: 'Every Door Gets a Record',
    copy: "Outcome, photo, notes logged in under 10 seconds. Not home becomes a scheduled callback before the rep steps off the porch. If the rep forgets, the system doesn't.",
    image: `${assetBaseGlob}/04_1.webp`,
    width: 718,
    height: 553,
  },
  {
    title: 'Get It Signed at the Door',
    copy: 'Estimate built at the door. Agreement signed on the phone before the rep leaves. The deal is locked while a competitor is still knocking.',
    image: `${assetBaseGlob}/07_1.webp`,
    width: 634,
    height: 459,
  },
];

export const platformColumns = [
  {
    title: 'Canvass',
    items: ['Unlimited territories and campaigns', 'Custom boundaries, multiple markets, one account', 'Pre-knocked data import', 'Territory assignment per rep or team'],
  },
  {
    title: 'Capture',
    items: ['Outcome logging in under 10 seconds', 'Photo capture at the door', 'Not-homes become scheduled callbacks','Follow-up runs automatically on every lead'],
  },
  {
    title: 'Track',
    items: ['Live GPS rep tracking on a shared map', 'Color-coded statuses you define','Lead proximity, measured in feet, on every lead','Custom reports and granular permissions'],
  },
  {
    title: 'Close',
    items: ['Branded estimate builder, sent from the driveway', 'Digital contracts signed, at the door','Collect on-site and remote payments', 'Invoices and payment status, every job'],
  },
];

export const fullStackItems = [
  'Assign and manage unlimited territories from the admin dashboard',
  'Track reps live on a shared map, no check-in calls needed',
  'See how far a rep was from the door on every lead they log',
  'Log door outcomes, photos, and notes from the field in seconds',
  'Turn a not-home into a scheduled callback before the rep walks away',
  'Trigger tasks, texts, and emails automatically as leads move stage',
  'Send branded estimates from the driveway, collect payment on the spot',
  'Set permissions by role and run reports by rep, territory, or campaign',
  'Your data stays with your company, not with your reps'
];

export const workSteps = [
  {
    image: `${assetBase}/work-img1.webp`,
    title: 'Guided onboarding on day one',
    copy: 'Guided onboarding on day one. Most teams are running live campaigns within the hour. We walk you through territory setup, rep accounts, and your first campaign, no consultant needed.',
    width: 713,
    height: 376,
  },
  {
    image: `${assetBase}/work-img2.webp`,
    title: 'Import your existing data',
    copy: "Import your existing data. Bring over lead lists, pre-knocked address data, and customer records via CSV or direct migration. Your history doesn't disappear when you switch, and it never gets held hostage.",
    width: 713,
    height: 376,
  },
  {
    image: `${assetBase}/work-img3.webp`,
    title: 'Real support from real people',
    copy: 'Real support from real people. Direct access to the team, including the founder. No ticket queues, no offshore tiers, no chatbot. You talk to a person. Most issues resolved same day.',
    width: 713,
    height: 376,
  },
];

export const pricingPlans = [
  {
    id: 'prospect',
    icon: 'Map',
    packageId: '4',
    title: 'Prospect',
    description: 'For canvassing teams that need territories, routes, presentations, tracking, and field lead capture.',
    price: '$20',
    discountNote: '$25/user for 1-4 users',
    cta: 'Start Prospect',
    featured: false,
    features: [
      'Unlimited Territories & Campaigns',
      'Route Planning & Optimization',
      'Pre-Knocked Data (15 cents per address)',
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
    discountNote: '$60/user for 1-4 users',
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
    discountNote: '$35/user for 1-4 users',
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

export const faqs = [
  {
    question: 'Will my reps actually use it?',
    answer: 'Logging a knock takes under 10 seconds: outcome, photo, done. The app is built for people moving fast between doors. Most teams have reps logging live the same day.',
  },
  {
    question: 'How long does setup take?',
    answer: 'Most teams are live in under 10 minutes. Create your account, add your reps, draw your first territory. No weeks of onboarding. No consultant required.',
  },
  {
    question: 'Is there a contract?',
    answer: 'No. All plans are month-to-month. No annual commitment, no cancellation fees, and no auto-renewal surprises.',
  },
  {
    question: 'How is Knockio different from SalesRabbit or SPOTIO?',
    answer: 'SalesRabbit and SPOTIO stop at the knock. Knockio continues through estimates, contracts, invoices, and payment in the same platform, with no annual contract trap.',
  },
  {
    question: 'What happens to my data if I ever leave?',
    answer: 'It is yours. Export contacts, door records, lead history, and photos at any time. No fees. No runaround.',
  },
  {
    question: 'We already have a CRM. Why switch?',
    answer: 'Most CRMs were never built for reps knocking doors. They have no canvassing, no in-app photos, no signature on the porch. Knockio is the whole thing, not a CRM with field tools bolted on.',
  },
  {
    question: 'Is $20 per user worth it?',
    answer: 'One job that doesn\'t slip is worth more than a year of seats. Your rep got the agreement signed on the porch instead of chasing it for a week.',
  },
  {
    question: 'Can I upgrade to a different plan later?',
    answer: 'Yes. Start with Prospect and move to Growth whenever your team is ready. Nothing locks you into your first choice.',
  }
];

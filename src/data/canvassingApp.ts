export const assetBaseGlob = '/assets/cfw';
export const assetBase = '/assets/canvassing-app';

export const trustLogos = [
  { src: `${assetBase}/google.png`, alt: 'Google reviews' },
  { src: `${assetBase}/capterra.webp`, alt: 'Capterra reviews' },
  { src: `${assetBase}/advice.webp`, alt: 'Software Advice reviews' },
  { src: `${assetBase}/review.webp`, alt: 'Review platform rating' },
];

export const stats = [
  ['1000+', 'Field sales teams running on Knockio'],
  ['12+', 'Verticals built for D2D field sales'],
  ['10 min', 'From signup to your first live campaign.'],
  ['One', 'Platform from the first knock to the payment'],
];

export const featureCards = [
  {
    title: 'No Overlapping Routes. Ever.',
    copy: 'Assign streets before reps leave the lot. When a rep moves on, every door they knocked stays with you.',
    image: `${assetBaseGlob}/01_1.webp`,
    width: 603,
    height: 527,
  },
  {
    title: 'Full Field Visibility',
    copy: "See every rep's exact location in real time. Know who's working and who's sitting in their car, without picking up the phone.",
    image: `${assetBaseGlob}/03_1.webp`,
    width: 843,
    height: 561,
  },
  {
    title: 'Every Door Gets a Record',
    copy: "Outcome, photo, notes logged in under 10 seconds. No leads falling through the cracks because a rep's notes lived in their phone.",
    image: `${assetBaseGlob}/04_1.webp`,
    width: 718,
    height: 553,
  },
  {
    title: 'Estimates, Invoicing, and Payment',
    copy: 'Estimate from the driveway. Signature on the porch. Payment before you leave the block. Not five tools duct-taped together.',
    image: `${assetBaseGlob}/07_1.webp`,
    width: 634,
    height: 459,
  },
];

export const platformColumns = [
  {
    title: 'Canvass',
    items: ['Custom territory boundaries', 'Unlimited campaigns', 'Pre-knocked data import', 'Route assignment per rep'],
  },
  {
    title: 'Capture',
    items: ['Outcome logging in under 10 seconds', 'Photo capture at the door', 'Automatic follow-up task creation', 'Team visibility into open leads'],
  },
  {
    title: 'Track',
    items: ['Live GPS rep tracking and real-time map fill-in', 'Daily rep performance summary', 'Manager dashboard'],
  },
  {
    title: 'Close',
    items: ['Branded estimate builder and mobile digital signature', 'Work order auto-generation', 'On-site and remote payment collection'],
  },
];

export const fullStackItems = [
  'Assign and manage unlimited territories from the admin dashboard',
  'Track reps live on a shared map, no check-in calls needed.',
  'Log door outcomes, photos, and notes from the field app in seconds.',
  'Send branded estimates from the driveway before you move to the next house.',
  'Auto-generate work orders when a job is won, no re-entry.',
  'Collect payment on-site or send a payment link from your phone.',
  'Set permissions for reps, team leads, and office admins separately.',
  'Run performance reports by rep, territory, or campaign.',
  'Your data stays with your company, not with your reps.',
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
    answer: 'SalesRabbit and SPOTIO stop at the knock. Knockio continues through estimates, work orders, invoices, and payment in the same platform, with no annual contract trap.',
  },
  {
    question: 'What happens to my data if I ever leave?',
    answer: 'It is yours. Export contacts, door records, lead history, and photos at any time. No fees. No runaround.',
  },
  {
    question: 'Can I see it before committing?',
    answer: 'Yes. Book a live demo: a real session built around your vertical and team size, not a slide deck or recorded walkthrough.',
  },
];

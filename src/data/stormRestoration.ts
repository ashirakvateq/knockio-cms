const baseGlob = '/assets/cfw';
const base = '/assets/storm-restoration-roofing';

export const stormHero = {
  title: 'Close More Storm Jobs',
  titleBreak1: 'Before Your Rep Leaves',
  titleBreak2: 'The Driveway',
  description:
    `Storm teams don't lose jobs at the door. They lose them in the weeks after. Photos in camera rolls, agreements in texts, a pipeline that goes dark when the rep drives away. Knockio keeps it all on one platform until the last check clears.`,
  image: `${base}/restoration-hero.webp`,
  imageWidth: 2560,
  imageHeight: 2044,
  imageAlt: 'Knockio storm restoration roofing workflow dashboard showing territory mapping, damage documentation, and payment tracking',
};

export const stormTrustLogos = [
  { src: `${baseGlob}/google.webp`, alt: 'Google reviews' },
  { src: `${baseGlob}/capterra.webp`, alt: 'Capterra reviews' },
  { src: `${baseGlob}/advice.webp`, alt: 'Software Advice reviews' },
  { src: `${baseGlob}/review.webp`, alt: 'Review platform rating' },
];

export const stormCycleCards = [
  {
    title: 'Territory',
    copy: 'Assign streets before reps leave the lot. Zero overlap, any neighborhood, any storm market. When a rep moves on, every door they knocked stays with you.',
    image: `${baseGlob}/roofing-asset-1.webp`,
    width: 365,
    height: 285,
  },
  {
    title: 'Damage Documentation',
    copy: 'Photos, notes, and door outcome logged in seconds. Tied to the lead, not a camera roll or a WhatsApp thread. The evidence your adjuster needs, captured at the door.',
    image: `${baseGlob}/stormrestore-asset-2.webp`,
    width: 290,
    height: 272,
  },
  {
    title: 'Sign the Contingency on the Porch',
    copy: 'Contingency agreed and signed at the door, with photos and scope already attached to the job.',
    image: `${baseGlob}/stormrestore-asset-3.webp`,
    width: 325,
    height: 254,
  },
  {
    title: 'Track Payments',
    copy: 'ACV received. Depreciation pending. Know exactly where every dollar stands without a spreadsheet on the side. Because the second check doesn\'t release itself.',
    image: `${baseGlob}/roofing-asset-4.webp`,
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
    title: 'Canvass',
    items: [
      { icon: 'MapPin', title: 'Territory Assignment', copy: 'Unlimited territories and storm campaigns' },
      { icon: 'Radio', title: 'Live Rep Tracking', copy: 'Assign streets before reps leave the lot' },
      { icon: 'BarChart3', title: 'Rep Performance', copy: 'Pre-knocked and storm-hit address import' },
      { icon: 'MessageSquare', title: 'Communications', copy: 'Live rep tracking on a shared map.' },
    ],
  },
  {
    title: 'Document',
    items: [
      { icon: 'Camera', title: 'Damage Documentation', copy: 'Damage photos and video logged in seconds' },
      { icon: 'FileSignature', title: 'Contingency Signing', copy: 'Notes and homeowner details tied to the lead' },
      { icon: 'ClipboardList', title: 'Adjuster Gap Follow-Up', copy: 'Everything attached before the rep leaves the street' },
      { icon: 'FolderOpen', title: 'Your Crew Already Knows the Job', copy: 'Photos ready for the adjuster before he arrives' },
    ],
  },
  {
    title: 'Close and Wait',
    items: [
      { icon: 'DollarSign', title: 'ACV Tracking', copy: 'Contingency signed at the door' },
      { icon: 'TrendingDown', title: 'Depreciation Tracking', copy: 'Automated follow-up on a schedule, not memory' },
      { icon: 'LayoutDashboard', title: 'Campaign Reporting', copy: 'Appointments and reminders tied to the job' },
      { icon: 'CreditCard', title: 'Payment Processing', copy: 'Job status visible to the whole team' },
    ],
  },
  {
    title: 'Collect',
    items: [
      { icon: 'DollarSign', title: 'ACV Tracking', copy: 'ACV logged the day it lands' },
      { icon: 'TrendingDown', title: 'Depreciation Tracking', copy: 'Depreciation tracked separately on the same job' },
      { icon: 'LayoutDashboard', title: 'Campaign Reporting', copy: 'Completion photos and final invoice attached, ready to submit' },
      { icon: 'CreditCard', title: 'Payment Processing', copy: 'Every dollar in and still owed, on one record' },
    ],
  },
];


export const stormRestorationChecklist= [
  "Assign and manage unlimited territories from the admin dashboard",
  "Track reps live on a shared map, no check-in calls needed",
  "Log damage photos, video, and notes from the field in second",
  "Get the contingency signed at the door, even without signal",
  "Keep every job moving while the claim works its way through",
  "Hand the crew a job that already has photos, scope, and signed docs",
  "Track ACV and depreciation separately against the same job",
  "Submit completion photos and the final invoice without chasing anyone",
  "Run reports by rep, territory, or storm campaign"
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
      'Most teams are running live campaigns within the hour. Territory setup, rep accounts, and first campaign included. No consultant, no implementation process.',
  },
  {
    question: 'Will my reps actually use it?',
    answer:
      'Logging a door takes under 10 seconds. Outcome, photo, done.',
  },
  {
    question: 'Is there a contract?',
    answer:
      'No. All plans are month-to-month. No annual commitment, no cancellation fees. No auto-renewal surprises.',
  },
  {
    question: 'How is Knockio different from JobNimbus or AccuLynx?',
    answer:
      'JobNimbus and AccuLynx handle the office side of roofing well. Production, project management, invoicing. Neither owns the door. Knockio starts at the knock. Territory assignment, live rep tracking, damage documentation, contingency signing, automated follow-up, and two payment tracking. One platform. JobNimbus outsources canvassing to a separate tool. Knockio builds it natively.',
  },
  {
    question: 'Does Knockio track both insurance payments, ACV and depreciation?',
    answer:
      'Yes. ACV and depreciation are logged separately against the same job. What\'s been received, what\'s still pending. All in one place. When it\u2019s time to release the depreciation, the completion photos and final invoice are already attached to the job. Submit directly from Knockio. No separate spreadsheet, no chasing reps for payment status.',
  },
  {
    question: 'What happens to our data if a rep leaves mid-season?',
    answer:
      'Every door they knocked, every lead they captured, every note and photo. It all stays in your account. Your pipeline doesn\u2019t walk out the door when they do.',
  },
];

export const assetBaseGlob = '/assets/cfw';
export const assetBase = '/assets/canvassing-app';

export const trustLogos = [
  { src: `${assetBaseGlob}/google.webp`, alt: 'Google reviews' },
  { src: `${assetBaseGlob}/capterra.webp`, alt: 'Capterra reviews' },
  { src: `${assetBaseGlob}/advice.webp`, alt: 'Software Advice reviews' },
  { src: `${assetBaseGlob}/review.webp`, alt: 'Review platform rating' },
];

export const stats = [
  ['Published', 'Pricing on the site. No sales call required.'],
  ['12+', 'Trades built for field service'],
  ['1 day', 'From signup to dispatching live, with onboarding help'],
  ['One', 'Platform from the booked call to the paid invoice'],
];

export const featureCards = [
  {
    title: 'The Whole Week on One Board',
    copy: 'Drag a job onto a tech and he sees it on his phone before you put the receiver down. Move a job and the tech, the customer, and the work order all update together. No whiteboard, no three phone calls to find out who is free.',
    image: `${assetBaseGlob}/hvac-image1.webp`,
    width: 603,
    height: 527,
  },
  {
    title: "Plan the Day's Route, Then Watch It Run",
    copy: "Sequence the day's stops so techs spend less time between jobs. Assign the route and watch it play out on the map in real time. When a customer calls asking about arrival, you have an answer without radioing the truck.",
    image: `${assetBaseGlob}/hvac-image2.webp`,
    width: 843,
    height: 561,
  },
  {
    title: 'Set the Maintenance Plan Once',
    copy: "Subscribe a customer to a plan and the visits generate themselves for as long as they stay on it. Spring and fall tune-ups land on the schedule without anyone opening a calendar in March.",
    image: `${assetBaseGlob}/hvac-image3.webp`,
    width: 718,
    height: 553,
  },
  {
    title: 'Invoice Before You Leave the Driveway',
    copy: 'Build the invoice from the completed work order. Send it before you start the truck. Collect payment on site or by link. The job finished today and so did the paperwork.',
    image: `${assetBaseGlob}/hvac-image4.webp`,
    width: 634,
    height: 459,
  },
];

export const platformColumns = [
  {
    title: 'Schedule',
    items: ['Unlimited jobs, techs, and service calls', 'Recurring visits that generate themselves from a subscription', 'Customer records and full job history on every call', 'Week, day, and map views on one board'],
  },
  {
    title: 'Dispatch',
    items: ['Drag and drop assignment in seconds', "Optimize the day's route, then assign it", 'Live GPS tracking on a shared map','Techs see scope, parts, and history before they leave'],
  },
  {
    title: 'Complete',
    items: ['Work orders with parts, scope, and checklists', 'Photos and notes logged from the driveway', 'Reusable line items, build a service once and use it on every estimate', 'Estimates built and approved on site', 'Product and inventory tracking per job'],
  },
  {
    title: 'Invoice',
    items: ['Invoice built from the completed work order', 'Sent the same day the job is done' , 'Collect on-site and remote payments' , 'Payment status tied to every job'],
  },
];

export const fullStackItems = [
  "Schedule and dispatch every job from one board",
  "Optimize the day's route and assign it to the right tech",
  "Track techs live on a shared map, no check-in calls needed",
  "Set a customer on a maintenance plan and let the visits generate themselves",
  "Send the job with scope, parts, and history attached", 
  "Log photos, notes, and parts used from the driveway",
  "Build the line item once, then reuse it on every estimate after that",
  "Get approval on estimates while the tech is on site",
  "Invoice from the completed work order the same day",
  "Collect payment on site or send a link"
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
    copy: 'Real support from real people. Get help from the people who build and run Knockio. No chatbots, no ticket queues, no handoffs between tiers. You talk to a person who can actually fix it. Most issues resolved the same day.',
    width: 713,
    height: 376,
  },
];

export const pricingPlans = [
  {
    id: 'organize',
    icon: 'Boxes',
    packageId: '5',
    title: 'Organize',
    description:
      'For field service teams managing jobs, billing, and customer records.',
    price: '$30',
    discountNote: '$35/user/mo for 1–4 users',
    cta: 'Start Organize',
    featured: false,
    features: [
      'Pipelines & Lead Management',
      'Digital Contracts & E-Signature',
      'Granular Permissions',
      'Email Communication',
      'Estimates & Work Orders',
      'Invoices & Payments',
      'Product & Inventory Management',
      'Native Automation Builder',
      'Task Management & Appointment Scheduling',
      'Zapier & FlowChef Integrations',
      'Free Onboarding & Support',
      'Engage Add-On ($15/number/mo)',
    ],
  },
  {
    id: 'growth',
    icon: 'ChartLine',
    packageId: '6',
    title: 'Growth',
    description:
      'Canvassing, CRM, jobs, estimates, invoices, payments, and reporting in one platform.',
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
];

export const faqs = [
  {
    question: 'Will my techs actually use it?',
    answer: 'The work order opens with the job history, the parts, and the scope already on it. Techs use it because it saves them a phone call, not because you told them to.',
  },
  {
    question: 'Is Knockio HVAC software or field service software?',
    answer: 'Both. HVAC field service software and field service management software describe the same job: getting the right tech to the right call with the right information. Knockio does that, then carries the job through the work order, the invoice, and the payment. Most HVAC software stops at the schedule.',
  },
  {
    question: 'How long does setup take?',
    answer: 'Most teams are live in a day. Our onboarding team loads your customers, sets up your techs, and connects your accounting. No consultant required, no implementation fee.',
  },
  {
    question: 'Do we have to rebuild every estimate from scratch?',
    answer: 'No. Build a line item once and it is there for every estimate after that. Your common services stop being retyping work.',
  },
  {
    question: 'Is there a contract?',
    answer: 'No. All plans are month-to-month. No annual commitment, no cancellation fees, and no auto-renewal surprises.',
  },
  {
    question: 'Can we invoice from the field?',
    answer: 'Yes. Build the invoice from the completed work order and send it before you leave the driveway. Collect payment on site or send a link.',
  },
  {
    question: 'What does it actually cost?',
    answer: 'Pricing is published on this page. Organize starts at $35 per user and Growth at $60, with volume rates at five or more users. No sales call required to find out.',
  },
  {
    question: 'Can we import our customer list and job history? ',
    answer: 'Yes. CSV or direct migration. Your history comes with you.',
  },
  {
    question: 'What happens to my data if I ever leave?',
    answer: 'It is yours. Export customer records, job history, work orders, and invoices at any time. No fees. No runaround.',
  },
  {
    question: 'Can I upgrade to a different plan later?',
    answer: 'Yes. Start with Organize and move to Growth whenever your team is ready. Nothing locks you into your first choice.',
  },
];

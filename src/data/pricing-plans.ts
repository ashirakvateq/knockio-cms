export type FeatureIcon =
  | "check"
  | "phone"
  | "user-tie"
  | "shield"
  | "star"
  | "plug"
  | "briefcase";

export interface FeatureItem {
  text: string;
  icon?: FeatureIcon;
  bold?: boolean;
}

export interface PricingPlan {
  title: string;
  category: string;
  description: string;
  price: string;
  priceUnit: string;
  priceSubline: string;
  priceNote: string;
  packageId?: string;
  demoUrl?: string;
  isRecommended?: boolean;
  badge?: string;
  tagline?: string;
  features: FeatureItem[];
}

export const defaultPlans: PricingPlan[] = [
  {
    title: "Prospect",
    category: "Field Sales",
    description:
      "For field sales teams running door-to-door campaigns.",
    price: "$20",
    priceUnit: "/user/mo",
    priceSubline: "5+ users",
    priceNote: "$25/user/mo for 1–4 users",
    packageId: "4",
    features: [
      { text: "Unlimited Territories & Campaigns" },
      { text: "Route Planning & Optimization" },
      { text: "Pre-Knocked Data (15¢ per address)" },
      { text: "Real-time Rep Tracking" },
      { text: "Presentations" },
      { text: "Digital Contracts & E-Signature" },
      { text: "Native Automation Builder" },
      { text: "Task Management & Appointment Scheduling" },
      { text: "Zapier & FlowChef Integrations", icon: "plug" },
      { text: "Free Onboarding & Support" },
      { text: "Engage Add-On ($15/number/mo)", icon: "phone" },
    ],
  },
  {
    title: "Growth",
    category: "All-In-One",
    description:
      "For contractors and field teams running the entire business—from first knock to final payment.",
    price: "$45",
    priceUnit: "/user/mo",
    priceSubline: "5+ users",
    priceNote: "$60/user/mo for 1–4 users",
    packageId: "6",
    isRecommended: true,
    badge: "Recommended",
    tagline: "Sell the job. Run the job. Get paid.",
    features: [
      { text: "Everything in Prospect", bold: true },
      { text: "Unlimited Workspaces" },
      { text: "Pipelines & Lead Management" },
      { text: "Granular Permissions" },
      { text: "Email Communication" },
      { text: "Estimates & Work Orders" },
      { text: "Invoices & Payments" },
      { text: "Product & Inventory Management" },
      { text: "Native Automation Builder" },
      { text: "Zapier & FlowChef Integrations", icon: "plug" },
      { text: "Dedicated Success Manager", icon: "user-tie" },
      { text: "Free Onboarding & Account Setup" },
      { text: "Engage Add-On ($15/number/mo)", icon: "phone" },
    ],
  },
  {
    title: "Organize",
    category: "Field Service",
    description:
      "For field service teams managing jobs, billing, and customer records.",
    price: "$30",
    priceUnit: "/user/mo",
    priceSubline: "5+ users",
    priceNote: "$35/user/mo for 1–4 users",
    packageId: "5",
    features: [
      { text: "Pipelines & Lead Management" },
      { text: "Digital Contracts & E-Signature" },
      { text: "Granular Permissions" },
      { text: "Email Communication" },
      { text: "Estimates & Work Orders" },
      { text: "Invoices & Payments" },
      { text: "Product & Inventory Management" },
      { text: "Native Automation Builder" },
      { text: "Task Management & Appointment Scheduling" },
      { text: "Zapier & FlowChef Integrations", icon: "plug" },
      { text: "Free Onboarding & Support" },
      { text: "Engage Add-On ($15/number/mo)", icon: "phone" },
    ],
  },
  {
    title: "Scale",
    category: "Enterprise",
    description:
      "Built for multi-location contractors and enterprise operations running 100+ reps in the field.",
    price: "Custom Pricing",
    priceUnit: "",
    priceSubline: "Volume rates for large field teams",
    priceNote: "",
    demoUrl: "https://knockio.com/book-a-demo/",
    badge: "100+ Users",
    features: [
      { text: "Everything in Growth", bold: true },
      { text: "Custom Per-Seat Volume Rates" },
      { text: "White-Glove Onboarding & Account Setup" },
      { text: "Dedicated Success Manager & Priority Support", icon: "user-tie" },
      { text: "Direct Input on Product Roadmap & Features" },
      { text: "Custom Enterprise Workspaces & Security", icon: "shield" },
    ],
  },
];

import {
  PenTool,
  BarChart3,
  Shield,
  Zap,
  Search,
  Users,
  Globe,
  Lock,
  Layers,
  Brain,
  Sparkles,
  Calendar,
  type LucideIcon,
} from "lucide-react"

export interface Feature {
  icon: LucideIcon
  title: string
  description: string
}

export const homepageFeatures: Feature[] = [
  {
    icon: PenTool,
    title: "Rich Text Editor",
    description: "Write with a powerful Tiptap-powered editor. Format, embed, and style your notes effortlessly.",
  },
  {
    icon: BarChart3,
    title: "Visual Analytics",
    description: "Track your productivity with real-time charts and insights. See your progress at a glance.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Your data is protected with end-to-end encryption and SOC 2 compliant infrastructure.",
  },
  {
    icon: Zap,
    title: "Blazing Fast",
    description: "Built on modern tech for instant load times. No lag, no waiting — just flow.",
  },
  {
    icon: Search,
    title: "Instant Search",
    description: "Find any note or document in milliseconds with our powerful full-text search.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Share workspaces, leave comments, and collaborate in real-time with your team.",
  },
]

export const allFeatures: Feature[] = [
  ...homepageFeatures,
  {
    icon: Globe,
    title: "Cloud Sync",
    description: "Access your workspace from any device. Changes sync instantly across all platforms.",
  },
  {
    icon: Lock,
    title: "Zero-Knowledge Encryption",
    description: "Only you can read your data. We can't access your notes, even if we wanted to.",
  },
  {
    icon: Layers,
    title: "Integrations",
    description: "Connect with Slack, GitHub, Notion, and 50+ other tools your team already uses.",
  },
  {
    icon: Brain,
    title: "AI Assistant",
    description: "Get intelligent suggestions, auto-categorization, and smart summaries powered by AI.",
  },
  {
    icon: Sparkles,
    title: "Smart Templates",
    description: "Start faster with pre-built templates for meetings, projects, journals, and more.",
  },
  {
    icon: Calendar,
    title: "Task Management",
    description: "Turn notes into actionable tasks with deadlines, reminders, and priority levels.",
  },
]

export interface Testimonial {
  quote: string
  name: string
  role: string
  initials: string
}

export const testimonials: Testimonial[] = [
  {
    quote: "Neuron has completely replaced three separate tools for me. The notes, charts, and task management all work together beautifully.",
    name: "Sarah Chen",
    role: "Product Manager at Stripe",
    initials: "SC",
  },
  {
    quote: "The cleanest workspace app I've ever used. It's fast, the editor is fantastic, and I love the dark mode.",
    name: "Marcus Rivera",
    role: "Senior Engineer at Vercel",
    initials: "MR",
  },
  {
    quote: "We rolled this out to our entire design team. The collaboration features and real-time sync are exactly what we needed.",
    name: "Aisha Patel",
    role: "Design Lead at Figma",
    initials: "AP",
  },
  {
    quote: "I switched from Notion and never looked back. Neuron is faster, simpler, and the analytics give me real insight.",
    name: "James Okonkwo",
    role: "Freelance Developer",
    initials: "JO",
  },
  {
    quote: "Finally a productivity tool that doesn't get in the way. Open it, write, organize. That's it. Beautifully minimal.",
    name: "Lina Johansson",
    role: "Content Strategist",
    initials: "LJ",
  },
  {
    quote: "The keyboard shortcuts alone save me hours every week. It's clear this was built by people who actually write code.",
    name: "David Kim",
    role: "Staff Engineer at Linear",
    initials: "DK",
  },
]

export interface PricingPlan {
  name: string
  monthlyPrice: number
  annualPrice: number
  description: string
  features: string[]
  cta: string
  highlighted?: boolean
  badge?: string
}

export const pricingPlans: PricingPlan[] = [
  {
    name: "Free",
    monthlyPrice: 0,
    annualPrice: 0,
    description: "Perfect for individuals getting started.",
    features: [
      "Up to 50 notes",
      "Rich text editor",
      "Basic analytics",
      "Dark & light themes",
      "Keyboard shortcuts",
    ],
    cta: "Get started",
  },
  {
    name: "Pro",
    monthlyPrice: 12,
    annualPrice: 9,
    description: "For power users who want more.",
    features: [
      "Unlimited notes",
      "Advanced analytics & charts",
      "AI-powered summaries",
      "Priority support",
      "Cloud sync across devices",
      "Custom templates",
    ],
    cta: "Start free trial",
    highlighted: true,
    badge: "Most popular",
  },
  {
    name: "Team",
    monthlyPrice: 29,
    annualPrice: 23,
    description: "For teams that build together.",
    features: [
      "Everything in Pro",
      "Real-time collaboration",
      "Team workspaces",
      "Admin dashboard",
      "SSO & SAML",
      "Dedicated support",
      "Custom integrations",
    ],
    cta: "Contact sales",
  },
]

export interface FAQItem {
  question: string
  answer: string
}

export const faqItems: FAQItem[] = [
  {
    question: "What is Neuron Workspace?",
    answer: "Neuron Workspace is an intelligent productivity platform that combines note-taking, task management, and analytics in one beautiful interface. It's designed for developers, creators, and teams who want a focused workspace.",
  },
  {
    question: "Is there a free plan?",
    answer: "Yes! The Free plan gives you up to 50 notes, a rich text editor, basic analytics, and all the core features — completely free, forever. No credit card required to sign up.",
  },
  {
    question: "Can I use Neuron on mobile?",
    answer: "Absolutely. Neuron Workspace is fully responsive and works great on any device — phone, tablet, or desktop. There's no separate app needed; just open it in your browser.",
  },
  {
    question: "How does the AI assistant work?",
    answer: "Our AI assistant can automatically summarize long notes, suggest categories, and help you find related content. It runs on top of your existing notes and learns from your writing patterns.",
  },
  {
    question: "Can I import data from other tools?",
    answer: "Yes. We support importing from Notion, Evernote, Obsidian, Markdown files, and CSV. Our migration wizard makes it easy to get started in minutes.",
  },
  {
    question: "Is my data secure?",
    answer: "Security is our top priority. All data is encrypted at rest and in transit. We use zero-knowledge encryption, meaning even we can't read your notes. We're SOC 2 Type II compliant.",
  },
]

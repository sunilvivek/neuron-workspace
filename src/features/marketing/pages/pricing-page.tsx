import { useState } from "react"
import { SectionHeader } from "../components/section-header"
import { PricingCard, PricingToggle } from "../components/pricing-card"
import { FAQSection } from "../components/faq-section"
import { CTASection } from "../components/cta-section"
import { pricingPlans, faqItems } from "../data/content"
import { motion } from "framer-motion"
import { Check } from "lucide-react"

const comparisonFeatures = [
  { name: "Notes", free: "Up to 50", pro: "Unlimited", team: "Unlimited" },
  { name: "Rich text editor", free: true, pro: true, team: true },
  { name: "Dark & light themes", free: true, pro: true, team: true },
  { name: "Keyboard shortcuts", free: true, pro: true, team: true },
  { name: "Basic analytics", free: true, pro: true, team: true },
  { name: "Advanced analytics", free: false, pro: true, team: true },
  { name: "AI summaries", free: false, pro: true, team: true },
  { name: "Cloud sync", free: false, pro: true, team: true },
  { name: "Custom templates", free: false, pro: true, team: true },
  { name: "Priority support", free: false, pro: true, team: true },
  { name: "Real-time collaboration", free: false, pro: false, team: true },
  { name: "Team workspaces", free: false, pro: false, team: true },
  { name: "Admin dashboard", free: false, pro: false, team: true },
  { name: "SSO & SAML", free: false, pro: false, team: true },
  { name: "Custom integrations", free: false, pro: false, team: true },
]

function CellValue({ value }: { value: boolean | string }) {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="h-4 w-4 text-primary" aria-label="Included" />
    ) : (
      <span className="text-muted-foreground/40" aria-label="Not included">—</span>
    )
  }
  return <span className="text-sm">{value}</span>
}

export default function PricingPage() {
  const [annual, setAnnual] = useState(false)

  return (
    <>
      <section className="py-20 sm:py-28" aria-labelledby="pricing-hero">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 id="pricing-hero" className="text-4xl font-bold tracking-tight sm:text-5xl">
              Simple, honest pricing
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Start for free. Upgrade when you&apos;re ready. Cancel anytime.
            </p>
            <div className="mt-8 flex justify-center">
              <PricingToggle annual={annual} onChange={setAnnual} />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="pb-20" aria-label="Pricing plans">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
              >
                <PricingCard {...plan} annual={annual} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30" aria-labelledby="comparison-heading">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Compare plans"
            description="See which plan is right for you."
          />
          <div className="mt-12 overflow-x-auto">
            <table className="w-full text-left" role="table">
              <thead>
                <tr className="border-b">
                  <th scope="col" className="py-3 pr-4 text-sm font-medium">Feature</th>
                  <th scope="col" className="px-4 py-3 text-center text-sm font-medium">Free</th>
                  <th scope="col" className="px-4 py-3 text-center text-sm font-medium">Pro</th>
                  <th scope="col" className="pl-4 py-3 text-center text-sm font-medium">Team</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature) => (
                  <tr key={feature.name} className="border-b last:border-0">
                    <td className="py-3 pr-4 text-sm">{feature.name}</td>
                    <td className="px-4 py-3 text-center"><CellValue value={feature.free} /></td>
                    <td className="px-4 py-3 text-center"><CellValue value={feature.pro} /></td>
                    <td className="pl-4 py-3 text-center"><CellValue value={feature.team} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <FAQSection
        items={faqItems}
        title="Pricing FAQ"
        description="Everything you need to know about our pricing."
      />

      <CTASection
        title="Ready to get started?"
        description="Try Neuron free for 14 days. No credit card required."
        ctaText="Start free trial"
        secondaryText="Contact sales"
        secondaryHref="/contact"
      />
    </>
  )
}

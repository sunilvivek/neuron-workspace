import { HeroSection } from "../components/hero-section"
import { SectionHeader } from "../components/section-header"
import { FeatureCard } from "../components/feature-card"
import { TestimonialCard } from "../components/testimonial-card"
import { PricingCard } from "../components/pricing-card"
import { FAQSection } from "../components/faq-section"
import { CTASection } from "../components/cta-section"
import { WorkspacePreview, IntegrationsGrid } from "../components/workspace-preview"
import { homepageFeatures, testimonials, pricingPlans, faqItems } from "../data/content"
import { motion } from "framer-motion"

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <SectionHeader
        badge="Features"
        title="Everything you need to stay productive"
        description="Neuron combines powerful tools in a clean, distraction-free interface designed for deep work."
      />

      <section className="py-12" aria-label="Feature cards">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {homepageFeatures.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <WorkspacePreview />

      <IntegrationsGrid />

      <section className="py-20" aria-labelledby="testimonials-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Testimonials"
            title="Loved by teams worldwide"
            description="Don't take our word for it — hear from the people who use Neuron every day."
          />
          <motion.div
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {testimonials.slice(0, 6).map((t, i) => (
              <TestimonialCard key={i} {...t} />
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-muted/30" aria-labelledby="pricing-preview-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Pricing"
            title="Simple, transparent pricing"
            description="Start free. Upgrade when you need more. No surprises."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {pricingPlans.map((plan) => (
              <PricingCard key={plan.name} {...plan} />
            ))}
          </div>
        </div>
      </section>

      <FAQSection items={faqItems} />

      <CTASection
        title="Ready to supercharge your workflow?"
        description="Join thousands of productive people who use Neuron to organize their ideas and achieve their goals."
        ctaText="Get started for free"
        secondaryText="View pricing"
        secondaryHref="/pricing"
      />
    </>
  )
}

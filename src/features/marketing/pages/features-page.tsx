import { SectionHeader } from "../components/section-header"
import { FeatureCard } from "../components/feature-card"
import { CTASection } from "../components/cta-section"
import { allFeatures } from "../data/content"
import { motion } from "framer-motion"

export default function FeaturesPage() {
  return (
    <>
      <section className="py-20 sm:py-28" aria-labelledby="features-hero">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 id="features-hero" className="text-4xl font-bold tracking-tight sm:text-5xl">
              Built for how you work
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Every feature in Neuron is designed to help you focus, create, and ship faster.
              No bloat, no distractions — just the tools you need.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-20" aria-label="All features">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allFeatures.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Why Neuron"
            title="Not just another note app"
            description="We built Neuron for people who care about their tools. Every pixel, every interaction, every shortcut is crafted with intention."
          />
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { title: "Speed first", desc: "Built with Vite, React 19, and modern TypeScript. Sub-100ms interactions, instant page loads." },
              { title: "Privacy by default", desc: "Zero-knowledge encryption. We never see your data. SOC 2 compliant infrastructure." },
              { title: "Open architecture", desc: "Built on open standards. Export your data anytime. No vendor lock-in, ever." },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Experience the difference"
        description="Try Neuron free for 14 days. No credit card required."
        ctaText="Start free trial"
        secondaryText="View pricing"
        secondaryHref="/pricing"
      />
    </>
  )
}

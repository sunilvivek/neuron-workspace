import { SectionHeader } from "../components/section-header"
import { CTASection } from "../components/cta-section"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "../components/badge"
import { motion } from "framer-motion"
import { Target, Heart, Lightbulb, Users } from "lucide-react"

const values = [
  {
    icon: Target,
    title: "Focus on craft",
    description: "We obsess over details. Every interaction, every pixel, every millisecond matters to us.",
  },
  {
    icon: Heart,
    title: "User-first always",
    description: "If it doesn't make the user's life better, we don't build it. Simple as that.",
  },
  {
    icon: Lightbulb,
    title: "Think different",
    description: "We challenge assumptions. The best tools come from questioning how things have always been done.",
  },
  {
    icon: Users,
    title: "Build in the open",
    description: "We share our roadmap, listen to feedback, and build with our community, not just for them.",
  },
]

const team = [
  { name: "Alex Morgan", role: "CEO & Co-founder", initials: "AM" },
  { name: "Jordan Lee", role: "CTO & Co-founder", initials: "JL" },
  { name: "Sam Rivera", role: "Head of Design", initials: "SR" },
  { name: "Casey Kim", role: "Head of Engineering", initials: "CK" },
]

export default function AboutPage() {
  return (
    <>
      <section className="py-20 sm:py-28" aria-labelledby="about-hero">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-4">About us</Badge>
            <h1 id="about-hero" className="text-4xl font-bold tracking-tight sm:text-5xl">
              We believe work should feel good
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Neuron Workspace started with a simple idea: productivity tools should be fast, beautiful,
              and respect your privacy. We&apos;re a small team building something we personally want to use.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-muted/30" aria-labelledby="mission-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="secondary" className="mb-4">Our mission</Badge>
              <h2 id="mission-heading" className="text-3xl font-bold tracking-tight">
                Make deep work accessible to everyone
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                We started Neuron in 2024 because we were frustrated with existing productivity tools.
                They were either too complex, too slow, or didn&apos;t respect user privacy.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Our goal is simple: build the fastest, most focused workspace on the web. One that
                gets out of your way and lets you do your best work. No bloat, no dark patterns,
                no selling your data.
              </p>
            </motion.div>
            <motion.div
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {[
                { label: "Users", value: "10K+" },
                { label: "Notes created", value: "2M+" },
                { label: "Countries", value: "80+" },
                { label: "Uptime", value: "99.9%" },
              ].map((stat) => (
                <Card key={stat.label} className="border-0 bg-background">
                  <CardContent className="p-6 text-center">
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20" aria-labelledby="values-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Values"
            title="What we stand for"
            description="These principles guide every decision we make."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
              >
                <Card className="border-0 bg-muted/50 h-full">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <value.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-semibold">{value.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30" aria-labelledby="team-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Team"
            title="The people behind Neuron"
            description="A small, focused team with big ambitions."
          />
          <div className="mt-12 grid gap-6 grid-cols-2 md:grid-cols-4">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
              >
                <Card className="border-0 bg-background text-center">
                  <CardContent className="p-6">
                    <Avatar className="mx-auto h-20 w-20">
                      <AvatarFallback className="text-lg">{member.initials}</AvatarFallback>
                    </Avatar>
                    <h3 className="mt-4 font-semibold">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Join us on this journey"
        description="We're building the future of productive work. Come along."
        ctaText="Try Neuron free"
        secondaryText="Contact us"
        secondaryHref="/contact"
      />
    </>
  )
}

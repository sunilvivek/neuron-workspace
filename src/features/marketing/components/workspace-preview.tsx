import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { motion, type Variants } from "framer-motion"
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
} from "lucide-react"

export function WorkspacePreview() {
  return (
    <section className="py-20 overflow-hidden" aria-labelledby="preview-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 id="preview-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">
            Your workspace, beautifully crafted
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            A clean, focused interface that adapts to how you work. Dark mode, keyboard shortcuts, and rich editing — all built in.
          </p>
        </div>

        <div className="relative mt-12">
          {/* Browser chrome mockup */}
          <div className="rounded-xl border bg-card shadow-2xl overflow-hidden">
            <div className="flex items-center gap-2 border-b bg-muted/50 px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
              </div>
              <div className="ml-4 flex-1 rounded-md bg-background px-3 py-1 text-xs text-muted-foreground">
                app.neuronworkspace.com
              </div>
            </div>

            <div className="grid min-h-[400px] md:grid-cols-[240px_1fr]">
              {/* Sidebar mockup */}
              <div className="hidden border-r bg-muted/30 p-4 md:block">
                <div className="mb-6 flex items-center gap-2">
                  <div className="h-6 w-6 rounded bg-primary/20" />
                  <div className="h-4 w-20 rounded bg-muted-foreground/20" />
                </div>
                <div className="space-y-1">
                  {["Dashboard", "Notes", "Settings"].map((item) => (
                    <div
                      key={item}
                      className={cn(
                        "rounded-md px-3 py-2 text-sm",
                        item === "Dashboard"
                          ? "bg-accent font-medium text-accent-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Main content mockup */}
              <div className="p-6">
                <div className="mb-6">
                  <div className="h-6 w-32 rounded bg-muted-foreground/20" />
                  <div className="mt-2 h-4 w-64 rounded bg-muted-foreground/10" />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="border-0 bg-muted/50">
                      <CardContent className="p-4">
                        <div className="mb-2 h-4 w-16 rounded bg-muted-foreground/20" />
                        <div className="h-7 w-12 rounded bg-muted-foreground/15 font-bold" />
                        <div className="mt-2 h-2 w-full rounded bg-muted-foreground/10" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="mt-6 h-48 rounded-lg bg-muted/50 p-4">
                  <div className="h-4 w-24 rounded bg-muted-foreground/15" />
                  <div className="mt-4 grid grid-cols-7 gap-2">
                    {[35, 55, 40, 70, 45, 30, 50].map((h, i) => (
                      <div key={i} className="space-y-1">
                        <div className="h-24 rounded bg-muted-foreground/10" style={{ height: `${h}%` }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gradient blur behind */}
          <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-primary/5 blur-xl" />
        </div>
      </div>
    </section>
  )
}

const integrations = [
  { icon: PenTool, name: "Rich Editor", desc: "Tiptap-powered writing" },
  { icon: BarChart3, name: "Analytics", desc: "Visualize your data" },
  { icon: Shield, name: "Security", desc: "Enterprise-grade protection" },
  { icon: Zap, name: "Fast", desc: "Lightning-quick performance" },
  { icon: Search, name: "Search", desc: "Find anything instantly" },
  { icon: Users, name: "Collaboration", desc: "Work with your team" },
  { icon: Globe, name: "Cloud Sync", desc: "Access everywhere" },
  { icon: Lock, name: "Encryption", desc: "End-to-end encrypted" },
  { icon: Layers, name: "Integrations", desc: "Connect your tools" },
]

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function IntegrationsGrid() {
  return (
    <section className="py-20" aria-labelledby="integrations-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 id="integrations-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            A complete toolkit for your workflow, from note-taking to analytics.
          </p>
        </div>
        <motion.div
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {integrations.map((item) => (
            <motion.div key={item.name} variants={itemVariants}>
              <Card className="group border-0 bg-muted/50 transition-colors hover:bg-muted">
                <CardContent className="flex items-start gap-4 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-110">
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

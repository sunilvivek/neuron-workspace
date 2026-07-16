import { cn } from "@/lib/utils"
import { Brain } from "lucide-react"
import { Link } from "react-router"
import { motion } from "framer-motion"

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  description: string
  footer?: React.ReactNode
}

export function AuthLayout({ children, title, description, footer }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-12">
      <motion.div
        className="w-full max-w-[400px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 font-semibold" aria-label="Neuron Workspace home">
            <Brain className="h-8 w-8" aria-hidden="true" />
            <span className="text-xl tracking-tight">Neuron</span>
          </Link>
        </div>

        <div className={cn("rounded-xl border bg-card p-6 shadow-sm sm:p-8")}>
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          </div>
          {children}
        </div>

        {footer && (
          <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>
        )}
      </motion.div>
    </div>
  )
}

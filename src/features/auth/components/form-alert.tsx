import { AlertCircle, CheckCircle2, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface FormAlertProps {
  type: "success" | "error" | "info"
  message: string
  onDismiss?: () => void
}

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
}

const styles = {
  success: "border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400",
  error: "border-destructive/50 bg-destructive/10 text-destructive",
  info: "border-blue-500/50 bg-blue-500/10 text-blue-700 dark:text-blue-400",
}

export function FormAlert({ type, message, onDismiss }: FormAlertProps) {
  const Icon = icons[type]

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-lg border p-4 text-sm",
        styles[type]
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <p className="flex-1">{message}</p>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded-md p-0.5 opacity-70 hover:opacity-100"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </motion.div>
  )
}

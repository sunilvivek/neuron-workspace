interface PasswordStrengthProps {
  password: string
}

const rules = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "One number", test: (p: string) => /[0-9]/.test(p) },
]

function getStrength(password: string): number {
  return rules.filter((r) => r.test(password)).length
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const strength = getStrength(password)

  if (!password) return null

  return (
    <div className="space-y-2" role="status" aria-label={`Password strength: ${strength} of ${rules.length} requirements met`}>
      <div className="flex gap-1">
        {Array.from({ length: rules.length }).map((_, i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-colors"
            style={{
              backgroundColor:
                i < strength
                  ? strength <= 1
                    ? "hsl(var(--destructive))"
                    : strength <= 2
                      ? "hsl(38, 92%, 50%)"
                      : "hsl(var(--primary))"
                  : "hsl(var(--muted))",
            }}
          />
        ))}
      </div>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        {rules.map((rule) => (
          <li key={rule.label} className="flex items-center gap-1.5">
            <span
              className={`inline-block h-1 w-1 rounded-full ${
                rule.test(password) ? "bg-primary" : "bg-muted-foreground/40"
              }`}
              aria-hidden="true"
            />
            <span className={rule.test(password) ? "text-foreground" : "text-muted-foreground"}>
              {rule.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

import { useState } from "react"
import { Link, useSearchParams } from "react-router"
import { AuthLayout } from "../components/auth-layout"
import { FormAlert } from "../components/form-alert"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

export default function EmailVerificationPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleVerify() {
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })
      if (!res.ok) throw new Error("Verification failed")
      setSuccess(true)
    } catch {
      setError("Verification failed. The link may be expired or invalid.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <AuthLayout
        title="Email verified!"
        description="Your email has been verified successfully."
        footer={
          <>
            Continue to{" "}
            <Link to="/login" className="font-medium text-foreground underline underline-offset-4 hover:text-foreground/80">
              sign in
            </Link>
          </>
        }
      >
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-8 w-8 text-primary" aria-hidden="true" />
          </div>
          <Link to="/login">
            <Button className="w-full">Sign in</Button>
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Verify your email"
      description="Click the button below to verify your email address"
      footer={
        <>
          <Link to="/login" className="font-medium text-foreground underline underline-offset-4 hover:text-foreground/80">
            Back to sign in
          </Link>
        </>
      }
    >
      <div className="space-y-4">
        {error && <FormAlert type="error" message={error} onDismiss={() => setError(null)} />}

        {!token ? (
          <FormAlert
            type="info"
            message="No verification token found. Please check your email for the verification link."
          />
        ) : (
          <Button onClick={handleVerify} className="w-full" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Verifying...
              </span>
            ) : (
              "Verify email address"
            )}
          </Button>
        )}
      </div>
    </AuthLayout>
  )
}

import { useState } from "react"
import { Link, useSearchParams } from "react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { resetPasswordSchema, type ResetPasswordValues } from "../schemas/auth-schema"
import { AuthLayout } from "../components/auth-layout"
import { PasswordInput } from "../components/password-input"
import { PasswordStrength } from "../components/password-strength"
import { FormAlert } from "../components/form-alert"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  })

  const password = watch("password")

  if (!token) {
    return (
      <AuthLayout
        title="Invalid reset link"
        description="This password reset link is invalid or has expired."
        footer={
          <>
            <Link to="/forgot-password" className="font-medium text-foreground underline underline-offset-4 hover:text-foreground/80">
              Request a new link
            </Link>
          </>
        }
      >
        <Link to="/login">
          <Button variant="outline" className="w-full">
            Back to sign in
          </Button>
        </Link>
      </AuthLayout>
    )
  }

  async function onSubmit(data: ResetPasswordValues) {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: data.password }),
      })
      if (!res.ok) throw new Error("Reset failed")
      setSuccess(true)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Set new password"
      description="Choose a strong password for your account"
      footer={
        <>
          <Link to="/login" className="font-medium text-foreground underline underline-offset-4 hover:text-foreground/80">
            Back to sign in
          </Link>
        </>
      }
    >
      {success ? (
        <div className="space-y-4">
          <FormAlert type="success" message="Your password has been reset successfully!" />
          <Link to="/login">
            <Button className="w-full">Sign in with new password</Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {error && <FormAlert type="error" message={error} onDismiss={() => setError(null)} />}

          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>
            <PasswordInput
              id="password"
              placeholder="Create a new password"
              disabled={loading}
              error={!!errors.password}
              {...register("password")}
              aria-invalid={!!errors.password}
            />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
            <PasswordStrength password={password} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <PasswordInput
              id="confirmPassword"
              placeholder="Confirm your new password"
              disabled={loading}
              error={!!errors.confirmPassword}
              {...register("confirmPassword")}
              aria-invalid={!!errors.confirmPassword}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Resetting password...
              </span>
            ) : (
              "Reset password"
            )}
          </Button>
        </form>
      )}
    </AuthLayout>
  )
}

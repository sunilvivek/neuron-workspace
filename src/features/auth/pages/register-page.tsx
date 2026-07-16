import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAppDispatch, useAppSelector } from "@/app/store"
import { register as registerUser, clearError } from "../store/auth-slice"
import { registerSchema, type RegisterValues } from "../schemas/auth-schema"
import { AuthLayout } from "../components/auth-layout"
import { PasswordInput } from "../components/password-input"
import { PasswordStrength } from "../components/password-strength"
import { SocialLogin } from "../components/social-login"
import { FormAlert } from "../components/form-alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function RegisterPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error } = useAppSelector((s) => s.auth)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  })

  const password = watch("password")

  async function onSubmit(data: RegisterValues) {
    const result = await dispatch(
      registerUser({ name: data.name, email: data.email, password: data.password })
    )
    if (registerUser.fulfilled.match(result)) {
      setSuccess(true)
      setTimeout(() => navigate("/app"), 600)
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      description="Start your journey with Neuron Workspace"
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-foreground underline underline-offset-4 hover:text-foreground/80">
            Sign in
          </Link>
        </>
      }
    >
      <div className="space-y-4">
        {error && (
          <FormAlert type="error" message={error} onDismiss={() => dispatch(clearError())} />
        )}
        {success && (
          <FormAlert type="success" message="Account created! Redirecting..." />
        )}

        <SocialLogin disabled={loading} />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              autoComplete="name"
              disabled={loading}
              {...register("name")}
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              disabled={loading}
              {...register("email")}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              placeholder="Create a strong password"
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
              placeholder="Confirm your password"
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
                Creating account...
              </span>
            ) : (
              "Create account"
            )}
          </Button>
        </form>
      </div>
    </AuthLayout>
  )
}

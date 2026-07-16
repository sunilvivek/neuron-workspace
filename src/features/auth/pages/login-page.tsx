import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAppDispatch, useAppSelector } from "@/app/store"
import { login, clearError } from "../store/auth-slice"
import { loginSchema, type LoginValues } from "../schemas/auth-schema"
import { AuthLayout } from "../components/auth-layout"
import { PasswordInput } from "../components/password-input"
import { SocialLogin } from "../components/social-login"
import { FormAlert } from "../components/form-alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error } = useAppSelector((s) => s.auth)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  })

  async function onSubmit(data: LoginValues) {
    const result = await dispatch(login({ email: data.email, password: data.password }))
    if (login.fulfilled.match(result)) {
      setSuccess(true)
      setTimeout(() => navigate("/app"), 600)
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to your Neuron Workspace account"
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-medium text-foreground underline underline-offset-4 hover:text-foreground/80">
            Sign up
          </Link>
        </>
      }
    >
      <div className="space-y-4">
        {error && (
          <FormAlert type="error" message={error} onDismiss={() => dispatch(clearError())} />
        )}
        {success && (
          <FormAlert type="success" message="Login successful! Redirecting..." />
        )}

        <SocialLogin disabled={loading} />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                to="/forgot-password"
                className="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <PasswordInput
              id="password"
              placeholder="Enter your password"
              disabled={loading}
              error={!!errors.password}
              {...register("password")}
              aria-invalid={!!errors.password}
            />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              id="rememberMe"
              type="checkbox"
              className="h-4 w-4 rounded border-input"
              {...register("rememberMe")}
            />
            <Label htmlFor="rememberMe" className="text-sm font-normal">
              Remember me for 30 days
            </Label>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
      </div>
    </AuthLayout>
  )
}

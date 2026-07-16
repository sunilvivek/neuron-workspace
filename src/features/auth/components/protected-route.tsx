import { useEffect } from "react"
import { Navigate, useLocation } from "react-router"
import { useAppDispatch, useAppSelector } from "@/app/store"
import { fetchCurrentUser } from "@/features/auth/store/auth-slice"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const { isAuthenticated, token, loading } = useAppSelector((s) => s.auth)

  useEffect(() => {
    if (token && !isAuthenticated) {
      dispatch(fetchCurrentUser())
    }
  }, [token, isAuthenticated, dispatch])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return <>{children}</>
}

export function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAppSelector((s) => s.auth)

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/app" replace />
  }

  return <>{children}</>
}

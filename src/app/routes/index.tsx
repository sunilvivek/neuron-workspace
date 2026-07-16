/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter } from "react-router"
import { lazy, Suspense } from "react"
import { MarketingLayout } from "@/features/marketing/layouts/marketing-layout"
import { AppLayout } from "@/app/layouts/app-layout"
import { ProtectedRoute } from "@/features/auth/components/protected-route"
import { GuestRoute } from "@/features/auth/components/protected-route"

function PageLoader() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  )
}

const HomePage = lazy(() => import("@/features/marketing/pages/home-page"))
const FeaturesPage = lazy(() => import("@/features/marketing/pages/features-page"))
const PricingPage = lazy(() => import("@/features/marketing/pages/pricing-page"))
const AboutPage = lazy(() => import("@/features/marketing/pages/about-page"))
const ContactPage = lazy(() => import("@/features/marketing/pages/contact-page"))
const NotFoundPage = lazy(() => import("@/features/marketing/pages/not-found-page"))
const LoginPage = lazy(() => import("@/features/auth/pages/login-page"))
const RegisterPage = lazy(() => import("@/features/auth/pages/register-page"))
const ForgotPasswordPage = lazy(() => import("@/features/auth/pages/forgot-password-page"))
const ResetPasswordPage = lazy(() => import("@/features/auth/pages/reset-password-page"))
const EmailVerificationPage = lazy(() => import("@/features/auth/pages/email-verification-page"))
const DashboardPage = lazy(() => import("@/features/dashboard/pages/dashboard-page"))
const NotesPage = lazy(() => import("@/features/notes/pages/notes-page"))
const SettingsPage = lazy(() => import("@/features/settings/pages/settings-page"))

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MarketingLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: "features",
        element: (
          <Suspense fallback={<PageLoader />}>
            <FeaturesPage />
          </Suspense>
        ),
      },
      {
        path: "pricing",
        element: (
          <Suspense fallback={<PageLoader />}>
            <PricingPage />
          </Suspense>
        ),
      },
      {
        path: "about",
        element: (
          <Suspense fallback={<PageLoader />}>
            <AboutPage />
          </Suspense>
        ),
      },
      {
        path: "contact",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ContactPage />
          </Suspense>
        ),
      },
      {
        path: "*",
        element: (
          <Suspense fallback={<PageLoader />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: (
      <GuestRoute>
        <Suspense fallback={<PageLoader />}>
          <LoginPage />
        </Suspense>
      </GuestRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <GuestRoute>
        <Suspense fallback={<PageLoader />}>
          <RegisterPage />
        </Suspense>
      </GuestRoute>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <GuestRoute>
        <Suspense fallback={<PageLoader />}>
          <ForgotPasswordPage />
        </Suspense>
      </GuestRoute>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <GuestRoute>
        <Suspense fallback={<PageLoader />}>
          <ResetPasswordPage />
        </Suspense>
      </GuestRoute>
    ),
  },
  {
    path: "/verify-email",
    element: (
      <Suspense fallback={<PageLoader />}>
        <EmailVerificationPage />
      </Suspense>
    ),
  },
  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: "notes",
        element: (
          <Suspense fallback={<PageLoader />}>
            <NotesPage />
          </Suspense>
        ),
      },
      {
        path: "settings",
        element: (
          <Suspense fallback={<PageLoader />}>
            <SettingsPage />
          </Suspense>
        ),
      },
    ],
  },
])

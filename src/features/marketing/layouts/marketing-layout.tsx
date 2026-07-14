import { Outlet, useLocation } from "react-router"
import { MarketingNavbar } from "../components/marketing-navbar"
import { MarketingFooter } from "../components/marketing-footer"
import { useEffect } from "react"

export function MarketingLayout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:m-2 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to main content
      </a>
      <MarketingNavbar />
      <main id="main-content" className="flex-1" role="main">
        <Outlet />
      </main>
      <MarketingFooter />
    </div>
  )
}

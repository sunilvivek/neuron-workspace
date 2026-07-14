import { useState, useEffect } from "react"
import { Link, NavLink } from "react-router"
import { Menu, Brain } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const navLinks = [
  { to: "/features", label: "Features" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
]

function NavbarLink({ to, className, onClick }: { to: string; className?: string; onClick?: () => void }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "text-sm font-medium transition-colors hover:text-foreground",
          isActive ? "text-foreground" : "text-muted-foreground",
          className
        )
      }
    >
      {navLinks.find((l) => l.to === to)?.label}
    </NavLink>
  )
}

export function MarketingNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        scrolled
          ? "border-b bg-background/80 backdrop-blur-lg"
          : "bg-transparent"
      )}
      role="banner"
    >
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-semibold" aria-label="Neuron Workspace home">
          <Brain className="h-6 w-6" aria-hidden="true" />
          <span className="text-lg tracking-tight">Neuron</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <NavbarLink key={link.to} to={link.to} />
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Button variant="ghost" size="sm" asChild>
            <NavLink to="/app">Sign In</NavLink>
          </Button>
          <Button size="sm" asChild>
            <NavLink to="/app">Get Started</NavLink>
          </Button>
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-6 pt-8">
                <Link
                  to="/"
                  className="flex items-center gap-2 font-semibold"
                  onClick={() => setMobileOpen(false)}
                >
                  <Brain className="h-6 w-6" />
                  <span className="text-lg tracking-tight">Neuron</span>
                </Link>
                <div className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <NavbarLink
                      key={link.to}
                      to={link.to}
                      className="text-base"
                      onClick={() => setMobileOpen(false)}
                    />
                  ))}
                </div>
                <div className="flex flex-col gap-3 pt-4 border-t">
                  <Button variant="outline" asChild>
                    <NavLink to="/app" onClick={() => setMobileOpen(false)}>
                      Sign In
                    </NavLink>
                  </Button>
                  <Button asChild>
                    <NavLink to="/app" onClick={() => setMobileOpen(false)}>
                      Get Started
                    </NavLink>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}

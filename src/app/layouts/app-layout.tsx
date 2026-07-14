import { Outlet, NavLink, Link } from "react-router"
import {
  LayoutDashboard,
  FileText,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState, useEffect } from "react"

const navItems = [
  { to: "/app", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/app/notes", icon: FileText, label: "Notes" },
  { to: "/app/settings", icon: Settings, label: "Settings" },
]

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav
      className="flex flex-col gap-1"
      role="navigation"
      aria-label="Main navigation"
    >
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/"}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )
          }
        >
          <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Close mobile sidebar on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false)
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-screen overflow-hidden bg-background">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:m-2 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Skip to main content
        </a>
        {/* Desktop sidebar */}
        <aside
          className={cn(
            "hidden md:flex flex-col border-r transition-all duration-300",
            collapsed ? "w-16" : "w-60"
          )}
          aria-label="Sidebar"
        >
          <div className="flex h-14 items-center gap-2 border-b px-4">
            {!collapsed && (
              <Link to="/" className="text-lg font-semibold tracking-tight hover:opacity-80 transition-opacity">
                Neuron
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto h-8 w-8"
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </Button>
          </div>

          <ScrollArea className="flex-1 px-2 py-2">
            {collapsed ? (
              <div className="flex flex-col gap-1 items-center">
                {navItems.map((item) => (
                  <Tooltip key={item.to}>
                    <TooltipTrigger asChild>
                      <NavLink
                        to={item.to}
                        end={item.to === "/"}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center justify-center h-9 w-9 rounded-md transition-colors",
                            isActive
                              ? "bg-accent text-accent-foreground"
                              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                          )
                        }
                      >
                        <item.icon className="h-4 w-4" aria-hidden="true" />
                      </NavLink>
                    </TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  </Tooltip>
                ))}
              </div>
            ) : (
              <NavLinks />
            )}
          </ScrollArea>

          <Separator />
          <div className="flex items-center justify-end p-2">
            <ThemeToggle />
          </div>
        </aside>

        {/* Mobile header */}
        <div className="flex flex-1 flex-col">
          <header className="flex h-14 items-center justify-between border-b px-4 md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open navigation menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-60 p-0">
                <div className="flex h-14 items-center gap-2 border-b px-4">
                  <span className="text-lg font-semibold tracking-tight">
                    Neuron
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto h-8 w-8"
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close navigation menu"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="px-2 py-2">
                  <NavLinks onNavigate={() => setMobileOpen(false)} />
                </div>
                <div className="absolute bottom-4 right-4">
                  <ThemeToggle />
                </div>
              </SheetContent>
            </Sheet>
            <Link to="/" className="text-lg font-semibold tracking-tight hover:opacity-80 transition-opacity">Neuron</Link>
            <ThemeToggle />
          </header>

          <main className="flex-1 overflow-auto" role="main" id="main-content">
            <Outlet />
          </main>
        </div>
      </div>
    </TooltipProvider>
  )
}

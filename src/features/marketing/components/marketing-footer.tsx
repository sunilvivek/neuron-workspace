import { Link } from "react-router"
import { Brain, Globe, MessageCircle, ExternalLink } from "lucide-react"
import { Separator } from "@/components/ui/separator"

const footerLinks = {
  Product: [
    { to: "/features", label: "Features" },
    { to: "/pricing", label: "Pricing" },
    { to: "/app", label: "Dashboard" },
  ],
  Company: [
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ],
  Legal: [
    { to: "#", label: "Privacy Policy" },
    { to: "#", label: "Terms of Service" },
  ],
}

const socialLinks = [
  { href: "#", icon: Globe, label: "Website" },
  { href: "#", icon: MessageCircle, label: "Community" },
  { href: "#", icon: ExternalLink, label: "Blog" },
]

export function MarketingFooter() {
  return (
    <footer className="border-t bg-muted/30" role="contentinfo">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-semibold" aria-label="Neuron Workspace home">
              <Brain className="h-6 w-6" aria-hidden="true" />
              <span className="text-lg tracking-tight">Neuron</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground max-w-xs">
              Your intelligent workspace for notes, ideas, and productivity.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold">{title}</h3>
              <ul className="mt-3 space-y-2" role="list">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator />

        <div className="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Neuron Workspace. All rights reserved.
          </p>
          <div className="flex gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label={social.label}
                target="_blank"
                rel="noopener noreferrer"
              >
                <social.icon className="h-4 w-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { AnimatedPage } from "@/components/animated-page"
import { useTheme } from "@/app/providers/theme-provider"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()

  return (
    <AnimatedPage>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your preferences and account.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize the look and feel of the application.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Theme</Label>
              <div className="flex gap-2">
                {(["light", "dark", "system"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                      theme === t
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-foreground hover:bg-accent"
                    }`}
                    aria-pressed={theme === t}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle>Keyboard Shortcuts</CardTitle>
            <CardDescription>Available keyboard shortcuts for navigation.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Toggle sidebar</span>
                <kbd className="rounded border bg-muted px-1.5 py-0.5 text-xs font-mono">
                  [
                </kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Create note</span>
                <kbd className="rounded border bg-muted px-1.5 py-0.5 text-xs font-mono">
                  Ctrl + N
                </kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Search</span>
                <kbd className="rounded border bg-muted px-1.5 py-0.5 text-xs font-mono">
                  Ctrl + K
                </kbd>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Neuron Workspace v0.1.0 — Built with React, TypeScript, Tailwind CSS,
              and shadcn/ui.
            </p>
          </CardContent>
        </Card>
      </div>
    </AnimatedPage>
  )
}

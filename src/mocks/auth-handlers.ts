import { http, HttpResponse } from "msw"

interface MockUser {
  id: string
  name: string
  email: string
  password: string
}

const users: Record<string, MockUser> = {
  "demo@neuron.com": {
    id: "1",
    name: "Demo User",
    email: "demo@neuron.com",
    password: "Password1",
  },
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function omitPassword(user: MockUser): Omit<MockUser, "password"> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _removed, ...rest } = user
  return rest
}

export const authHandlers = [
  http.post("/api/auth/login", async ({ request }) => {
    await delay(800)
    const { email, password } = (await request.json()) as { email: string; password: string }
    const user = users[email]
    if (!user || user.password !== password) {
      return HttpResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }
    const token = `tok_${Date.now()}_${Math.random().toString(36).slice(2)}`
    return HttpResponse.json({ user: omitPassword(user), token })
  }),

  http.post("/api/auth/register", async ({ request }) => {
    await delay(800)
    const { name, email, password } = (await request.json()) as {
      name: string
      email: string
      password: string
    }
    if (users[email]) {
      return HttpResponse.json({ message: "An account with this email already exists" }, { status: 409 })
    }
    const user: MockUser = { id: String(Date.now()), name, email, password }
    users[email] = user
    const token = `tok_${Date.now()}_${Math.random().toString(36).slice(2)}`
    return HttpResponse.json({ user: omitPassword(user), token }, { status: 201 })
  }),

  http.post("/api/auth/logout", async () => {
    await delay(200)
    return HttpResponse.json({ success: true })
  }),

  http.post("/api/auth/forgot-password", async ({ request }) => {
    await delay(800)
    const { email } = (await request.json()) as { email: string }
    const user = users[email]
    if (!user) {
      return HttpResponse.json({ message: "If an account exists, a reset link has been sent" })
    }
    return HttpResponse.json({ message: "If an account exists, a reset link has been sent" })
  }),

  http.post("/api/auth/reset-password", async ({ request }) => {
    await delay(800)
    const body = (await request.json()) as { token: string; password: string }
    if (!body.password || body.password.length < 8) {
      return HttpResponse.json({ message: "Password must be at least 8 characters" }, { status: 400 })
    }
    return HttpResponse.json({ message: "Password reset successful" })
  }),

  http.post("/api/auth/verify-email", async ({ request }) => {
    await delay(800)
    await request.json()
    return HttpResponse.json({ message: "Email verified successfully" })
  }),

  http.get("/api/auth/me", ({ request }) => {
    const auth = request.headers.get("Authorization")
    if (!auth?.startsWith("Bearer ")) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    const firstUser = Object.values(users)[0]
    if (!firstUser) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    return HttpResponse.json({ user: omitPassword(firstUser) })
  }),
]

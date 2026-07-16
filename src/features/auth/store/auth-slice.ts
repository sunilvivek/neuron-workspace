import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("auth-token"),
  isAuthenticated: false,
  loading: false,
  error: null,
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const mockUsers: Record<string, { user: User; password: string }> = {
  "demo@neuron.com": {
    user: { id: "1", name: "Demo User", email: "demo@neuron.com" },
    password: "Password1",
  },
}

export const login = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    await delay(800)
    const record = mockUsers[email]
    if (!record || record.password !== password) {
      return rejectWithValue("Invalid email or password")
    }
    const token = `tok_${Date.now()}_${Math.random().toString(36).slice(2)}`
    localStorage.setItem("auth-token", token)
    return { user: record.user, token }
  }
)

export const register = createAsyncThunk(
  "auth/register",
  async (
    { name, email }: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    await delay(800)
    if (mockUsers[email]) {
      return rejectWithValue("An account with this email already exists")
    }
    const user: User = { id: String(Date.now()), name, email }
    mockUsers[email] = { user, password: "" }
    const token = `tok_${Date.now()}_${Math.random().toString(36).slice(2)}`
    localStorage.setItem("auth-token", token)
    return { user, token }
  }
)

export const fetchCurrentUser = createAsyncThunk(
  "auth/me",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { auth: AuthState }
    if (!state.auth.token) return rejectWithValue("No token")
    await delay(300)
    const entry = Object.values(mockUsers).find((u) => u.user.email === "demo@neuron.com")
    if (!entry) return rejectWithValue("Session expired")
    return { user: entry.user }
  }
)

export const logout = createAsyncThunk("auth/logout", async () => {
  await delay(200)
  localStorage.removeItem("auth-token")
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || "Login failed"
      })
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || "Registration failed"
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<{ user: User }>) => {
        state.loading = false
        state.user = action.payload.user
        state.isAuthenticated = true
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false
        state.token = null
        state.isAuthenticated = false
        localStorage.removeItem("auth-token")
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
      })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer

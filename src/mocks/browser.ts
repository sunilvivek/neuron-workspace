import { setupWorker } from "msw/browser"
import { handlers } from "./handlers"
import { authHandlers } from "./auth-handlers"
import { dashboardHandlers } from "./dashboard-handlers"
import { documentHandlers } from "./document-handlers"
import { aiHandlers } from "./ai-handlers"

export const worker = setupWorker(...handlers, ...authHandlers, ...dashboardHandlers, ...documentHandlers, ...aiHandlers)

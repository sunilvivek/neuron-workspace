import { setupWorker } from "msw/browser"
import { handlers } from "./handlers"
import { authHandlers } from "./auth-handlers"
import { dashboardHandlers } from "./dashboard-handlers"
import { documentHandlers } from "./document-handlers"

export const worker = setupWorker(...handlers, ...authHandlers, ...dashboardHandlers, ...documentHandlers)

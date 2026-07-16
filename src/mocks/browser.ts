import { setupWorker } from "msw/browser"
import { handlers } from "./handlers"
import { authHandlers } from "./auth-handlers"

export const worker = setupWorker(...handlers, ...authHandlers)

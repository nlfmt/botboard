import { createTRPCReact } from "@trpc/react-query"
import type { AppRouter } from "@server/routes/trpc/root"

export const API_URL = import.meta.env.DEV ? "http://localhost:3000/api/trpc" : window.location.origin + "/api/trpc"
console.log("API_URL", API_URL)

export function getAuthCookie(): string {
    return localStorage.getItem("token") ?? ""
}

const api = createTRPCReact<AppRouter>()

/**
 * TRPC React Query Provider
 */
export default api
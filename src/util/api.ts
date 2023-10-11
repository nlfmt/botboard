import { createTRPCReact } from "@trpc/react-query"
import type { AppRouter } from "@server/routes/trpc/root"

export const API_URL = "http://localhost:3001/api/trpc"

export function getAuthCookie(): string {
    return localStorage.getItem("token") ?? ""
}

const api = createTRPCReact<AppRouter>()

/**
 * TRPC React Query Provider
 */
export default api
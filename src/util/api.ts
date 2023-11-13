import { createTRPCReact } from "@trpc/react-query"
import type { AppRouter } from "@server/routes/trpc/root"

export const API_URL = "/api/trpc"

const api = createTRPCReact<AppRouter>()

/**
 * TRPC React Query Provider
 */
export default api
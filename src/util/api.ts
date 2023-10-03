import { createTRPCReact } from "@trpc/react-query"
import type { AppRouter } from "../../server/routers/root"

const api = createTRPCReact<AppRouter>()

export default api
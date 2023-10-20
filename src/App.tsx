import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { httpBatchLink } from "@trpc/client"
import api, { API_URL, getAuthCookie } from "./util/api"
import { RouterProvider } from "react-router-dom"
import { router } from "@/App.routes"

function App() {

  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        httpBatchLink({
          url: API_URL,
          async headers() {
            return {
              authorization: getAuthCookie(),
            }
          },
        }),
      ],
    })
  )

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </api.Provider>
  )
}

export default App

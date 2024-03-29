import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { httpBatchLink } from "@trpc/client"
import api, { API_URL } from "./util/api"
import { RouterProvider } from "react-router-dom"
import { router } from "@/App.routes"
import ModalProvider from "./services/ModalService/ModalProvider"

function App() {

  const [queryClient] = useState(() => new QueryClient({ defaultOptions: { queries: { retry: false } } }));
  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        httpBatchLink({
          url: API_URL,
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: "include",
            })
          }
        }),
      ],
    })
  )

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ModalProvider>
          <RouterProvider router={router} />
        </ModalProvider>
      </QueryClientProvider>
    </api.Provider>
  )
}

export default App

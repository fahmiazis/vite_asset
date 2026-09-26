import { QueryClient } from "@tanstack/react-query"

/**
 * Satu instance untuk seluruh app. Dipisah dari App.tsx supaya kode di luar
 * komponen React (mis. stores/stageEmailStore.ts) bisa meng-invalidate query.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})

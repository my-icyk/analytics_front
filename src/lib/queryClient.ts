// src/lib/queryClient.ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 100_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

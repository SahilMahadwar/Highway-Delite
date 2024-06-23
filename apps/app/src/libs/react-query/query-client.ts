import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0, // retries query or mutations for 2 times then throws an error
    },
    mutations: {
      retry: 0, // retries query or mutations for 2 times then throws an error
    },
  },
});

import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 3,
    },
    
    mutations: {
      onError: () => {
        // TODO: check for 400 errors and show toast with the error message
        // TODO: check for 500 errors and show toast with static message "Something went wrong"
      },
    },
  },
});

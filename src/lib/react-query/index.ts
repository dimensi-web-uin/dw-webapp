import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 60 * 1000,
    },
  },
  queryCache: new QueryCache({
    onError: () => {
      toast.error('Terjadi kesalahan');
    },
  }),
  mutationCache: new MutationCache({
    onError: () => {
      toast.error('Terjadi kesalahan');
    },
  }),
});

export { queryClient };

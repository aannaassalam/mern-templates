// In Next.js, this file would be called: app/providers.tsx
'use client';

// Since QueryClientProvider relies on useContext under the hood, we have to put 'use client' on top
import {
  isServer,
  Mutation,
  MutationCache,
  QueryClient,
  QueryClientProvider,
  QueryKey,
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { toast } from 'sonner';

interface ErrorData {
  response: {
    data: {
      message: string;
    };
  };
}

function makeQueryClient() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      },
    },
    mutationCache: new MutationCache({
      onSuccess: (data, _variables, _context, mutation) => {
        const message = (data as AxiosResponse).headers['x-message'];
        const showToast = mutation.meta?.showToast !== false;
        if (showToast && message) {
          toast.success(message);
        }
      },
      onError: (res, _variables, _context, _mutation) => {
        const result = res as unknown as ErrorData;
        if (result?.response?.data?.message) {
          toast.error(result?.response?.data?.message);
        } else {
          toast.error('An error occurred while processing your request.');
        }
      },
      onSettled: (
        _data,
        _error,
        _variables,
        _context,
        mutation: Mutation<unknown, unknown, unknown, unknown>
      ) => {
        if (mutation?.meta?.invalidateQueries) {
          queryClient.invalidateQueries({
            queryKey: mutation?.meta?.invalidateQueries as QueryKey,
            refetchType: 'all',
          });
        }
      },
    }),
  });
  return queryClient;
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export default function Providers({ children }: { children: React.ReactNode }) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

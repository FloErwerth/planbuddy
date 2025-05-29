import { QueryClient, QueryClientProvider } from 'react-query';
import { PropsWithChildren } from 'react';

const client = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, refetchOnMount: 'always' } },
});

export const QueryProvider = ({ children }: PropsWithChildren) => {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

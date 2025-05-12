import { QueryClient, QueryClientProvider } from "react-query";
import { PropsWithChildren } from "react";

const client = new QueryClient();

export const QueryProvider = ({ children }: PropsWithChildren) => {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

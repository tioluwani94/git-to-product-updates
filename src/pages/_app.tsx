import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "@/components/theme";
import { AppLayout } from "@/components/layout";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { useState } from "react";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ProtectedRoute } from "@/components/protected";
import { PageProvider } from "@/hooks/page";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools position="bottom-left" initialIsOpen={false} />
      <Hydrate
        //@ts-ignore
        state={pageProps.dehydratedState}
      >
        <SessionProvider session={session}>
          <ChakraProvider theme={theme}>
            {
              //@ts-ignore
              Component.auth ? (
                <ProtectedRoute>
                  <PageProvider>
                    <AppLayout>
                      <Component {...pageProps} />
                    </AppLayout>
                  </PageProvider>
                </ProtectedRoute>
              ) : (
                <AppLayout>
                  <Component {...pageProps} />
                </AppLayout>
              )
            }
          </ChakraProvider>
        </SessionProvider>
        <Analytics mode="production" />
      </Hydrate>
    </QueryClientProvider>
  );
}

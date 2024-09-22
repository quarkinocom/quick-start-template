"use client";

import React, { ReactNode } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      staleTime: 1000 * 30,
    },
  },
});

/**
 * @param props the main prop object
 * @param props.children The React Node containing children elements being rendered inside of this component
 * @returns The providers that need a client component to load correctly
 */
const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools
        buttonPosition={"bottom-left"}
        initialIsOpen={false}
      />

      {children}
    </QueryClientProvider>
  );
};

export default Providers;

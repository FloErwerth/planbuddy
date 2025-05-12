import { PropsWithChildren } from "react";
import { TamaguiProvider } from "@/providers/TamaguiProvider";
import { SafeAreaProvider } from "@/providers/SafeAreaProvider";
import { QueryProvider } from "@/providers/QueryClient";
import { StatusBar } from "expo-status-bar";

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <SafeAreaProvider>
      <QueryProvider>
        <TamaguiProvider>
          <StatusBar />
          {children}
        </TamaguiProvider>
      </QueryProvider>
    </SafeAreaProvider>
  );
};

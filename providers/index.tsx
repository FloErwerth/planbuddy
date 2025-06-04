import { PropsWithChildren } from 'react';
import { TamaguiProvider } from '@/providers/TamaguiProvider';
import { SafeAreaProvider } from '@/providers/SafeAreaProvider';
import { QueryProvider } from '@/providers/QueryClient';
import { StatusBar } from 'expo-status-bar';
import { PortalHost } from 'tamagui';
import { useWatchLoginState } from '@/hooks/useWatchLoginState';

export const Providers = ({ children }: PropsWithChildren) => {
  useWatchLoginState();

  return (
    <SafeAreaProvider>
      <QueryProvider>
        <TamaguiProvider>
          <PortalHost name="sheets" />
          <StatusBar />
          {children}
        </TamaguiProvider>
      </QueryProvider>
    </SafeAreaProvider>
  );
};

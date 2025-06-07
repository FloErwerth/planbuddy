import { PropsWithChildren } from 'react';
import { TamaguiProvider } from '@/providers/TamaguiProvider';
import { SafeAreaProvider } from '@/providers/SafeAreaProvider';
import { QueryProvider } from '@/providers/QueryClient';
import { StatusBar } from 'expo-status-bar';
import { PortalHost } from 'tamagui';
import { useWatchLoginState } from '@/hooks/useWatchLoginState';
import { ErrorBoundary } from '@sentry/react';
import { ErrorScreen } from '@/screens/ErrorScreen';

export const Providers = ({ children }: PropsWithChildren) => {
  useWatchLoginState();

  return (
    <ErrorBoundary fallback={ErrorScreen}>
      <SafeAreaProvider>
        <QueryProvider>
          <TamaguiProvider>
            <PortalHost name="sheets" />
            <StatusBar />
            {children}
          </TamaguiProvider>
        </QueryProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
};

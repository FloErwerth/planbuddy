import { PropsWithChildren } from 'react';
import { TamaguiProvider } from '@/providers/TamaguiProvider';
import { SafeAreaProvider } from '@/providers/SafeAreaProvider';
import { QueryProvider } from '@/providers/QueryClient';
import { StatusBar } from 'expo-status-bar';
import { PortalHost } from 'tamagui';
import { ErrorBoundary } from '@sentry/react';
import { ErrorScreen } from '@/screens/ErrorScreen';
import { LoginProvider } from '@/providers/LoginProvider';

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <ErrorBoundary fallback={ErrorScreen}>
      <SafeAreaProvider>
        <QueryProvider>
          <LoginProvider>
            <TamaguiProvider>
              <PortalHost name="sheets" />
              <StatusBar />
              {children}
            </TamaguiProvider>
          </LoginProvider>
        </QueryProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
};

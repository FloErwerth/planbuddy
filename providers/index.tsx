import { PropsWithChildren } from 'react';
import { TamaguiProvider } from '@/providers/TamaguiProvider';
import { QueryProvider } from '@/providers/QueryClient';
import { StatusBar } from 'expo-status-bar';
import { ErrorBoundary } from '@sentry/react';
import { ErrorScreen } from '@/screens/ErrorScreen';
import { LoginProvider } from '@/providers/LoginProvider';
import { SafeAreaView } from 'react-native-safe-area-context';

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <ErrorBoundary fallback={ErrorScreen}>
      <QueryProvider>
        <LoginProvider>
          <TamaguiProvider>
            <StatusBar hidden />
            <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
          </TamaguiProvider>
        </LoginProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
};

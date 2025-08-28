import { PropsWithChildren, StrictMode } from 'react';
import { TamaguiProvider } from '@/providers/TamaguiProvider';
import { QueryProvider } from '@/providers/QueryClient';
import { StatusBar } from 'expo-status-bar';
import { ErrorBoundary } from '@sentry/react';
import { ErrorScreen } from '@/screens/ErrorScreen';
import { LoginProvider } from '@/providers/LoginProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NotificationsProvider } from '@/providers/NotificationsProvider';

export const Providers = ({ children }: PropsWithChildren) => {
    return (
        <StrictMode>
            <ErrorBoundary fallback={ErrorScreen}>
                <QueryProvider>
                    <LoginProvider>
                        <NotificationsProvider>
                            <TamaguiProvider>
                                <StatusBar hidden />
                                <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
                            </TamaguiProvider>
                        </NotificationsProvider>
                    </LoginProvider>
                </QueryProvider>
            </ErrorBoundary>
        </StrictMode>
    );
};

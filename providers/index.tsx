import { PropsWithChildren, StrictMode } from "react";
import { TamaguiProvider } from "@/providers/TamaguiProvider";
import { QueryProvider } from "@/providers/QueryClient";
import { StatusBar } from "expo-status-bar";
import { ErrorBoundary } from "@sentry/react";
import { ErrorScreen } from "@/screens/ErrorScreen";
import { LoginProvider } from "@/providers/LoginProvider";
import { NotificationsProvider } from "@/providers/NotificationsProvider";
import { SafeAreaProvider } from "@/providers/SafeAreaProvider";

export const Providers = ({ children }: PropsWithChildren) => {
	return (
		<StrictMode>
			<QueryProvider>
				<TamaguiProvider>
					<SafeAreaProvider>
						<ErrorBoundary fallback={ErrorScreen}>
							<LoginProvider>
								<NotificationsProvider>
									<StatusBar hidden />
									{children}
								</NotificationsProvider>
							</LoginProvider>
						</ErrorBoundary>
					</SafeAreaProvider>
				</TamaguiProvider>
			</QueryProvider>
		</StrictMode>
	);
};

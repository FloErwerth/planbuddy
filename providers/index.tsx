import { StatusBar } from "expo-status-bar";
import { type PropsWithChildren, StrictMode } from "react";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { UserSearchProvider } from "@/components/UserSearch";
import { AuthenticationProvider } from "@/providers/AuthenticationProvider";
import { LoginProvider } from "@/providers/LoginProvider";
import { NotificationsProvider } from "@/providers/NotificationsProvider";
import { QueryProvider } from "@/providers/QueryClient";
import { SafeAreaProvider } from "@/providers/SafeAreaProvider";
import { TamaguiProvider } from "@/providers/TamaguiProvider";

export const Providers = ({ children }: PropsWithChildren) => {
	return (
		<StrictMode>
			<KeyboardProvider>
				<QueryProvider>
					<AuthenticationProvider>
						<UserSearchProvider>
							<TamaguiProvider>
								<SafeAreaProvider>
									<LoginProvider>
										<NotificationsProvider>
											<StatusBar hidden />
											{children}
										</NotificationsProvider>
									</LoginProvider>
								</SafeAreaProvider>
							</TamaguiProvider>
						</UserSearchProvider>
					</AuthenticationProvider>
				</QueryProvider>
			</KeyboardProvider>
		</StrictMode>
	);
};

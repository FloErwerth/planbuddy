import { type PropsWithChildren, StrictMode } from "react";
import { TamaguiProvider } from "@/providers/TamaguiProvider";
import { QueryProvider } from "@/providers/QueryClient";
import { StatusBar } from "expo-status-bar";
import { LoginProvider } from "@/providers/LoginProvider";
import { NotificationsProvider } from "@/providers/NotificationsProvider";
import { SafeAreaProvider } from "@/providers/SafeAreaProvider";
import { UserSearchProvider } from "@/components/UserSearch";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { AuthenticationProvider } from "@/providers/AuthenticationProvider";

export const Providers = ({ children }: PropsWithChildren) => {
	return (
		<StrictMode>
			<KeyboardProvider>
				<QueryProvider>
					<UserSearchProvider>
						<TamaguiProvider>
							<SafeAreaProvider>
								<AuthenticationProvider>
									<LoginProvider>
										<NotificationsProvider>
											<StatusBar hidden />
											{children}
										</NotificationsProvider>
									</LoginProvider>
								</AuthenticationProvider>
							</SafeAreaProvider>
						</TamaguiProvider>
					</UserSearchProvider>
				</QueryProvider>
			</KeyboardProvider>
		</StrictMode>
	);
};

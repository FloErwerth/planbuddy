import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { Stack } from "expo-router";
import { useAuthenticationContext } from "@/providers/AuthenticationProvider";

const defaultOptions: NativeStackNavigationOptions = {
	headerShown: false,
};

export default function LoginLayout() {
	const { isAuthenticatedWithSupabase, user } = useAuthenticationContext();
	console.log(isAuthenticatedWithSupabase, user);
	return (
		<Stack>
			<Stack.Protected guard={!isAuthenticatedWithSupabase && user === null}>
				<Stack.Screen options={defaultOptions} name="index" />
				<Stack.Screen options={defaultOptions} name="sendingEmail" />
				<Stack.Screen options={defaultOptions} name="token" />
			</Stack.Protected>
			<Stack.Protected guard={isAuthenticatedWithSupabase && user === null}>
				<Stack.Screen options={defaultOptions} name="onboarding" />
			</Stack.Protected>
		</Stack>
	);
}

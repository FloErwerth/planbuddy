import { Stack } from "expo-router";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";

const defaultOptions: NativeStackNavigationOptions = {
	headerShown: false,
};

export default function LoginLayout() {
	return (
		<Stack>
			<Stack.Screen options={defaultOptions} name="index" />
			<Stack.Screen options={defaultOptions} name="sendingEmail" />
			<Stack.Screen options={defaultOptions} name="token" />
			<Stack.Screen options={defaultOptions} name="onboarding" />
		</Stack>
	);
}

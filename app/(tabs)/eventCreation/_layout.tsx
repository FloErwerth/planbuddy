import { Stack } from "expo-router";
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";

const defaultOptions: NativeStackNavigationOptions = {
	headerShown: false,
};

export default function EventCreationStack() {
	return (
		<Stack>
			<Stack.Screen options={defaultOptions} name="index" />
		</Stack>
	);
}

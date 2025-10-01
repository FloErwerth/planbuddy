import { Stack } from "expo-router";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";

const defaultOptions: NativeStackNavigationOptions = {
	headerShown: false,
};

export default function InviteGuestsLayout() {
	return (
		<Stack>
			<Stack.Screen name="index" options={defaultOptions} />
			<Stack.Screen name="confirmInvitations" options={defaultOptions} />
		</Stack>
	);
}

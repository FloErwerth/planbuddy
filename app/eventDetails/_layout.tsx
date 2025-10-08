import { Stack } from "expo-router";
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { EventDetailsProvider } from "@/screens/EventDetails/EventDetailsProvider";

const defaultOptions: NativeStackNavigationOptions = {
	headerShown: false,
};
export default function EventDetailsLayout() {
	return (
		<EventDetailsProvider>
			<Stack>
				<Stack.Screen name="index" options={defaultOptions} />
				<Stack.Screen name="hosts" options={defaultOptions} />
				<Stack.Screen name="participants" options={defaultOptions} />
				<Stack.Screen name="editGuest" options={defaultOptions} />
				<Stack.Screen name="transferEvent" options={defaultOptions} />
				<Stack.Screen name="editEvent" options={defaultOptions} />
				<Stack.Screen name="inviteGuests" options={defaultOptions} />
				<Stack.Screen name="shareEvent" options={defaultOptions} />
			</Stack>
		</EventDetailsProvider>
	);
}

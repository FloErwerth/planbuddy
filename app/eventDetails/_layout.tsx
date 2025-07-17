import { Stack } from 'expo-router';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { EventDetailsProvider } from '@/screens/EventDetails/EventDetailsProvider';

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
                <Stack.Screen name="addFriends" options={defaultOptions} />
            </Stack>
        </EventDetailsProvider>
    );
}

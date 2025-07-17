import { Stack } from 'expo-router';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { EventCreationContextProvider } from '@/screens/EventCreation/EventCreationContext';

const defaultOptions: NativeStackNavigationOptions = {
    headerShown: false,
    animation: 'fade',
};

export default function EventCreationStack() {
    return (
        <EventCreationContextProvider>
            <Stack>
                <Stack.Screen options={defaultOptions} name="index" />
                <Stack.Screen options={defaultOptions} name="addFriends" />
            </Stack>
        </EventCreationContextProvider>
    );
}

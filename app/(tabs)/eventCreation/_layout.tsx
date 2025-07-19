import { Stack } from 'expo-router';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

const defaultOptions: NativeStackNavigationOptions = {
    headerShown: false,
    animation: 'fade',
};

export default function EventCreationStack() {
    return (
        <Stack>
            <Stack.Screen options={defaultOptions} name="index" />
        </Stack>
    );
}

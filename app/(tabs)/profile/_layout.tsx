import { Stack } from 'expo-router';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

const defaultOptions: NativeStackNavigationOptions = {
    headerShown: false,
    animation: 'fade',
};

export default function ProfileStack() {
    return (
        <Stack>
            <Stack.Screen options={defaultOptions} name="index" />
            <Stack.Screen options={defaultOptions} name="friendRequests" />
            <Stack.Screen options={defaultOptions} name="editProfile" />
            <Stack.Screen options={defaultOptions} name="friends" />
        </Stack>
    );
}

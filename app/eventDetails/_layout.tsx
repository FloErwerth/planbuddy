import { Stack } from 'expo-router';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

const defaultOptions: NativeStackNavigationOptions = {
  headerShown: false,
};
export default function EventDetailsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={defaultOptions} />
      <Stack.Screen name="hosts" options={defaultOptions} />
      <Stack.Screen name="participants" options={defaultOptions} />
    </Stack>
  );
}

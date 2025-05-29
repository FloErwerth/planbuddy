import { Stack } from 'expo-router';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

const defaultOptions: NativeStackNavigationOptions = {
  headerShown: false,
};
export default function SettingsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={defaultOptions} />
      <Stack.Screen name="editProfile" options={defaultOptions} />
    </Stack>
  );
}

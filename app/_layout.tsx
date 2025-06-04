import { SplashScreen, Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { Providers } from '@/providers';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

SplashScreen.preventAutoHideAsync();

const defaultOptions: NativeStackNavigationOptions = {
  headerShown: false,
  animation: 'fade',
  animationDuration: 0,
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Normal: require('../assets/fonts/Roboto-Regular.ttf'),
    Italic: require('../assets/fonts/Roboto-MediumItalic.ttf'),
    SemiBold: require('../assets/fonts/Roboto-SemiBold.ttf'),
    SemiBoldItalic: require('../assets/fonts/Roboto-SemiBoldItalic.ttf'),
    Bold: require('../assets/fonts/Roboto-Bold.ttf'),
    BoldItalic: require('../assets/fonts/Roboto-BoldItalic.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      setTimeout(SplashScreen.hideAsync, 1000);
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Providers>
      <Stack>
        <Stack.Screen name="(tabs)" options={defaultOptions} />
        <Stack.Screen name="createEvent" options={defaultOptions} />
        <Stack.Screen name="onboarding" options={defaultOptions} />
        <Stack.Screen
          name="eventDetails"
          options={{ ...defaultOptions, presentation: 'modal', animation: 'fade' }}
        />
        <Stack.Screen name="login" options={defaultOptions} />
      </Stack>
    </Providers>
  );
}

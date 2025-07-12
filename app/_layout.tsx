import { SplashScreen, Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { Providers } from '@/providers';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://468683226bfb2668906c6fee1941aa74@o4509455416229888.ingest.de.sentry.io/4509455421800528',

  enabled: false,
  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

SplashScreen.preventAutoHideAsync();

const defaultOptions: NativeStackNavigationOptions = {
  headerShown: false,
};

export default Sentry.wrap(function RootLayout() {
  const [fontsLoaded] = useFonts({
    Normal: require('../assets/fonts/Roboto-Regular.ttf'),
    Italic: require('../assets/fonts/Roboto-MediumItalic.ttf'),
    SemiBold: require('../assets/fonts/Roboto-SemiBold.ttf'),
    SemiBoldItalic: require('../assets/fonts/Roboto-SemiBoldItalic.ttf'),
    Bold: require('../assets/fonts/Roboto-Bold.ttf'),
    BoldItalic: require('../assets/fonts/Roboto-BoldItalic.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Providers>
      <Stack>
        <Stack.Screen name="index" options={defaultOptions} />
        <Stack.Screen name="onboarding" options={defaultOptions} />
        <Stack.Screen name="(tabs)" options={defaultOptions} />

        <Stack.Screen name="joinEvent" options={defaultOptions} />
        <Stack.Screen name="friends" options={defaultOptions} />
        <Stack.Screen name="eventDetails" options={{ ...defaultOptions, presentation: 'modal', animation: 'fade' }} />
        <Stack.Screen name="login" options={defaultOptions} />
        <Stack.Screen name="token" options={defaultOptions} />
      </Stack>
    </Providers>
  );
});

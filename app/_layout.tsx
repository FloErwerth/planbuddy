import { SplashScreen, Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { useCallback, useEffect, useState } from 'react';
import { Providers } from '@/providers';
import { CallbackOrObserver, FirebaseAuthTypes, getAuth } from '@react-native-firebase/auth';
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleOnAuthStateChange: CallbackOrObserver<FirebaseAuthTypes.AuthListenerCallback> =
    useCallback((user: FirebaseAuthTypes.User | null) => {
      setIsLoggedIn(!!user);
    }, []);

  useEffect(() => {
    getAuth().onAuthStateChanged(handleOnAuthStateChange);
  }, [handleOnAuthStateChange]);

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
      <Stack screenOptions={{ freezeOnBlur: true }}>
        <Stack.Protected guard={isLoggedIn}>
          <Stack.Screen name="(tabs)" options={defaultOptions} />
          <Stack.Screen name="createEvent" options={defaultOptions} />
          <Stack.Screen
            name="eventDetails"
            options={{ ...defaultOptions, presentation: 'modal', animation: 'fade' }}
          />
        </Stack.Protected>
        <Stack.Protected guard={!isLoggedIn}>
          <Stack.Screen name="login" options={defaultOptions} />
          <Stack.Screen name="register" options={defaultOptions} />
        </Stack.Protected>
      </Stack>
    </Providers>
  );
}

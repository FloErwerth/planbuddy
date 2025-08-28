import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Providers } from '@/providers';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import * as Sentry from '@sentry/react-native';
import { useCheckLoginStateOnAppStart } from '@/hooks/useCheckLoginState';

import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
    duration: 1000,
    fade: true,
});

const defaultOptions: NativeStackNavigationOptions = {
    headerShown: false,
};

const AppStack = () => {
    useCheckLoginStateOnAppStart();

    return (
        <Stack>
            <Stack.Screen name="index" options={defaultOptions} />
            <Stack.Screen name="(tabs)" options={defaultOptions} />
            <Stack.Screen name="eventDetails" options={defaultOptions} />
            <Stack.Screen name="authentication" options={defaultOptions} />
        </Stack>
    );
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
            <AppStack />
        </Providers>
    );
});

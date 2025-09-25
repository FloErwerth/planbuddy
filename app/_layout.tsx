import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { Providers } from "@/providers";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import * as Sentry from "@sentry/react-native";
import { useCheckLoginStateOnAppStart } from "@/hooks/useCheckLoginState";
import {
	PlusJakartaSans_400Regular as Normal,
	PlusJakartaSans_400Regular_Italic as Italic,
	PlusJakartaSans_600SemiBold as SemiBold,
	PlusJakartaSans_600SemiBold_Italic as SemiBoldItalic,
	PlusJakartaSans_700Bold as Bold,
	PlusJakartaSans_700Bold_Italic as BoldItalic,
} from "@expo-google-fonts/plus-jakarta-sans";
import * as Notifications from "expo-notifications";

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
	navigationBarHidden: true,
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
		Normal,
		Italic,
		SemiBold,
		SemiBoldItalic,
		Bold,
		BoldItalic,
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

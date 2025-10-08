import {
	NunitoSans_700Bold as Bold,
	NunitoSans_700Bold_Italic as BoldItalic,
	NunitoSans_400Regular_Italic as Italic,
	NunitoSans_400Regular as Normal,
	NunitoSans_600SemiBold as SemiBold,
	NunitoSans_600SemiBold_Italic as SemiBoldItalic,
} from "@expo-google-fonts/nunito-sans";
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Platform } from "react-native";
import { Providers } from "@/providers";
import { useAuthenticationContext } from "@/providers/AuthenticationProvider";

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
	const { isAuthenticatedWithSupabase, user } = useAuthenticationContext();

	if (Platform.OS === "web") {
		return null;
	}

	return (
		<Stack>
			<Stack.Protected guard={isAuthenticatedWithSupabase && user !== null}>
				<Stack.Screen name="(tabs)" options={defaultOptions} />
				<Stack.Screen name="eventDetails" options={defaultOptions} />
				<Stack.Screen name="joinEvent/[eventId]/index" options={defaultOptions} />
			</Stack.Protected>
			<Stack.Protected guard={!isAuthenticatedWithSupabase || user === null}>
				<Stack.Screen name="index" options={defaultOptions} />
				<Stack.Screen name="authentication" options={defaultOptions} />
			</Stack.Protected>
		</Stack>
	);
};

export default function RootLayout() {
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
}

import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { Providers } from "@/providers";
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import {
	NunitoSans_400Regular as Normal,
	NunitoSans_400Regular_Italic as Italic,
	NunitoSans_600SemiBold as SemiBold,
	NunitoSans_600SemiBold_Italic as SemiBoldItalic,
	NunitoSans_700Bold as Bold,
	NunitoSans_700Bold_Italic as BoldItalic,
} from "@expo-google-fonts/nunito-sans";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
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
				<Stack.Screen name="index" options={defaultOptions} />
				<Stack.Screen name="(tabs)" options={defaultOptions} />
				<Stack.Screen name="eventDetails" options={defaultOptions} />
				<Stack.Screen name="joinEvent/[eventId]/index" options={defaultOptions} />
			</Stack.Protected>
			<Stack.Screen name="authentication" options={defaultOptions} />
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

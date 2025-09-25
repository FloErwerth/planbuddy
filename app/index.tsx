import { ScrollableScreen } from "@/components/Screen";
import { LoginForm } from "@/screens/Authentication";
import { Image } from "expo-image";
import { SizableText, View } from "tamagui";

export default function InitialAppScreen() {
	return (
		<ScrollableScreen flex={1}>
			<View flex={0.33} justifyContent="center" alignItems="center" gap="$4">
				<Image source={require("@/assets/images/splash-icon.png")} style={{ width: 300, height: 135 }} />
				<SizableText size="$11" fontWeight="700" textAlign="center">
					Willkommen bei PlanBuddy
				</SizableText>
				<SizableText size="$6" alignSelf="center" width="90%" fontWeight="$4" textAlign="center">
					Erstelle mühelos Events mit deinen Freunden
				</SizableText>
			</View>
			<LoginForm />
		</ScrollableScreen>
	);
}

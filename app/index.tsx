import { Image } from "expo-image";
import { SizableText, View } from "tamagui";
import splashIcon from "@/assets/images/splash-icon.png";
import { ScrollableScreen } from "@/components/Screen";
import { useTranslation } from "@/hooks/useTranslation";
import { LoginForm } from "@/screens/Authentication";

export default function InitialAppScreen() {
	const { t } = useTranslation();

	return (
		<ScrollableScreen flex={1}>
			<View flex={0.33} justifyContent="center" alignItems="center" gap="$4">
				<Image source={splashIcon} style={{ width: 300, height: 135 }} />
				<SizableText size="$11" fontWeight="700" textAlign="center">
					{t("welcome.title")}
				</SizableText>
				<SizableText size="$6" alignSelf="center" width="90%" fontWeight="$4" textAlign="center">
					{t("welcome.subtitle")}
				</SizableText>
			</View>
			<LoginForm />
		</ScrollableScreen>
	);
}

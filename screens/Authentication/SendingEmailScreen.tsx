import { Check } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import { useEffect, useState } from "react";
import { SizableText, useWindowDimensions, View } from "tamagui";
import spinner from "@/assets/animations/spinner.json";
import { useSetTimeout } from "@/hooks/useSetTimeout";
import { useTranslation } from "@/hooks/useTranslation";

export const SendingEmailScreen = () => {
	const { t } = useTranslation();
	const [emailSent, setEmailSent] = useState(false);
	const { setTimeout: setEmailSentTimeout, clear: clearEmailSentTimeout } = useSetTimeout();
	const { setTimeout: setRedirectTimeout, clear: clearRedirectTimeout } = useSetTimeout();
	const { width, height } = useWindowDimensions();

	const measures = {
		left: 0,
		top: 0,
		width,
		height,
	};

	useEffect(() => {
		setEmailSentTimeout(() => {
			setEmailSent(true);
			setRedirectTimeout(() => {
				router.replace("/authentication/token");
			}, 1500);
		}, 3200);

		return () => {
			clearEmailSentTimeout();
			clearRedirectTimeout();
		};
	}, [clearEmailSentTimeout, clearRedirectTimeout, setEmailSentTimeout, setRedirectTimeout]);

	return (
		<View flex={1} justifyContent="center" gap="$2">
			<View width="100%" height={75} alignItems="center" justifyContent="center">
				{emailSent ? (
					<View gap="$3" justifyContent="center" alignItems="center" {...measures}>
						<View
							animation="bouncy"
							width={65}
							justifyContent="center"
							alignItems="center"
							height={65}
							enterStyle={{ scale: 0.8, opacity: 0 }}
							borderRadius="$12"
							backgroundColor="$primary"
						>
							<Check size="$4" animation="bouncy" enterStyle={{ size: "$1" }} color="$background" />
						</View>
					</View>
				) : (
					<LottieView autoPlay loop style={{ width: "100%", height: "100%" }} source={spinner} />
				)}
			</View>
			<View alignItems="center">
				{emailSent ? <SizableText size="$6">{t("auth.sendingEmail.done")}</SizableText> : <SizableText size="$6">{t("auth.sendingEmail.sending")}</SizableText>}
			</View>
		</View>
	);
};

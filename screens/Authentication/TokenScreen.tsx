import { router } from "expo-router";
import { useState } from "react";
import { debounce, SizableText, View } from "tamagui";
import { supabase } from "@/api/supabase";
import { BackButton } from "@/components/BackButton";
import { Screen } from "@/components/Screen";
import { TokenInput } from "@/components/TokenInput/TokenInput";
import { Button } from "@/components/tamagui/Button";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuthenticationContext } from "@/providers/AuthenticationProvider";
import { useLoginContext } from "@/providers/LoginProvider";

export const TokenScreen = () => {
	const { t } = useTranslation();
	const { email, resetTokenPage } = useLoginContext();
	const [tokenError, setTokenError] = useState<string>("");
	const { recheckLoginState } = useAuthenticationContext();
	const [token, setToken] = useState<string>("");

	const onComplete = async () => {
		try {
			const { data, error } = await supabase.auth.verifyOtp({
				email,
				token,
				type: "email",
			});

			if (error || !data.session || !data.user) {
				console.error(error?.code);
				switch (error?.code) {
					case "invalid_credentials":
					case "otp_expired":
						setTokenError(t("auth.token.invalidCode"));
				}
				return;
			}

			await supabase.auth.setSession(data.session);
			await recheckLoginState();
			resetTokenPage();
		} catch (e) {
			if (e instanceof Error) {
				console.error(e.message);
			}
		}
	};

	const handleChangeMail = () => {
		router.replace("/");
	};

	return (
		<Screen back={<BackButton href="/" />} flex={1} title={t("auth.token.title")}>
			<View flex={1} justifyContent="center" gap="$6">
				<SizableText size="$8" fontWeight="bold" textAlign="center">
					{t("auth.token.heading")}
				</SizableText>
				<SizableText textAlign="center">{t("auth.token.description", { email })}</SizableText>
				<View gap="$2">
					{tokenError && (
						<SizableText
							animation="bouncy"
							enterStyle={{
								height: 0,
								opacity: 0,
								scale: 0.9,
							}}
							pointerEvents="none"
							theme="error"
						>
							{tokenError}
						</SizableText>
					)}
					<TokenInput onFilled={setToken} showErrorColors={!!tokenError} />
				</View>
			</View>
			<View gap="$1">
				<Button size="$5" elevationAndroid="$0" fontWeight="700" onPress={debounce(onComplete, 200, true)}>
					{t("auth.token.verify")}
				</Button>
				<Button size="$5" variant="transparent" fontWeight="700" onPress={debounce(handleChangeMail, 200, true)}>
					{t("auth.token.requestNewCode")}
				</Button>
			</View>
		</Screen>
	);
};

import { supabase } from "@/api/supabase";
import { BackButton } from "@/components/BackButton";
import { Screen } from "@/components/Screen";
import { TokenInput } from "@/components/TokenInput/TokenInput";
import { Button } from "@/components/tamagui/Button";
import { useCheckLoginState } from "@/hooks/useCheckLoginState";
import { useLoginContext } from "@/providers/LoginProvider";
import { useSetUser } from "@/store/authentication";
import { router } from "expo-router";
import { useState } from "react";
import { debounce, SizableText, View } from "tamagui";

export const TokenScreen = () => {
	const { email, resetTokenPage } = useLoginContext();
	const [token, setToken] = useState<string[]>([" ", " ", " ", " ", " ", " "]);
	const [previousToken, setPreviousToken] = useState<string[]>([]);
	const setUser = useSetUser();
	const [tokenError, setTokenError] = useState<string>("");
	const hasValue = !token.every((val) => !val);
	const { handleCheckLoginstate } = useCheckLoginState();

	const onComplete = async () => {
		if (!email || token.join("") === previousToken.join("") || !hasValue) {
			return;
		}
		setPreviousToken(token);

		try {
			const { data, error } = await supabase.auth.verifyOtp({
				email: email,
				token: token.join(""),
				type: "email",
			});

			if (error || !data.session || !data.user) {
				console.error(error?.code);
				switch (error?.code) {
					case "invalid_credentials":
					case "otp_expired":
						setTokenError("Der eingegebene Code ist ungültig");
				}
				return;
			}

			await handleCheckLoginstate(data.user);
			await supabase.auth.setSession(data.session);
			resetTokenPage();
			setUser(data.user);
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
		<>
			<Screen back={<BackButton href="/" />} flex={1} title="Verifizierung">
				<View flex={1} justifyContent="center" gap="$6">
					<SizableText size="$8" fontWeight="bold" textAlign="center">
						Checke deine E-Mails
					</SizableText>
					<SizableText textAlign="center">Wir haben dir einen 6-stelligen Code an {email} gesendet. Bitte gib den dort angezeigten Code unten ein</SizableText>
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
						<TokenInput value={token} onChange={setToken} />
					</View>
				</View>
				<View gap="$1">
					<Button size="$5" elevationAndroid="$0" fontWeight="700" onPress={debounce(onComplete, 200, true)}>
						Verifizieren
					</Button>
					<Button size="$5" variant="transparent" fontWeight="700" onPress={debounce(handleChangeMail, 200, true)}>
						Neuen Code anfordern
					</Button>
				</View>
			</Screen>
		</>
	);
};

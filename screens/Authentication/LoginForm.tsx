import { supabase } from "@/api/supabase";
import { FormInput } from "@/components/FormFields";
import { Button } from "@/components/tamagui/Button";
import { useLoginContext } from "@/providers/LoginProvider";
import { LoginSchema, loginSchema } from "@/screens/Authentication/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import { debounce, SizableText, View } from "tamagui";

export const LoginForm = () => {
	const { email: previousEmail, loginError, setLoginError, setEmail, startResendTokenTimer, resendTokenTime, resetTokenPage } = useLoginContext();

	const form = useForm({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: previousEmail },
	});

	const signUpWithPhone = async ({ email }: LoginSchema) => {
		router.push({ pathname: "/authentication/sendingEmail", params: { email } });

		try {
			const loginResult = await supabase.auth.signInWithOtp({
				email,
			});

			if (loginResult.error) {
				resetTokenPage();
				router.replace("/");
				switch (loginResult.error.code) {
					case "over_email_send_rate_limit":
						startResendTokenTimer();
						setLoginError("Aus Sicherheitsgründen kannst Du nur alle 60 Sekunden einen neuen Code anfordern.");
						break;
					case "email_exists":
						setLoginError("Diese E-Mail ist bereits vergeben.");
						break;
					case "over_request_rate_limit":
					default:
						setLoginError("Es ist ein Fehler aufgetreten, bitte versuche es erneut");
				}
			}
		} catch (e) {
			if (e instanceof Error) {
				console.error(e.message);
			}
			// log error in sentry
		}

		// set this here to make sure the user does not see this
		setEmail(email);
		setLoginError("");
	};

	return (
		<>
			<View gap="$4" flex={1}>
				<FormProvider {...form}>
					<SizableText size="$5" textAlign="center">
						Melde dich hier ganz bequem mit deiner E-Mail an
					</SizableText>
					<View gap="$2">
						<FormInput
							theme={loginError ? "error" : "default"}
							autoComplete="email"
							textContentType="emailAddress"
							keyboardType="email-address"
							autoCorrect={false}
							placeholder="max@mustermann@email.de"
							size="$5"
							name="email"
							autoCapitalize="none"
						/>
						{loginError && (
							<SizableText top="$-1.5" theme="error">
								{loginError}
							</SizableText>
						)}
						<Button size="$5" fontWeight="700" disabled={resendTokenTime > 0} onPress={debounce(form.handleSubmit(signUpWithPhone), 200, true)}>
							{resendTokenTime > 0 ? `Code erneut senden (${resendTokenTime}s)` : "Anmelden"}
						</Button>
					</View>
				</FormProvider>
			</View>
		</>
	);
};

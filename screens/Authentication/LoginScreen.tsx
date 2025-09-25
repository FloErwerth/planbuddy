import { FormInput } from "@/components/FormFields";
import { Button } from "@/components/tamagui/Button";
import { useLoginContext } from "@/providers/LoginProvider";
import { LoginSchema, loginSchema } from "@/screens/Authentication/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useNavigation } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { debounce, SizableText, View } from "tamagui";

export const LoginForm = () => {
	const navigation = useNavigation();
	const [hintSheetOpen, setHintSheetOpen] = useState(false);
	const { email: previousEmail, loginError, setLoginError, setEmail, setStartedLoginAttempt, startResendTokenTimer, resendTokenTime } = useLoginContext();

	const form = useForm({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: previousEmail },
	});

	const resetForm = useCallback(() => {
		form.reset({ email: previousEmail });
	}, [form, previousEmail]);

	useEffect(() => {
		const unsubscribe = navigation.addListener("focus", resetForm);
		return () => {
			unsubscribe();
		};
	}, [navigation, resetForm]);

	const signUpWithPhone = async ({ email }: LoginSchema) => {
		router.push({ pathname: "/authentication/sendingEmail", params: { email } });
		/*if (email === previousEmail && resendTokenTime > 0) {
			setHintSheetOpen(true);
			return;
		}

		router.push({ pathname: "/authentication/sendingEmail", params: { email } });

		try {
			const loginResult = await supabase.auth.signInWithOtp({
				email,
			});

			if (loginResult.error) {
				router.replace("/authentication");
				switch (loginResult.error.code) {
					case "over_request_rate_limit":
					case "over_email_send_rate_limit":
						// should never happen
						setLoginError(`Es wurden mit ${email} zu viele Loginversuche gemacht. Bitte versuche es später noch einmal.`);
						break;
					case "email_exists":
						setLoginError("Diese E-Mail ist bereits vergeben.");
						break;
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

		setEmail(email);
		startResendTokenTimer();*/
	};

	const handleEnterCode = () => {
		setHintSheetOpen(false);
		setStartedLoginAttempt(true);
		router.push("/authentication/token");
	};

	return (
		<>
			<View gap="$4" flex={1}>
				<FormProvider {...form}>
					<SizableText size="$5" textAlign="center">
						Melde dich hier ganz bequem mit deiner E-Mail an
					</SizableText>
					<View gap="$2">
						{loginError && <SizableText theme="error">{loginError}</SizableText>}
						<FormInput autoComplete="email" autoCorrect={false} placeholder="max@mustermann@email.de" size="$5" name="email" autoCapitalize="none" />
						<Button size="$5" fontWeight="700" onPress={debounce(form.handleSubmit(signUpWithPhone), 200, true)}>
							Anmelden
						</Button>
					</View>
				</FormProvider>
			</View>
		</>
	);
};

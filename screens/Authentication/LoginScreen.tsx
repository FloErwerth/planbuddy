import { supabase } from "@/api/supabase";
import { BackButton } from "@/components/BackButton";
import { FormInput } from "@/components/FormFields";
import { Screen } from "@/components/Screen";
import { Button } from "@/components/tamagui/Button";
import { Separator } from "@/components/tamagui/Separator";
import { Sheet } from "@/components/tamagui/Sheet";
import { useLoginContext } from "@/providers/LoginProvider";
import { LoginSchema, loginSchema } from "@/screens/Authentication/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useNavigation } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { debounce, SizableText, View } from "tamagui";

export const LoginScreen = () => {
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
		if (email === previousEmail && resendTokenTime > 0) {
			setHintSheetOpen(true);
			return;
		}

		router.push({ pathname: "/authentication/sendingEmail", params: { email } });

		try {
			const loginResult = await supabase.auth.signInWithOtp({
				email,
			});

			if (loginResult.error) {
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
		startResendTokenTimer();
	};

	const handleEnterCode = () => {
		setHintSheetOpen(false);
		setStartedLoginAttempt(true);
		router.push("/authentication/token");
	};

	return (
		<>
			<Screen back={<BackButton href="/" />} title="Anmelden" flex={1}>
				<FormProvider {...form}>
					<SizableText size="$8" textAlign="center">
						Melde dich ganz bequem ohne Passwort an
					</SizableText>
					{loginError && <SizableText theme="error">{loginError}</SizableText>}
					<FormInput label="Email" name="email" autoCapitalize="none" />
					<Button onPress={debounce(form.handleSubmit(signUpWithPhone), 200, true)}>Anmelden</Button>
				</FormProvider>
			</Screen>
			<Sheet snapPoints={undefined} snapPointsMode="fit" open={hintSheetOpen} onOpenChange={setHintSheetOpen}>
				<Screen>
					<SizableText size="$6">Gleiche E-Mail</SizableText>
					<SizableText>Es sieht so aus als hättest Du die gleiche E-Mail wie in deinem vorherigen Login-Versuch benutzt.</SizableText>
					<View gap="$2">
						<SizableText>Du kannst Dir erneut einen Code an {previousEmail} verschicken</SizableText>
						<Button onPress={debounce(form.handleSubmit(signUpWithPhone), 200, true)} disabled={resendTokenTime > 0}>
							{resendTokenTime > 0 ? `Code in ${resendTokenTime} erneut versenden` : `Code erneut versenden`}
						</Button>
					</View>
					<Separator />
					<View gap="$2">
						<SizableText>Oder, wenn Du doch einen Code erhalten hast:</SizableText>
						<Button onPress={debounce(handleEnterCode, 200, true)}>Deinen Code eingeben</Button>
					</View>
				</Screen>
			</Sheet>
		</>
	);
};

import { FormProvider, useForm } from "react-hook-form";
import { onboardingSchema, type OnboardingSchema } from "@/api/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Screen } from "@/components/Screen";
import { SizableText, View } from "tamagui";
import { AvatarImagePicker } from "@/components/AvatarImagePicker";
import { FormInput } from "@/components/FormFields";
import { Button } from "@/components/tamagui/Button";
import { useInsertUserMutation } from "@/api/user/insertUser";
import { useUploadProfilePictureMutation } from "@/api/user/uploadProfilePicture";
import { useAuthenticationContext } from "@/providers/AuthenticationProvider";
import { supabase } from "@/api/supabase";
import { userSchema } from "@/api/user/types";

export const OnboardingScreen = () => {
	const form = useForm<OnboardingSchema>({
		resolver: zodResolver(onboardingSchema),
	});
	const { setUser } = useAuthenticationContext();
	const { mutateAsync: insertUser } = useInsertUserMutation();

	const [file, setFile] = useState<string | null>(null);
	const { mutateAsync: uploadImage } = useUploadProfilePictureMutation();

	const completeOnboarding = async ({ firstName, lastName }: OnboardingSchema) => {
		try {
			const supabaseUser = await supabase.auth.getUser();
			const inserUserResult = await insertUser({
				firstName,
				lastName,
				email: supabaseUser.data.user?.email,
			});

			if (!inserUserResult) {
				//todo: display error here
				return;
			}

			const parsedUser = userSchema.safeParse(inserUserResult);
			if (parsedUser.error) {
				//todo: display error here
				return;
			}

			setUser(parsedUser.data);

			if (file !== null) {
				await uploadImage(file);
			}
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<Screen flex={1}>
			<SizableText size="$8" textAlign="center">
				Herzlich Willkommen bei PlanBuddy!
			</SizableText>
			<SizableText>Wenn Du willst such Dir ein schickes Profilbild aus und lade es hoch</SizableText>
			<AvatarImagePicker image={file} editable onImageDeleted={() => setFile(null)} onImageSelected={setFile} />
			<SizableText>Damit deine Freunde dich ohne Probleme finden können gib uns bitte folgende Informationen. Diese Angaben sind alle optional.</SizableText>
			<FormProvider {...form}>
				<FormInput autoComplete="given-name" textContentType="givenName" label="Vorname" name="firstName" />
				<FormInput autoComplete="family-name" textContentType="familyName" label="Nachname" name="lastName" />
			</FormProvider>
			<View flex={1} />
			<Button onPress={form.handleSubmit(completeOnboarding)}>Abschließen</Button>
		</Screen>
	);
};

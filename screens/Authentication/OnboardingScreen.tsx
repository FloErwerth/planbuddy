import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { SizableText, View } from "tamagui";
import { supabase } from "@/api/supabase";
import { type OnboardingSchema, onboardingSchema } from "@/api/types";
import { useInsertUserMutation } from "@/api/user/insertUser";
import { userSchema } from "@/api/user/types";
import { useUploadProfilePictureMutation } from "@/api/user/uploadProfilePicture";
import { AvatarImagePicker } from "@/components/AvatarImagePicker";
import { FormInput } from "@/components/FormFields";
import { Screen } from "@/components/Screen";
import { Button } from "@/components/tamagui/Button";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuthenticationContext } from "@/providers/AuthenticationProvider";

export const OnboardingScreen = () => {
	const { t } = useTranslation();
	const form = useForm<OnboardingSchema>({
		resolver: zodResolver(onboardingSchema),
	});
	const { setUser } = useAuthenticationContext();
	const { mutateAsync: insertUser } = useInsertUserMutation();

	const [file, setFile] = useState<string | undefined>(undefined);
	const { mutateAsync: uploadImage } = useUploadProfilePictureMutation();

	const completeOnboarding = async ({ firstName, lastName }: OnboardingSchema) => {
		try {
			const supabaseUser = await supabase.auth.getUser();
			const inserUserResult = await insertUser({
				id: supabaseUser.data.user?.id,
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

			if (file !== undefined) {
				await uploadImage(file);
			}
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<Screen flex={1}>
			<SizableText size="$8" textAlign="center">
				{t("welcome.title")}
			</SizableText>
			<SizableText>{t("auth.onboarding.description")}</SizableText>
			<AvatarImagePicker image={file} editable onImageDeleted={() => setFile(undefined)} onImageSelected={setFile} />
			<SizableText>{t("auth.onboarding.description")}</SizableText>
			<FormProvider {...form}>
				<FormInput autoComplete="given-name" textContentType="givenName" label={t("auth.onboarding.firstName")} name="firstName" />
				<FormInput autoComplete="family-name" textContentType="familyName" label={t("auth.onboarding.lastName")} name="lastName" />
			</FormProvider>
			<View flex={1} />
			<Button onPress={form.handleSubmit(completeOnboarding)}>{t("auth.onboarding.complete")}</Button>
		</Screen>
	);
};

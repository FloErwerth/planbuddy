import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "@tamagui/lucide-icons";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SizableText, View } from "tamagui";
import { type OnboardingSchema, onboardingSchema } from "@/api/types";
import { useDeleteProfilePictureMutation } from "@/api/user/deleteUserProfile";
import { useGetUserQuery } from "@/api/user/getUser";
import { useProfileImageQuery } from "@/api/user/profilePicture";
import { useUpdateUserMutation } from "@/api/user/updateUser";
import { useUploadProfilePictureMutation } from "@/api/user/uploadProfilePicture";
import { AvatarImagePicker } from "@/components/AvatarImagePicker";
import { BackButton } from "@/components/BackButton";
import { FormInput } from "@/components/FormFields";
import { Screen } from "@/components/Screen";
import { Button } from "@/components/tamagui/Button";
import { Dialog } from "@/components/tamagui/Dialog";

export const EditProfileScreen = () => {
	const [isLoading, setIsLoading] = useState(false);
	const { data: user } = useGetUserQuery();
	const { mutate: updateUser } = useUpdateUserMutation();
	const { data: userImage } = useProfileImageQuery(user?.id);
	const { mutate: updateImage } = useUploadProfilePictureMutation();
	const { mutateAsync: deleteImage } = useDeleteProfilePictureMutation();
	const [deleteUserModalOpen, setDeleteUserModalOpen] = useState(false);
	const { t } = useTranslation();

	const form = useForm<OnboardingSchema>({
		resolver: zodResolver(onboardingSchema),
	});

	useEffect(() => {
		if (user) {
			form.reset(user);
		}
	}, [form, user]);

	const handleSubmit = form.handleSubmit(async (data) => {
		setIsLoading(true);

		updateUser({ updatedUser: data, onSuccess: () => setIsLoading(false) });
		setIsLoading(false);
	});

	const handleImageDeletion = async () => {
		await deleteImage();
	};

	const disabled = !form.formState.isDirty || isLoading;

	return (
		<>
			<Screen
				flex={1}
				back={<BackButton href="/(tabs)/profile" />}
				action={
					<Button onPress={() => setDeleteUserModalOpen(true)} theme="error" backgroundColor="$backgroundColor" variant="round">
						<Trash size="$1" scale={0.75} />
					</Button>
				}
				titleKey="profile.edit"
			>
				<View flex={1} gap="$4">
					<AvatarImagePicker editable onImageDeleted={handleImageDeletion} image={userImage || undefined} onImageSelected={updateImage} />

					<FormProvider {...form}>
						<FormInput labelKey="profile.email" name="email" editable={false} disabled value={user?.email} />
						<FormInput labelKey="profile.firstName" name="firstName" />
						<FormInput labelKey="profile.lastName" name="lastName" />
					</FormProvider>
				</View>

				<Button onPress={handleSubmit} disabled={disabled} animation="bouncy">
					{t("profile.submitChanges")}
				</Button>
			</Screen>
			<Dialog open={deleteUserModalOpen} onOpenChange={setDeleteUserModalOpen}>
				<SizableText size="$6">{t("profile.deleteAccountTitle")}</SizableText>
				<SizableText>{t("profile.deleteAccountWarning")}</SizableText>

				<SizableText>{t("profile.deleteAccountEventsWarning")}</SizableText>
				<View gap="$2">
					<Button>{t("profile.deleteAccount")}</Button>
					<Button onPress={() => setDeleteUserModalOpen(false)} variant="secondary">
						{t("common.cancel")}
					</Button>
				</View>
			</Dialog>
		</>
	);
};

import { type DialogProps, SizableText, View } from "tamagui";
import { useAllEventsQuery } from "@/api/events/allEvents";
import { useDeleteUserMutation } from "@/api/user/deleteUser";
import { Button } from "@/components/tamagui/Button";
import { Dialog } from "@/components/tamagui/Dialog";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuthenticationContext } from "@/providers/AuthenticationProvider";

export const DeleteUserDialog = (props: DialogProps) => {
	const { data: events } = useAllEventsQuery();
	const { user, logout } = useAuthenticationContext();
	const isCreator = events?.some((event) => event.creatorId === user?.id);
	const { mutateAsync: deleteUserFromDB } = useDeleteUserMutation();
	const { t } = useTranslation();

	const handleDeleteAccount = async () => {
		await deleteUserFromDB();
		await logout();
	};

	return (
		<Dialog {...props}>
			<SizableText textAlign="center" size="$6">
				{t("profile.deleteAccountTitle")}
			</SizableText>
			{isCreator && (
				<>
					<SizableText>{t("profile.deleteAccountCreatorWarning")}</SizableText>
					<SizableText>{t("profile.deleteAccountCreatorWarning2")}</SizableText>
				</>
			)}
			<SizableText>{t("profile.deleteAccountConfirm")}</SizableText>
			<View gap="$2">
				<Button onPress={handleDeleteAccount}>{t("profile.deleteAccount")}</Button>
				<Button variant="secondary">{t("common.cancel")}</Button>
			</View>
		</Dialog>
	);
};

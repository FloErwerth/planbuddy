import { DialogProps, SizableText, View } from "tamagui";
import { Dialog } from "@/components/tamagui/Dialog";
import { useEventsQuery } from "@/api/events/queries";
import { useGetUser } from "@/store/authentication";
import { Button } from "@/components/tamagui/Button";
import { useDeleteUserMutation } from "@/api/user";
import { useLogout } from "@/api/supabase";

export const DeleteUserDialog = (props: DialogProps) => {
	const { data: events } = useEventsQuery();
	const user = useGetUser();
	const logout = useLogout();
	const isCreator = events?.some((event) => event.creatorId === user?.id);
	const { mutateAsync: deleteUserFromDB } = useDeleteUserMutation();

	const handleDeleteAccount = async () => {
		await deleteUserFromDB();
		await logout();
	};

	return (
		<Dialog {...props}>
			<SizableText textAlign="center" size="$6">
				Account löschen?
			</SizableText>
			{isCreator && (
				<>
					<SizableText>Du hast noch Events, in denen Du als Ersteller:in eingetragen bist.</SizableText>
					<SizableText>Wenn Du deinen Account löschsts, dann werden auch deine erstellen Events gelöscht.</SizableText>
				</>
			)}
			<SizableText>Bist Du Dir sicher, dass Du deinen Account löschen möchtest?</SizableText>
			<View gap="$2">
				<Button onPress={handleDeleteAccount}>Account löschen</Button>
				<Button variant="secondary">Abbrechen</Button>
			</View>
		</Dialog>
	);
};

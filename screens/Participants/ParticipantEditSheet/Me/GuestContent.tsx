import { router } from "expo-router";
import { type DialogProps, SizableText, View } from "tamagui";
import { useDeleteParticipantMutation } from "@/api/participants/deleteParticipant";
import { Button } from "@/components/tamagui/Button";
import { useEventDetailsContext } from "@/screens/EventDetails/EventDetailsProvider";

type GuestContentProps = Pick<DialogProps, "onOpenChange">;
export const GuestContent = ({ onOpenChange }: GuestContentProps) => {
	const { mutateAsync: remove } = useDeleteParticipantMutation();
	const { editedGuest, setEditedGuest } = useEventDetailsContext();

	const onConfirmRemove = async () => {
		if (!editedGuest || !editedGuest.id) {
			return;
		}
		await remove(editedGuest.id);
		setEditedGuest(undefined);
		router.replace("/(tabs)");
	};

	return (
		<>
			<SizableText textAlign="center" size="$6">
				Event verlassen
			</SizableText>
			<SizableText>Bist Du dir sicher, dass Du das Event verlassen möchtest?</SizableText>{" "}
			<View gap="$2">
				<Button onPress={onConfirmRemove}>Event verlassen</Button>{" "}
				<Button onPress={() => onOpenChange?.(false)} variant="secondary">
					Abbrechen
				</Button>
			</View>
		</>
	);
};

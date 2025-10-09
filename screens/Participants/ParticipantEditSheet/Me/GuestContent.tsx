import { router } from "expo-router";
import { type DialogProps, SizableText, View } from "tamagui";
import { useDeleteParticipantMutation } from "@/api/participants/deleteParticipant";
import { Button } from "@/components/tamagui/Button";
import { useTranslation } from "@/hooks/useTranslation";
import { useEventDetailsContext } from "@/screens/EventDetails/EventDetailsProvider";

type GuestContentProps = Pick<DialogProps, "onOpenChange">;
export const GuestContent = ({ onOpenChange }: GuestContentProps) => {
	const { mutateAsync: remove } = useDeleteParticipantMutation();
	const { editedGuest, setEditedGuest } = useEventDetailsContext();
	const { t } = useTranslation();

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
				{t("events.leave")}
			</SizableText>
			<SizableText>{t("guests.leaveEventConfirm")}</SizableText>{" "}
			<View gap="$2">
				<Button onPress={onConfirmRemove}>{t("events.leave")}</Button>{" "}
				<Button onPress={() => onOpenChange?.(false)} variant="secondary">
					{t("common.cancel")}
				</Button>
			</View>
		</>
	);
};

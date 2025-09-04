import { DialogProps, SizableText, Spinner, View } from "tamagui";
import { Dialog } from "@/components/tamagui/Dialog";
import { Button } from "@/components/tamagui/Button";
import { useEventDetailsContext } from "@/screens/EventDetails/EventDetailsProvider";
import { useDeleteParticipantMutation } from "@/api/events/mutations";
import { useState } from "react";
import { router } from "expo-router";

export type ParticipantLeaveEventModalProps = DialogProps;

export const ParticipantLeaveEventDialog = (props: ParticipantLeaveEventModalProps) => {
	const { editedGuest } = useEventDetailsContext();
	const { mutateAsync: remove } = useDeleteParticipantMutation();
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleRemove = async () => {
		if (!editedGuest || !editedGuest.id || isLoading) {
			return;
		}
		setIsLoading(true);
		try {
			await remove(editedGuest.id);
			router.back();
		} catch (e) {
			console.log(e);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog modal={false} {...props}>
			<SizableText textAlign="center" size="$6">
				{editedGuest?.firstName} ausladen
			</SizableText>

			<SizableText size="$4">Bitte bestätige uns noch einmal, dass Du {editedGuest?.firstName} aus dem Event ausladen möchtest</SizableText>
			<View gap="$2">
				<Button size="$3" onPress={handleRemove}>
					{isLoading ? <Spinner /> : "Ausladen"}
				</Button>
				<Button size="$3" variant="secondary" onPress={() => props.onOpenChange?.(false)}>
					Abbrechen
				</Button>
			</View>
		</Dialog>
	);
};

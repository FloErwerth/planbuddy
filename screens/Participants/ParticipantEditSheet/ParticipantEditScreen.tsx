import { Screen } from "@/components/Screen";
import { Button } from "@/components/tamagui/Button";
import { useState } from "react";
import { useUpdateParticipationMutation } from "@/api/events/mutations";
import { useMe } from "@/api/events/refiners";
import { EditGuestOptions } from "@/screens/Participants/ParticipantEditSheet/Guest/EditGuestOptions";
import { ParticipantEditMeOptions } from "./Me/ParticipantEditMeOptions";
import { ParticipantLeaveEventDialog } from "@/screens/Participants/ParticipantEditSheet/Guest/ParticipantLeaveEventModal";
import { useEventDetailsContext } from "@/screens/EventDetails/EventDetailsProvider";
import { BackButton } from "@/components/BackButton";
import { MeLeaveEventDialog } from "@/screens/Participants/ParticipantEditSheet/Me/MeLeaveEventDialog";
import { router } from "expo-router";

export const ParticipantEditScreen = () => {
	const { eventId, editedGuest, setEditedGuest } = useEventDetailsContext();

	const { mutateAsync } = useUpdateParticipationMutation();
	const me = useMe(eventId);
	const isMe = editedGuest?.userId === me?.userId;
	const [leaveEventModalOpen, setLeaveEventModalOpen] = useState(false);

	const saveEditedGuest = async () => {
		if (!editedGuest) {
			return;
		}
		await mutateAsync({
			id: editedGuest.id!,
			participant: { role: editedGuest.role },
		});
		router.back();
	};

	const removeEditedGuest = async () => {
		setLeaveEventModalOpen(true);
	};

	return (
		<>
			<Screen
				back={<BackButton onPress={() => setEditedGuest(undefined)} />}
				title={isMe ? "Einladung verwalten" : `${editedGuest?.firstName} ${editedGuest?.lastName}`}
				flex={1}
			>
				{isMe ? <ParticipantEditMeOptions onRemoveGuest={removeEditedGuest} /> : <EditGuestOptions onRemoveGuest={removeEditedGuest} />}
			</Screen>
			<Button margin="$4" onPress={saveEditedGuest}>
				Speichern
			</Button>

			{isMe ? (
				<MeLeaveEventDialog open={leaveEventModalOpen} onOpenChange={setLeaveEventModalOpen} />
			) : (
				<ParticipantLeaveEventDialog open={leaveEventModalOpen} onOpenChange={setLeaveEventModalOpen} />
			)}
		</>
	);
};

import { DialogProps, SizableText, View } from "tamagui";
import { Button } from "@/components/tamagui/Button";
import { router } from "expo-router";
import { Dialog } from "@/components/tamagui/Dialog";
import { useParticipantsQuery } from "@/api/events/queries";
import { ParticipantRoleEnum } from "@/api/events/types";
import { useEventDetailsContext } from "@/screens/EventDetails/EventDetailsProvider";
import { StatusEnum } from "@/api/types";
import { useMe } from "@/api/events/refiners";
import { useDeleteEventAndEventImageMutation } from "@/api/events/mutations";
import { useState } from "react";

type CreatorContentProps = Pick<DialogProps, "onOpenChange">;

export const CreatorContent = ({ onOpenChange }: CreatorContentProps) => {
	const { eventId } = useEventDetailsContext();
	const me = useMe(eventId);
	const participants = useParticipantsQuery(eventId);
	const hasAdmin = participants.data?.some((participant) => participant.role === ParticipantRoleEnum.enum.ADMIN);
	const hasOtherGuests = participants.data?.some((participant) => {
		return participant.userId !== me?.userId && participant.status === StatusEnum.ACCEPTED;
	});
	const [chooseAdminSheetOpen, setChooseAdminSheetOpen] = useState(false);

	const { mutateAsync: deleteEvent } = useDeleteEventAndEventImageMutation();

	const handleDeleteEvent = async () => {
		await deleteEvent(eventId);
	};

	return (
		<>
			<SizableText textAlign="center" size="$6">
				Event verlassen
			</SizableText>
			{!hasAdmin ? (
				<>
					<SizableText size="$4">Achtung! Du bist als Creator des Events eingetragen und es gibt aktuell keinen weiteren verwaltenden Gast.</SizableText>

					{hasOtherGuests ? (
						<SizableText textAlign="center" size="$4">
							Bitte suche nun einen neuen Verwaltenden für das Event aus. Alternativ kannst Du das Event auch löschen.
						</SizableText>
					) : (
						<>
							<SizableText>Leider gibt es für dieses Event noch keine weiteren Teilnehmenden, daher kannst Du das Event auch niemandem übertragen.</SizableText>
							<SizableText>
								Wenn Du das Event dennoch nicht absagen möchtest, dann sage Teilnehmenden bescheid, dass die Teilnahme bestätigt werden muss, um das Event
								übertragen zu können.
							</SizableText>
							<SizableText>Du kannst natürlich dennoch das Event löschen, wenn Du das möchtest.</SizableText>
						</>
					)}
					<View gap="$2">
						{hasOtherGuests && <Button onPress={() => router.push("/eventDetails/transferEvent")}>Neuen Verwaltenden aussuchen</Button>}
						<Button onPress={handleDeleteEvent} variant={hasOtherGuests ? "secondary" : "primary"}>
							Event löschen
						</Button>
						{hasOtherGuests && <SizableText textAlign="center">oder</SizableText>}
						<Button variant="secondary" onPress={() => onOpenChange?.(false)}>
							Abbrechen
						</Button>
					</View>
					<Dialog fullscreen open={chooseAdminSheetOpen} onOpenChange={setChooseAdminSheetOpen}></Dialog>
				</>
			) : (
				<SizableText></SizableText>
			)}
		</>
	);
};

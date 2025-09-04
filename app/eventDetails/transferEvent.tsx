import { Screen } from "@/components/Screen";
import { BackButton } from "@/components/BackButton";
import { useEventDetailsContext } from "@/screens/EventDetails/EventDetailsProvider";
import { useParticipantsQuery, useSingleEventQuery } from "@/api/events/queries";
import { ScrollView } from "@/components/tamagui/ScrollView";
import { useState } from "react";
import { Participant } from "@/screens/Participants/Participant";
import { StatusEnum } from "@/api/types";
import { useMe } from "@/api/events/refiners";
import { SizableText, View } from "tamagui";
import { useDeleteParticipantMutation, useUpdateEventMutation, useUpdateParticipationMutation } from "@/api/events/mutations";
import { ParticipantQueryResponse, Role } from "@/api/events/types";
import { router } from "expo-router";
import { Dialog } from "@/components/tamagui/Dialog";
import { Button } from "@/components/tamagui/Button";

export default function TransferEvent() {
	const { eventId } = useEventDetailsContext();
	const { data: event } = useSingleEventQuery(eventId);
	const participants = useParticipantsQuery(eventId, [StatusEnum.ACCEPTED]);
	const me = useMe(eventId);
	const { mutateAsync: updateGuest } = useUpdateParticipationMutation();
	const { mutateAsync: updateEvent } = useUpdateEventMutation();
	const { mutateAsync: removeGuest } = useDeleteParticipantMutation();
	const [guestToTransferTo, setGuestToTransferTo] = useState<ParticipantQueryResponse | undefined>(undefined);

	const handleTransferEvent = async () => {
		try {
			if (!me.id || !guestToTransferTo || !guestToTransferTo.id || !event) {
				return;
			}
			setGuestToTransferTo(undefined);
			await updateEvent({
				id: eventId,
				creatorId: guestToTransferTo.userId,
			});
			await updateGuest({
				id: guestToTransferTo?.id,
				participant: {
					role: Role.enum.CREATOR,
				},
			});
			await removeGuest(me?.id);
			router.push("/(tabs)");
		} catch (e) {
			console.error(e);
			router.back();
		}
	};

	const mappedParticipants = participants.data
		?.filter((guest) => {
			if (!guest || !me) {
				return true;
			}
			return guest?.userId !== me?.userId;
		})
		.map((participant) => {
			if (!participant.id) {
				return null;
			}
			return (
				<Participant
					key={participant.id}
					onOpenOptions={() => setGuestToTransferTo(participant)}
					showEllipsis={false}
					showStatus={false}
					participant={participant}
				/>
			);
		});

	return (
		<>
			<Screen back={<BackButton />} title="Event übertragen">
				<SizableText>Suche dir nun jemanden aus, der das Event von nun an Leiten wird.</SizableText>
			</Screen>
			<Dialog modal={false} open={!!guestToTransferTo} onOpenChange={() => setGuestToTransferTo(undefined)}>
				<SizableText size="$5">Möchtest Du {guestToTransferTo?.firstName} das Event übertragen?</SizableText>
				<View gap="$2">
					<Button onPress={handleTransferEvent}>
						<SizableText color="$background">An {guestToTransferTo?.firstName} übertragen</SizableText>
					</Button>
					<Button variant="secondary" onPress={() => setGuestToTransferTo(undefined)}>
						Abbrechen
					</Button>
				</View>
			</Dialog>
			<ScrollView withShadow contentContainerStyle={{ padding: "$4", gap: "$2" }}>
				{mappedParticipants}
			</ScrollView>
		</>
	);
}

import { useEventQuery } from "@/api/events/event/useEventQuery";
import { useCreateParticipationMutation } from "@/api/participants/createParticipant";
import { useSingleParticipantQuery } from "@/api/participants/singleParticipant";
import { ParticipantRoleEnum, ParticipantStatusEnum, type Participant } from "@/api/participants/types";
import { useAllUsersQuery } from "@/api/user/allUsers/useAllUsersQuery";
import { BackButton } from "@/components/BackButton";
import { Screen } from "@/components/Screen";
import { SizeableText } from "@/components/tamagui/SizeableText";
import { NotificationChannelEnum } from "@/providers/NotificationsProvider";
import { useEventDetailsContext } from "@/screens/EventDetails/EventDetailsProvider";
import { EventDetailsConfirmInvitationsGuest } from "@/screens/EventDetails/InviteFriends/EventDetailsConfirmInvitations/EventDetailsConfirmInvitationsGuest";
import { useGetUser } from "@/store/authentication";
import { sendGuestInviteNotification } from "@/utils/notifications";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import React from "react";
import type { ListRenderItemInfo } from "@shopify/flash-list";
import { View } from "tamagui";
import { Button } from "@/components/tamagui/Button";
import type { User } from "@/api/user/types";

export const EventDetailsConfirmInvitations = () => {
	const { usersToAdd, toggleGuest } = useEventDetailsContext();
	const { data: allUsers } = useAllUsersQuery();
	const { eventId } = useEventDetailsContext();
	const user = useGetUser();
	const { data: event } = useEventQuery(eventId);
	const { data: me } = useSingleParticipantQuery(eventId, user.id);
	const { mutate } = useCreateParticipationMutation();
	const usersAdded = allUsers?.filter((user) => usersToAdd.has(user.id)) ?? [];

	const handleAddParticipants = async () => {
		mutate(
			usersAdded.map(
				({ id }) =>
					({ userId: id, eventId, role: ParticipantRoleEnum.GUEST, status: ParticipantStatusEnum.PENDING }) satisfies Omit<Participant, "id" | "createdAt">,
			),
		);

		router.replace("/eventDetails/participants");
		await Promise.all(
			usersAdded.map(async ({ id, pushChannels, pushToken }) => {
				if (pushToken && me?.firstName && event?.name && pushChannels?.includes(NotificationChannelEnum.GUEST_INVITE)) {
					return await sendGuestInviteNotification(pushToken, me.firstName, event.name);
				}
			}),
		);
	};

	const render = ({ item: user }: ListRenderItemInfo<User>) => {
		return <EventDetailsConfirmInvitationsGuest {...user} onPress={() => toggleGuest(user.id)} />;
	};

	return (
		<>
			<Screen flex={1} back={<BackButton href="/eventDetails/inviteGuests" />} title="Einladungen überprüfen">
				<SizeableText>Sieh dir die Einladungen zu den Gästen nochmals an. Anschließend kannst Du die Gäste einladen.</SizeableText>
				<FlashList
					showsVerticalScrollIndicator={false}
					estimatedItemSize={92}
					ItemSeparatorComponent={() => <View height="$1" />}
					data={usersAdded}
					renderItem={render}
				/>
				<View flexDirection="row" gap="$2">
					<Button onPress={() => router.replace("/eventDetails/inviteGuests")} variant="secondary" flex={1}>
						Auswahl editieren
					</Button>
					<Button flex={1} onPress={handleAddParticipants}>
						Gäste einladen
					</Button>
				</View>
			</Screen>
		</>
	);
};

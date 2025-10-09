import type { ListRenderItemInfo } from "@shopify/flash-list";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { View } from "tamagui";
import { useEventQuery } from "@/api/events/event/useEventQuery";
import { useCreateParticipationMutation } from "@/api/participants/createParticipant";
import { useSingleParticipantQuery } from "@/api/participants/singleParticipant";
import { type Participant, ParticipantRoleEnum, ParticipantStatusEnum } from "@/api/participants/types";
import { useAllUsersQuery } from "@/api/user/allUsers/useAllUsersQuery";
import type { User } from "@/api/user/types";
import { NotificationChannelEnum } from "@/api/user/types";
import { BackButton } from "@/components/BackButton";
import { Screen } from "@/components/Screen";
import { Button } from "@/components/tamagui/Button";
import { SizeableText } from "@/components/tamagui/Text";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuthenticationContext } from "@/providers/AuthenticationProvider";
import { useEventDetailsContext } from "@/screens/EventDetails/EventDetailsProvider";
import { EventDetailsConfirmInvitationsGuest } from "@/screens/EventDetails/InviteFriends/EventDetailsConfirmInvitations/EventDetailsConfirmInvitationsGuest";
import { sendGuestInviteNotification } from "@/utils/notifications";

export const EventDetailsConfirmInvitations = () => {
	const { usersToAdd, toggleGuest } = useEventDetailsContext();
	const { data: allUsers } = useAllUsersQuery();
	const { eventId } = useEventDetailsContext();
	const { user } = useAuthenticationContext();
	const { data: event } = useEventQuery(eventId);
	const { data: me } = useSingleParticipantQuery(eventId, user.id);
	const { mutate } = useCreateParticipationMutation();
	const usersAdded = allUsers?.filter((user) => usersToAdd.has(user.id)) ?? [];
	const { t } = useTranslation();

	const handleAddParticipants = async () => {
		mutate(
			usersAdded.map(
				({ id }) =>
					({ userId: id, eventId, role: ParticipantRoleEnum.GUEST, status: ParticipantStatusEnum.PENDING }) satisfies Omit<Participant, "id" | "createdAt">,
			),
		);

		router.replace("/eventDetails/participants");
		await Promise.all(
			usersAdded.map(async ({ pushChannels, pushToken }) => {
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
		<Screen flex={1} back={<BackButton href="/eventDetails/inviteGuests" />} title={t("guests.reviewInvitations")}>
			<SizeableText>{t("guests.reviewDescription")}</SizeableText>
			<FlashList
				showsVerticalScrollIndicator={false}
				estimatedItemSize={92}
				ItemSeparatorComponent={() => <View height="$1" />}
				data={usersAdded}
				renderItem={render}
			/>
			<View flexDirection="row" gap="$2">
				<Button onPress={() => router.replace("/eventDetails/inviteGuests")} variant="secondary" flex={1}>
					{t("guests.editSelection")}
				</Button>
				<Button flex={1} onPress={handleAddParticipants}>
					{t("guests.invite")}
				</Button>
			</View>
		</Screen>
	);
};

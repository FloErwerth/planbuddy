import { useEventQuery } from "@/api/events/event/useEventQuery";
import { useCreateParticipationMutation } from "@/api/participants/createParticipant";
import { useSingleParticipantQuery } from "@/api/participants/singleParticipant";
import { Participant, ParticipantRoleEnum, ParticipantStatusEnum } from "@/api/participants/types";
import { useAllUsersQuery } from "@/api/user/allUsers/useAllUsersQuery";
import { User } from "@/api/user/types";
import { BackButton } from "@/components/BackButton";
import { Screen } from "@/components/Screen";
import { Button } from "@/components/tamagui/Button";
import { Card } from "@/components/tamagui/Card";
import { SizeableText } from "@/components/tamagui/SizeableText";
import { UserAvatar } from "@/components/UserAvatar";
import { NotificationChannelEnum } from "@/providers/NotificationsProvider";
import { useEventDetailsContext } from "@/screens/EventDetails/EventDetailsProvider";
import { useGetUser } from "@/store/authentication";
import { sendGuestInviteNotification } from "@/utils/notifications";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { X } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import { View, XStack } from "tamagui";

const Guest = ({ id, onPress, firstName, lastName, email }: User & { onPress: () => void }) => {
	return (
		<Card key={id}>
			<XStack alignItems="center" paddingRight="$2" justifyContent="space-between">
				<XStack gap="$3" alignItems="center">
					<UserAvatar id={id} />
					<View gap="$1">
						<SizeableText size="$5" fontWeight="bold">
							{firstName} {lastName}
						</SizeableText>
						<SizeableText size="$3">{email}</SizeableText>
					</View>
				</XStack>
				<Button variant="transparent" onPress={onPress}>
					<X />
				</Button>
			</XStack>
		</Card>
	);
};

export default function ConfirmInvitations() {
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
				({ id }) => ({ userId: id, eventId, role: ParticipantRoleEnum.GUEST, status: ParticipantStatusEnum.PENDING }) satisfies Omit<Participant, "id">
			)
		);

		router.replace("/eventDetails/participants");
		await Promise.all(
			usersAdded.map(async ({ id, pushChannels, pushToken }) => {
				if (pushToken && me?.firstName && event?.name && pushChannels?.includes(NotificationChannelEnum.GUEST_INVITE)) {
					return await sendGuestInviteNotification(pushToken, me.firstName, event.name);
				}
			})
		);
	};

	const render = ({ item: user }: ListRenderItemInfo<User>) => {
		return <Guest onPress={() => toggleGuest(user.id)} {...user} />;
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
}

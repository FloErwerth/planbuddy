import { useState } from "react";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { Screen } from "@/components/Screen";
import { BackButton } from "@/components/BackButton";
import { SearchInput } from "@/components/SearchInput";
import { AnimatePresence, getTokenValue, Spinner, useWindowDimensions, View } from "tamagui";
import { Card } from "@/components/tamagui/Card";
import { Pressable } from "react-native";
import { FriendDisplay } from "@/components/FriendDisplay";
import { Checkbox } from "@/components/tamagui/Checkbox";
import { Button } from "@/components/tamagui/Button";
import { useEventDetailsContext } from "@/screens/EventDetails/EventDetailsProvider";
import { router } from "expo-router";
import { NotificationChannelEnum } from "@/providers/NotificationsProvider";
import { sendGuestInviteNotification } from "@/utils/notifications";
import { Friend } from "@/api/friends/types";
import { useCreateParticipationMutation } from "@/api/participants/createParticipant";
import { useEventQuery } from "@/api/events/event/useEventQuery";
import { useSingleParticipantQuery } from "@/api/participants/singleParticipant";
import { useGetUser } from "@/store/authentication";

const Guest = ({ id, onPress, checked, ...friend }: Friend & { checked: boolean; onPress: (id: string) => void }) => {
	return (
		<Card marginHorizontal="$4" key={id}>
			<Pressable onPress={() => onPress(id!)}>
				<FriendDisplay id={id} {...friend}>
					<Checkbox checked={checked} />
				</FriendDisplay>
			</Pressable>
		</Card>
	);
};

export const EventDetailsAddFriends = () => {
	const [addedGuests, setAddedGuests] = useState<Set<string>>(new Set());
	const [isLoading, setIsLoading] = useState(false);
	const [filter, setFilter] = useState<string>();
	const { width } = useWindowDimensions();
	const { mutateAsync } = useCreateParticipationMutation();
	const { eventId } = useEventDetailsContext();
	const user = useGetUser();
	const { data: event } = useEventQuery(eventId);	
	const me = useSingleParticipantQuery(eventId, user.id));

	const applyFilter = (other: Friend | undefined) => {
		if (!filter || !other) {
			return true;
		}

		const terms = filter.split(" ");

		if (terms.length === 0) {
			return true;
		}

		let foundMatch = false;

		for (let i = 0; i < terms.length; i++) {
			const currentTerm = terms[i].toLowerCase();
			if (!foundMatch) {
				foundMatch = Boolean(other.firstName?.includes(currentTerm) || other.lastName?.includes(currentTerm) || other.email?.includes(currentTerm));
			}
		}

		return foundMatch;
	};

	const friendsWithChecked = friends
		.map((friend) => ({
			...friend,
			checked: addedGuests.has(friend.userId!),
		}))
		.filter(applyFilter)
		.filter((friend) => !participants?.find((participant) => participant.userId === friend.userId));

	const toggleGuest = (userId: string, isGuest: boolean) => {
		const newGuests = new Set(addedGuests.values());
		if (isGuest) {
			newGuests.delete(userId);
		} else {
			newGuests.add(userId);
		}
		setAddedGuests(newGuests);
	};

	const render = ({ item: friend }: ListRenderItemInfo<SimpleFriend & { checked: boolean }>) => {
		return <Guest {...friend} onPress={() => toggleGuest(friend.userId!, friend.checked)} />;
	};

	const handleAddParticipants = async () => {
		setIsLoading(true);
		try {
			const addedGuestsList = friendsWithChecked.filter(({ checked }) => checked);
			await mutateAsync(
				addedGuestsList.map(({ userId }) => ({ userId, eventId, role: ParticipantRoleEnum.enum.GUEST, status: StatusEnum.PENDING }) satisfies Participant)
			);
			await Promise.all(
				addedGuestsList.map(async ({ other, me }) => {
					if (other && other.pushToken && other.pushChannels?.includes(NotificationChannelEnum.GUEST_INVITE)) {
						return await sendGuestInviteNotification(other.pushToken, me?.firstName, event?.name);
					}
				})
			);

			router.back();
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<Screen back={<BackButton />} title="Gäste hinzufügen">
				<SearchInput placeholder="Name oder E-Mail" onChangeText={setFilter} />
			</Screen>
			<FlashList
				contentContainerStyle={{ paddingVertical: 16 }}
				ItemSeparatorComponent={() => <View height="$1" />}
				data={friendsWithChecked}
				renderItem={render}
				estimatedItemSize={200}
			/>
			<AnimatePresence>
				{addedGuests.size > 0 && (
					<Button
						animation="bouncy"
						enterStyle={{ scale: 0.9, opacity: 0 }}
						exitStyle={{ scale: 0.9, opacity: 0 }}
						margin="$4"
						position="absolute"
						bottom={0}
						width={width - 2 * getTokenValue("$4", "space")}
						onPress={handleAddParticipants}
					>
						{isLoading ? <Spinner /> : "Gäste hinzufügen"}
					</Button>
				)}
			</AnimatePresence>
		</>
	);
};

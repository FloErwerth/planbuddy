import { FlashList, type ListRenderItemInfo } from "@shopify/flash-list";
import { router } from "expo-router";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getTokenValue, type Token, View } from "tamagui";
import { useSearchParticipantsByStatus } from "@/api/participants/searchParticipantsByNameStatus";
import { useAllUsersQuery } from "@/api/user/allUsers/useAllUsersQuery";
import { BackButton } from "@/components/BackButton";
import { Screen } from "@/components/Screen";
import { SearchInput } from "@/components/SearchInput";
import { Button } from "@/components/tamagui/Button";
import { useEventDetailsContext } from "@/screens/EventDetails/EventDetailsProvider";
import { EventDetailsGuest, type EventDetailsGuestProps } from "@/screens/EventDetails/InviteFriends/EventDetailsInviteGuests";

export const EventDetailsInviteGuests = () => {
	const [filter, setFilter] = useState<string>();
	const { bottom } = useSafeAreaInsets();
	const { eventId, toggleGuest, usersToAdd } = useEventDetailsContext();

	const { data: allUsers } = useAllUsersQuery();
	const { data: participants } = useSearchParticipantsByStatus(eventId);

	const render = ({ item: user }: ListRenderItemInfo<EventDetailsGuestProps>) => {
		return <EventDetailsGuest {...user} />;
	};

	const allUsersCheckedOrInvited = allUsers
		?.filter(({ firstName, lastName, email }) => (filter ? firstName?.includes(filter) || lastName?.includes(filter) || email?.includes(filter) : true))
		.map((user) => ({
			...user,
			checked: usersToAdd.has(user.id),
			onPress: () => toggleGuest(user.id),
			createdAt: participants?.find((participant) => participant.userId === user.id)?.createdAt ?? "",
		}));

	return (
		<Screen flex={1} back={<BackButton />} title="Gäste hinzufügen">
			<SearchInput placeholder="Name oder E-Mail" onChangeText={setFilter} />
			<FlashList
				showsVerticalScrollIndicator={false}
				estimatedItemSize={92}
				ItemSeparatorComponent={() => <View height="$1" />}
				data={allUsersCheckedOrInvited}
				renderItem={render}
			/>
			{usersToAdd.size > 0 && (
				<Button
					position="absolute"
					bottom={getTokenValue("$4" as Token, "space") + bottom}
					right="$4"
					left="$4"
					animation="bouncy"
					enterStyle={{ scale: 0.9, opacity: 0 }}
					exitStyle={{ scale: 0.9, opacity: 0 }}
					onPress={() => router.push("/eventDetails/inviteGuests/confirmInvitations")}
				>
					Gäste überprüfen und hinzufügen{`(${usersToAdd.size})`}
				</Button>
			)}
		</Screen>
	);
};

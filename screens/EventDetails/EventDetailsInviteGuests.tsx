import { memo, useState } from "react";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { Screen } from "@/components/Screen";
import { BackButton } from "@/components/BackButton";
import { SizableText, Spinner, View, XStack } from "tamagui";
import { Card } from "@/components/tamagui/Card";
import { Button } from "@/components/tamagui/Button";
import { useEventDetailsContext } from "@/screens/EventDetails/EventDetailsProvider";
import { router } from "expo-router";
import { useGetUser } from "@/store/authentication";
import { useAllUsersQuery } from "@/api/user/allUsers/useAllUsersQuery";
import { User } from "@/api/user/types";
import { UserAvatar } from "@/components/UserAvatar";
import { Checkbox } from "@/components/tamagui/Checkbox";
import { SearchInput } from "@/components/SearchInput";
import { useSearchParticipantsByStatus } from "@/api/participants/searchParticipantsByNameStatus";
import { Participant } from "@/api/participants/types";
import { formatToDate, formatToTime } from "@/utils/date";

type GuestProps = User & { checked: boolean; onPress: (id: string) => void; createdAt?: Participant["createdAt"] };
const Guest = memo(({ id, onPress, checked, firstName, createdAt, lastName, email }: GuestProps) => {
	return (
		<Card onPress={() => onPress(id!)} key={id}>
			<XStack alignItems="center" paddingRight="$2" justifyContent="space-between">
				<XStack gap="$3" alignItems="center">
					<UserAvatar id={id} />
					<View gap="$1">
						<SizableText size="$5" fontWeight="bold">
							{firstName} {lastName}
						</SizableText>
						{createdAt ? (
							<SizableText size="$3">
								Eingeladen am {formatToDate(createdAt)}, {formatToTime(createdAt)} Uhr
							</SizableText>
						) : (
							<SizableText size="$3">{email}</SizableText>
						)}
					</View>
				</XStack>
				{!createdAt && <Checkbox checked={checked} />}
			</XStack>
		</Card>
	);
});
Guest.displayName = "Guest";

export const EventDetailsInviteGuests = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [filter, setFilter] = useState<string>();

	const { eventId, toggleGuest, usersToAdd } = useEventDetailsContext();
	const user = useGetUser();

	const { data: allUsers } = useAllUsersQuery();
	const { data: participants } = useSearchParticipantsByStatus(eventId);

	const render = ({ item: user }: ListRenderItemInfo<GuestProps>) => {
		return <Guest {...user} onPress={() => toggleGuest(user.id)} />;
	};

	const allUsersCheckedOrInvited = allUsers
		?.filter(({ firstName, lastName, email }) => (filter ? firstName?.includes(filter) || lastName?.includes(filter) || email?.includes(filter) : true))
		.map((user) => ({ ...user, checked: usersToAdd.has(user.id), createdAt: participants?.find((participant) => participant.userId === user.id)?.createdAt }));

	return (
		<>
			<Screen flex={1} back={<BackButton href="/eventDetails/participants" />} title="Gäste hinzufügen">
				<SearchInput placeholder="Name oder E-Mail" onChangeText={setFilter} />
				<FlashList
					showsVerticalScrollIndicator={false}
					estimatedItemSize={92}
					ItemSeparatorComponent={() => <View height="$1" />}
					data={allUsersCheckedOrInvited}
					renderItem={render}
				/>
				<Button
					animation="bouncy"
					enterStyle={{ scale: 0.9, opacity: 0 }}
					exitStyle={{ scale: 0.9, opacity: 0 }}
					onPress={() => router.push("/eventDetails/inviteGuests/confirmInvitations")}
				>
					{isLoading ? <Spinner /> : `Gäste überprüfen und hinzufügen (${usersToAdd.size})`}
				</Button>
			</Screen>
		</>
	);
};

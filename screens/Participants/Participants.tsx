import { useParticipantsQuery } from "@/api/events/queries";
import { ParticipantQueryResponse } from "@/api/events/types";
import { Status, StatusEnum } from "@/api/types";
import { BackButton } from "@/components/BackButton";
import { PlusButton } from "@/components/PlusButton";
import { Screen } from "@/components/Screen";
import { SearchInput } from "@/components/SearchInput";
import { ToggleButton } from "@/components/TogglePillButton";
import { useEventDetailsContext } from "@/screens/EventDetails/EventDetailsProvider";
import { Participant } from "@/screens/Participants/Participant";
import { ParticipantSkeleton } from "@/screens/Participants/ParticipantSkeleton";
import { useGetUser } from "@/store/authentication";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { Eye } from "@tamagui/lucide-icons";
import { Redirect, router } from "expo-router";
import { useState } from "react";
import { RefreshControl } from "react-native";
import { View, XStack } from "tamagui";

export const Participants = () => {
	const { eventId, setEditedGuest } = useEventDetailsContext();
	const [activeFilters, setActiveFilters] = useState<Status[]>([]);
	const [search, setSearch] = useState("");
	const [refreshing, setRefreshing] = useState(false);
	const { data: participants, refetch, isLoading } = useParticipantsQuery(eventId, activeFilters, search);
	const user = useGetUser();

	const sortedParticipants = participants?.sort((a) => (a.userId === user?.id ? 1 : 0));

	const render = ({ item: participant }: ListRenderItemInfo<ParticipantQueryResponse>) =>
		refreshing ? (
			<ParticipantSkeleton />
		) : (
			<Participant
				participant={participant}
				onOpenOptions={() => {
					setEditedGuest(participant);
					router.push("/eventDetails/editGuest");
				}}
			/>
		);

	if (!participants && !isLoading) {
		return <Redirect href=".." />;
	}

	const toggleFilter = (toggledFilter: Status) => {
		if (activeFilters.includes(toggledFilter)) {
			setActiveFilters((filters) => filters.filter((filter) => filter !== toggledFilter));
		} else {
			setActiveFilters((filters) => [...filters, toggledFilter]);
		}
	};

	const acceptedFilterActive = activeFilters.includes(StatusEnum.ACCEPTED);
	const declinedFilterActive = activeFilters.includes(StatusEnum.DECLINED);
	const pendingFilterActive = activeFilters.includes(StatusEnum.PENDING);

	return (
		<>
			<Screen back={<BackButton />} title="Teilnehmer" action={<PlusButton onPress={() => router.push("./addFriends")} />}>
				<XStack gap="$3">
					<ToggleButton
						borderRadius="$12"
						onPress={() => toggleFilter(StatusEnum.ACCEPTED)}
						active={acceptedFilterActive}
						icon={<Eye color="$background" size="$1" />}
					>
						Zugesagt
					</ToggleButton>
					<ToggleButton
						borderRadius="$12"
						active={pendingFilterActive}
						onPress={() => toggleFilter(StatusEnum.PENDING)}
						icon={<Eye color="$background" size="$1" />}
					>
						Ausstehend
					</ToggleButton>
					<ToggleButton
						borderRadius="$12"
						onPress={() => toggleFilter(StatusEnum.DECLINED)}
						active={declinedFilterActive}
						icon={<Eye color="$background" size="$1" />}
					>
						Abgesagt
					</ToggleButton>
				</XStack>
				<SearchInput placeholder="E-Mail oder Name" onChangeText={setSearch} />
			</Screen>
			<FlashList
				key={sortedParticipants?.length}
				refreshControl={
					<RefreshControl
						onRefresh={async () => {
							setRefreshing(true);
							await refetch();
							setRefreshing(false);
						}}
						refreshing={refreshing}
					/>
				}
				ItemSeparatorComponent={() => <View height="$1" />}
				contentContainerStyle={{ padding: 16 }}
				renderItem={render}
				data={sortedParticipants}
				estimatedItemSize={200}
			/>
		</>
	);
};

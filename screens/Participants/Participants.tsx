import { FlashList, type ListRenderItemInfo } from "@shopify/flash-list";
import { Eye } from "@tamagui/lucide-icons";
import { Redirect, router } from "expo-router";
import { useState } from "react";
import { RefreshControl } from "react-native";
import { View, XStack } from "tamagui";
import { useSearchParticipantsByStatus } from "@/api/participants/searchParticipantsByNameStatus";
import { type Participant, type ParticipantStatus, ParticipantStatusEnum } from "@/api/participants/types";
import type { User } from "@/api/user/types";
import { BackButton } from "@/components/BackButton";
import { PlusButton } from "@/components/PlusButton";
import { Screen } from "@/components/Screen";
import { SearchInput } from "@/components/SearchInput";
import { ToggleButton } from "@/components/TogglePillButton";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuthenticationContext } from "@/providers/AuthenticationProvider";
import { useEventDetailsContext } from "@/screens/EventDetails/EventDetailsProvider";
import { ParticipantRow } from "@/screens/Participants/Participant";
import { ParticipantSkeleton } from "@/screens/Participants/ParticipantSkeleton";

export const Participants = () => {
	const { eventId, setEditedGuest } = useEventDetailsContext();
	const [activeFilters, setActiveFilters] = useState<ParticipantStatus[]>([]);
	const [search, setSearch] = useState("");
	const [refreshing, setRefreshing] = useState(false);
	const { data: participants, refetch, isLoading } = useSearchParticipantsByStatus(eventId, activeFilters, search);
	const { user } = useAuthenticationContext();
	const { t } = useTranslation();

	const sortedParticipants = participants?.sort((a) => (a.userId === user?.id ? 1 : 0));

	const render = ({ item: participatingUser }: ListRenderItemInfo<Participant & User>) =>
		refreshing ? (
			<ParticipantSkeleton />
		) : (
			<ParticipantRow
				participatingUser={participatingUser}
				onOpenOptions={() => {
					setEditedGuest(participatingUser);
					router.push("/eventDetails/editGuest");
				}}
			/>
		);

	if (!participants && !isLoading) {
		return <Redirect href="/eventDetails" />;
	}

	const toggleFilter = (toggledFilter: ParticipantStatus) => {
		if (activeFilters.includes(toggledFilter)) {
			setActiveFilters((filters) => filters.filter((filter) => filter !== toggledFilter));
		} else {
			setActiveFilters((filters) => [...filters, toggledFilter]);
		}
	};

	const acceptedFilterActive = activeFilters.includes(ParticipantStatusEnum.ACCEPTED);
	const declinedFilterActive = activeFilters.includes(ParticipantStatusEnum.DECLINED);
	const pendingFilterActive = activeFilters.includes(ParticipantStatusEnum.PENDING);

	return (
		<>
			<Screen back={<BackButton href="/eventDetails" />} title={t("participants.title")} action={<PlusButton onPress={() => router.push("./inviteGuests")} />}>
				<XStack gap="$3">
					<ToggleButton
						borderRadius="$12"
						onPress={() => toggleFilter(ParticipantStatusEnum.ACCEPTED)}
						active={acceptedFilterActive}
						icon={<Eye color="$background" size="$1" />}
					>
						{t("guests.accepted")}
					</ToggleButton>
					<ToggleButton
						borderRadius="$12"
						active={pendingFilterActive}
						onPress={() => toggleFilter(ParticipantStatusEnum.PENDING)}
						icon={<Eye color="$background" size="$1" />}
					>
						{t("guests.pending")}
					</ToggleButton>
					<ToggleButton
						borderRadius="$12"
						onPress={() => toggleFilter(ParticipantStatusEnum.DECLINED)}
						active={declinedFilterActive}
						icon={<Eye color="$background" size="$1" />}
					>
						{t("guests.declined")}
					</ToggleButton>
				</XStack>
				<SearchInput placeholder={t("guests.searchPlaceholder")} onChangeText={setSearch} />
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

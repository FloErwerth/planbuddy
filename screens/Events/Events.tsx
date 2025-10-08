import { useState } from "react";
import { RefreshControl, SectionList } from "react-native";
import { View, XStack } from "tamagui";
import { useAllEventsQuery } from "@/api/events/allEvents";
import type { AppEvent } from "@/api/events/types";
import { EventSmall } from "@/components/Events/EventSmall";
import { Screen } from "@/components/Screen";
import { ScreenTopbarSearch } from "@/components/Screen/ScreenTopbarSearch";
import { ToggleButton } from "@/components/TogglePillButton";
import { Separator } from "@/components/tamagui/Separator";
import { SizeableText } from "@/components/tamagui/SizeableText";
import { formatToDate, timePartialsWithoutTimeZone } from "@/utils/date";

export const Events = () => {
	const { refetch } = useAllEventsQuery();
	const [refreshing, setRefreshing] = useState(false);
	const [_, setSearch] = useState<string>();
	const [showPastEvents, setShowPastEvents] = useState(false);
	const { data: events = [] } = useAllEventsQuery();

	const eventsSectionsByDate = events
		.reduce(
			(sections, event) => {
				const date = timePartialsWithoutTimeZone(new Date(event.startTime)).date;
				const newSections = [...(sections ?? [])];
				const currentSection = newSections.find((section) => section.date === date);

				if (currentSection) {
					currentSection.data.push(event);
					return newSections;
				}
				newSections.push({ date: date, data: [event] });
				return newSections;
			},
			[] as { date: string; data: AppEvent[] }[],
		)
		.sort((a, b) => {
			const aDate = new Date(a.date).valueOf();
			const bDate = new Date(b.date).valueOf();
			return aDate - bDate;
		});

	const upcomingEvents = eventsSectionsByDate.filter((section) => {
		const date = new Date(section.date);
		return date >= new Date();
	});

	const pastEvents = eventsSectionsByDate.filter((section) => {
		const date = new Date(section.date);
		return date < new Date();
	});

	const toggleShowEvents = () => setShowPastEvents((show) => !show);

	return (
		<>
			<Screen title="Events" action={<ScreenTopbarSearch onChangeText={setSearch} />}>
				<XStack gap="$2">
					<View>
						<ToggleButton size="$3" backgroundColor={!showPastEvents ? "$primary" : "$accent"} onPress={toggleShowEvents} active={!showPastEvents}>
							<SizeableText color={!showPastEvents ? "$background" : "$color"}>Ausstehend</SizeableText>
						</ToggleButton>
					</View>
					<View>
						<ToggleButton size="$3" backgroundColor={showPastEvents ? "$primary" : "$accent"} onPress={toggleShowEvents} active={showPastEvents}>
							<SizeableText color={showPastEvents ? "$background" : "$color"}>Vergangen</SizeableText>
						</ToggleButton>
					</View>
				</XStack>
			</Screen>
			<Separator />
			<SectionList
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={async () => {
							setRefreshing(true);
							await refetch();
							setRefreshing(false);
						}}
					/>
				}
				keyExtractor={(item) => item.id}
				sections={showPastEvents ? pastEvents : upcomingEvents}
				renderItem={({ item }) => <EventSmall {...item} />}
				renderSectionHeader={({ section: { date } }) => (
					<SizeableText size="$5" fontWeight="700">
						{formatToDate(date)}
					</SizeableText>
				)}
				contentContainerStyle={{ gap: 16, paddingHorizontal: 16, paddingTop: 16 }}
			/>
		</>
	);
};

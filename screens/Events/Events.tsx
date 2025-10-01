import { useAllEventsQuery } from "@/api/events/allEvents";
import { AppEvent } from "@/api/events/types";
import { FriendRequestStatusEnum } from "@/api/friends/types";
import { useAllParticipantsFromEventQuery } from "@/api/participants/allParticipants";
import { useSingleParticipantQuery } from "@/api/participants/singleParticipant";
import { ParticipantRoleEnum, ParticipantStatusEnum } from "@/api/participants/types";
import { useUpdateParticipationMutation } from "@/api/participants/updateParticipant";
import { EventSmall } from "@/components/Events/EventSmall";
import { Screen } from "@/components/Screen";
import { ScreenTopbarSearch } from "@/components/Screen/ScreenTopbarSearch";
import { Button } from "@/components/tamagui/Button";
import { Separator } from "@/components/tamagui/Separator";
import { SizeableText } from "@/components/tamagui/SizeableText";
import { ToggleButton } from "@/components/TogglePillButton";
import { NotificationChannelEnum } from "@/providers/NotificationsProvider";
import { useGetUser } from "@/store/authentication";
import { formatToDate, timePartialsWithoutTimeZone } from "@/utils/date";
import { sendGuestHasAnsweredInviteNotification } from "@/utils/notifications";
import { CalendarX } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import { useState } from "react";
import { RefreshControl, SectionList } from "react-native";
import { Circle, View, XStack } from "tamagui";

const contentContainerStyle = { gap: "$3", padding: "$4", flex: 1 };

type MappedEventsProps = {
	search?: string;
	showPastEvents: boolean;
};

type AcceptEventInviteProps = {
	event: AppEvent;
};
const AcceptEventInvite = ({ event }: AcceptEventInviteProps) => {
	const { data: participants } = useAllParticipantsFromEventQuery(event.id);
	const user = useGetUser();
	const { data: me } = useSingleParticipantQuery(event.id, user.id);
	const { mutateAsync: updateParticipation } = useUpdateParticipationMutation();

	const acceptInvitation = async (updatedEventId: string, eventName: string) => {
		const myParticipation = participants?.find(({ userId }) => user?.id === userId);
		const participantsToSendNotification = participants?.filter(
			({ role, pushChannels, pushToken }) =>
				(role === ParticipantRoleEnum.ADMIN || role === ParticipantRoleEnum.CREATOR) &&
				pushChannels?.includes(NotificationChannelEnum.HOST_INVITATION_ANSWERED) &&
				Boolean(pushToken)
		);

		if (myParticipation && myParticipation.id) {
			await updateParticipation({ id: myParticipation.id, status: ParticipantStatusEnum.ACCEPTED });

			if (participantsToSendNotification && participantsToSendNotification.length > 0) {
				await Promise.all(
					participantsToSendNotification.map((participant) =>
						sendGuestHasAnsweredInviteNotification(participant.pushToken!, FriendRequestStatusEnum.ACCEPTED, me?.firstName, eventName)
					)
				);
			}
		}
	};

	return (
		<Button key={event.id} onPress={() => acceptInvitation(event.id, event.name)}>
			Einladung annehmen
		</Button>
	);
};

const MappedEvents = ({ search, showPastEvents }: MappedEventsProps) => {
	const { data: events } = useAllEventsQuery();

	if (events === undefined || events?.length === 0) {
		return (
			<View paddingHorizontal="$4" gap="$4" flex={1} justifyContent="center" alignItems="center">
				<Circle backgroundColor="$accent" size="$12" borderRadius="100%">
					<CalendarX color="$primary" size="$6" />
				</Circle>
				<SizeableText textAlign="center" size="$6" fontWeight="700">
					Keine Events
				</SizeableText>
				<View marginBottom="$4">
					<SizeableText textAlign="center" size="$3">
						Leider konnten keine Events gefunden werden
					</SizeableText>
					<SizeableText textAlign="center" size="$3">
						Das kannst Du leicht ändern, indem Du selbst ein Event erstellst
					</SizeableText>
				</View>
				<Button fontWeight="700" size="$5" onPress={() => router.replace("/(tabs)/eventCreation")}>
					Event erstellen
				</Button>
			</View>
		);
	}
	const now = new Date();
	const filtered = events
		?.filter((event) => {
			let result: boolean = true;
			const starting = new Date(event.startTime);

			if (showPastEvents) {
				result = starting < now;
			} else {
				result = starting >= now;
			}

			if (!search) {
				return result;
			}

			result = result && event.name.toLowerCase().includes(search);
			return result;
		})
		.sort((a, b) => {
			const aDate = new Date(a.startTime).valueOf();
			const bDate = new Date(b.startTime).valueOf();
			return aDate - bDate;
		});

	return filtered.map((event) => {
		return <EventSmall key={event.id} {...event} />;
	});
};

export const Events = () => {
	const { refetch } = useAllEventsQuery();
	const [refreshing, setRefreshing] = useState(false);
	const [search, setSearch] = useState<string>();
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
			[] as { date: string; data: AppEvent[] }[]
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
			></SectionList>
		</>
	);
};

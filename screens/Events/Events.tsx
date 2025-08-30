import { useUpdateParticipationMutation } from "@/api/events/mutations";
import { useEventsQuery, useParticipantsQuery } from "@/api/events/queries";
import { Role } from "@/api/events/types";
import { StatusEnum } from "@/api/types";
import { EventSmall } from "@/components/Events/EventSmall";
import { Screen } from "@/components/Screen";
import { SearchInput } from "@/components/SearchInput";
import { Button } from "@/components/tamagui/Button";
import { ScrollView } from "@/components/tamagui/ScrollView";
import { SizeableText } from "@/components/tamagui/SizeableText";
import { ToggleButton } from "@/components/TogglePillButton";
import { NotificationChannelEnum } from "@/providers/NotificationsProvider";
import { useGetUser } from "@/store/authentication";
import { sendGuestHasAnsweredInviteNotification } from "@/utils/notifications";
import { CalendarX } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import { useState } from "react";
import { RefreshControl } from "react-native";
import { View, XStack } from "tamagui";
import type { Event } from "@/api/events/types";

const contentContainerStyle = { gap: "$3", paddingVertical: "$4", flex: 1 };

type MappedEventsProps = {
    search?: string;
    showPastEvents: boolean;
};

type AcceptEventInviteProps = {
    event: Event;
};
const AcceptEventInvite = ({ event }: AcceptEventInviteProps) => {
    const { data: participants } = useParticipantsQuery(event.id);
    const user = useGetUser();
    const { mutateAsync: updateParticipation } = useUpdateParticipationMutation();
    const acceptInvitation = async (updatedEventId: string, eventName: string) => {
        const participantData = participants?.filter(({ eventId }) => eventId === updatedEventId);
        const myParticipation = participantData?.find(({ userId }) => user?.id === userId);
        const participantsToSendNotification = participantData?.filter(
            ({ role, pushChannels, pushToken }) =>
                (role === Role.Enum.ADMIN || role === Role.Enum.CREATOR) &&
                pushChannels?.includes(NotificationChannelEnum.HOST_INVITATION_ANSWERED) &&
                Boolean(pushToken)
        );

        if (myParticipation && myParticipation.id) {
            await updateParticipation({ id: myParticipation.id, participant: { status: StatusEnum.ACCEPTED } });

            if (participantsToSendNotification && participantsToSendNotification.length > 0) {
                await Promise.all(
                    participantsToSendNotification.map((participant) =>
                        sendGuestHasAnsweredInviteNotification(participant.pushToken!, StatusEnum.ACCEPTED, myParticipation.firstName, eventName)
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
    const { data: events } = useEventsQuery();

    if (events === undefined || events?.length === 0) {
        return (
            <View gap="$4" flex={1} justifyContent="center" alignItems="center">
                <CalendarX size="$4" />
                <SizeableText textAlign="center">Leider keine bevorstehenden Events vorhanden</SizeableText>
                <SizeableText textAlign="center">Dies kannst Du leicht ändern, indem Du ein Event erstellst und Freunde dazu einlädst</SizeableText>
                <Button borderRadius="$12" onPress={() => router.replace("/(tabs)/eventCreation")}>
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
        if (event.status === StatusEnum.PENDING) {
            return <AcceptEventInvite key={event.id} event={event} />;
        }

        return <EventSmall key={event.id} {...event} />;
    });
};

export const Events = () => {
    const { refetch } = useEventsQuery();
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState<string>();
    const [showPastEvents, setShowPastEvents] = useState(false);

    const toggleShowEvents = () => setShowPastEvents((show) => !show);

    return (
        <>
            <Screen backgroundColor="white">
                <SearchInput placeholder="Eventname" onChangeText={setSearch} />
                <XStack gap="$2">
                    <View flex={0.5}>
                        <ToggleButton borderRadius="$12" onPress={toggleShowEvents} active={!showPastEvents}>
                            <SizeableText color={!showPastEvents ? "$background" : "$color"}>Ausstehend</SizeableText>
                        </ToggleButton>
                    </View>
                    <View flex={0.5}>
                        <ToggleButton borderRadius="$12" onPress={toggleShowEvents} active={showPastEvents}>
                            <SizeableText color={showPastEvents ? "$background" : "$color"}>Vergangen</SizeableText>
                        </ToggleButton>
                    </View>
                </XStack>
            </Screen>
            <ScrollView
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
                contentContainerStyle={contentContainerStyle}
            >
                <MappedEvents showPastEvents={showPastEvents} search={search?.toLowerCase()} />
            </ScrollView>
        </>
    );
};

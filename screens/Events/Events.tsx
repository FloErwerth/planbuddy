import { useEventsQuery } from '@/api/events/queries';
import { EventSmall } from '@/components/Events/EventSmall';
import { Screen } from '@/components/Screen';
import { SearchInput } from '@/components/SearchInput';
import { Button } from '@/components/tamagui/Button';
import { ScrollView } from '@/components/tamagui/ScrollView';
import { SizeableText } from '@/components/tamagui/SizeableText';
import { ToggleButton } from '@/components/TogglePillButton';
import { CalendarX } from '@tamagui/lucide-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { RefreshControl } from 'react-native';
import { View, XStack } from 'tamagui';

const contentContainerStyle = { gap: '$3', paddingVertical: '$4', flex: 1 };

type MappedEventsProps = {
    search?: string;
    showPastEvents: boolean;
};
const MappedEvents = ({ search, showPastEvents }: MappedEventsProps) => {
    const { data: events } = useEventsQuery();

    if (events === undefined || events?.length === 0) {
        return (
            <View gap="$4" flex={1} justifyContent="center" alignItems="center">
                <CalendarX size="$4" />
                <SizeableText textAlign="center">Leider keine bevorstehenden Events vorhanden</SizeableText>
                <SizeableText textAlign="center">Dies kannst Du leicht ändern, indem Du ein Event erstellst und Freunde dazu einlädst</SizeableText>
                <Button borderRadius="$12" onPress={() => router.replace('/(tabs)/eventCreation')}>
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

    return filtered.map((event) => <EventSmall key={event.id} {...event} />);
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
                            <SizeableText color={!showPastEvents ? '$background' : '$color'}>Ausstehend</SizeableText>
                        </ToggleButton>
                    </View>
                    <View flex={0.5}>
                        <ToggleButton borderRadius="$12" onPress={toggleShowEvents} active={showPastEvents}>
                            <SizeableText color={showPastEvents ? '$background' : '$color'}>Vergangen</SizeableText>
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

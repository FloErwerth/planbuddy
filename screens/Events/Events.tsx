import { useEventsQuery } from '@/api/events/queries';
import { EventSmall } from '@/components/Events/EventSmall';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/tamagui/Button';
import { ScrollView } from '@/components/tamagui/ScrollView';
import { CalendarX } from '@tamagui/lucide-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { RefreshControl } from 'react-native';
import { SizableText, View } from 'tamagui';

const contentContainerStyle = { gap: '$3', paddingVertical: '$4', flex: 1 };

const MappedEvents = () => {
    const { data: events } = useEventsQuery();

    if (events === undefined || events?.length === 0) {
        return (
            <View gap="$4" flex={1} justifyContent="center" alignItems="center">
                <CalendarX size="$4" />
                <SizableText textAlign="center">Leider keine bevorstehenden Events vorhanden</SizableText>
                <SizableText textAlign="center">Dies kannst Du leicht ändern, indem Du ein Event erstellst und Freunde dazu einlädst</SizableText>
                <Button borderRadius="$12" onPress={() => router.replace('/(tabs)/eventCreation')}>
                    Event erstellen
                </Button>
            </View>
        );
    }

    return events.map((event) => <EventSmall key={event.id} {...event} />);
};

export const Events = () => {
    const { refetch } = useEventsQuery();
    const [refreshing, setRefreshing] = useState(false);

    return (
        <>
            <Screen>{/* Bevorstehend und Vergangnen Option */}</Screen>
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
                withShadow
                contentContainerStyle={contentContainerStyle}
            >
                <MappedEvents />
            </ScrollView>
        </>
    );
};

import { Redirect, router } from 'expo-router';
import { ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { useSingleEventQuery } from '@/api/events/queries';
import { useEventImageQuery } from '@/api/images';
import { useState } from 'react';
import { Details } from '@/screens/EventDetails/components/Details';
import { ShareSheet } from '@/sheets/ShareSheet';
import { ScrollableScreen } from '@/components/Screen';
import { View } from 'tamagui';
import { BackButton } from '@/components/BackButton';
import { useEventDetailsContext } from '@/screens/EventDetails/EventDetailsProvider';
import { useGetUser } from '@/store/authentication';
import { Button } from '@/components/tamagui/Button';
import { useMe } from '@/api/events/refiners';
import { Role } from '@/api/events/types';
import { Pencil } from '@tamagui/lucide-icons';

export const EventDetails = () => {
    const { eventId } = useEventDetailsContext();
    const me = useMe(eventId);
    const [showShare, setShowShare] = useState(false);

    const user = useGetUser();
    const { data: event, isLoading } = useSingleEventQuery(eventId);
    const { data: image } = useEventImageQuery(eventId);

    if (isLoading) {
        return <ActivityIndicator />;
    }

    const hasMissingData = !user || !event;

    if (!isLoading && hasMissingData) {
        return <Redirect href="/(tabs)" />;
    }

    return (
        <ScrollableScreen
            back={<BackButton href="/(tabs)" />}
            action={
                me?.role === Role.enum.GUEST ? null : (
                    <Button variant="round" onPress={() => router.push('/eventDetails/editEvent')}>
                        <Pencil color="$color" size="$1" scale={0.75} />
                    </Button>
                )
            }
        >
            {image && (
                <View backgroundColor="$background" overflow="hidden" elevationAndroid="$2" width="100%" borderRadius="$8">
                    <Image source={image} style={{ width: 'auto', height: 200 }} />
                </View>
            )}
            {event?.id && <Details />}
            {event?.id && <ShareSheet onOpenChange={setShowShare} open={showShare} />}
        </ScrollableScreen>
    );
};

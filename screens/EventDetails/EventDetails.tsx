import { Redirect, router } from 'expo-router';
import { Image } from 'expo-image';
import { useSingleEventQuery } from '@/api/events/queries';
import { useEventImageQuery } from '@/api/images';
import { useState } from 'react';
import { Details } from '@/screens/EventDetails/components/Details';
import { ShareSheet } from '@/sheets/ShareSheet';
import { Screen, ScrollableScreen } from '@/components/Screen';
import { View } from 'tamagui';
import { BackButton } from '@/components/BackButton';
import { useEventDetailsContext } from '@/screens/EventDetails/EventDetailsProvider';
import { useGetUser } from '@/store/authentication';
import { Button } from '@/components/tamagui/Button';
import { useMe } from '@/api/events/refiners';
import { Role } from '@/api/events/types';
import { Pencil } from '@tamagui/lucide-icons';
import { Skeleton } from '@/components/Skeleton';

export const EventDetails = () => {
    const { eventId } = useEventDetailsContext();
    const me = useMe(eventId);
    const [showShare, setShowShare] = useState(false);

    const user = useGetUser();
    const { data: event, isLoading } = useSingleEventQuery(eventId);
    const { data: image } = useEventImageQuery(eventId);

    const hasMissingData = !user || !event;

    if (!isLoading && hasMissingData) {
        return <Redirect href="/(tabs)" />;
    }

    return (
        <>
            {isLoading ? (
                <Screen
                    animation="medium"
                    enterStyle={{ opacity: 0 }}
                    exitStyle={{ opacity: 0 }}
                    flex={1}
                    back={<Skeleton shape="circle" size="$3" />}
                    action={<Skeleton shape="circle" size="$3" />}
                >
                    <Skeleton alignSelf="center" width="50%" shape="square" height="$3" />
                    <Skeleton shape="square" height="$6" width="100%" />
                    <Skeleton shape="square" height="$2" width="100%" />
                    <Skeleton shape="square" height="$2" width="100%" />
                    <Skeleton shape="square" height="$2" width="100%" />
                    <View flex={1} />
                    <Skeleton shape="square" height="$3" width="100%" />
                </Screen>
            ) : (
                <View animation="medium" flex={1} enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }}>
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
                </View>
            )}
        </>
    );
};

import { SizableText, XStack, YStack } from 'tamagui';
import { CalendarDays, ChevronRight, ExternalLink, Link2, MapPin, MessageSquareText, Users } from '@tamagui/lucide-icons';
import { router } from 'expo-router';
import { useSingleEventQuery } from '@/api/events/queries';
import { formatToDate, formatToTime } from '@/utils/date';
import { PressableRow } from '@/components/PressableRow';
import { useEventDetailsContext } from '@/screens/EventDetails/EventDetailsProvider';
import { Linking } from 'react-native';
import { Card } from '@/components/tamagui/Card';

export const Details = () => {
    const { eventId } = useEventDetailsContext();
    const { data: event } = useSingleEventQuery(eventId);

    if (!event) {
        return null;
    }

    const url = (() => {
        if (!event.link) {
            return undefined;
        }
        const url = new URL(event.link);
        if (url.toString() === 'INVALID_URL') {
            return undefined;
        }

        return url;
    })();

    const handleOpenLink = async () => {
        if (url && (await Linking.canOpenURL(url.toString()))) {
            await Linking.openURL(url.toString());
        }
    };

    return (
        <>
            <SizableText textAlign="center" size="$8">
                {event.name}
            </SizableText>
            <XStack alignItems="center" gap="$3">
                <CalendarDays />
                <Card flex={1} justifyContent="space-evenly" flexDirection="row" alignItems="center" paddingVertical="$3" borderRadius="$4">
                    <XStack gap="$3" alignItems="center">
                        <SizableText>vom</SizableText>
                        <YStack>
                            <SizableText size="$5">{formatToDate(parseInt(event.startTime))}</SizableText>
                            <SizableText>{formatToTime(parseInt(event.startTime))} Uhr</SizableText>
                        </YStack>
                    </XStack>
                    <XStack gap="$3" alignItems="center">
                        <SizableText>bis</SizableText>
                        <YStack>
                            <SizableText size="$5">{formatToDate(parseInt(event.endTime))}</SizableText>
                            <SizableText>{formatToTime(parseInt(event.endTime))} Uhr</SizableText>
                        </YStack>
                    </XStack>
                </Card>
            </XStack>
            <PressableRow icon={<MapPin />} iconRight={null}>
                <SizableText>{event.location}</SizableText>
            </PressableRow>
            {event.description && (
                <PressableRow icon={<MessageSquareText />} iconRight={null}>
                    <SizableText>{event.description}</SizableText>
                </PressableRow>
            )}
            <PressableRow icon={<Users />} onPress={() => router.push(`/eventDetails/participants`)} iconRight={<ChevronRight size="$1" />}>
                <SizableText>Gäste</SizableText>
            </PressableRow>
            {url && (
                <PressableRow icon={<Link2 />} onPress={handleOpenLink} iconRight={<ExternalLink scale={0.75} size="$1" />}>
                    <SizableText>{url.host}</SizableText>
                </PressableRow>
            )}
        </>
    );
};

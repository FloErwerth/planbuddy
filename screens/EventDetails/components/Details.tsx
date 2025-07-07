import { SizableText, XStack, YStack } from 'tamagui';
import { CalendarDays, MapPin, MessageSquareText, Users } from '@tamagui/lucide-icons';
import { router } from 'expo-router';
import { useSingleEventQuery } from '@/api/events/queries';
import { formatToDate, formatToTime } from '@/utils/date';
import { PressableRow } from '@/components/PressableRow';
import { useEventDetailsContext } from '@/screens/EventDetails/EventDetailsProvider';

export const Details = () => {
  const { eventId } = useEventDetailsContext();
  const { data: event } = useSingleEventQuery(eventId);

  if (!event) {
    return null;
  }

  return (
    <>
      <SizableText color="$primary" size="$8">
        {event.name}
      </SizableText>
      <XStack alignItems="center" gap="$3">
        <CalendarDays />
        <XStack flex={1} justifyContent="space-evenly" alignItems="center" backgroundColor="$inputBackground" padding="$3" borderRadius="$4">
          <YStack>
            <SizableText size="$5">{formatToDate(parseInt(event.startTime))}</SizableText>
            <SizableText>{formatToTime(parseInt(event.startTime))} Uhr</SizableText>
          </YStack>
          <SizableText>bis</SizableText>
          <YStack>
            <SizableText size="$5">{formatToDate(parseInt(event.endTime))}</SizableText>
            <SizableText>{formatToTime(parseInt(event.endTime))} Uhr</SizableText>
          </YStack>
        </XStack>
      </XStack>
      <PressableRow icon={<MapPin />}>
        <SizableText>{event.location}</SizableText>
      </PressableRow>
      {event.description && (
        <PressableRow icon={<MessageSquareText />}>
          <SizableText>{event.description}</SizableText>
        </PressableRow>
      )}
      <PressableRow icon={<Users />} onPress={() => router.push(`/eventDetails/participants`)}>
        <SizableText>Teilnehmer</SizableText>
      </PressableRow>
    </>
  );
};

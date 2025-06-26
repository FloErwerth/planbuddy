import { SizableText, useWindowDimensions, XStack, YStack } from 'tamagui';
import { CalendarDays, MapPin, MessageSquareText, Users } from '@tamagui/lucide-icons';
import { router } from 'expo-router';
import { useSingleEventQuery } from '@/api/events/queries';
import { formatToDate, formatToTime } from '@/utils/date';
import { PressableRow } from '@/components/PressableRow';

type DetailsProps = {
  eventId: string;
};
export const Details = ({ eventId }: DetailsProps) => {
  const { data: event } = useSingleEventQuery(eventId);
  const { width } = useWindowDimensions();

  if (!event) {
    return null;
  }

  const { participants } = event;

  return (
    <>
      <SizableText color="$primary" size="$8">
        {event.name}
      </SizableText>
      <XStack alignItems="center" gap="$3">
        <CalendarDays />
        <XStack
          flex={1}
          justifyContent="space-evenly"
          alignItems="center"
          backgroundColor="$inputBackground"
          padding="$3"
          borderRadius="$4"
        >
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
      <PressableRow title={event.location} icon={<MapPin />} />
      {event.description && <PressableRow title={event.description} icon={<MessageSquareText />} />}
      <PressableRow
        title="Teilnehmer"
        icon={<Users />}
        onPress={() => router.push({ pathname: `/eventDetails/participants`, params: { eventId } })}
      />
    </>
  );
};

import { SizableText, useWindowDimensions, View, XStack, YStack } from 'tamagui';
import {
  CalendarDays,
  ChevronRight,
  MapPin,
  MessageSquareText,
  Users,
} from '@tamagui/lucide-icons';
import { Pressable } from 'react-native';
import { router } from 'expo-router';
import { useSingleEventQuery } from '@/api/events/queries';
import { formatToDate, formatToTime } from '@/utils/date';

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
      <XStack alignItems="center" gap="$3">
        <MapPin />
        <View
          flex={1}
          justifyContent="space-between"
          backgroundColor="$inputBackground"
          padding="$3"
          borderRadius="$4"
        >
          <SizableText>{event.location}</SizableText>
        </View>
      </XStack>
      {event.description && (
        <XStack gap="$3" alignItems="center">
          <MessageSquareText />
          <View
            flex={1}
            justifyContent="space-evenly"
            backgroundColor="$inputBackground"
            padding="$3"
            borderRadius="$4"
          >
            <SizableText>{event.description}</SizableText>
          </View>
        </XStack>
      )}
      <Pressable
        onPress={() => router.push({ pathname: `/eventDetails/participants`, params: { eventId } })}
      >
        <XStack gap="$3" alignItems="center">
          <Users />
          <View
            flex={1}
            justifyContent="space-between"
            alignItems="center"
            backgroundColor="$inputBackground"
            padding="$3"
            borderRadius="$4"
            flexDirection="row"
          >
            <SizableText>Teilnehmer</SizableText>
            <ChevronRight />
          </View>
        </XStack>
      </Pressable>
    </>
  );
};

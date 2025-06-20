import { XStack, YStack } from 'tamagui';
import { Pressable } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { useEventImageQuery } from '@/api/images';
import { Event } from '@/api/events/types';
import { Card } from '@/components/tamagui/Card';
import { Text } from '@/components/tamagui/Text';
import { getRelativeDate } from '@/utils/date';

type EventSmallProps = Pick<Event, 'name' | 'location' | 'startTime' | 'id'>;

const imageStyle = { aspectRatio: '4/3', borderRadius: 8 } as const;
export const EventSmall = ({ name, location, startTime, id }: EventSmallProps) => {
  const { data: image } = useEventImageQuery(id);
  return (
    <Pressable onPress={() => router.push({ pathname: '/eventDetails', params: { eventId: id } })}>
      <Card marginHorizontal="$4">
        <XStack justifyContent="space-between">
          <YStack>
            <Text size="$6">{name}</Text>
            <Text size="$3">{getRelativeDate(parseInt(startTime))}</Text>
            <Text size="$3">{location}</Text>
          </YStack>
          {image && <Image source={image} style={imageStyle} />}
        </XStack>
      </Card>
    </Pressable>
  );
};

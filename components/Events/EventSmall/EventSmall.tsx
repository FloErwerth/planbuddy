import { Event } from '@/api/events/types';
import { useEventImageQuery } from '@/api/images';
import { Card } from '@/components/tamagui/Card';
import { SizeableText } from '@/components/tamagui/SizeableText';
import { getRelativeDate } from '@/utils/date';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable } from 'react-native';
import { XStack, YStack } from 'tamagui';

type EventSmallProps = Pick<Event, 'name' | 'location' | 'startTime' | 'id'>;

const imageStyle = { aspectRatio: '4/3', borderRadius: 8 } as const;
export const EventSmall = ({ name, location, startTime, id }: EventSmallProps) => {
    const { data: image } = useEventImageQuery(id);
    return (
        <Pressable
            onPress={() =>
                router.push({
                    pathname: '/eventDetails',
                    params: { eventId: id },
                })
            }
        >
            <Card marginHorizontal="$4">
                <XStack justifyContent="space-between">
                    <YStack>
                        <SizeableText size="$6">{name}</SizeableText>
                        <SizeableText size="$3">{getRelativeDate(new Date(startTime))}</SizeableText>
                        <SizeableText size="$3">{location}</SizeableText>
                    </YStack>
                    {image && <Image source={image} style={imageStyle} />}
                </XStack>
            </Card>
        </Pressable>
    );
};

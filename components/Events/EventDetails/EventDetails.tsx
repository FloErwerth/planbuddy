import { Redirect, router, useGlobalSearchParams } from 'expo-router';
import { ActivityIndicator, Dimensions, Pressable } from 'react-native';
import { SizableText, View, XStack } from 'tamagui';
import { Image } from 'expo-image';
import { ChevronRight, MessageSquareText, Users } from '@tamagui/lucide-icons';
import { useSingleEventQuery } from '@/api/events/queries';
import { useGetUser } from '@/store/user';
import { useEventImageQuery } from '@/api/images';
import { ScrollView } from '@/components/tamagui/ScrollView';
import { useCallback } from 'react';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

const screenWidth = Dimensions.get('screen').width;

export const EventDetails = () => {
  const { detailEventId } = useGlobalSearchParams<{
    detailEventId: string;
  }>();

  const user = useGetUser();
  const { data: event, isLoading } = useSingleEventQuery(detailEventId);
  const { data: image } = useEventImageQuery(detailEventId);

  const cardStyle = useAnimatedStyle(
    () =>
      ({
        flex: withTiming(image ? 0.5 : 0.25),
      }) as const
  );

  const imageStyle = useAnimatedStyle(
    () =>
      ({
        opacity: withTiming(image ? 1 : 0),
        height: image ? '100%' : '0%',
        zIndex: 10,
      }) as const
  );

  const UploadedImage = useCallback(() => {
    if (!image) {
      return <View backgroundColor="$inputBackground" width="100%" height="$4" />;
    }

    return (
      <Animated.View style={cardStyle}>
        <View backgroundColor="$inputBackground">
          <Animated.View style={imageStyle}>
            <Image source={image} style={{ aspectRatio: '4/3', width: screenWidth }} />
          </Animated.View>
        </View>
      </Animated.View>
    );
  }, [cardStyle, image, imageStyle]);

  if (isLoading || !user) {
    return <ActivityIndicator />;
  }

  if (!event && !isLoading) {
    return <Redirect href="/(tabs)" />;
  }

  const role = event?.participants.role;
  const numberOfParticipants = event?.participants.total;
  const accepted = event?.participants.accepted;

  const hosts = [{ id: 'some' }, { id: 'lol' }];
  const isHost = true;

  return (
    <>
      <UploadedImage />
      <View
        elevationAndroid="$4"
        borderTopLeftRadius="$8"
        borderTopRightRadius="$8"
        flex={1}
        backgroundColor="$background"
        top="$-4"
        overflow="hidden"
      >
        <ScrollView
          contentContainerStyle={{
            padding: '$4',
            paddingTop: 0,
          }}
        >
          <View
            position="relative"
            gap="$4"
            width={screenWidth}
            right="$4"
            overflow="hidden"
            height="100%"
            borderTopLeftRadius="$8"
            borderTopRightRadius="$8"
          >
            <ScrollView contentContainerStyle={{ padding: '$4', gap: '$4' }}>
              <View>
                <SizableText color="$primary" size="$8">
                  {event?.event.name}
                </SizableText>
              </View>
              <SizableText>{event?.event.location}</SizableText>
              {event?.event.description && (
                <XStack gap="$3" alignItems="center">
                  <MessageSquareText />
                  <View>
                    <SizableText fontWeight="$6">Beschreibung</SizableText>
                    <SizableText>{event.event.description}</SizableText>
                  </View>
                </XStack>
              )}
              <Pressable onPress={() => router.push(`/eventDetails/${event?.event.id}`)}>
                <XStack alignItems="center" justifyContent="space-between">
                  <XStack gap="$3" alignItems="center">
                    <Users />
                    <View>
                      <SizableText fontWeight="$6">
                        {accepted} Teilnehmer, die zugesagt haben
                      </SizableText>
                      <SizableText>{numberOfParticipants} eingeladene Teilnehmer</SizableText>
                    </View>
                  </XStack>
                  <ChevronRight />
                </XStack>
              </Pressable>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

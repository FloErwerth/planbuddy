import { Redirect, useGlobalSearchParams } from 'expo-router';
import { ActivityIndicator, Dimensions } from 'react-native';
import { View, XStack } from 'tamagui';
import { Image } from 'expo-image';
import { useSingleEventQuery } from '@/api/events/queries';
import { useGetUser } from '@/store/user';
import { useEventImageQuery } from '@/api/images';
import { useCallback, useState } from 'react';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { BackButton } from '@/components/BackButton';
import { ShareButton } from '@/components/ShareButton/ShareButton';
import { Details } from '@/components/Events/EventDetails/components/Details';
import { ShareSheet } from '@/sheets/ShareSheet';

const screenWidth = Dimensions.get('screen').width;

export const EventDetails = () => {
  const { detailEventId } = useGlobalSearchParams<{
    detailEventId: string;
  }>();
  const [showShare, setShowShare] = useState(false);

  const user = useGetUser();
  const { data: event, isLoading } = useSingleEventQuery(detailEventId);
  const { data: image } = useEventImageQuery(detailEventId);

  const cardStyle = useAnimatedStyle(
    () =>
      ({
        flex: withTiming(image ? 0.5 : 0),
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
      return (
        <XStack
          justifyContent="space-between"
          backgroundColor="$inputBackground"
          width="100%"
          height="$8"
        >
          <BackButton top="$4" left="$4" href="/(tabs)" />
          {event?.id && (
            <ShareButton onPress={() => setShowShare(true)} id={event?.id} right="$4" top="$4" />
          )}
        </XStack>
      );
    }

    return (
      <>
        <BackButton position="absolute" top="$4" left="$4" href="/(tabs)" />
        {event?.id && (
          <ShareButton
            onPress={() => setShowShare(true)}
            position="absolute"
            id={event?.id}
            right="$4"
            top="$4"
          />
        )}
        <Animated.View style={cardStyle}>
          <View backgroundColor="$inputBackground">
            <Animated.View style={imageStyle}>
              <Image source={image} style={{ aspectRatio: '4/3', width: screenWidth }} />
            </Animated.View>
          </View>
        </Animated.View>
      </>
    );
  }, [cardStyle, event?.id, image, imageStyle]);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  const hasMissingData = !user || !event;

  if (!isLoading && hasMissingData) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <View flex={1}>
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
        {event?.id && <Details eventId={event.id} />}
      </View>
      {event?.id && <ShareSheet eventId={event.id} onOpenChange={setShowShare} open={showShare} />}
    </View>
  );
};

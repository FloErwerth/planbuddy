import { getAuth } from '@react-native-firebase/auth';
import { Redirect, useGlobalSearchParams } from 'expo-router';
import { ActivityIndicator } from 'react-native';
import { Screen } from '@/components/Screen';
import { getTokenValue, SizableText, View } from 'tamagui';
import { useEventsQuery } from '@/api/query/events';
import { Image } from 'expo-image';

export const EventDetails = () => {
  const { detailEventId } = useGlobalSearchParams<{
    detailEventId: string;
  }>();
  const { data: events, isLoading } = useEventsQuery();
  const userId = getAuth().currentUser?.uid;

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if ((!events && !isLoading) || !userId) {
    return <Redirect href="/(tabs)" />;
  }

  const event = events.find((event) => event?.id === detailEventId);

  if (!event) {
    return <Redirect href="/(tabs)" />;
  }

  const userDetails = event.users?.find((user) => user.id === userId);

  if (!userDetails) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Screen>
      <Image
        source={{ uri: event.image }}
        style={{
          alignSelf: 'center',
          width: '80%',
          aspectRatio: '4/3',
          borderRadius: getTokenValue('$4', 'radius'),
        }}
      ></Image>
      <View>
        <SizableText size="$8">Event Name</SizableText>
        <SizableText>{event.name}</SizableText>
      </View>
      <SizableText>{event.description}</SizableText>
      <View>
        <SizableText size="$8">Ort</SizableText>
        <SizableText>{event.address.streetHouseNr.concat(', ', event.address.zipCity)}</SizableText>
      </View>
      <SizableText>{detailEventId}</SizableText>
    </Screen>
  );
};

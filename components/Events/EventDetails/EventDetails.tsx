import { getAuth } from '@react-native-firebase/auth';
import { Redirect, useGlobalSearchParams } from 'expo-router';
import { ActivityIndicator, Pressable } from 'react-native';
import { Avatar, SizableText, View, XStack, ZStack } from 'tamagui';
import { useEventsQuery } from '@/api/query/events';
import { Image } from 'expo-image';
import { BackButton } from '@/components/BackButton';
import { MapPin, MessageSquareText, Users } from '@tamagui/lucide-icons';
import { formatToTime } from '@/components/Calendar/utils';
import { ShareButton } from '@/components/ShareButton/ShareButton';

const imageStyle = {
  alignSelf: 'center',
  width: '100%',
  aspectRatio: '4/3',
  position: 'absolute',
} as const;

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

  const hosts = event.users?.filter(({ isAdmin }) => isAdmin) ?? [];
  const isHost = hosts.some(({ id }) => id === userId);

  return (
    <View>
      <BackButton />
      <ShareButton id={event.id ?? ''} />
      <Image source={{ uri: event.image }} style={imageStyle}></Image>
      <View
        position="relative"
        gap="$4"
        top="30%"
        overflow="hidden"
        height="100%"
        borderTopLeftRadius="$8"
        borderTopRightRadius="$8"
        backgroundColor="$background"
      >
        <View padding="$4" gap="$4">
          <View>
            <SizableText color="$primary" textAlign="center" size="$8">
              {event.name}
            </SizableText>
          </View>
          <XStack gap="$3" alignItems="center">
            <MessageSquareText />
            <View>
              <SizableText fontWeight="$6">
                {hosts.length > 1 ? 'Deine Hosts' : 'Dein Host'}
              </SizableText>
              <ZStack height="$4" marginTop="$1">
                {[...hosts, ...hosts, ...hosts].reverse().map(({ id }, index) => (
                  <View key={id + index} left={(3 - index - 1) * 30}>
                    <Avatar circular size="$4" elevationAndroid={4}>
                      <Avatar.Image src="http://some" />
                      <Avatar.Fallback
                        backgroundColor="$background"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <SizableText>F.E</SizableText>
                      </Avatar.Fallback>
                    </Avatar>
                  </View>
                ))}
              </ZStack>
            </View>
          </XStack>
          <XStack gap="$3" alignItems="center">
            <MessageSquareText />
            <View>
              <SizableText fontWeight="$6">Beschreibung</SizableText>
              <SizableText>{event.description}</SizableText>
            </View>
          </XStack>
          <XStack gap="$3" alignItems="center">
            <MapPin />
            <View>
              <SizableText fontWeight="$6">Ort und Uhrzeit</SizableText>
              <SizableText>
                {event.address.streetHouseNr.concat(', ', event.address.zipCity)}
              </SizableText>
              <SizableText>ab {formatToTime(event.dateTimestamp)} Uhr</SizableText>
            </View>
          </XStack>
          <XStack gap="$3" alignItems="center">
            <Users />
            <View>
              <XStack gap="$1">
                <SizableText fontWeight="$6">32 Teilnehmer</SizableText>
              </XStack>

              <Pressable>
                <SizableText>Füge hier weitere Teilnehmer hinzu</SizableText>
              </Pressable>
            </View>
          </XStack>
        </View>
      </View>
    </View>
  );
};

import { ScrollView } from '@/components/tamagui/ScrollView';
import { SizableText, useWindowDimensions, View, XStack } from 'tamagui';
import { ChevronRight, MessageSquareText, Users } from '@tamagui/lucide-icons';
import { Pressable } from 'react-native';
import { router } from 'expo-router';
import { useSingleEventQuery } from '@/api/events/queries';

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
      <ScrollView
        contentContainerStyle={{
          padding: '$4',
          paddingTop: 0,
        }}
      >
        <View
          position="relative"
          gap="$4"
          width={width}
          right="$4"
          overflow="hidden"
          height="100%"
          borderTopLeftRadius="$8"
          borderTopRightRadius="$8"
        >
          <View padding="$4" gap="$4">
            <View>
              <SizableText color="$primary" size="$8">
                {event.name}
              </SizableText>
            </View>
            <SizableText>{event.location}</SizableText>
            {event.description && (
              <XStack gap="$3" alignItems="center">
                <MessageSquareText />
                <View>
                  <SizableText fontWeight="$6">Beschreibung</SizableText>
                  <SizableText>{event.description}</SizableText>
                </View>
              </XStack>
            )}
            <Pressable
              onPress={() =>
                router.push({ pathname: `/eventDetails/participants`, params: { eventId } })
              }
            >
              <XStack alignItems="center" justifyContent="space-between">
                <XStack gap="$3" alignItems="center">
                  <Users />
                  <View>
                    <SizableText fontWeight="$6">
                      {participants.accepted} Teilnehmer, die zugesagt haben
                    </SizableText>
                    <SizableText>{participants.total} eingeladene Teilnehmer</SizableText>
                  </View>
                </XStack>
                <ChevronRight />
              </XStack>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

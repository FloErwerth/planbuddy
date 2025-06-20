import { Avatar, SizableText, View, XStack } from 'tamagui';
import { Screen } from '@/components/Screen';
import { BackButton } from '@/components/BackButton';
import { useParticipantsImageQuery, useParticipantsQuery } from '@/api/events/queries';
import { Redirect, useGlobalSearchParams } from 'expo-router';
import { ActivityIndicator } from 'react-native';
import { ParticipantQueryResponse } from '@/api/events/types';
import { Button } from '@/components/tamagui/Button';
import { useState } from 'react';
import { z } from 'zod';
import { Eye } from '@tamagui/lucide-icons';
import { ScrollView } from '@/components/tamagui/ScrollView';

const ParticipantAvatar = ({
  participant: { firstName, lastName, userId },
}: {
  participant: ParticipantQueryResponse;
}) => {
  const { data: image } = useParticipantsImageQuery(userId);

  const kuerzel =
    firstName?.charAt(0).toUpperCase() + '. ' + lastName?.charAt(0).toUpperCase() + '.';

  return (
    <Avatar circular size="$4" elevationAndroid={4}>
      {image && <Avatar.Image source={{ uri: image }} />}
      <Avatar.Fallback backgroundColor="$background" alignItems="center" justifyContent="center">
        <SizableText>{kuerzel}</SizableText>
      </Avatar.Fallback>
    </Avatar>
  );
};

const filter = z.enum(['accepted', 'declined', 'pending']);
type Filter = z.infer<typeof filter>;

export default function Participants() {
  const { eventId = '' } = useGlobalSearchParams<{ eventId: string }>();
  const { data: participants, isLoading } = useParticipantsQuery(eventId);
  const [activeFilters, setActiveFilters] = useState<Filter[]>([]);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (!participants) {
    return <Redirect href=".." />;
  }

  const toggleFilter = (toggledFilter: Filter) => {
    if (activeFilters.includes(toggledFilter)) {
      setActiveFilters((filters) => filters.filter((filter) => filter !== toggledFilter));
    } else {
      setActiveFilters((filters) => [...filters, toggledFilter]);
    }
  };

  const acceptedFilterActive = activeFilters.includes('accepted');
  const declinedFilterActive = activeFilters.includes('declined');
  const pendingFilterActived = activeFilters.includes('pending');

  const noFilterActive = !pendingFilterActived && !declinedFilterActive && !acceptedFilterActive;
  return (
    <>
      <Screen back={<BackButton href=".." />} title="Teilnehmer">
        <XStack gap="$3">
          <Button
            size="$2"
            variant={noFilterActive ? 'primary' : 'secondary'}
            borderRadius="$12"
            onPress={() => setActiveFilters([])}
          >
            Alle
            {noFilterActive && <Eye color="$background" size="$1" />}
          </Button>
          <Button
            size="$2"
            variant={acceptedFilterActive ? 'primary' : 'secondary'}
            borderRadius="$12"
            onPress={() => toggleFilter('accepted')}
          >
            Zugesagt
            {acceptedFilterActive && <Eye color="$background" size="$1" />}
          </Button>
          <Button
            onPress={() => toggleFilter('declined')}
            size="$2"
            variant={declinedFilterActive ? 'primary' : 'secondary'}
            borderRadius="$12"
          >
            Abgesagt
            {declinedFilterActive && <Eye color="$background" size="$1" />}
          </Button>
          <Button
            size="$2"
            onPress={() => toggleFilter('pending')}
            variant={pendingFilterActived ? 'primary' : 'secondary'}
            borderRadius="$12"
          >
            Ausstehend
            {pendingFilterActived && <Eye color="$background" size="$1" />}
          </Button>
        </XStack>
      </Screen>
      <ScrollView withShadow contentContainerStyle={{ padding: '$4' }}>
        {participants.map((participant) => (
          <>
            <XStack justifyContent="space-between" alignItems="center">
              <XStack gap="$4" alignItems="center">
                <ParticipantAvatar participant={participant} />
                <View>
                  <SizableText size="$5">
                    {participant.firstName} {participant.lastName}
                  </SizableText>
                  <SizableText size="$2">{participant.role}</SizableText>
                </View>
              </XStack>
            </XStack>
          </>
        ))}
      </ScrollView>
    </>
  );
}

import { BackButton } from '@/components/BackButton';
import { Redirect, useGlobalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ParticipanFilter, ParticipantFilter, useParticipantsQuery } from '@/api/events/queries';
import { useGetUser } from '@/store/user';
import { Participant } from '@/api/events/types';
import { Pressable, RefreshControl } from 'react-native';
import { SizableText, View, XStack } from 'tamagui';
import { UserAvatar } from './ParticipantsAvatar';
import { Button } from '@/components/tamagui/Button';
import { Eye } from '@tamagui/lucide-icons';
import { ScrollView } from '@/components/tamagui/ScrollView';
import { Screen } from '@/components/Screen';
import { ParticipantSceleton } from '@/screens/Participants/ParticipantSceleton';

export const Participants = () => {
  const { eventId = '' } = useGlobalSearchParams<{ eventId: string }>();
  const [activeFilters, setActiveFilters] = useState<ParticipantFilter[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { data: participants, refetch, isLoading } = useParticipantsQuery(eventId, activeFilters);
  const user = useGetUser();

  const sortedParticipants = useMemo(() => {
    return participants?.sort((a, b) => (a.userId === user?.id ? 1 : 0));
  }, [participants, user?.id]);

  const handlePressParticipant = useCallback(
    (participant: Participant) => {
      if (user?.id === participant.userId) {
        console.log('allowing action on myself');
        return;
      }
      if (user?.role !== 'user') {
        console.log('allowing action');
      }
    },
    [user?.id, user?.role]
  );

  const mappedParticipants = useMemo(() => {
    return sortedParticipants?.map((participant) => {
      const isMe = participant.userId === user?.id;
      return (
        <Pressable key={participant.id} onPress={() => handlePressParticipant(participant)}>
          <XStack
            justifyContent="space-between"
            elevationAndroid="$1"
            padding="$2"
            borderRadius="$4"
            backgroundColor={isMe ? '$color.blue4Light' : '$background'}
            alignItems="center"
          >
            <XStack gap="$4" alignItems="center">
              <UserAvatar
                id={participant.userId}
                firstName={participant.firstName}
                lastName={participant.lastName}
              />
              <View>
                <SizableText size="$5">
                  {participant.firstName} {participant.lastName}
                </SizableText>
                <SizableText size="$2">{participant.role}</SizableText>
              </View>
            </XStack>
            {isMe && <SizableText marginRight="$2">Du</SizableText>}
          </XStack>
        </Pressable>
      );
    });
  }, [handlePressParticipant, sortedParticipants, user?.id]);

  const sceletons = useMemo(() => {
    return participants?.map(({ id }) => <ParticipantSceleton key={id} />);
  }, [participants]);

  if (!participants && !isLoading) {
    return <Redirect href=".." />;
  }

  const toggleFilter = (toggledFilter: ParticipantFilter) => {
    if (activeFilters.includes(toggledFilter)) {
      setActiveFilters((filters) => filters.filter((filter) => filter !== toggledFilter));
    } else {
      setActiveFilters((filters) => [...filters, toggledFilter]);
    }
  };

  const acceptedFilterActive = activeFilters.includes(ParticipanFilter.accepted);
  const declinedFilterActive = activeFilters.includes(ParticipanFilter.declined);
  const pendingFilterActive = activeFilters.includes(ParticipanFilter.undecided);

  return (
    <>
      <Screen back={<BackButton href=".." />} title="Teilnehmer">
        <XStack gap="$3">
          <Button
            size="$2"
            variant={acceptedFilterActive ? 'primary' : 'secondary'}
            borderRadius="$12"
            onPress={() => toggleFilter(ParticipanFilter.accepted)}
          >
            Zugesagt
            {acceptedFilterActive && <Eye color="$background" size="$1" />}
          </Button>
          <Button
            onPress={() => toggleFilter(ParticipanFilter.declined)}
            size="$2"
            variant={declinedFilterActive ? 'primary' : 'secondary'}
            borderRadius="$12"
          >
            Abgesagt
            {declinedFilterActive && <Eye color="$background" size="$1" />}
          </Button>
          <Button
            size="$2"
            onPress={() => toggleFilter(ParticipanFilter.undecided)}
            variant={pendingFilterActive ? 'primary' : 'secondary'}
            borderRadius="$12"
          >
            Ausstehend
            {pendingFilterActive && <Eye color="$background" size="$1" />}
          </Button>
        </XStack>
      </Screen>
      <ScrollView
        refreshControl={
          <RefreshControl
            onRefresh={async () => {
              setRefreshing(true);
              await refetch();
              setRefreshing(false);
            }}
            refreshing={refreshing}
          />
        }
        withShadow
        contentContainerStyle={{ padding: '$4', gap: '$2' }}
      >
        {refreshing ? sceletons : mappedParticipants}
      </ScrollView>
    </>
  );
};

import { BackButton } from '@/components/BackButton';
import { Redirect } from 'expo-router';
import { useMemo, useState } from 'react';
import { useParticipantsQuery } from '@/api/events/queries';
import { useGetUser } from '@/store/user';
import { RefreshControl } from 'react-native';
import { XStack } from 'tamagui';
import { Button } from '@/components/tamagui/Button';
import { Eye, Plus } from '@tamagui/lucide-icons';
import { ScrollView } from '@/components/tamagui/ScrollView';
import { Screen } from '@/components/Screen';
import { ParticipantSkeleton } from '@/screens/Participants/ParticipantSkeleton';
import { Status, StatusEnum } from '@/api/types';
import { SearchInput } from '@/components/SearchInput';
import { ParticipantsAddSheet } from '@/screens/Participants/ParticipantsAdd';
import { Participant } from '@/screens/Participants/Participant';
import { useEventDetailsContext } from '@/screens/EventDetails/EventDetailsProvider';

export const Participants = () => {
  const { eventId, setEditedGuest, editedGuest } = useEventDetailsContext();
  const [activeFilters, setActiveFilters] = useState<Status[]>([]);
  const [addSheetOpen, setAddSheetOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const { data: participants, refetch, isLoading } = useParticipantsQuery(eventId, activeFilters, search);
  const user = useGetUser();

  const sortedParticipants = useMemo(() => {
    return participants?.sort((a, b) => (a.userId === user?.id ? 1 : 0));
  }, [participants, user?.id]);

  const mappedParticipants = useMemo(
    () =>
      sortedParticipants?.map((participant) => (
        <Participant key={participant.id} participant={participant} onOpenOptions={() => setEditedGuest(participant)} />
      )),
    [setEditedGuest, sortedParticipants]
  );

  const sceletons = useMemo(() => {
    return participants?.map(({ id }) => <ParticipantSkeleton key={id} />);
  }, [participants]);

  if (!participants && !isLoading) {
    return <Redirect href=".." />;
  }

  const toggleFilter = (toggledFilter: Status) => {
    if (activeFilters.includes(toggledFilter)) {
      setActiveFilters((filters) => filters.filter((filter) => filter !== toggledFilter));
    } else {
      setActiveFilters((filters) => [...filters, toggledFilter]);
    }
  };

  const acceptedFilterActive = activeFilters.includes(StatusEnum.ACCEPTED);
  const declinedFilterActive = activeFilters.includes(StatusEnum.DECLINED);
  const pendingFilterActive = activeFilters.includes(StatusEnum.PENDING);

  return (
    <>
      <Screen
        back={<BackButton href=".." />}
        title="Teilnehmer"
        action={
          <Button variant="round" onPress={() => setAddSheetOpen(true)} width="$2" height="$2">
            <Plus color="$background" scale={0.85} />
          </Button>
        }
      >
        <XStack gap="$3">
          <Button size="$2" variant={acceptedFilterActive ? 'primary' : 'secondary'} borderRadius="$12" onPress={() => toggleFilter(StatusEnum.ACCEPTED)}>
            Zugesagt
            {acceptedFilterActive && <Eye color="$background" size="$1" />}
          </Button>
          <Button onPress={() => toggleFilter(StatusEnum.DECLINED)} size="$2" variant={declinedFilterActive ? 'primary' : 'secondary'} borderRadius="$12">
            Abgesagt
            {declinedFilterActive && <Eye color="$background" size="$1" />}
          </Button>
          <Button size="$2" onPress={() => toggleFilter(StatusEnum.PENDING)} variant={pendingFilterActive ? 'primary' : 'secondary'} borderRadius="$12">
            Ausstehend
            {pendingFilterActive && <Eye color="$background" size="$1" />}
          </Button>
        </XStack>
        <SearchInput placeholder="E-Mail oder Name" onChangeText={setSearch} />
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

      <ParticipantsAddSheet eventId={eventId} open={addSheetOpen} onOpenChange={setAddSheetOpen} />
    </>
  );
};

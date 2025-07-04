import { BackButton } from '@/components/BackButton';
import { Redirect, useGlobalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { useParticipantsQuery } from '@/api/events/queries';
import { useGetUser } from '@/store/user';
import { Participant, ParticipantQueryResponse, Role } from '@/api/events/types';
import { Pressable, RefreshControl } from 'react-native';
import { SizableText, styled, ToggleGroup, View, XStack } from 'tamagui';
import { UserAvatar } from '@/components/UserAvatar';
import { Button } from '@/components/tamagui/Button';
import { Ellipsis, Eye } from '@tamagui/lucide-icons';
import { ScrollView } from '@/components/tamagui/ScrollView';
import { Screen } from '@/components/Screen';
import { ParticipantSkeleton } from '@/screens/Participants/ParticipantSkeleton';
import { Status, StatusEnum } from '@/api/types';
import { SearchInput } from '@/components/SearchInput';
import { Sheet } from '@/components/tamagui/Sheet';

export const Participants = () => {
  const { eventId = '' } = useGlobalSearchParams<{ eventId: string }>();
  const [activeFilters, setActiveFilters] = useState<Status[]>([]);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const {
    data: participants,
    refetch,
    isLoading,
  } = useParticipantsQuery(eventId, activeFilters, search);
  const user = useGetUser();
  const [editedGuest, setEditedGuest] = useState<ParticipantQueryResponse | undefined>(undefined);
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

  const me = participants?.filter(({ userId }) => userId === user?.id)[0];

  const mappedParticipants = useMemo(() => {
    return sortedParticipants?.map((participant) => {
      const isMe = participant.userId === user!.id;
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
              <UserAvatar id={participant.userId} />
              <View>
                <SizableText size="$5">
                  {participant.firstName} {participant.lastName}
                </SizableText>
                <SizableText size="$2">{participant.role}</SizableText>
              </View>
            </XStack>
            {isMe ? (
              <SizableText marginRight="$2">Du</SizableText>
            ) : (
              <>
                {me && me.role !== Role.enum.GUEST && (
                  <Pressable onPress={() => setEditedGuest(participant)}>
                    <Ellipsis />
                  </Pressable>
                )}
              </>
            )}
          </XStack>
        </Pressable>
      );
    });
  }, [handlePressParticipant, me, sortedParticipants, user]);

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

  const StyledToggleItem = styled(ToggleGroup.Item, {
    variants: {
      active: {
        true: {
          backgroundColor: '$color.blue8Light',
        },
      },
    },
  });

  return (
    <>
      <Screen back={<BackButton href=".." />} title="Teilnehmer">
        <XStack gap="$3">
          <Button
            size="$2"
            variant={acceptedFilterActive ? 'primary' : 'secondary'}
            borderRadius="$12"
            onPress={() => toggleFilter(StatusEnum.ACCEPTED)}
          >
            Zugesagt
            {acceptedFilterActive && <Eye color="$background" size="$1" />}
          </Button>
          <Button
            onPress={() => toggleFilter(StatusEnum.DECLINED)}
            size="$2"
            variant={declinedFilterActive ? 'primary' : 'secondary'}
            borderRadius="$12"
          >
            Abgesagt
            {declinedFilterActive && <Eye color="$background" size="$1" />}
          </Button>
          <Button
            size="$2"
            onPress={() => toggleFilter(StatusEnum.PENDING)}
            variant={pendingFilterActive ? 'primary' : 'secondary'}
            borderRadius="$12"
          >
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
      <Sheet
        open={!!editedGuest}
        onOpenChange={(open: boolean) => {
          if (!open) {
            setEditedGuest(undefined);
          }
        }}
      >
        <Screen title="Gast verwalten">
          <SizableText>Rolle</SizableText>
          <ToggleGroup value={editedGuest?.role} type="single">
            <StyledToggleItem
              active={editedGuest?.role === Role.enum.GUEST}
              onPress={() => setEditedGuest((guest) => ({ ...guest!, role: Role.enum.GUEST }))}
              value={Role.enum.GUEST}
            >
              <SizableText>{Role.enum.GUEST}</SizableText>
            </StyledToggleItem>
            <StyledToggleItem
              active={editedGuest?.role === Role.enum.ADMIN}
              onPress={() => setEditedGuest((guest) => ({ ...guest!, role: Role.enum.ADMIN }))}
              value={Role.enum.ADMIN}
            >
              <SizableText>{Role.enum.ADMIN}</SizableText>
            </StyledToggleItem>
          </ToggleGroup>
        </Screen>
      </Sheet>
    </>
  );
};

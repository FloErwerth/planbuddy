import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react';
import { ParticipantQueryResponse } from '@/api/events/types';
import { router, useGlobalSearchParams } from 'expo-router';
import { useCreateParticipationMutation } from '@/api/events/mutations';
import { UserWithStatus, useUserSearchContext } from '@/components/UserSearch';
import { AnimatePresence, SizableText, View } from 'tamagui';
import { Button } from '@/components/tamagui/Button';
import { useFriendSearchContext } from '@/components/FriendSearch';

export type UserWithStatusAndSelection = UserWithStatus & { selected?: boolean };
type EventDetailsContextType =
  | {
      eventId: string;
      editedGuest: ParticipantQueryResponse | undefined;
      setEditedGuest: (guest: ParticipantQueryResponse | undefined) => void;
      users: UserWithStatusAndSelection[];
      friends: UserWithStatusAndSelection[];
      addUserToUsersToAdd: (userId: string) => void;
      removeUserFromUsersToAdd: (userId: string) => void;
      toggleUsersToAdd: (userId: string) => void;
      numberOfAddedUsers: number;
    }
  | undefined;

export const EventDetailsContext = createContext<EventDetailsContextType>(undefined);

export const useEventDetailsContext = () => {
  const context = useContext(EventDetailsContext);

  if (!context) {
    throw new Error('useEventDetailsContext must be used as useEventDetailsContext');
  }

  return context;
};

export const EventDetailsProvider = ({ children }: PropsWithChildren) => {
  const { eventId } = useGlobalSearchParams<{ eventId: string }>();
  const [editedGuest, setEditedGuest] = useState<ParticipantQueryResponse>();
  const [usersToAdd, setUsersToAdd] = useState<Set<string>>(new Set());
  const { users } = useUserSearchContext();
  const { mutateAsync } = useCreateParticipationMutation();
  const { friends: others } = useFriendSearchContext();

  const handleSetEditedGuest = useCallback(
    (guest: ParticipantQueryResponse | undefined) => {
      if (!guest) {
        setEditedGuest(guest);
      }

      if (guest?.id === editedGuest?.id) {
        return;
      }

      setEditedGuest(guest);
      router.push('./editGuest');
    },
    [editedGuest?.id]
  );

  const addUserToUsersToAdd = useCallback((id: string) => {
    setUsersToAdd((current) => {
      const newSet = new Set(current.values());
      newSet.add(id);
      return newSet;
    });
  }, []);

  const removeUserFromUsersToAdd = useCallback((id: string) => {
    setUsersToAdd((current) => {
      const newSet = new Set(current.values());
      newSet.delete(id);
      return newSet;
    });
  }, []);

  const toggleUsersToAdd = useCallback(
    (id: string) => {
      if (usersToAdd.has(id)) {
        removeUserFromUsersToAdd(id);
        return;
      }

      addUserToUsersToAdd(id);
    },
    [addUserToUsersToAdd, removeUserFromUsersToAdd, usersToAdd]
  );

  const handleInviteUsers = useCallback(async () => {
    await mutateAsync(
      Array.from(usersToAdd).map((user) => ({
        eventId,
        userId: user,
      }))
    );
    router.replace('/eventDetails/participants');
  }, [eventId, mutateAsync, usersToAdd]);

  const contextValue: EventDetailsContextType = useMemo(
    () => ({
      eventId,
      editedGuest,
      setEditedGuest: handleSetEditedGuest,
      toggleUsersToAdd,
      friends: (others ?? [])?.map((friend) => {
        return {
          ...friend,
          selected: usersToAdd.has(friend?.id!),
        };
      }),
      users:
        users
          ?.filter((user) => !others?.find((friend) => friend?.id === user.id))
          .map((user) => {
            return {
              ...user,
              selected: usersToAdd.has(user.id!),
            };
          }) ?? [],
      addUserToUsersToAdd,
      removeUserFromUsersToAdd,
      numberOfAddedUsers: usersToAdd.size,
    }),
    [addUserToUsersToAdd, editedGuest, eventId, handleSetEditedGuest, others, removeUserFromUsersToAdd, toggleUsersToAdd, users, usersToAdd]
  );

  return (
    <EventDetailsContext.Provider value={contextValue}>
      {children}
      <View width="100%" position="absolute" bottom={0} pointerEvents={usersToAdd.size > 0 ? 'auto' : 'none'} padding="$4">
        <AnimatePresence>
          {usersToAdd.size > 0 && (
            <Button
              onPress={handleInviteUsers}
              width="100%"
              animation="bouncy"
              exitStyle={{ opacity: 0, bottom: -10 }}
              enterStyle={{ opacity: 0, bottom: -10 }}
            >
              <SizableText color="$background">
                {usersToAdd.size} {usersToAdd.size === 1 ? 'Gast' : 'Gäste'} hinzufügen
              </SizableText>
            </Button>
          )}
        </AnimatePresence>
      </View>
    </EventDetailsContext.Provider>
  );
};

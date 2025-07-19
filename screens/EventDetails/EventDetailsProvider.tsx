import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { ParticipantQueryResponse } from '@/api/events/types';
import { router, useGlobalSearchParams } from 'expo-router';
import { useCreateParticipationMutation } from '@/api/events/mutations';
import { AnimatePresence, SizableText, View } from 'tamagui';
import { Button } from '@/components/tamagui/Button';

type EventDetailsContextType =
    | {
          eventId: string;
          editedGuest: ParticipantQueryResponse | undefined;
          setEditedGuest: (guest: ParticipantQueryResponse | undefined) => void;
          toggleInviteToEvent: (userId: string) => void;
          numberOfAddedUsers: number;
          usersToAdd: Set<string>;
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
    const { mutateAsync } = useCreateParticipationMutation();

    const addFriendsToEvent = (id: string) => {
        setUsersToAdd((current) => {
            const newSet = new Set(current.values());
            newSet.add(id);
            return newSet;
        });
    };

    const removeUserFromUsersToAdd = (id: string) => {
        setUsersToAdd((current) => {
            const newSet = new Set(current.values());
            newSet.delete(id);
            return newSet;
        });
    };

    const toggleInviteToEvent = (id: string) => {
        if (usersToAdd.has(id)) {
            removeUserFromUsersToAdd(id);
            return;
        }

        addFriendsToEvent(id);
    };

    const handleInviteUsers = async () => {
        await mutateAsync(
            Array.from(usersToAdd).map((user) => ({
                eventId,
                userId: user,
            }))
        );
        router.replace('/eventDetails/participants');
    };

    const contextValue: EventDetailsContextType = {
        eventId,
        editedGuest,
        setEditedGuest,
        toggleInviteToEvent,
        numberOfAddedUsers: usersToAdd.size,
        usersToAdd,
    };

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

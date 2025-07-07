import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react';
import { ParticipantQueryResponse } from '@/api/events/types';
import { router, useGlobalSearchParams } from 'expo-router';

type EventDetailsContextType =
  | { eventId: string; editedGuest: ParticipantQueryResponse | undefined; setEditedGuest: (guest: ParticipantQueryResponse | undefined) => void }
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

  const contextValue: EventDetailsContextType = useMemo(
    () => ({
      eventId,
      editedGuest,
      setEditedGuest: handleSetEditedGuest,
    }),
    [editedGuest, eventId, handleSetEditedGuest]
  );

  return <EventDetailsContext.Provider value={contextValue}>{children}</EventDetailsContext.Provider>;
};

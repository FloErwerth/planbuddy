import { createContext, PropsWithChildren, useCallback, useContext, useState } from 'react';

export const EventCreationContext = createContext<
  | {
      guests: string[];
      addGuests: (guests: string[]) => void;
      removeGuests: (guests: string[]) => void;
      mounted: boolean;
      doMount: () => void;
      doUnmount: () => void;
    }
  | undefined
>(undefined);

export const useEventCreationContext = () => {
  const context = useContext(EventCreationContext);
  if (!context) {
    throw new Error('useEventCreationContext must be used within the context.');
  }

  return context;
};

export const EventCreationContextProvider = ({ children }: PropsWithChildren) => {
  const [guests, setGuests] = useState<string[]>([]);
  const [mounted, setMounted] = useState<boolean>(true);

  const addGuests = useCallback((incommingGuests: string[]) => {
    setGuests((current) => Array.from(new Set([...incommingGuests, ...current]).values()));
  }, []);

  const removeGuests = useCallback((removedGuests: string[]) => {
    setGuests((current) => {
      return current.filter((guest) => !removedGuests.includes(guest));
    });
  }, []);

  return (
    <EventCreationContext.Provider
      value={{
        addGuests,
        removeGuests,
        doMount: () => setMounted(true),
        doUnmount: () => {
          setMounted(false);
          setGuests([]);
        },
        mounted,
        guests,
      }}
    >
      {children}
    </EventCreationContext.Provider>
  );
};

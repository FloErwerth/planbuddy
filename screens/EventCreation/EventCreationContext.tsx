import { createContext, PropsWithChildren, useCallback, useContext, useState } from 'react';

export const EventCreationContext = createContext<
    | {
          guests: Set<string>;
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
    const [guests, setGuests] = useState<Set<string>>(new Set());
    const [mounted, setMounted] = useState<boolean>(true);

    const addGuests = (incommingGuests: string[]) => {
        setGuests(new Set([...incommingGuests, ...guests]));
    };

    const removeGuests = useCallback(
        (removedGuests: string[]) => {
            const newSet = new Set([...guests]);
            removedGuests.forEach((guest) => {
                newSet.delete(guest);
            });
            setGuests(newSet);
        },
        [guests]
    );

    return (
        <EventCreationContext.Provider
            value={{
                addGuests,
                removeGuests,
                doMount: () => setMounted(true),
                doUnmount: () => {
                    setMounted(false);
                    setGuests(new Set());
                },
                mounted,
                guests,
            }}
        >
            {children}
        </EventCreationContext.Provider>
    );
};

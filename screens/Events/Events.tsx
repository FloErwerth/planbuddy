import { useCallback, useMemo, useState } from 'react';
import { Screen } from '@/components/Screen';
import { ScrollView } from '@/components/tamagui/ScrollView';
import { useEventsQuery } from '@/api/events/queries';
import { EventSmall } from '@/components/Events/EventSmall';
import { SizableText } from 'tamagui';
import { Button } from '@/components/tamagui/Button';
import { CalendarX } from '@tamagui/lucide-icons';
import { EventCreationSheet } from '@/sheets/EventCreationSheet';

const contentContainerStyle = { gap: '$3', paddingVertical: '$4' };
export const Events = () => {
  const [isEventCreationOpen, setIsEventCreationOpen] = useState<boolean>(false);

  const { data: events, isLoading } = useEventsQuery();

  const mappedData = useMemo(
    () => (events ?? []).map((event) => <EventSmall key={event.id} {...event} />),
    [events]
  );

  const openEventCreationSheet = useCallback(() => {
    setIsEventCreationOpen(true);
  }, []);

  return (
    <>
      <Screen>{/* Bevorstehend und Vergangnen Option */}</Screen>
      {mappedData.length === 0 ? (
        <Screen justifyContent="center" alignItems="center" flex={1}>
          <CalendarX size="$4" />
          <SizableText textAlign="center">Leider keine bevorstehenden Events vorhanden</SizableText>
          <SizableText textAlign="center">
            Dies kannst Du leicht ändern, indem Du ein Event erstellst und Freunde dazu einlädst
          </SizableText>
          <Button borderRadius="$12" onPress={openEventCreationSheet}>
            Event erstellen
          </Button>
        </Screen>
      ) : (
        <ScrollView withShadow contentContainerStyle={contentContainerStyle}>
          {mappedData}
        </ScrollView>
      )}
      <EventCreationSheet open={isEventCreationOpen} onOpenChange={setIsEventCreationOpen} />
    </>
  );
};

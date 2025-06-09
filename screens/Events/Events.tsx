import { useMemo, useState } from 'react';
import { Screen } from '@/components/Screen';
import { InputWithClear } from '@/components/Inputs/InputWithClear/InputWithClear';
import { ScrollView } from '@/components/tamagui/ScrollView';
import { router } from 'expo-router';
import { useEventsQuery } from '@/api/events/queries';
import { EventSmall } from '@/components/Events/EventSmall';
import { Button } from '@/components/tamagui/Button';
import { useGetUser } from '@/store/user';
import { useParticipateEventMutation } from '@/api/events/mutations';

const contentContainerStyle = { gap: '$3', paddingVertical: '$4' };
export const Events = () => {
  const [search, setSearch] = useState('');
  const { mutateAsync: joinEvent } = useParticipateEventMutation();

  const user = useGetUser();
  const events = useEventsQuery();

  const mappedData = useMemo(
    () => events.data?.map((event) => <EventSmall key={event.id} {...event} />),
    [events]
  );

  return (
    <>
      <Screen>
        <InputWithClear placeholder="Nach Events suchen" value={search} onChangeText={setSearch} />
      </Screen>
      <ScrollView withShadow contentContainerStyle={contentContainerStyle}>
        {mappedData}
      </ScrollView>
      <Button onPress={() => router.push('/createEvent')}>Event erstellen</Button>
      <Button
        onPress={async () =>
          await joinEvent({
            eventId: 'e333b045-5cec-4e39-8271-b96df783ff37',
            userId: 'aa58cd5b-c00c-433f-9bb8-a8351913dccd',
          })
        }
      >
        JOIN
      </Button>
    </>
  );
};

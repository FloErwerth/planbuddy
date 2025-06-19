import { useMemo, useState } from 'react';
import { Screen } from '@/components/Screen';
import { InputWithClear } from '@/components/Inputs/InputWithClear/InputWithClear';
import { ScrollView } from '@/components/tamagui/ScrollView';
import { useEventsQuery } from '@/api/events/queries';
import { EventSmall } from '@/components/Events/EventSmall';
import { useGetUser } from '@/store/user';
import { useCreateParticipationMutation } from '@/api/events/mutations';

const contentContainerStyle = { gap: '$3', paddingVertical: '$4' };
export const Events = () => {
  const [search, setSearch] = useState('');
  const { mutateAsync: joinEvent } = useCreateParticipationMutation();

  const user = useGetUser();
  const events = useEventsQuery();

  const mappedData = useMemo(
    () => (events.data ?? []).map((event) => <EventSmall key={event.id} {...event} />),
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
    </>
  );
};

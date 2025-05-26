import { useMemo, useState } from 'react';
import { useEventsQuery } from '@/api/query/events';
import { EventSmall } from '@/components/Events/EventSmall';
import { Screen } from '@/components/Screen';
import { InputWithClear } from '@/components/Inputs/InputWithClear/InputWithClear';
import { ScrollView } from '@/components/tamagui/ScrollView';
import { Button } from '@/components/tamagui';
import { router } from 'expo-router';

const contentContainerStyle = { gap: '$3', paddingVertical: '$4' };
export const Events = () => {
  const [search, setSearch] = useState('');
  const { data = [] } = useEventsQuery();

  const mappedData = useMemo(
    () =>
      data
        .filter((event) => event.name.toLowerCase().includes(search.toLowerCase().trim()))
        .map((event, index) => <EventSmall key={event.id + Math.random().toString()} {...event} />),
    [data, search]
  );

  return (
    <>
      <Screen>
        <InputWithClear placeholder="Nach Events suchen" value={search} onChangeText={setSearch} />
      </Screen>
      <ScrollView withShadow paddingHorizontal="$4" contentContainerStyle={contentContainerStyle}>
        {mappedData}
      </ScrollView>
      <Button onPress={() => router.push('/createEvent')}>Event erstellen</Button>
    </>
  );
};

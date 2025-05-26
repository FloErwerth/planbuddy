import { Screen } from '@/components/Screen';
import { EventSmall } from '@/components/Events/EventSmall';
import { useEventsQuery } from '@/api/query/events';
import { useMemo, useState } from 'react';
import { InputWithClear } from '@/components/Inputs/InputWithClear/InputWithClear';
import { ScrollView } from '@/components/tamagui/ScrollView';

const contentContainerStyle = { gap: '$3', paddingVertical: '$4' };

export default function HomePage() {
  const [search, setSearch] = useState('');
  const { data = [] } = useEventsQuery();

  const mappedData = useMemo(
    () =>
      [
        ...data,
        ...data,
        ...data,
        ...data,
        ...data,
        ...data,
        ...data,
        ...data,
        ...data,
        ...data,
        ...data,
      ]
        .filter((event) => event.name.toLowerCase().includes(search.toLowerCase().trim()))
        .map((event, index) => (
          <EventSmall
            imageUrl={index % 2 === 0 ? 'https://picsum.photos/200/300' : undefined}
            key={event.id + Math.random().toString()}
            {...event}
          />
        )),
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
    </>
  );
}

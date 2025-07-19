import { BackButton } from '@/components/BackButton';
import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { useParticipantsQuery } from '@/api/events/queries';
import { RefreshControl } from 'react-native';
import { View, XStack } from 'tamagui';
import { Button } from '@/components/tamagui/Button';
import { Eye } from '@tamagui/lucide-icons';
import { Screen } from '@/components/Screen';
import { ParticipantSkeleton } from '@/screens/Participants/ParticipantSkeleton';
import { Status, StatusEnum } from '@/api/types';
import { SearchInput } from '@/components/SearchInput';
import { Participant } from '@/screens/Participants/Participant';
import { useEventDetailsContext } from '@/screens/EventDetails/EventDetailsProvider';
import { PlusButton } from '@/components/PlusButton';
import { useGetUser } from '@/store/authentication';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { ParticipantQueryResponse } from '@/api/events/types';

export const Participants = () => {
    const { eventId, setEditedGuest } = useEventDetailsContext();
    const [activeFilters, setActiveFilters] = useState<Status[]>([]);
    const [search, setSearch] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const { data: participants, refetch, isLoading } = useParticipantsQuery(eventId, activeFilters, search);
    const user = useGetUser();

    const sortedParticipants = participants?.sort((a) => (a.userId === user?.id ? 1 : 0));

    const render = ({ item: participant }: ListRenderItemInfo<ParticipantQueryResponse>) =>
        refreshing ? (
            <ParticipantSkeleton />
        ) : (
            <Participant
                participant={participant}
                onOpenOptions={() => {
                    setEditedGuest(participant);
                    router.push('/eventDetails/editGuest');
                }}
            />
        );

    if (!participants && !isLoading) {
        return <Redirect href=".." />;
    }

    const toggleFilter = (toggledFilter: Status) => {
        if (activeFilters.includes(toggledFilter)) {
            setActiveFilters((filters) => filters.filter((filter) => filter !== toggledFilter));
        } else {
            setActiveFilters((filters) => [...filters, toggledFilter]);
        }
    };

    const acceptedFilterActive = activeFilters.includes(StatusEnum.ACCEPTED);
    const declinedFilterActive = activeFilters.includes(StatusEnum.DECLINED);
    const pendingFilterActive = activeFilters.includes(StatusEnum.PENDING);

    return (
        <>
            <Screen back={<BackButton href=".." />} title="Teilnehmer" action={<PlusButton onPress={() => router.push('./addFriends')} />}>
                <XStack gap="$3">
                    <Button
                        size="$2"
                        variant={acceptedFilterActive ? 'primary' : 'secondary'}
                        borderRadius="$12"
                        onPress={() => toggleFilter(StatusEnum.ACCEPTED)}
                    >
                        Zugesagt
                        {acceptedFilterActive && <Eye color="$background" size="$1" />}
                    </Button>
                    <Button
                        onPress={() => toggleFilter(StatusEnum.DECLINED)}
                        size="$2"
                        variant={declinedFilterActive ? 'primary' : 'secondary'}
                        borderRadius="$12"
                    >
                        Abgesagt
                        {declinedFilterActive && <Eye color="$background" size="$1" />}
                    </Button>
                    <Button
                        size="$2"
                        onPress={() => toggleFilter(StatusEnum.PENDING)}
                        variant={pendingFilterActive ? 'primary' : 'secondary'}
                        borderRadius="$12"
                    >
                        Ausstehend
                        {pendingFilterActive && <Eye color="$background" size="$1" />}
                    </Button>
                </XStack>
                <SearchInput placeholder="E-Mail oder Name" onChangeText={setSearch} />
            </Screen>
            <FlashList
                refreshControl={
                    <RefreshControl
                        onRefresh={async () => {
                            setRefreshing(true);
                            await refetch();
                            setRefreshing(false);
                        }}
                        refreshing={refreshing}
                    />
                }
                ItemSeparatorComponent={() => <View height="$1" />}
                contentContainerStyle={{ padding: 16 }}
                renderItem={render}
                data={sortedParticipants}
                estimatedItemSize={200}
            />
        </>
    );
};

import { FriendDisplay } from '@/components/FriendDisplay';
import { Checkbox } from '@/components/tamagui/Checkbox';
import { useEventCreationContext } from '@/screens/EventCreation/EventCreationContext';
import { Pressable } from 'react-native';
import { Screen } from '@/components/Screen';
import { Card } from '@/components/tamagui/Card';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { SimpleFriend } from '@/api/friends/types';
import { View } from 'tamagui';
import { useFriendsByStatus } from '@/api/friends/refiners';
import { BackButton } from '@/components/BackButton';
import { SearchInput } from '@/components/SearchInput';
import { useState } from 'react';

const Guest = ({ id, onPress, checked, ...friend }: SimpleFriend & { checked: boolean; onPress: (id: string) => void }) => {
    return (
        <Card marginHorizontal="$4" key={id}>
            <Pressable onPress={() => onPress(id!)}>
                <FriendDisplay {...friend}>
                    <Checkbox checked={checked} />
                </FriendDisplay>
            </Pressable>
        </Card>
    );
};

export const EventCreationAddFriends = () => {
    const { guests, addGuests, removeGuests } = useEventCreationContext();
    const { accepted: friends } = useFriendsByStatus();
    const [filter, setFilter] = useState<string>();

    const applyFilter = (other: SimpleFriend | undefined) => {
        if (!filter || !other) {
            return true;
        }

        const terms = filter.split(' ');

        if (terms.length === 0) {
            return true;
        }

        let foundMatch = false;

        for (let i = 0; i < terms.length; i++) {
            const currentTerm = terms[i].toLowerCase();
            if (!foundMatch) {
                foundMatch = Boolean(other.firstName?.includes(currentTerm) || other.lastName?.includes(currentTerm) || other.email?.includes(currentTerm));
            }
        }

        return foundMatch;
    };

    const friendsWithChecked = friends
        .map((friend) => ({
            ...friend,
            checked: guests.has(friend.userId!),
        }))
        .filter(applyFilter);

    const toggleGuest = (guestId: string, isGuest: boolean) => {
        if (isGuest) {
            removeGuests([guestId]);
        } else {
            addGuests([guestId]);
        }
    };

    const render = ({ item: friend }: ListRenderItemInfo<SimpleFriend & { checked: boolean }>) => {
        return <Guest {...friend} onPress={() => toggleGuest(friend.userId!, friend.checked)} />;
    };

    return (
        <>
            <Screen back={<BackButton href="/(tabs)/eventCreation" />} title="Gäste hinzufügen">
                <SearchInput placeholder="Name oder E-Mail" onChangeText={setFilter} />
            </Screen>
            <FlashList
                contentContainerStyle={{ paddingVertical: 16 }}
                ItemSeparatorComponent={() => <View height="$1" />}
                data={friendsWithChecked}
                renderItem={render}
                estimatedItemSize={200}
            />
        </>
    );
};

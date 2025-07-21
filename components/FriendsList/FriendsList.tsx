import { useFriendOverview, useFriendsByStatus } from '@/api/friends/refiners';
import { Pressable, RefreshControl } from 'react-native';
import { Card } from '@/components/tamagui/Card';
import { SizableText, View, XStack } from 'tamagui';
import { UserAvatar } from '@/components/UserAvatar';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { FC, useState } from 'react';
import { SimpleFriend } from '@/api/friends/types';
import { SearchInput } from '@/components/SearchInput';
import { formatToDate } from '@/utils/date';
import { StatusEnum } from '@/api/types';

type FriendsListProps = {
    onFriendPressed: (friend: SimpleFriend) => void;
    Action: FC<{ friend: SimpleFriend }>;
};

export const FriendsList = ({ onFriendPressed, Action }: FriendsListProps) => {
    const { accepted = [], refetch } = useFriendsByStatus();
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter] = useState<string | null>(null);

    const render = ({ item: friend }: ListRenderItemInfo<ReturnType<typeof useFriendOverview>['others'][number]>) => {
        const { id, firstName, lastName, requesterWasMe } = friend;

        return (
            <Pressable onPress={() => onFriendPressed(friend)}>
                <Card>
                    <XStack justifyContent="space-between" paddingRight="$2" alignItems="center">
                        <XStack alignItems="center" gap="$4">
                            <UserAvatar id={id} />
                            <View>
                                <SizableText>{`${firstName} ${lastName}`}</SizableText>
                                {friend.status === StatusEnum.ACCEPTED && friend.acceptedAt && (
                                    <SizableText size="$2">Befreundet seit {formatToDate(friend.acceptedAt)}</SizableText>
                                )}
                                {friend.status === StatusEnum.PENDING && friend.sendAt && (
                                    <SizableText size="$2">
                                        {requesterWasMe ? 'Gesendet' : 'Empfangen'} am {formatToDate(friend.sendAt)}
                                    </SizableText>
                                )}
                            </View>
                        </XStack>
                        <Action friend={friend} />
                    </XStack>
                </Card>
            </Pressable>
        );
    };

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

    const searchedOthers = accepted.filter(applyFilter);

    return (
        <>
            <SearchInput margin="$4" placeholder="Name oder E-Mail" onChangeText={setFilter} />
            <FlashList
                key={searchedOthers.length}
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
                refreshing={refreshing}
                renderItem={render}
                data={searchedOthers}
                contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
                ItemSeparatorComponent={() => <View height="$1" />}
                estimatedItemSize={100}
                showsVerticalScrollIndicator={false}
            />
        </>
    );
};

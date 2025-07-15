import { useFriendOverview } from '@/api/friends/refiners';
import { Pressable, RefreshControl } from 'react-native';
import { Card } from '@/components/tamagui/Card';
import { SizableText, View, XStack } from 'tamagui';
import { UserAvatar } from '@/components/UserAvatar';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { FC, useCallback, useState } from 'react';
import { SimpleFriend } from '@/api/friends/types';

type FriendsListProps = {
  onFriendPressed: (friend: SimpleFriend) => void;
  Action: FC<{ friend: SimpleFriend }>;
};

export const FriendsList = ({ onFriendPressed, Action }: FriendsListProps) => {
  const { others = [], refetch } = useFriendOverview();
  const [refreshing, setRefreshing] = useState(false);

  const render = useCallback(
    ({ item: friend }: ListRenderItemInfo<SimpleFriend>) => {
      const { id, firstName, lastName, email } = friend;
      return (
        <Pressable onPress={() => onFriendPressed(friend)}>
          <Card>
            <XStack justifyContent="space-between" paddingRight="$2" alignItems="center">
              <XStack alignItems="center" gap="$4">
                <UserAvatar id={id} />
                <SizableText>{firstName || lastName ? `${firstName} ${lastName}` : email}</SizableText>
              </XStack>
              <Action friend={friend} />
            </XStack>
          </Card>
        </Pressable>
      );
    },
    [Action, onFriendPressed]
  );

  return (
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
      refreshing={refreshing}
      renderItem={render}
      data={others}
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      ItemSeparatorComponent={() => <View height="$1" />}
      estimatedItemSize={100}
      showsVerticalScrollIndicator={false}
    />
  );
};

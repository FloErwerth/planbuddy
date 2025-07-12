import { Screen } from '@/components/Screen';
import { useEventDetailsContext } from '@/screens/EventDetails/EventDetailsProvider';
import { SizableText, View, XStack } from 'tamagui';
import { BackButton } from '@/components/BackButton';
import { Checkbox } from '@/components/tamagui/Checkbox';
import { Pressable } from 'react-native';
import { useCallback, useMemo } from 'react';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { Card } from '@/components/tamagui/Card';
import { UserAvatar } from '@/components/UserAvatar';
import { FriendSearchInput, FriendSearchProvider, useFriendSearchContext } from '@/components/FriendSearch';
import { UserWithStatus } from '@/components/UserSearch';

export const AddFriendsScreen = () => {
  const { friends } = useFriendSearchContext();
  const { toggleInviteToEvent, usersToAdd } = useEventDetailsContext();

  const mappedFriends = useMemo(
    () =>
      friends.map((friend) => {
        return { ...friend, selected: usersToAdd.has(friend?.id ?? '') };
      }),
    [friends, usersToAdd]
  );

  const render = useCallback(
    ({ item: friend }: ListRenderItemInfo<UserWithStatus & { selected: boolean }>) => {
      const { firstName, lastName, email } = friend;
      return (
        <Pressable key={friend.id} onPress={() => toggleInviteToEvent(friend.id!)}>
          <Card>
            <XStack justifyContent="space-between" paddingRight="$2" alignItems="center">
              <XStack alignItems="center" gap="$4">
                <UserAvatar id={friend.id} />
                <SizableText>{firstName || lastName ? `${firstName} ${lastName}` : email}</SizableText>
              </XStack>
              <Checkbox checked={friend.selected} />
            </XStack>
          </Card>
        </Pressable>
      );
    },
    [toggleInviteToEvent]
  );

  return (
    <>
      <Screen back={<BackButton />} title="Freunde einladen">
        <FriendSearchInput />
      </Screen>
      <FlashList
        renderItem={render}
        data={mappedFriends}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        ItemSeparatorComponent={() => <View height="$1" />}
        estimatedItemSize={100}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.5}
      />
    </>
  );
};

export default function AddFriends() {
  return (
    <FriendSearchProvider>
      <AddFriendsScreen />
    </FriendSearchProvider>
  );
}

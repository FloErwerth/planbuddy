import { SizableText, View } from 'tamagui';
import { Screen } from '@/components/Screen';
import { FriendEntry } from '@/screens/AddFriendsScreen/FriendEntry';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { UserSearchInput, UserSearchProvider, UserWithStatus, useUserSearchContext } from '@/components/UserSearch';
import { useCallback } from 'react';

const containerStyle = { padding: 16, paddingBottom: 32 } as const;

const AddFriendsDisplay = () => {
  const { users, onLoadMore } = useUserSearchContext();

  const renderItem = useCallback(({ item: user }: ListRenderItemInfo<UserWithStatus>) => <FriendEntry friend={user} />, []);

  if (users !== undefined && users?.length === 0) {
    return <SizableText>Placeholder </SizableText>;
  }

  return (
    <FlashList
      renderItem={renderItem}
      data={users}
      contentContainerStyle={containerStyle}
      ItemSeparatorComponent={() => <View height="$2" />}
      onEndReached={onLoadMore}
      estimatedItemSize={100}
      showsVerticalScrollIndicator={false}
      onEndReachedThreshold={0.5}
    />
  );
};

export const AddFriendsScreen = () => {
  return (
    <UserSearchProvider showUsersWhenEmpty>
      <Screen title="Freunde hinzufügen">
        <UserSearchInput />
      </Screen>
      <AddFriendsDisplay />
    </UserSearchProvider>
  );
};

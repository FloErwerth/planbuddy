import { SizableText, View } from 'tamagui';
import { Screen } from '@/components/Screen';
import { FriendEntry } from '@/screens/AddFriendsScreen/FriendEntry';
import { FlashList } from '@shopify/flash-list';
import { UserSearchInput, UserSearchProvider, useUserSearchContext } from '@/components/UserSearch';

const AddFriendsDisplay = () => {
  const { users, onLoadMore } = useUserSearchContext();

  if (users !== undefined && users?.length === 0) {
    return <SizableText>Placeholder </SizableText>;
  }

  return (
    <FlashList
      renderItem={({ item: user }) => <FriendEntry friend={user} />}
      data={users}
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
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
    <UserSearchProvider>
      <Screen title="Freunde hinzufügen">
        <UserSearchInput />
      </Screen>
      <AddFriendsDisplay />
    </UserSearchProvider>
  );
};

import { Screen } from '@/components/Screen';
import { BackButton } from '@/components/BackButton';
import { SizableText, Spinner, XStack } from 'tamagui';
import { Fragment, useCallback, useMemo, useState } from 'react';
import { Plus } from '@tamagui/lucide-icons';
import { Pressable, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { ScrollView } from '@/components/tamagui/ScrollView';
import { PressableRow } from '@/components/PressableRow';
import { PendingFriendRequestsDot } from '@/components/PendingFriendRequestsDot/PendingFriendRequestsDot';
import { FriendAcceptanceStatus } from '@/screens/FriendsScreen/FriendAcceptanceStatus';
import { FriendRequestsSheet } from '@/screens/FriendsScreen/FriendRequestsSheet';
import { useFriendOverview } from '@/api/friends/refiners';
import { useGetUser } from '@/store/user';
import { FriendOptionsSheet } from '@/screens/FriendsScreen/FriendOptionsSheet';
import { FriendsQueryResponse } from '@/api/friends/schema';
import { extractOtherUser } from '@/utils/extractOtherUser';
import { FriendDisplay } from '@/components/FriendDisplay';

export const FriendsScreen = () => {
  const { data: friends, pendingToAccept, refetch, isLoading } = useFriendOverview();
  const [requestsSheetOpen, setRequestsSheetOpen] = useState(false);
  const user = useGetUser();
  const [refreshing, setRefreshing] = useState(false);
  const [editedFriend, setEditedFriend] = useState<FriendsQueryResponse[number] | undefined>(undefined);

  const handleOpenChange = useCallback((open: boolean) => {
    if (open) {
      return;
    }

    setEditedFriend(undefined);
  }, []);

  const handleOpenOptions = useCallback((friend: FriendsQueryResponse[number]) => {
    setEditedFriend(friend);
  }, []);

  const mappedFriends = useMemo(
    () =>
      friends.map((friend) => {
        const { firstName, lastName } = extractOtherUser(user!.id, friend);

        return (
          <FriendDisplay key={friend.id} firstName={firstName} lastName={lastName} {...friend}>
            <FriendAcceptanceStatus openOptions={() => handleOpenOptions(friend)} status={friend.status} />
          </FriendDisplay>
        );
      }),
    [friends, handleOpenOptions, user]
  );

  if (isLoading) {
    return (
      <Screen flex={1} justifyContent="center" alignItems="center">
        <Spinner />
      </Screen>
    );
  }

  return (
    <>
      <Screen
        back={<BackButton href=".." />}
        title="Freunde"
        action={
          <Pressable onPress={() => router.push('/(tabs)/settings/addFriends')}>
            <Plus />
          </Pressable>
        }
      >
        {pendingToAccept.length > 0 && (
          <PressableRow onPress={() => setRequestsSheetOpen(true)}>
            <XStack>
              <SizableText>Freundschaftsanfragen</SizableText>
              <PendingFriendRequestsDot position="relative" />
            </XStack>
          </PressableRow>
        )}
      </Screen>

      <SizableText paddingHorizontal="$4">Freunde</SizableText>
      <ScrollView
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
        contentContainerStyle={{ padding: '$4', gap: '$2' }}
      >
        {mappedFriends}
      </ScrollView>
      <FriendRequestsSheet open={requestsSheetOpen} onOpenChange={setRequestsSheetOpen} />
      <FriendOptionsSheet friend={editedFriend} open={!!editedFriend} onOpenChange={handleOpenChange} />
    </>
  );
};

import { UserWithStatus, useUserSearchContext } from '@/components/UserSearch';
import { AnimatePresence, SizableText, View, XStack } from 'tamagui';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { Card } from '@/components/tamagui/Card';
import { UserAvatar } from '@/components/UserAvatar';
import { memo, useCallback, useMemo, useRef, useState } from 'react';
import { Pressable } from 'react-native';
import { Checkbox } from '@/components/tamagui/Checkbox';
import { Button } from '@/components/tamagui/Button';
import { useCreateParticipationMutation } from '@/api/events/mutations';
import { FriendAcceptanceStatus } from '@/screens/FriendsScreen/FriendAcceptanceStatus';

const ParticipantEntry = memo(
  ({
    toggleUser,
    selected,
    user: { id, firstName, lastName, email, status },
  }: {
    selected: boolean;
    toggleUser: (userId: string) => void;
    user: UserWithStatus;
  }) => {
    return (
      <Pressable onPress={() => toggleUser(id!)}>
        <Card>
          <XStack justifyContent="space-between" paddingRight="$2" alignItems="center">
            <XStack alignItems="center" gap="$4">
              <UserAvatar id={id} />
              <View>
                <SizableText>{firstName || lastName ? `${firstName} ${lastName}` : email}</SizableText>
                <FriendAcceptanceStatus status={status!} openOptions={() => toggleUser(id!)} />
              </View>
            </XStack>
            <Checkbox checked={selected} />
          </XStack>
        </Card>
      </Pressable>
    );
  }
);

ParticipantEntry.displayName = 'ParticipantEntry';

type ParticipantsSearchResultsProps = {
  eventId: string;
  onGuestsInvited: () => void;
};
export const ParticipantsSearchResults = ({ eventId, onGuestsInvited }: ParticipantsSearchResultsProps) => {
  const { users, onLoadMore } = useUserSearchContext();
  const [addedUsers, setAddedUsers] = useState<Set<string>>(new Set());
  const ref = useRef<FlashList<any>>(null);
  const { mutateAsync } = useCreateParticipationMutation();

  const toggleUser = useCallback((userId: string) => {
    setAddedUsers((current) => {
      const newSet = new Set(current.values());
      if (newSet.has(userId)) {
        newSet.delete(userId);
        return newSet;
      }
      newSet.add(userId);

      return newSet;
    });
  }, []);

  const combinedUsers = useMemo(() => {
    return users?.map((user) => ({
      ...user,
      selected: addedUsers.has(user.id!),
    }));
  }, [addedUsers, users]);

  const renderItem = useCallback(
    ({ item: user }: ListRenderItemInfo<UserWithStatus & { selected: boolean }>) => {
      return <ParticipantEntry toggleUser={toggleUser} selected={user.selected} user={user} />;
    },
    [toggleUser]
  );

  const handleInviteUsers = useCallback(async () => {
    await mutateAsync(
      Array.from(addedUsers).map((user) => ({
        eventId,
        userId: user,
      }))
    );
    onGuestsInvited();
  }, [addedUsers, eventId, mutateAsync, onGuestsInvited]);

  if (users !== undefined && users?.length === 0) {
    return <SizableText>Placeholder </SizableText>;
  }

  return (
    <>
      <FlashList
        ref={ref}
        keyboardShouldPersistTaps="handled"
        renderItem={renderItem}
        data={combinedUsers}
        contentContainerStyle={{ padding: 16, paddingBottom: addedUsers.size ? 96 : 32 }}
        ItemSeparatorComponent={() => <View height="$1" />}
        onEndReached={onLoadMore}
        estimatedItemSize={100}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.75}
      />
      <View width="100%" position="absolute" bottom={0} pointerEvents={addedUsers.size > 0 ? 'auto' : 'none'} padding="$4">
        <AnimatePresence>
          {addedUsers.size > 0 && (
            <Button
              onPress={handleInviteUsers}
              width="100%"
              animation="bouncy"
              exitStyle={{ opacity: 0, bottom: -10 }}
              enterStyle={{ opacity: 0, bottom: -10 }}
            >
              <SizableText>
                {addedUsers.size} {addedUsers.size === 1 ? 'Gast' : 'Gäste'} hinzufügen
              </SizableText>
            </Button>
          )}
        </AnimatePresence>
      </View>
    </>
  );
};

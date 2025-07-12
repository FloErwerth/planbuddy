import { useUserSearchContext } from '@/components/UserSearch';
import { SizableText, View, XStack } from 'tamagui';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { Card } from '@/components/tamagui/Card';
import { UserAvatar } from '@/components/UserAvatar';
import { memo, useCallback, useRef } from 'react';
import { Pressable } from 'react-native';
import { Checkbox } from '@/components/tamagui/Checkbox';
import { ParticipantsAcceptanceStatus } from '@/screens/Participants/ParticipantsAcceptanceStatus';
import { Shadow } from '@/components/Shadow';
import { useEventDetailsContext, UserWithStatusAndSelection } from '@/screens/EventDetails/EventDetailsProvider';

const ParticipantEntry = memo(
  ({
    toggleUser,
    selected,
    user: { id, firstName, lastName, email, status },
  }: {
    selected: boolean;
    toggleUser: (userId: string) => void;
    user: UserWithStatusAndSelection;
  }) => {
    return (
      <Pressable onPress={() => toggleUser(id!)}>
        <Card>
          <XStack justifyContent="space-between" paddingRight="$2" alignItems="center">
            <XStack alignItems="center" gap="$4">
              <UserAvatar id={id} />
              <SizableText>{firstName || lastName ? `${firstName} ${lastName}` : email}</SizableText>
            </XStack>
            <XStack gap="$2">
              <ParticipantsAcceptanceStatus status={status!} />
              <Checkbox checked={selected} />
            </XStack>
          </XStack>
        </Card>
      </Pressable>
    );
  }
);

ParticipantEntry.displayName = 'ParticipantEntry';

export const ParticipantsSearchResults = () => {
  const { onLoadMore } = useUserSearchContext();
  const { toggleFriend, users, numberOfAddedUsers } = useEventDetailsContext();
  const ref = useRef<FlashList<any>>(null);

  const renderItem = useCallback(
    ({ item: user }: ListRenderItemInfo<UserWithStatusAndSelection>) => {
      return <ParticipantEntry toggleUser={toggleFriend} selected={!!user.selected} user={user} />;
    },
    [toggleFriend]
  );

  if (users !== undefined && users?.length === 0) {
    return <SizableText>Placeholder </SizableText>;
  }

  return (
    <View flex={1}>
      <Shadow position="absolute" height={30} zIndex={1} />
      <FlashList
        ref={ref}
        keyboardShouldPersistTaps="handled"
        renderItem={renderItem}
        data={users}
        contentContainerStyle={{ padding: 16, paddingBottom: numberOfAddedUsers ? 96 : 32 }}
        ItemSeparatorComponent={() => <View height="$1" />}
        onEndReached={onLoadMore}
        estimatedItemSize={100}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.75}
      />
    </View>
  );
};

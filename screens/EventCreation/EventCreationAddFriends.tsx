import { useCallback } from 'react';
import { FriendDisplay } from '@/components/FriendDisplay';
import { useGetUser } from '@/store/user';
import { extractOtherUser } from '@/utils/extractOtherUser';
import { Checkbox } from '@/components/tamagui/Checkbox';
import { useEventCreationContext } from '@/screens/EventCreation/EventCreationContext';
import { Pressable } from 'react-native';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/tamagui/Button';
import { Card } from '@/components/tamagui/Card';
import { UserSearchInput, useUserSearchContext } from '@/components/UserSearch';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { SimpleFriend } from '@/api/friends/types';
import { StatusEnum } from '@/api/types';
import { View } from 'tamagui';

type EventCreationAddFriendsProps = {
  onClose: () => void;
};

export const EventCreationAddFriends = ({ onClose }: EventCreationAddFriendsProps) => {
  const { guests, addGuests, removeGuests } = useEventCreationContext();
  const { users } = useUserSearchContext();
  const friends = users?.filter(({ status }) => status === StatusEnum.ACCEPTED);
  const user = useGetUser();

  const getIsGuest = useCallback(
    (guestId: string) => {
      return guests.includes(guestId);
    },
    [guests]
  );

  const toggleGuest = useCallback(
    (guest: string) => {
      const isGuest = getIsGuest(guest);
      if (isGuest) {
        removeGuests([guest]);
      } else {
        addGuests([guest]);
      }
    },
    [addGuests, getIsGuest, removeGuests]
  );

  const render = useCallback(
    ({ item: friend }: ListRenderItemInfo<SimpleFriend>) => {
      const { id, firstName, lastName } = extractOtherUser(user!.id, friend);
      const checked = Boolean(getIsGuest(id!));
      return (
        <Card marginHorizontal="$4" key={id}>
          <Pressable onPress={() => toggleGuest(id!)}>
            <FriendDisplay {...friend} lastName={lastName} firstName={firstName}>
              <Checkbox checked={checked} />
            </FriendDisplay>
          </Pressable>
        </Card>
      );
    },
    [getIsGuest, toggleGuest, user]
  );

  return (
    <>
      <Screen
        action={
          <Button onPress={onClose} variant="secondary" size="$2">
            Schließen
          </Button>
        }
        title="Deine Gäste"
      >
        <UserSearchInput />
      </Screen>
      <FlashList
        contentContainerStyle={{ paddingVertical: 16 }}
        ItemSeparatorComponent={() => <View height="$1" />}
        data={friends}
        renderItem={render}
        estimatedItemSize={200}
      />
    </>
  );
};

import { useCallback, useMemo } from 'react';
import { FriendDisplay } from '@/components/FriendDisplay';
import { useGetUser } from '@/store/user';
import { extractOtherUser } from '@/utils/extractOtherUser';
import { Checkbox } from '@/components/tamagui/Checkbox';
import { useEventCreationContext } from '@/screens/EventCreation/EventCreationContext';
import { Pressable } from 'react-native';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/tamagui/Button';
import { Card } from '@/components/tamagui/Card';
import { StatusEnum } from '@/api/types';
import { FriendSearchInput, useFriendSearchContext } from '@/components/FriendSearch';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { SimpleFriend } from '@/api/friends/types';

type EventCreationAddFriendsProps = {
  onClose: () => void;
};

export const EventCreationAddFriends = ({ onClose }: EventCreationAddFriendsProps) => {
  const { guests, addGuests, removeGuests } = useEventCreationContext();
  const { friends } = useFriendSearchContext();
  const accepted: SimpleFriend[] = useMemo(() => friends.filter((friend) => friend.status === StatusEnum.ACCEPTED) ?? [], [friends]);

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
        <Card key={id} margin="$4">
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
        <FriendSearchInput />
      </Screen>
      <FlashList data={accepted} renderItem={render} estimatedItemSize={200} />
    </>
  );
};

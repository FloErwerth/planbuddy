import { useFriendsByStatus } from '@/api/friends/refiners';
import { useCallback, useMemo } from 'react';
import { FriendDisplay } from '@/components/FriendDisplay';
import { useGetUser } from '@/store/user';
import { extractOtherUser } from '@/utils/extractOtherUser';
import { Checkbox } from '@/components/tamagui/Checkbox';
import { useEventCreationContext } from '@/screens/EventCreation/EventCreationContext';
import { Pressable } from 'react-native';
import { ScrollableScreen } from '@/components/Screen';
import { Button } from '@/components/tamagui/Button';

type EventCreationAddFriendsProps = {
  onClose: () => void;
};
export const EventCreationAddFriends = ({ onClose }: EventCreationAddFriendsProps) => {
  const { guests, addGuests, removeGuests } = useEventCreationContext();
  const { accepted } = useFriendsByStatus();
  const user = useGetUser();

  const toggleGuest = useCallback(
    (id: string | undefined) => {
      if (!id) {
        return;
      }

      const isGuest = guests.includes(id);
      if (isGuest) {
        removeGuests([id]);
      } else {
        addGuests([id]);
      }
    },
    [addGuests, guests, removeGuests]
  );

  const mappedFriends = useMemo(
    () =>
      accepted.map((friend) => {
        const { id, firstName, lastName } = extractOtherUser(user!.id, friend);

        return (
          <Pressable key={friend.id} onPress={() => toggleGuest(id)}>
            <FriendDisplay {...friend} lastName={lastName} firstName={firstName}>
              <Checkbox checked={guests.includes(id!)} />
            </FriendDisplay>
          </Pressable>
        );
      }),
    [accepted, guests, toggleGuest, user]
  );

  return (
    <ScrollableScreen
      action={
        <Button onPress={onClose} variant="secondary" size="$2">
          Schließen
        </Button>
      }
      title="Deine Gäste"
    >
      {mappedFriends}
    </ScrollableScreen>
  );
};

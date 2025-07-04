import { useCallback, useMemo } from 'react';
import { FriendDisplay } from '@/components/FriendDisplay';
import { useGetUser } from '@/store/user';
import { extractOtherUser } from '@/utils/extractOtherUser';
import { Checkbox } from '@/components/tamagui/Checkbox';
import { useEventCreationContext } from '@/screens/EventCreation/EventCreationContext';
import { Pressable } from 'react-native';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/tamagui/Button';
import { ScrollView } from '@/components/tamagui/ScrollView';
import { Card } from '@/components/tamagui/Card';
import { FriendSearchInput, useFriendSearchContext } from '@/components/FriendSearch';
import { StatusEnum } from '@/api/types';

type EventCreationAddFriendsProps = {
  onClose: () => void;
};
export const EventCreationAddFriends = ({ onClose }: EventCreationAddFriendsProps) => {
  const { guests, addGuests, removeGuests } = useEventCreationContext();
  const { users } = useFriendSearchContext();
  const accepted = useMemo(
    () => users?.filter((user) => user.status === StatusEnum.ACCEPTED) ?? [],
    [users]
  );

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

  const mappedFriends = useMemo(
    () =>
      accepted.map((friend) => {
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
      }),
    [accepted, getIsGuest, toggleGuest, user]
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
      <ScrollView withShadow>{mappedFriends}</ScrollView>
    </>
  );
};

import { SizableText, View, XStack } from 'tamagui';
import { Button } from '@/components/tamagui/Button';
import { useUpdateFriendMutation } from '@/api/friends/addFriendsMutation';
import { useCallback } from 'react';
import { FriendsQueryResponse } from '@/api/friends/schema';

type RequestToAcceptProps = { friend: FriendsQueryResponse[number] };
export const RequestToAccept = ({ friend }: RequestToAcceptProps) => {
  const { mutateAsync: updateFriend } = useUpdateFriendMutation();

  const acceptFriend = useCallback(
    (friend: FriendsQueryResponse[number]) => {
      void updateFriend(friend);
    },
    [updateFriend]
  );

  return (
    <View flex={1} gap="$1">
      <SizableText>
        {friend.requester.firstName} {friend.requester.lastName}
      </SizableText>
      <XStack flex={0.5} gap="$2">
        <Button onPress={() => acceptFriend(friend)} size="$2" flex={1}>
          Akzeptieren
        </Button>
        <Button flex={1} variant="secondary" size="$2">
          Ablehnen
        </Button>
      </XStack>
    </View>
  );
};

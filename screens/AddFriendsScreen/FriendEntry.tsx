import { StatusEnum } from '@/api/types';
import { useAddFriendMutation } from '@/api/friends/addFriendsMutation';
import { memo, useCallback, useMemo } from 'react';
import { SizableText, View, XStack } from 'tamagui';
import { Button } from '@/components/tamagui/Button';
import { UserPlus } from '@tamagui/lucide-icons';
import { Card } from '@/components/tamagui/Card';
import { UserAvatar } from '@/components/UserAvatar';
import { useGetUser } from '@/store/user';
import { UserWithStatus } from '@/components/UserSearch';

type SearchAcceptanceStatusProps = { friend: UserWithStatus };
const SearchAcceptanceStatus = ({ friend: { status, requester } }: SearchAcceptanceStatusProps) => {
  const user = useGetUser();

  const isRequester = user?.id === requester?.id;

  if (isRequester) {
    if (status === StatusEnum.PENDING) {
      return (
        <View padding="$1.5" borderRadius="$12" backgroundColor="$color.green8Light">
          <SizableText size="$1">hinzugefügt!</SizableText>
        </View>
      );
    }

    if (status === StatusEnum.DECLINED) {
      return (
        <View padding="$1.5" borderRadius="$12" backgroundColor="$color.red8Light">
          <SizableText size="$1">abgelehnt</SizableText>
        </View>
      );
    }

    if (status === StatusEnum.ACCEPTED) {
      return (
        <View padding="$1.5" borderRadius="$12" backgroundColor="$color.green8Light">
          <SizableText size="$1">bereits Freunde</SizableText>
        </View>
      );
    }
  }

  if (status === StatusEnum.ACCEPTED) {
    return (
      <View padding="$1.5" borderRadius="$12" backgroundColor="$color.green8Light">
        <SizableText size="$1">bereits Freunde</SizableText>
      </View>
    );
  }

  if (status === StatusEnum.PENDING) {
    return (
      <View padding="$1.5" borderRadius="$12" backgroundColor="$color.green8Light">
        <SizableText size="$1">Anfrage erhalten</SizableText>
      </View>
    );
  }

  if (status === StatusEnum.DECLINED) {
    return (
      <View padding="$2" borderRadius="$12" backgroundColor="$color.red8Light">
        <SizableText size="$2">abgelehnt</SizableText>
      </View>
    );
  }
};

export const FriendEntry = memo(({ friend }: { friend: UserWithStatus }) => {
  const { mutateAsync: addFriend } = useAddFriendMutation();
  const { id, status, firstName, lastName, email } = friend;

  const doAddFriend = useCallback(async () => {
    if (!id) {
      return;
    }
    await addFriend(id);
  }, [addFriend, id]);

  const renderedButton = useMemo(() => {
    if (status) {
      return <SearchAcceptanceStatus friend={friend} />;
    }

    return (
      <Button borderRadius="$12" size="$2" onPress={doAddFriend}>
        <UserPlus color="white" scale={0.7} />
      </Button>
    );
  }, [doAddFriend, friend, status]);

  return (
    <Card key={id}>
      <XStack justifyContent="space-between" paddingRight="$2" alignItems="center">
        <XStack alignItems="center" gap="$4">
          <UserAvatar id={id} />
          <SizableText>{firstName || lastName ? `${firstName} ${lastName}` : email}</SizableText>
        </XStack>
        {renderedButton}
      </XStack>
    </Card>
  );
});

FriendEntry.displayName = 'FriendEntry';

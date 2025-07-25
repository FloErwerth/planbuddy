import { StatusEnum } from '@/api/types';
import { useAddFriendMutation } from '@/api/friends/addFriendsMutation';
import { memo, useState } from 'react';
import { SizableText, Spinner, View, XStack } from 'tamagui';
import { Button } from '@/components/tamagui/Button';
import { UserPlus } from '@tamagui/lucide-icons';
import { Card } from '@/components/tamagui/Card';
import { UserAvatar } from '@/components/UserAvatar';
import { UserWithStatus } from '@/components/UserSearch';
import { useGetUser } from '@/store/authentication';

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
    const [isRequesting, setIsRequesting] = useState(false);
    const doAddFriend = async () => {
        if (!id) {
            return;
        }
        setIsRequesting(true);
        await addFriend(id);
        setIsRequesting(false);
    };

    const renderedButton = (() => {
        if (status) {
            return <SearchAcceptanceStatus friend={friend} />;
        }

        if (isRequesting) {
            return (
                <View animation="bouncy" width="$5" borderRadius="$12" backgroundColor="$primary" enterStyle={{ scale: 0.5 }}>
                    <View scale={0.7}>
                        <Spinner animation="bouncy" enterStyle={{ scale: 1.1 }} color="$background" />
                    </View>
                </View>
            );
        }

        return (
            <Button disabled={isRequesting} borderRadius="$12" size="$2" onPress={doAddFriend}>
                <UserPlus color="white" scale={0.7} />
            </Button>
        );
    })();

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

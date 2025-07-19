import { useFriendOverview } from '@/api/friends/refiners';
import { useState } from 'react';
import { extractOtherUser } from '@/utils/extractOtherUser';
import { useRemoveFriendMutation, useUpdateFriendMutation } from '@/api/friends/addFriendsMutation';
import { StatusEnum } from '@/api/types';
import { router } from 'expo-router';
import { Card } from '@/components/tamagui/Card';
import { SizableText, View, XStack } from 'tamagui';
import { UserAvatar } from '@/components/UserAvatar';
import { formatToDate } from '@/utils/date';
import { Button } from '@/components/tamagui/Button';
import { Check, X } from '@tamagui/lucide-icons';
import { Screen } from '@/components/Screen';
import { BackButton } from '@/components/BackButton';
import { ScrollView } from '@/components/tamagui/ScrollView';
import { Dialog } from '@/components/tamagui/Dialog';

export const FriendRequestsScreen = () => {
    const { pendingToAccept } = useFriendOverview();
    const [userToDecline, setUserToDecline] = useState<ReturnType<typeof extractOtherUser> | undefined>(undefined);
    const { mutateAsync: removeFriend } = useRemoveFriendMutation();
    const { mutateAsync: updateFriend } = useUpdateFriendMutation();

    if (pendingToAccept.length === 0) {
        return null;
    }

    const acceptFriendRequest = async (id: string) => {
        await updateFriend({
            id,
            status: StatusEnum.ACCEPTED,
            acceptedAt: new Date(),
        });
        router.navigate('/profile');
    };

    const mapped = pendingToAccept.map((pending) => {
        return (
            <Card key={pending.id}>
                <XStack alignItems="center" justifyContent="space-between">
                    <XStack alignItems="center" gap="$2">
                        <UserAvatar id={pending.id} />
                        <View>
                            <SizableText>
                                {pending.firstName} {pending.lastName}
                            </SizableText>
                            <SizableText size="$2">Erhalten am {formatToDate(pending.sendAt)}</SizableText>
                        </View>
                    </XStack>
                    <XStack gap="$2">
                        <Button onPress={() => acceptFriendRequest(pending.id!)} size="$2" backgroundColor="$color.green8Light">
                            <Check size="$1" />
                        </Button>
                        <Button onPress={() => setUserToDecline(pending)} size="$2" backgroundColor="$color.red8Light">
                            <X size="$1" />
                        </Button>
                    </XStack>
                </XStack>
            </Card>
        );
    });

    const declineFriendRequest = async () => {
        await removeFriend(userToDecline?.id);
        router.navigate('/profile');
    };

    return (
        <>
            <Screen back={<BackButton href="/profile" />} title="Freundschaftsanfragen"></Screen>
            <ScrollView contentContainerStyle={{ padding: '$4' }}>{mapped}</ScrollView>
            <Dialog
                open={!!userToDecline}
                onOpenChange={(open) => {
                    if (!open) {
                        setUserToDecline(undefined);
                    }
                }}
            >
                <SizableText textAlign="center" size="$6">
                    Anfrage ablehnen
                </SizableText>
                <SizableText>Bist Du Dir sicher, dass Du die Anfrage von {userToDecline?.firstName} ablehnen willst?</SizableText>
                <View gap="$2">
                    <Button onPress={declineFriendRequest}>Anfrage ablehnen</Button>
                    <Button onPress={() => setUserToDecline(undefined)} variant="secondary">
                        Abbrechen
                    </Button>
                </View>
            </Dialog>
        </>
    );
};

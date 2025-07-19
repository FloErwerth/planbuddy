import { PressableRow } from '@/components/PressableRow';
import { router } from 'expo-router';
import { SizableText, View, XStack } from 'tamagui';
import { UserPlus } from '@tamagui/lucide-icons';
import { PendingFriendRequestsDot } from '@/components/PendingFriendRequestsDot/PendingFriendRequestsDot';
import { useFriendOverview } from '@/api/friends/refiners';

export const FriendRequestRow = () => {
    const { pendingToAccept } = useFriendOverview();

    return (
        pendingToAccept.length > 0 && (
            <PressableRow
                onPress={() => router.navigate('/(tabs)/profile/friendRequests')}
                backgroundColor="transparent"
                icon={
                    <View>
                        <UserPlus />
                        <PendingFriendRequestsDot left="$5" top="$-1" />
                    </View>
                }
            >
                <XStack>
                    <SizableText>Freundschaftsanfragen</SizableText>
                </XStack>
            </PressableRow>
        )
    );
};

import { SizableText, View, ViewProps } from 'tamagui';
import { useFriendOverview } from '@/api/friends/refiners';

export const PendingFriendRequestsDot = (props: ViewProps) => {
    const { pendingToAccept } = useFriendOverview();

    if (pendingToAccept.length === 0) {
        return null;
    }

    const pendingRequestsText = pendingToAccept.length >= 100 ? '99+' : pendingToAccept.length;

    return (
        <View width={14} height={14} backgroundColor="red" borderRadius="$12" position="absolute" justifyContent="center" alignItems="center" {...props}>
            <SizableText fontSize={pendingToAccept.length < 10 ? 8 : 6} color="$background">
                {pendingRequestsText}
            </SizableText>
        </View>
    );
};

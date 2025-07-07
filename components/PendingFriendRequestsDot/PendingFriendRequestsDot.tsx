import { SizableText, View, ViewProps } from 'tamagui';
import { useFriendOverview } from '@/api/friends/refiners';

export const PendingFriendRequestsDot = (props: ViewProps) => {
  const { pendingToAccept } = useFriendOverview();

  if (pendingToAccept.length === 0) {
    return null;
  }

  return (
    <View width={12} height={12} backgroundColor="red" borderRadius="$12" position="absolute" justifyContent="center" alignItems="center" {...props}>
      <SizableText size="$1" color="$background">
        {pendingToAccept.length}
      </SizableText>
    </View>
  );
};

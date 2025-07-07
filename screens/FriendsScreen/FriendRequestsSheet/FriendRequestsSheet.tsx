import { Screen } from '@/components/Screen';
import { Button } from '@/components/tamagui/Button';
import { ScrollView } from '@/components/tamagui/ScrollView';
import { RefreshControl } from 'react-native';
import { Fragment, useState } from 'react';
import { SheetProps, XStack } from 'tamagui';
import { UserAvatar } from '@/components/UserAvatar';
import { Sheet } from '@/components/tamagui/Sheet';
import { RequestToAccept } from '@/screens/FriendsScreen/FriendRequestsSheet/RequestToAccept';
import { useFriendOverview } from '@/api/friends/refiners';

export const FriendRequestsSheet = ({ open, onOpenChange, children }: SheetProps) => {
  const [refreshing, setRefreshing] = useState(false);
  const { pendingToAccept, refetch } = useFriendOverview();

  return (
    <Sheet hideHandle open={open} dismissOnOverlayPress={false} disableDrag={true} snapPoints={[97]} snapPointsMode="percent" onOpenChange={onOpenChange}>
      <Screen
        flex={1}
        title="Anfragen"
        action={
          <Button onPress={() => onOpenChange?.(false)} size="$3" variant="secondary">
            Schließen
          </Button>
        }
      >
        <ScrollView
          refreshControl={
            <RefreshControl
              onRefresh={async () => {
                setRefreshing(true);
                await refetch();
                setRefreshing(false);
              }}
              refreshing={refreshing}
            />
          }
          contentContainerStyle={{ gap: '$4' }}
        >
          {children}
          {pendingToAccept.map((friend) => (
            <Fragment key={friend.id}>
              <XStack alignItems="center" paddingRight="$2" justifyContent="space-between">
                <XStack gap="$3" alignItems="center">
                  <UserAvatar {...friend} />
                  <RequestToAccept friend={friend} />
                </XStack>
              </XStack>
            </Fragment>
          ))}
        </ScrollView>
      </Screen>
    </Sheet>
  );
};

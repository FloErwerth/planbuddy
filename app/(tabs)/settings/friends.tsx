import { Screen } from '@/components/Screen';
import { BackButton } from '@/components/BackButton';
import { useGetFriendsQuery } from '@/api/friends/getFriendsQuery';
import { SizableText, Spinner, View, XStack } from 'tamagui';
import { UserAvatar } from '@/screens/Participants/ParticipantsAvatar';
import { Fragment, useState } from 'react';
import { ParticipantStatus } from '@/api/events/types';
import { Plus } from '@tamagui/lucide-icons';
import { Pressable, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { ScrollView } from '@/components/tamagui/ScrollView';

export default function FriendsScreen() {
  const { data: friends, isLoading, refetch } = useGetFriendsQuery(true);
  const [refreshing, setRefreshing] = useState(false);
  if (isLoading) {
    return (
      <Screen flex={1} justifyContent="center" alignItems="center">
        <Spinner />
      </Screen>
    );
  }

  const AcceptanceStatus = ({ status }: { status: ParticipantStatus }) => {
    if (status === 'accepted') {
      return null;
    }

    if (status === 'undecided') {
      return (
        <View padding="$2" borderRadius="$12" backgroundColor="$color.yellow10Light">
          <SizableText size="$2">Ausstehend</SizableText>
        </View>
      );
    }

    if (status === 'declined') {
      return (
        <View padding="$2" borderRadius="$12" backgroundColor="$color.red8Light">
          <SizableText size="$2">Abgelehnt</SizableText>
        </View>
      );
    }
  };

  return (
    <>
      <Screen
        back={<BackButton href=".." />}
        title="Freunde"
        action={
          <Pressable onPress={() => router.push('/(tabs)/settings/addFriends')}>
            <Plus />
          </Pressable>
        }
      ></Screen>
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
        withShadow
        contentContainerStyle={{ padding: '$4', gap: '$2' }}
      >
        {friends?.map((friend) => (
          <Fragment key={friend.id}>
            <XStack alignItems="center" paddingRight="$2" justifyContent="space-between">
              <XStack gap="$3" alignItems="center">
                <UserAvatar {...friend} />
                <SizableText>
                  {friend.firstName} {friend.lastName}
                </SizableText>
              </XStack>
              {friend.status !== 'accepted' && <AcceptanceStatus status={friend.status} />}
            </XStack>
          </Fragment>
        ))}
      </ScrollView>
    </>
  );
}

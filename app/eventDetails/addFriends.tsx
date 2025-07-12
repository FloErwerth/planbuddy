import { Screen } from '@/components/Screen';
import { useEventDetailsContext, UserWithStatusAndSelection } from '@/screens/EventDetails/EventDetailsProvider';
import { SizableText, View, XStack } from 'tamagui';
import { Button } from '@/components/tamagui/Button';
import { router } from 'expo-router';
import { BackButton } from '@/components/BackButton';
import { UserPlus } from '@tamagui/lucide-icons';
import { Checkbox } from '@/components/tamagui/Checkbox';
import { Pressable } from 'react-native';
import { useCallback } from 'react';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import Animated, { FadeOut } from 'react-native-reanimated';
import { Card } from '@/components/tamagui/Card';
import { UserAvatar } from '@/components/UserAvatar';
import { FriendSearchInput } from '@/components/FriendSearch';

export default function AddFriends() {
  const { friends, toggleUsersToAdd } = useEventDetailsContext();

  const render = useCallback(
    ({ item: friend }: ListRenderItemInfo<UserWithStatusAndSelection>) => {
      const { firstName, lastName, email } = friend;
      return (
        <Pressable onPress={() => toggleUsersToAdd(friend.id!)}>
          <Animated.View key={friend.id} exiting={FadeOut}>
            <Card>
              <XStack justifyContent="space-between" paddingRight="$2" alignItems="center">
                <XStack alignItems="center" gap="$4">
                  <UserAvatar id={friend.id} />
                  <SizableText>{firstName || lastName ? `${firstName} ${lastName}` : email}</SizableText>
                </XStack>
                <Checkbox checked={!!friend.selected} />
              </XStack>
            </Card>
          </Animated.View>
        </Pressable>
      );
    },
    [toggleUsersToAdd]
  );

  return (
    <>
      <Screen
        back={<BackButton />}
        title="Freunde einladen"
        action={
          <Button variant="round" onPress={() => router.push('./addUsers')} padding={0} width="$2" height="$2">
            <UserPlus scale={0.7} color="$background" left={1} />
          </Button>
        }
      >
        <FriendSearchInput />
      </Screen>
      <FlashList
        renderItem={render}
        data={friends}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        ItemSeparatorComponent={() => <View height="$1" />}
        estimatedItemSize={100}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.5}
      />
    </>
  );
}

import { Screen } from '@/components/Screen';
import { Separator, SizableText, Spinner, View, XStack } from 'tamagui';
import { Pressable } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/api/supabase';
import { useProfileImageQuery } from '@/api/images';
import { useUserQuery } from '@/api/user';
import { PressableRow } from '@/components/PressableRow/PressableRow';
import { Users } from '@tamagui/lucide-icons';
import { useState } from 'react';
import { EditProfileSheet } from '@/sheets/EditProfileSheet';
import { useSetUser } from '@/store/user';
import { useQueryClient } from 'react-query';
import { PendingFriendRequestsDot } from '@/components/PendingFriendRequestsDot/PendingFriendRequestsDot';
import { UserAvatar } from '@/components/UserAvatar';
import { AddFriendsSheet } from '@/sheets/AddFriendsSheet';

export default function SettingsPage() {
  const { data: user, isLoading: isLoadingProfile } = useUserQuery();
  const { data: image, isLoading: isLoadingImage } = useProfileImageQuery(user?.id);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const queryClient = useQueryClient();
  const setUser = useSetUser();
  const [friendsSheetOpen, setFriendsSheetOpen] = useState(false);

  if (isLoadingProfile || isLoadingImage) {
    return (
      <Screen alignItems="center" flex={1} justifyContent="center">
        <Spinner />
      </Screen>
    );
  }

  return (
    <>
      <Screen
        title="Profil"
        action={
          <Pressable onPress={() => setEditProfileOpen(true)}>
            <SizableText color="$primary">Bearbeiten</SizableText>
          </Pressable>
        }
      >
        <UserAvatar size="$10" alignSelf="center" {...user} />
        <View alignSelf="center" justifyContent="center">
          <SizableText size="$6" textAlign="center">
            {user?.firstName} {user?.lastName}
          </SizableText>
          <SizableText>{user?.email}</SizableText>
        </View>
        <Separator />
        <PressableRow onPress={() => setFriendsSheetOpen(true)} backgroundColor="transparent" icon={<Users />}>
          <XStack>
            <SizableText>Freunde</SizableText>
            <PendingFriendRequestsDot position="relative" />
          </XStack>
        </PressableRow>
        <Pressable
          onPress={async () => {
            const result = await supabase.auth.signOut();

            if (result.error) {
              // login failed
              return;
            }

            router.replace('/login');
            setUser(undefined);
            await queryClient.invalidateQueries();
          }}
        >
          <SizableText>Logout</SizableText>
        </Pressable>
      </Screen>
      <EditProfileSheet open={editProfileOpen} onOpenChange={setEditProfileOpen} />
      <AddFriendsSheet open={friendsSheetOpen} onOpenChange={setFriendsSheetOpen} />
    </>
  );
}

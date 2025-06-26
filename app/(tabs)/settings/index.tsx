import { Screen } from '@/components/Screen';
import { Separator, SizableText, Spinner, View } from 'tamagui';
import { Pressable } from 'react-native';
import { router } from 'expo-router';
import { AvatarImagePicker } from '@/components/AvatarImagePicker';
import { supabase } from '@/api/supabase';
import { useProfileImageQuery } from '@/api/images';
import { useUserQuery } from '@/api/user';
import { PressableRow } from '@/components/PressableRow/PressableRow';
import { Users } from '@tamagui/lucide-icons';
import { useState } from 'react';
import { EditProfileSheet } from '@/sheets/EditProfileSheet';

export default function SettingsPage() {
  const { data: user, isLoading: isLoadingProfile } = useUserQuery();
  const { data: image, isLoading: isLoadingImage } = useProfileImageQuery(user?.id);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [friendsOpen, setFriendsOpen] = useState(false);

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
        <AvatarImagePicker image={image} />
        <View alignSelf="center">
          <SizableText size="$6">
            {user?.firstName} {user?.lastName}
          </SizableText>
        </View>
        <Separator />
        <PressableRow
          onPress={() => router.push('/(tabs)/settings/friends')}
          title="Freunde"
          backgroundColor="transparent"
          icon={<Users />}
        />
        <Pressable
          onPress={async () => {
            const result = await supabase.auth.signOut();

            if (result.error) {
              // login failed
              return;
            }

            router.replace('../..');
          }}
        >
          <SizableText>Logout</SizableText>
        </Pressable>
      </Screen>
      <EditProfileSheet open={editProfileOpen} onOpenChange={setEditProfileOpen} />
    </>
  );
}

import { Screen } from '@/components/Screen';
import { SizableText, View } from 'tamagui';
import { Pressable } from 'react-native';
import { router } from 'expo-router';
import { AvatarImagePicker } from '@/components/AvatarImagePicker';
import { supabase } from '@/api/supabase';
import { useProfileImageQuery } from '@/api/images';

export default function SettingsPage() {
  const { data: image } = useProfileImageQuery();

  return (
    <Screen
      title="Profil"
      action={
        <Pressable onPress={() => router.push('/(tabs)/settings/editProfile')}>
          <SizableText color="$primary">Bearbeiten</SizableText>
        </Pressable>
      }
    >
      <AvatarImagePicker image={image} />
      <View alignSelf="center">
        <SizableText size="$6">Florian Erwerth</SizableText>
      </View>
      <Pressable onPress={() => supabase.auth.signOut()}>
        <SizableText>Logout</SizableText>
      </Pressable>
    </Screen>
  );
}

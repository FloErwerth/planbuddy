import { Screen } from '@/components/Screen';
import { SizableText, View } from 'tamagui';
import { Pressable } from 'react-native';
import { router } from 'expo-router';
import { AvatarImagePicker } from '@/components/AvatarImagePicker';
import { supabase } from '@/api/supabase';

export default function SettingsPage() {
  return (
    <Screen
      title="Profil"
      action={
        <Pressable onPress={() => router.push('/(tabs)/settings/editProfile')}>
          <SizableText color="$primary">Bearbeiten</SizableText>
        </Pressable>
      }
    >
      <AvatarImagePicker />
      <View alignSelf="center">
        <SizableText size="$6">Florian Erwerth</SizableText>
      </View>
      <Pressable onPress={() => supabase.auth.signOut()}>
        <SizableText>Logout</SizableText>
      </Pressable>
    </Screen>
  );
}

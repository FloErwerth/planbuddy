import { getAuth } from '@react-native-firebase/auth';
import { Screen } from '@/components/Screen';
import { useUserQuery } from '@/api/query/user';
import { SizableText, View } from 'tamagui';
import { Pressable } from 'react-native';
import { router } from 'expo-router';
import { AvatarImagePicker } from '@/components/AvatarImagePicker';

export default function SettingsPage() {
  const { data: user } = useUserQuery();

  if (!user) {
    return null;
  }

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
        <SizableText size="$6">
          {user.firstName} {user.lastName}
        </SizableText>
      </View>
      <Pressable onPress={() => getAuth().signOut()}>
        <SizableText>Logout</SizableText>
      </Pressable>
    </Screen>
  );
}

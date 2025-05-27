import { getAuth } from '@react-native-firebase/auth';
import { Screen } from '@/components/Screen';
import { useUserQuery } from '@/api/query/user';
import { Avatar, SizableText, View, XStack } from 'tamagui';
import { Pressable } from 'react-native';

export default function SettingsPage() {
  const { data: user } = useUserQuery(getAuth().currentUser?.uid ?? '');

  if (!user) {
    return null;
  }

  return (
    <Screen>
      <XStack flex={1} gap="$4" alignItems="center">
        <Avatar circular size="$8" elevationAndroid={4}>
          <Avatar.Image src={user.image} />
          <Avatar.Fallback
            backgroundColor="$background"
            alignItems="center"
            justifyContent="center"
          >
            <SizableText>F.E</SizableText>
          </Avatar.Fallback>
        </Avatar>
        <View>
          <SizableText>
            {user.firstName} {user.lastName}
          </SizableText>
          <SizableText>{user.email}</SizableText>
        </View>
      </XStack>
      <Pressable onPress={() => getAuth().signOut()}>
        <SizableText>Logout</SizableText>
      </Pressable>
    </Screen>
  );
}

import { Button } from '@/components/tamagui';
import { getAuth } from '@react-native-firebase/auth';
import { Screen } from '@/components/Screen';
import { ImagePicker } from '@/components/ImagePicker';

export default function SettingsPage() {
  return (
    <Screen>
      <Button onPress={() => getAuth().signOut()}>Logout</Button>
      <ImagePicker />
    </Screen>
  );
}

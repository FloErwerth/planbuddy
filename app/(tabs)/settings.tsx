import { Button } from '@/components/tamagui';
import { getAuth } from '@react-native-firebase/auth';
import { Screen } from '@/components/Screen';

export default function SettingsPage() {
  return (
    <Screen>
      <Button onPress={() => getAuth().signOut()}>Logout</Button>
    </Screen>
  );
}

import { Button } from '@/components/tamagui';
import { getAuth } from '@react-native-firebase/auth';

export default function SettingsPage() {
  return (
    <>
      <Button onPress={() => getAuth().signOut()}>Logout</Button>
    </>
  );
}

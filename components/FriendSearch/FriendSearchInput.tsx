import { Input } from '@/components/tamagui/Input';
import { useFriendSearchContext } from '@/components/FriendSearch/FriendSearchContext';

export const FriendSearchInput = () => {
  const { search } = useFriendSearchContext();

  return <Input placeholder="Name oder E-Mail" onChangeText={search} />;
};

import { Input } from '@/components/tamagui/Input';
import { useSearchContext } from '@/screens/AddFriendsScreen/SearchContextProvider';

export const SearchWithText = () => {
  const { search } = useSearchContext();

  return <Input placeholder="Name oder E-Mail" onChangeText={search} />;
};

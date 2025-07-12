import { Input } from '@/components/tamagui/Input';
import { useCallback } from 'react';
import { useFriendSearchContext } from '@/components/FriendSearch/FriendSearch';

export const FriendSearchInput = () => {
  const { search, searchDisplay, setSearchDisplay } = useFriendSearchContext();

  const handleSearch = useCallback(
    (text: string) => {
      search(text);
      setSearchDisplay(text);
    },
    [search, setSearchDisplay]
  );

  return <Input value={searchDisplay} margin="$2" placeholder="Name oder E-Mail" onChangeText={handleSearch} />;
};

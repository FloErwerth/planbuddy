import { Input } from '@/components/tamagui/Input';
import { useUserSearchContext } from '@/components/UserSearch/UserSearchContext';
import { useCallback } from 'react';

export const UserSearchInput = () => {
    const { search, searchDisplay, setSearchDisplay } = useUserSearchContext();

    const handleSearch = useCallback(
        (text: string) => {
            search(text);
            setSearchDisplay(text);
        },
        [search, setSearchDisplay]
    );

    return <Input value={searchDisplay} placeholder="Name oder E-Mail" onChangeText={handleSearch} />;
};

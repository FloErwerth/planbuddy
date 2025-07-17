import { SizableText, View } from 'tamagui';
import { Screen } from '@/components/Screen';
import { FriendEntry } from '@/screens/AddFriendsScreen/FriendEntry';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { UserSearchInput, UserSearchProvider, UserWithStatus, useUserSearchContext } from '@/components/UserSearch';
import { useCallback } from 'react';
import { UserSearch } from '@tamagui/lucide-icons';

const containerStyle = { padding: 16, paddingBottom: 32 } as const;

const AddFriendsDisplay = () => {
    const { users } = useUserSearchContext();

    const renderItem = useCallback(({ item: user }: ListRenderItemInfo<UserWithStatus>) => <FriendEntry friend={user} />, []);

    if (users !== undefined && users?.length === 0) {
        return (
            <Screen>
                <View gap="$4" justifyContent="center" alignItems="center">
                    <UserSearch size="$4" />
                    <SizableText>Starte eine Suche, um neue Freunde hinzuzufügen</SizableText>
                </View>
            </Screen>
        );
    }

    return (
        <FlashList
            renderItem={renderItem}
            data={users}
            contentContainerStyle={containerStyle}
            ItemSeparatorComponent={() => <View height="$1" />}
            estimatedItemSize={100}
            showsVerticalScrollIndicator={false}
        />
    );
};

export const AddFriendsScreen = () => {
    return (
        <UserSearchProvider>
            <Screen title="Freunde hinzufügen">
                <UserSearchInput />
            </Screen>
            <AddFriendsDisplay />
        </UserSearchProvider>
    );
};

import { useUserQuery } from '@/api/user';
import { useProfileImageQuery } from '@/api/images';
import { Screen } from '@/components/Screen';
import { Separator, SizableText, Spinner, View, XStack } from 'tamagui';
import { Pressable } from 'react-native';
import { UserAvatar } from '@/components/UserAvatar';
import { PressableRow } from '@/components/PressableRow';
import { router } from 'expo-router';
import { UserCog, Users } from '@tamagui/lucide-icons';
import { FriendRequestRow } from '@/screens/ProfileScreen/FriendRequests';
import { useLogout } from '@/api/supabase';

export const ProfileScreen = () => {
    const { data: user, isLoading: isLoadingProfile } = useUserQuery();
    const { data: image, isLoading: isLoadingImage } = useProfileImageQuery(user?.id);
    const logout = useLogout();

    if (isLoadingProfile || isLoadingImage) {
        return (
            <Screen alignItems="center" flex={1} justifyContent="center">
                <Spinner />
            </Screen>
        );
    }

    return (
        <>
            <Screen
                title="Profil"
                action={
                    <Pressable onPress={() => router.push('/(tabs)/profile/editProfile')}>
                        <UserCog />
                    </Pressable>
                }
            >
                <UserAvatar size="$10" alignSelf="center" {...user} />
                <View alignSelf="center" justifyContent="center">
                    <SizableText size="$6" textAlign="center">
                        {user?.firstName} {user?.lastName}
                    </SizableText>
                    <SizableText>{user?.email}</SizableText>
                </View>
                <Separator />
                <View>
                    <FriendRequestRow />
                    <PressableRow onPress={() => router.navigate('/(tabs)/profile/friends')} backgroundColor="transparent" icon={<Users />}>
                        <XStack>
                            <SizableText>Freunde</SizableText>
                        </XStack>
                    </PressableRow>
                </View>
                <Pressable onPress={logout}>
                    <SizableText>Logout</SizableText>
                </Pressable>
            </Screen>
        </>
    );
};

import { useUserQuery } from '@/api/user';
import { useProfileImageQuery } from '@/api/images';
import { Screen } from '@/components/Screen';
import { Separator, SizableText, Spinner, View, XStack } from 'tamagui';
import { Pressable } from 'react-native';
import { UserAvatar } from '@/components/UserAvatar';
import { PressableRow } from '@/components/PressableRow';
import { router } from 'expo-router';
import { ChevronRight, UserCog, Users } from '@tamagui/lucide-icons';
import { FriendRequestRow } from '@/screens/ProfileScreen/FriendRequests';
import { useLogout } from '@/api/supabase';
import { Button } from '@/components/tamagui/Button';
import packageJson from '@/package.json';

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
        <Screen
            flex={1}
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
            <FriendRequestRow />
            <PressableRow onPress={() => router.navigate('/(tabs)/profile/friends')} icon={<Users size="$1" />} iconRight={<ChevronRight size="$1" />}>
                <SizableText>Freunde</SizableText>
            </PressableRow>
            <View flex={1} justifyContent="flex-end">
                <XStack justifyContent="space-between" alignItems="center">
                    <Button alignSelf="flex-start" variant="secondary" size="$2" onPress={logout}>
                        <SizableText>Logout</SizableText>
                    </Button>
                </XStack>
                <SizableText size="$2" alignSelf="flex-end">
                    Version {packageJson.version}
                </SizableText>
            </View>
        </Screen>
    );
};

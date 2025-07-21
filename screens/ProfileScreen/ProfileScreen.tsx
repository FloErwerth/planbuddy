import { useUserQuery } from '@/api/user';
import { Screen } from '@/components/Screen';
import { SizableText, Spinner, View, XStack } from 'tamagui';
import { UserAvatar } from '@/components/UserAvatar';
import { PressableRow } from '@/components/PressableRow';
import { router } from 'expo-router';
import { ChevronRight, Pencil, Users } from '@tamagui/lucide-icons';
import { FriendRequestRow } from '@/screens/ProfileScreen/FriendRequests';
import { useLogout } from '@/api/supabase';
import { Button } from '@/components/tamagui/Button';
import packageJson from '@/package.json';
import { Separator } from '@/components/tamagui/Separator';

export const ProfileScreen = () => {
    const { data: user, isLoading: isLoadingProfile } = useUserQuery();
    const logout = useLogout();

    if (isLoadingProfile) {
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
                <Button variant="round" onPress={() => router.push('/(tabs)/profile/editProfile')}>
                    <Pencil scale={0.75} size="$1" />
                </Button>
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
            <SizableText>
                Account löschen: Checken ob user ein creator ist, wenn ja Hinweisen, dass dann Events gelöscht werden. Möglichkeit Event an Pariticpant zu
                übertragen, wenn vorhanden
            </SizableText>
            <View flex={1} gap="$4" justifyContent="flex-end">
                <XStack justifyContent="space-between" alignItems="center">
                    <XStack gap="$2">
                        <Button variant="secondary" size="$2" onPress={logout}>
                            Logout
                        </Button>
                    </XStack>
                    <SizableText size="$2" alignSelf="flex-end">
                        Version {packageJson.version}
                    </SizableText>
                </XStack>
            </View>
        </Screen>
    );
};

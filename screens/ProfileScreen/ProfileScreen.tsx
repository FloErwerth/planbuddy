import { Screen } from "@/components/Screen";
import { SizableText, Spinner, View, XStack } from "tamagui";
import { UserAvatar } from "@/components/UserAvatar";
import { PressableRow } from "@/components/PressableRow";
import { router } from "expo-router";
import { Bell, ChevronRight, Pencil, Users } from "@tamagui/lucide-icons";
import { FriendRequestRow } from "@/screens/ProfileScreen/FriendRequests";
import { useLogout } from "@/api/supabase";
import { Button } from "@/components/tamagui/Button";
import packageJson from "@/package.json";
import { Separator } from "@/components/tamagui/Separator";
import { Pressable } from "react-native";
import { useState } from "react";
import { DeleteUserDialog } from "./DeleteUserDialog";
import { useGetUserQuery } from "@/api/user/getUser";
import { ProfileStatistics } from "@/screens/ProfileScreen/ProfileStatistics/ProfileStatistics";

export const ProfileScreen = () => {
  const { data: user, isLoading: isLoadingProfile } = useGetUserQuery();
  const logout = useLogout();
  const [deleteUserDialogOpen, setDeleteUserDialogOpen] = useState(false);

  if (isLoadingProfile) {
    return (
      <Screen alignItems="center" flex={1} justifyContent="center">
        <Spinner />
      </Screen>
    );
  }

  return (
    <>
      <Screen
        flex={1}
        title="Profil"
        action={
          <Button variant="round" onPress={() => router.push("/(tabs)/profile/editProfile")}>
            <Pencil scale={0.75} size="$1" />
          </Button>
        }
      >
        <UserAvatar size="$10" alignSelf="center" id={user?.id} />
        <View alignSelf="center" justifyContent="center">
          <SizableText size="$7" textAlign="center">
            {user?.firstName} {user?.lastName}
          </SizableText>
          <SizableText size="$3">{user?.email}</SizableText>
        </View>
        <Separator />
        <ProfileStatistics />
        <SizableText size="$5">Einstellungen</SizableText>
        <FriendRequestRow />
        <PressableRow onPress={() => router.navigate("/(tabs)/profile/friends")} icon={<Users size="$1" />} iconRight={<ChevronRight size="$1" />}>
          <SizableText>Freunde</SizableText>
        </PressableRow>
        <PressableRow onPress={() => router.navigate("/(tabs)/profile/notifications")} icon={<Bell size="$1" />} iconRight={<ChevronRight size="$1" />}>
          <SizableText>Benachrichtigungen</SizableText>
        </PressableRow>
        <SizableText>
          Account löschen: Checken ob user ein creator ist, wenn ja Hinweisen, dass dann Events gelöscht werden. Möglichkeit Event an Pariticpant zu übertragen,
          wenn vorhanden
        </SizableText>
        <View flex={1} gap="$4" justifyContent="flex-end">
          <Button alignSelf="flex-start" variant="secondary" size="$3" onPress={logout}>
            Logout
          </Button>
          <Separator />
          <XStack justifyContent="space-between" alignItems="center">
            <Pressable onPress={() => setDeleteUserDialogOpen(true)}>
              <SizableText size="$2" theme="error">
                Account löschen
              </SizableText>
            </Pressable>
            <SizableText size="$2" alignSelf="flex-end">
              Version {packageJson.version}
            </SizableText>
          </XStack>
        </View>
      </Screen>
      <DeleteUserDialog open={deleteUserDialogOpen} onOpenChange={setDeleteUserDialogOpen} />
    </>
  );
};

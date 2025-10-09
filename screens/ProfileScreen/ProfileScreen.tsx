import { Bell, ChevronRight, Pencil, Users } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable } from "react-native";
import { SizableText, Spinner, View, XStack } from "tamagui";
import { useGetUserQuery } from "@/api/user/getUser";
import { useProfileImageQuery } from "@/api/user/profilePicture";
import { AvatarImagePicker } from "@/components/AvatarImagePicker";
import { PressableRow } from "@/components/PressableRow";
import { Screen } from "@/components/Screen";
import { Button } from "@/components/tamagui/Button";
import { Separator } from "@/components/tamagui/Separator";
import { useTranslation } from "@/hooks/useTranslation";
import packageJson from "@/package.json";
import { useAuthenticationContext } from "@/providers/AuthenticationProvider";
import { FriendRequestRow } from "@/screens/ProfileScreen/FriendRequests";
import { ProfileStatistics } from "@/screens/ProfileScreen/ProfileStatistics/ProfileStatistics";
import { DeleteUserDialog } from "./DeleteUserDialog";

export const ProfileScreen = () => {
	const { data: user, isLoading: isLoadingProfile } = useGetUserQuery();
	const { data: profilePicture } = useProfileImageQuery(user?.id);
	const [deleteUserDialogOpen, setDeleteUserDialogOpen] = useState(false);
	const { logout } = useAuthenticationContext();
	const { t } = useTranslation();

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
				title={t("profile.title")}
				action={
					<Button variant="round" onPress={() => router.push("/(tabs)/profile/editProfile")}>
						<Pencil scale={0.75} size="$1" />
					</Button>
				}
			>
				<AvatarImagePicker editable={false} image={profilePicture || undefined} />
				<View alignSelf="center" justifyContent="center">
					<SizableText size="$7" textAlign="center">
						{user?.firstName} {user?.lastName}
					</SizableText>
					<SizableText size="$3">{user?.email}</SizableText>
				</View>
				<Separator />
				<ProfileStatistics />
				<SizableText size="$5">{t("profile.settings")}</SizableText>
				<FriendRequestRow />
				<PressableRow onPress={() => router.navigate("/(tabs)/profile/friends")} icon={<Users size="$1" />} iconRight={<ChevronRight size="$1" />}>
					<SizableText>{t("friends.title")}</SizableText>
				</PressableRow>
				<PressableRow onPress={() => router.navigate("/(tabs)/profile/notifications")} icon={<Bell size="$1" />} iconRight={<ChevronRight size="$1" />}>
					<SizableText>{t("notifications.title")}</SizableText>
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
								{t("profile.deleteAccount")}
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

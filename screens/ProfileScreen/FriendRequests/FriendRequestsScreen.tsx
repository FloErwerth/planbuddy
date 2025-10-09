import { Check, X } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import { useState } from "react";
import { SizableText, View, XStack } from "tamagui";
import { useRemoveFriendMutation } from "@/api/friends/removeFriend";
import { type Friend, FriendRequestStatusEnum } from "@/api/friends/types";
import { useUpdateFriendMutation } from "@/api/friends/updateFriend";
import { BackButton } from "@/components/BackButton";
import { Screen } from "@/components/Screen";
import { Button } from "@/components/tamagui/Button";
import { Card } from "@/components/tamagui/Card";
import { Dialog } from "@/components/tamagui/Dialog";
import { ScrollView } from "@/components/tamagui/ScrollView";
import { UserAvatar } from "@/components/UserAvatar";
import { usePendingFriends } from "@/hooks/friends/usePendingFriends";
import { useTranslation } from "@/hooks/useTranslation";
import { formatToDate } from "@/utils/date";

export const FriendRequestsScreen = () => {
	const pendingFriends = usePendingFriends();
	const [userToDecline, setUserToDecline] = useState<Friend | undefined>(undefined);
	const { mutateAsync: removeFriend } = useRemoveFriendMutation();
	const { mutateAsync: updateFriend } = useUpdateFriendMutation();
	const { t } = useTranslation();

	if (pendingFriends.length === 0) {
		return null;
	}

	const acceptFriendRequest = async (id: string) => {
		await updateFriend({
			id,
			status: FriendRequestStatusEnum.ACCEPTED,
			acceptedAt: new Date().toISOString(),
		});
		router.navigate("/profile");
	};

	const mapped = pendingFriends.map((pending) => {
		return (
			<Card key={pending.id}>
				<XStack alignItems="center" justifyContent="space-between">
					<XStack alignItems="center" gap="$2">
						<UserAvatar id={pending.id} />
						<View>
							<SizableText>
								{pending.firstName} {pending.lastName}
							</SizableText>
							<SizableText size="$2">{t("friends.receivedOn", { date: formatToDate(pending.sendAt) })}</SizableText>
						</View>
					</XStack>
					<XStack gap="$2">
						<Button onPress={() => acceptFriendRequest(pending.id)} size="$2" backgroundColor="$color.green8Light">
							<Check size="$1" />
						</Button>
						<Button onPress={() => setUserToDecline(pending)} size="$2" backgroundColor="$color.red8Light">
							<X size="$1" />
						</Button>
					</XStack>
				</XStack>
			</Card>
		);
	});

	const declineFriendRequest = async () => {
		await removeFriend(userToDecline?.id);
		router.navigate("/profile");
	};

	return (
		<>
			<Screen back={<BackButton href="/profile" />} title={t("friends.requests")} />
			<ScrollView contentContainerStyle={{ padding: "$4" }}>{mapped}</ScrollView>
			<Dialog
				open={!!userToDecline}
				onOpenChange={(open) => {
					if (!open) {
						setUserToDecline(undefined);
					}
				}}
			>
				<SizableText textAlign="center" size="$6">
					{t("friends.declineRequest")}
				</SizableText>
				<SizableText>{t("friends.declineConfirm", { name: userToDecline?.firstName })}</SizableText>
				<View gap="$2">
					<Button onPress={declineFriendRequest}>{t("friends.declineRequest")}</Button>
					<Button onPress={() => setUserToDecline(undefined)} variant="secondary">
						{t("common.cancel")}
					</Button>
				</View>
			</Dialog>
		</>
	);
};

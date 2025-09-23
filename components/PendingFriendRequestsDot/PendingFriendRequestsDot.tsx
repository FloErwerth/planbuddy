import { useAllFriendsQuery } from "@/api/friends/allFriends";
import { FriendRequestStatusEnum } from "@/api/friends/types";
import { SizableText, View, ViewProps } from "tamagui";

export const PendingFriendRequestsDot = (props: ViewProps) => {
	const { data: friends } = useAllFriendsQuery();

	const pending = friends?.filter((friend) => friend.status === FriendRequestStatusEnum.PENDING);

	if (!pending || pending?.length === 0) {
		return null;
	}

	const pendingRequestsText = pending.length >= 100 ? "99+" : pending.length;

	return (
		<View width={14} height={14} backgroundColor="red" borderRadius="$12" position="absolute" justifyContent="center" alignItems="center" {...props}>
			<SizableText fontSize={pending.length < 10 ? 8 : 6} color="$background">
				{pendingRequestsText}
			</SizableText>
		</View>
	);
};

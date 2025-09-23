import { useAllFriendsQuery } from "@/api/friends/allFriends";
import { FriendRequestStatusEnum } from "@/api/friends/types";

export const useAcceptedFriends = () => {
	const { data: friends } = useAllFriendsQuery();

	if (friends === undefined || friends.length === 0) {
		return [];
	}

	return friends.filter((friend) => friend.status === FriendRequestStatusEnum.ACCEPTED);
};

import { BaseFriend, Friend, FriendsQueryResponse } from "@/api/friends/types";

export const getBaseFriendFromQuery = (response: FriendsQueryResponse): BaseFriend => {
	return {
		id: response.id,
		acceptedAt: response.acceptedAt,
		sendAt: response.sendAt,
		status: response.status,
	};
};

export const getFriendFromQuery = (response: FriendsQueryResponse, userId: string) => {
	const baseFriend = getBaseFriendFromQuery(response);
	const receiver = { ...response.receiverId };
	const requester = { ...response.requesterId };
	const requesterUserId = requester.id;
	const receiverUserId = receiver.id;
	delete requester.id;
	delete receiver.id;

	if (!receiver || !requester) {
		throw new Error("Error in getFriendFromQuery: The received data had no receiver user or requester user.");
	}

	if (receiver.id !== userId && requester.id !== userId) {
		throw new Error("Error in getFriendFromQuery: The received data had no overlap with the user");
	}

	if (requesterUserId === userId) {
		return {
			...baseFriend,
			userId: requesterUserId,
			...requester,
		} as Friend;
	}

	return {
		...baseFriend,
		userId: receiverUserId,
		...receiver,
	} as Friend;
};

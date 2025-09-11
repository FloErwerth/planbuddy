import { FRIENDS_QUERY_KEY } from "@/api/friends/constants";
import { getFriendSupabaseQuery } from "@/api/friends/getFriend/query";
import { singleFriendSchema } from "@/api/friends/schema";
import { useGetUser } from "@/store/authentication";
import { QueryOptions, useQuery } from "@tanstack/react-query";

export const useGetFriendQuery = (friendId: string, options: QueryOptions = {}) => {
	const user = useGetUser();

	return useQuery({
		queryFn: async () => {
			const response = await getFriendSupabaseQuery(friendId, user.id);

			if (response.error) {
				throw new Error(`error in useGetFriendQuery: ${response.error.message} `);
			}

			// user sent the request
			if (response.data.fromUserId !== null) {
				return singleFriendSchema.parse({
					...response.data,
					firstName: response.data.toUserId.firstName,
					lastName: response.data.toUserId.lastName,
					email: response.data.toUserId.email,
					receiverId: user.id!,
					requesterId: response.data.fromUserId.id!,
				});
			}

			// user received the request
			if (response.data.toUserId !== null) {
				return singleFriendSchema.parse({
					...response.data,
					firstName: response.data.toUserId.firstName,
					lastName: response.data.toUserId.lastName,
					email: response.data.toUserId.email,
					receiverId: response.data.toUserId.id!,
					requesterId: user.id!,
				});
			}

			return undefined;
		},
		queryKey: [FRIENDS_QUERY_KEY, friendId, user.id],
		...options,
	});
};

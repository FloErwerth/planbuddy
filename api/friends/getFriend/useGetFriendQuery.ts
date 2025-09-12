import { FRIENDS_QUERY_KEY } from "@/api/friends/constants";
import { getFriendSupabaseQuery } from "@/api/friends/getFriend/query";
import { friendsQuerySchema } from "@/api/friends/types";
import { getFriendFromQuery } from "@/api/friends/utils/getFriendFromQuery";
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

			const parsedResponse = friendsQuerySchema.safeParse(response.data);

			if (parsedResponse.error) {
				throw new Error(`Error in useGetFriendsQuery: Parsing the response failed. Details: ${parsedResponse.error.message}`);
			}

			return getFriendFromQuery(parsedResponse.data, user.id);
		},
		queryKey: [FRIENDS_QUERY_KEY, friendId, user.id],
		...options,
	});
};

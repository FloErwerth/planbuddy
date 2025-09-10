import { allFriendsSupabaseQuery } from "@/api/friends/allFriends/query";
import { FRIENDS_QUERY_KEY } from "@/api/friends/constants";
import { friendsQuerySchema } from "@/api/friends/schema";
import { useGetUser } from "@/store/authentication";
import { useQuery } from "@tanstack/react-query";
export const useAllFriendsQuery = () => {
	const user = useGetUser();

	return useQuery({
		queryFn: async () => {
			const queryResponse = await allFriendsSupabaseQuery(user.id);

			if (queryResponse.error) {
				throw new Error(`Error in useAllFriendsQuery: ${queryResponse.error.message}`);
			}

			return friendsQuerySchema.parse(queryResponse.data);
		},
		queryKey: [FRIENDS_QUERY_KEY, user?.id],
	});
};

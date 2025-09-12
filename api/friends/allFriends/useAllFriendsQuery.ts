import { allFriendsSupabaseQuery } from "@/api/friends/allFriends/query";
import { FRIENDS_QUERY_KEY } from "@/api/friends/constants";
import { allFriendsQueryResponseSchema } from "@/api/friends/types";
import { getFriendFromQuery } from "@/api/friends/utils/getFriendFromQuery";
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

			const parse = allFriendsQueryResponseSchema.safeParse(queryResponse.data);

			if (parse.error) {
				throw new Error(`Error in useAllFriendsQuery: Parsing failed. Details: ${parse.error.message}`);
			}

			return parse.data.map((data) => getFriendFromQuery(data, user.id));
		},
		queryKey: [FRIENDS_QUERY_KEY, user?.id],
	});
};

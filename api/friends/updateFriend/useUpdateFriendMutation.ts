import { FRIENDS_MUTATION_KEY, FRIENDS_QUERY_KEY } from "@/api/friends/constants";
import { SimpleFriend } from "@/api/friends/types";
import { updateFriendSupabaseQuery } from "@/api/friends/updateFriend/query";
import { useGetUser } from "@/store/authentication";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const useUpdateFriendMutation = () => {
	const user = useGetUser();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (friend: SimpleFriend) => {
			if (!user) {
				throw new Error("Probably not logged in.");
			}

			const result = await updateFriendSupabaseQuery(friend);

			return !result.error;
		},
		mutationKey: [FRIENDS_MUTATION_KEY],
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: [FRIENDS_QUERY_KEY] });
		},
	});
};

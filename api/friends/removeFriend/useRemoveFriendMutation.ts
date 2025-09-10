import { FRIENDS_MUTATION_KEY, FRIENDS_QUERY_KEY } from "@/api/friends/constants";
import { removeFriendSupabaseQuery } from "@/api/friends/removeFriend/query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useRemoveFriendMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (friendId: string) => {
			const result = await removeFriendSupabaseQuery(friendId);

			if (result.error) {
				throw new Error(`Error in useRemoveFriendMutation: ${result.error.message}`);
			}

			return result.data;
		},
		mutationKey: [FRIENDS_MUTATION_KEY],
		onSuccess: async () => {
			await queryClient.refetchQueries({ queryKey: [FRIENDS_QUERY_KEY] });
		},
	});
};

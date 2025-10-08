import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FRIENDS_MUTATION_KEY, FRIENDS_QUERY_KEY } from "@/api/friends/constants";
import type { BaseFriend } from "@/api/friends/types";
import { updateFriendSupabaseQuery } from "@/api/friends/updateFriend/query";
import { useAuthenticationContext } from "@/providers/AuthenticationProvider";

export const useUpdateFriendMutation = () => {
	const { user } = useAuthenticationContext();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (friend: Partial<BaseFriend>) => {
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

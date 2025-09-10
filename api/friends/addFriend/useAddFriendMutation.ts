import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FRIENDS_MUTATION_KEY, FRIENDS_QUERY_KEY } from "@/api/friends/constants";
import { useFriendOverview } from "@/api/friends/refiners";
import { useGetUser } from "@/store/authentication";
import { addFriendSupabaseQuery } from "@/api/friends/addFriend/query";

export const useAddFriendMutation = () => {
	const user = useGetUser();
	const queryClient = useQueryClient();
	const { data } = useFriendOverview();

	return useMutation({
		mutationFn: async (friendId: string) => {
			const isAlreadyFriend = data.find((friend) => friend.requester?.id === friendId || friend.receiver?.id === friendId);

			if (isAlreadyFriend) {
				return;
			}

			const result = await addFriendSupabaseQuery(user.id, friendId);

			return !result.error;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: [FRIENDS_QUERY_KEY] });
		},
		mutationKey: [FRIENDS_MUTATION_KEY],
	});
};

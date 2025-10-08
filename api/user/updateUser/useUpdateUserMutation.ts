import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UPDATE_USERS_MUTATION_KEY, USERS_QUERY_KEY } from "@/api/user/constants";
import type { User } from "@/api/user/types";
import { updateUserSupabaseQuery } from "@/api/user/updateUser/query";

export const useUpdateUserMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ updatedUser, onSuccess }: { updatedUser: Partial<User>; onSuccess?: (user: User) => void }) => {
			const result = await updateUserSupabaseQuery(updatedUser);

			if (result.error) {
				throw new Error(result.error.message);
			}

			onSuccess?.(result.data[0]);
		},
		mutationKey: [UPDATE_USERS_MUTATION_KEY],
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
		},
	});
};

import { INSERT_USERS_MUTATION_KEY, USERS_QUERY_KEY } from "@/api/user/constants";
import { insertUserSupabaseQuery } from "@/api/user/insertUser/query";
import type { User } from "@/api/user/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useInsertUserMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (insertedUser: Partial<User>) => {
			const result = await insertUserSupabaseQuery(insertedUser);

			if (result.error) {
				throw new Error(`Error in useInsertUserMutation: ${result.error.message}`);
			}

			return result.data?.[0];
		},
		mutationKey: [INSERT_USERS_MUTATION_KEY],
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
		},
	});
};

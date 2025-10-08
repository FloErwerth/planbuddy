import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DELETE_USER_MUTATION } from "@/api/user/constants";
import { deleteUserSupabaseQuery } from "@/api/user/deleteUser/query";
import { useAuthenticationContext } from "@/providers/AuthenticationProvider";

export const useDeleteUserMutation = () => {
	const queryClient = useQueryClient();
	const { user } = useAuthenticationContext();
	return useMutation({
		mutationFn: async () => {
			const result = await deleteUserSupabaseQuery(user.id);

			if (result.error) {
				throw new Error(`Error in useDeleteUserMutation: ${result.error.message}`);
			}

			return !!result.data;
		},
		mutationKey: [DELETE_USER_MUTATION],
		onSuccess: async () => {
			await queryClient.invalidateQueries();
		},
	});
};

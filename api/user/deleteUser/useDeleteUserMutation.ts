import { DELETE_USER_MUTATION } from "@/api/user/constants";
import { deleteUserSupabaseQuery } from "@/api/user/deleteUser/query";
import { useGetUser } from "@/store/authentication";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const useDeleteUserMutation = () => {
	const queryClient = useQueryClient();
	const user = useGetUser();
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

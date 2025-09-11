import { DELETE_PROFILE_IMAGE_MUTATION_KEY, PROFILE_PICTURE_QUERY_KEY } from "@/api/user/constants";
import { deleteUserProfilePictureSupabaseQuery } from "@/api/user/deleteUserProfile/query";
import { useProfileImageQuery } from "@/api/user/profilePicture/useProfilePictureQuery";
import { useGetUser } from "@/store/authentication";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const useDeleteProfilePictureMutation = () => {
	const user = useGetUser();
	const queryClient = useQueryClient();
	const image = useProfileImageQuery(user?.id);

	return useMutation({
		mutationFn: async () => {
			if (!image) {
				return;
			}

			const result = await deleteUserProfilePictureSupabaseQuery(user.id);
			if (result.error) {
				throw new Error(`Error in useDeleteProfilePictureMutation: ${result.error.message}`);
			}
		},
		mutationKey: [DELETE_PROFILE_IMAGE_MUTATION_KEY],
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: [PROFILE_PICTURE_QUERY_KEY] });
		},
	});
};

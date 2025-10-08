import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as FileSystem from "expo-file-system";
import { Image } from "react-native-compressor";
import { PROFILE_PICTURE_QUERY_KEY, UPLOAD_PROFILE_IMAGE_MUTATION_KEY } from "@/api/user/constants";
import { uploadProfilePictureSupabaseQuery } from "@/api/user/uploadProfilePicture/query";
import { useAuthenticationContext } from "@/providers/AuthenticationProvider";

export const useUploadProfilePictureMutation = () => {
	const { user } = useAuthenticationContext();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (file: string | null) => {
			if (file === null) {
				return Promise.resolve(undefined);
			}

			const compressedImage = await Image.compress(file, {
				compressionMethod: "manual",
				maxWidth: 240,
				maxHeight: 240,
				quality: 1,
			});

			const base64 = await FileSystem.readAsStringAsync(compressedImage, {
				encoding: "base64",
			});

			return await uploadProfilePictureSupabaseQuery(user.id, base64);
		},
		mutationKey: [UPLOAD_PROFILE_IMAGE_MUTATION_KEY],
		onSuccess: async () => {
			await queryClient.refetchQueries({ queryKey: [PROFILE_PICTURE_QUERY_KEY] });
		},
	});
};

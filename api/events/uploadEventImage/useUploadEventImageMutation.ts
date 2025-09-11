import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Image } from "react-native-compressor";
import * as FileSystem from "expo-file-system";
import { uploadEventImageSupabaseQuery } from "@/api/events/uploadEventImage/query";
import { EVENT_IMAGE_QUERY_KEY, UPLOAD_EVENT_IMAGE_MUTATION_KEY } from "@/api/events/constants";

type UploadedEventData = { eventId: string; image: string };
export const useUploadEventImageMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ image, eventId }: UploadedEventData) => {
			if (!image) {
				throw new Error("Error in uploading image: image was empty or undefined");
			}
			if (!eventId) {
				throw new Error("Error in uploading image: event id was empty or undefined");
			}

			const compressedImage = await Image.compress(image, {
				compressionMethod: "manual",
				maxWidth: 1024,
				maxHeight: 1024,
				quality: 1,
			});

			const base64 = await FileSystem.readAsStringAsync(compressedImage, {
				encoding: "base64",
			});

			return await uploadEventImageSupabaseQuery(eventId, base64);
		},
		mutationKey: [UPLOAD_EVENT_IMAGE_MUTATION_KEY],
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: [EVENT_IMAGE_QUERY_KEY] });
		},
	});
};

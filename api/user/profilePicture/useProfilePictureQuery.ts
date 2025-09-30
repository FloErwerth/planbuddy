import { supabase } from "@/api/supabase";
import { PROFILE_PICTURE_QUERY_KEY } from "@/api/user/constants";
import { useQuery } from "@tanstack/react-query";

export const useProfileImageQuery = (userId?: string) => {
	return useQuery({
		queryFn: async (): Promise<string | null> => {
			if (!userId) {
				return null;
			}

			// get image
			const download = await supabase.storage.from("profile-images").download(`${userId}/profileImage.png?bust=${Date.now()}`);

			if (download.error) {
				if (download.error.name === "StorageUnknownError") {
					// this is likely because of no image uploaded for the event
					return null;
				}
				throw new Error(download.error.message);
			}

			if (download.data.size === 0) {
				return null;
			}

			return new Promise((resolve, _) => {
				const reader = new FileReader();
				reader.onloadend = () => resolve(reader.result as string);
				reader.readAsDataURL(download.data);
			});
		},
		queryKey: [PROFILE_PICTURE_QUERY_KEY, userId],
	});
};

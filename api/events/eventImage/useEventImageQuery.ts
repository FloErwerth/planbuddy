import { EVENT_IMAGE_QUERY_KEY } from "@/api/events/constants";
import { supabase } from "@/api/supabase";
import { useQuery } from "@tanstack/react-query";

export const useEventImageQuery = (eventId?: string) => {
	return useQuery({
		queryFn: async (): Promise<string | null> => {
			if (!eventId) {
				return null;
			}
			const download = await supabase.storage.from("event-images").download(`${eventId}/image.png?bust=${Date.now()}`);

			if (download.error) {
				if (download.error.name === "StorageUnknownError") {
					// this is likely because of no image uploaded for the event
					return null;
				}
				throw new Error(download.error.message);
			}

			if (download.data.size < 100) {
				return null;
			}

			return new Promise((resolve, _) => {
				const reader = new FileReader();
				reader.onloadend = () => resolve(reader.result as string);
				reader.readAsDataURL(download.data);
			});
		},
		queryKey: [EVENT_IMAGE_QUERY_KEY, eventId],
	});
};

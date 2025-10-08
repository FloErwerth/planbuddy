import { EVENT_IMAGE_QUERY_KEY, REMOVE_EVENT_IMAGE_MUTATION_KEY } from "@/api/events/constants";
import { removeEventImageSupabaseQuery } from "@/api/events/removeEventImage/query";
import { useQueryClient, useMutation } from "@tanstack/react-query";
type RemoveEventImageData = { eventId: string };

/**
 * @description Removes the event image from the database using the cache buster from supabase.
 */
export const useRemoveEventImageMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ eventId }: RemoveEventImageData) => {
			if (!eventId) {
				throw new Error("Error in remove event image: event id was undefined or empty");
			}
			return await removeEventImageSupabaseQuery(eventId);
		},
		mutationKey: [REMOVE_EVENT_IMAGE_MUTATION_KEY],
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: [EVENT_IMAGE_QUERY_KEY] });
		},
	});
};

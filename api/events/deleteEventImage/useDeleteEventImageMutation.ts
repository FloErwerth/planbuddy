import { DELETE_EVENT_IMAGE_MUTATION_KEY, EVENT_IMAGE_QUERY_KEY } from "@/api/events/constants";
import { deleteEventImageSupabaseQuery } from "@/api/events/deleteEventImage/query";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const useDeleteEventImageMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (eventId?: string) => {
			if (!eventId) {
				throw new Error("Error in delete event image mutation: The event id must be provided");
			}
			return await deleteEventImageSupabaseQuery(eventId);
		},
		mutationKey: [DELETE_EVENT_IMAGE_MUTATION_KEY],
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: [EVENT_IMAGE_QUERY_KEY] });
		},
	});
};

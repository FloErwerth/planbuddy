import { DELETE_EVENT_MUTATION_KEY, EVENTS_QUERY_KEY } from "@/api/events/constants";
import { deleteEventImageSupabaseQuery, deleteEventSupabaseQuery } from "@/api/events/deleteEvent/query";
import { EVENT_IMAGE_QUERY_KEY } from "@/api/images/constants";
import { invalidateQueriesSimultaneously } from "@/api/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteEventMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (eventId: string): Promise<boolean> => {
			const result = await deleteEventSupabaseQuery(eventId);

			if (result.error) {
				throw new Error(`Error in deleting event mutation: ${result.error.message}`);
			}

			const imageDeletionResult = await deleteEventImageSupabaseQuery(eventId);

			if (imageDeletionResult.error) {
				throw new Error(`Error in deleting event mutation: deleting event image with message ${imageDeletionResult.error.message}`);
			}

			return result.error === null;
		},
		onSuccess: async () => {
			await invalidateQueriesSimultaneously([EVENTS_QUERY_KEY, EVENT_IMAGE_QUERY_KEY], queryClient);
		},
		mutationKey: [DELETE_EVENT_MUTATION_KEY],
	});
};

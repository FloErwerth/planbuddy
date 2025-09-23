import { EVENTS_QUERY_KEY, UPDATE_EVENT_MUTATION_KEY } from "@/api/events/constants";
import { AppEvent } from "@/api/events/types";
import { updateEventSupabaseQuery } from "@/api/events/updateEvent/query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateEventMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (updatedEventFields: Partial<AppEvent>): Promise<boolean> => {
			const result = await updateEventSupabaseQuery(updatedEventFields);

			if (result.error) {
				throw new Error(`Error in updating event mutation: ${result.error.message}`);
			}

			return result.error === null;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: [EVENTS_QUERY_KEY] });
		},
		mutationKey: [UPDATE_EVENT_MUTATION_KEY],
	});
};

import { DELETE_PARTICIPANT_MUTATION_KEY, PARTICIPANT_QUERY_KEY } from "@/api/participants/constants";
import { deleteParticipantSupabaseQuery } from "@/api/participants/deleteParticipant/query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteParticipantMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			if (!id) {
				throw new Error("Error in remove participant: participant id was undefined or empty");
			}
			const result = await deleteParticipantSupabaseQuery(id);

			if (result.error) {
				throw new Error(`Error in remove participant: ${result.error.message}`);
			}
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: [PARTICIPANT_QUERY_KEY] });
		},
		mutationKey: [DELETE_PARTICIPANT_MUTATION_KEY],
	});
};

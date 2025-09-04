import { CREATE_PARTICIPANT_MUTATION_KEY, PARTICIPANT_QUERY_KEY } from "@/api/events/constants";
import { Participant } from "@/api/events/types";
import { upsertParticipantSupabaseQuery } from "@/api/participants/createParticipant/query";
import { useGetUser } from "@/store/authentication";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateParticipationMutation = () => {
	const user = useGetUser();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (participant: Participant | Participant[]) => {
			if (user === undefined) {
				return undefined;
			}

			const result = await upsertParticipantSupabaseQuery(participant);

			if (result.error) {
				throw new Error(result.error.message);
			}
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: [PARTICIPANT_QUERY_KEY] });
		},
		mutationKey: [CREATE_PARTICIPANT_MUTATION_KEY],
	});
};

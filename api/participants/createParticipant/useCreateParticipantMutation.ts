import { CREATE_PARTICIPANT_MUTATION_KEY, PARTICIPANT_QUERY_KEY } from "@/api/participants/constants";
import { upsertParticipantSupabaseQuery } from "@/api/participants/createParticipant/query";
import type { Participant } from "@/api/participants/types";
import { useGetUser } from "@/store/authentication";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateParticipationMutation = () => {
	const user = useGetUser();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (participant: Partial<Participant> | Partial<Participant>[]) => {
			if (user === undefined) {
				return undefined;
			}

			await upsertParticipantSupabaseQuery(participant);
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: [PARTICIPANT_QUERY_KEY] });
		},
		mutationKey: [CREATE_PARTICIPANT_MUTATION_KEY],
	});
};

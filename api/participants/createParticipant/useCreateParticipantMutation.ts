import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CREATE_PARTICIPANT_MUTATION_KEY, PARTICIPANT_QUERY_KEY } from "@/api/participants/constants";
import { upsertParticipantSupabaseQuery } from "@/api/participants/createParticipant/query";
import type { Participant } from "@/api/participants/types";
import { useAuthenticationContext } from "@/providers/AuthenticationProvider";

export const useCreateParticipationMutation = () => {
	const { user } = useAuthenticationContext();
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

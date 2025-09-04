import { EVENTS_QUERY_KEY, PARTICIPANT_QUERY_KEY, UPDATE_PARTICIPANT_MUTATION_KEY } from "@/api/events/constants";
import { Participant } from "@/api/events/types";
import { isParticipantWithIdAndUserId } from "@/api/participants/util";
import { supabase } from "@/api/supabase";
import { invalidateQueriesSimultaneously } from "@/api/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateParticipationMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (participant: Participant) => {
			if (!isParticipantWithIdAndUserId(participant)) {
				throw new Error("Error in useUpdateParticipantMutation: Participant was without id or user id.");
			}

			const result = await supabase.from("participants").update(participant).eq("id", participant.id).select();

			if (result.error) {
				throw new Error(`Error in update participant mutation: ${result.error.message}`);
			}
		},
		onSuccess: async () => {
			await invalidateQueriesSimultaneously([PARTICIPANT_QUERY_KEY, EVENTS_QUERY_KEY], queryClient);
		},
		mutationKey: [UPDATE_PARTICIPANT_MUTATION_KEY],
	});
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/api/supabase";
import { Participant, ParticipantRoleEnum } from "./types";
import { useGetUser } from "@/store/authentication";
import {
	CREATE_PARTICIPANT_MUTATION_KEY,
	DELETE_PARTICIPANT_MUTATION_KEY,
	EVENTS_QUERY_KEY,
	PARTICIPANT_QUERY_KEY,
	UPDATE_PARTICIPANT_MUTATION_KEY,
} from "@/api/events/constants";
import { ParticipantStatusEnum } from "@/api/types";

type ParticipantMutationArgs = Pick<Participant, "userId" | "eventId">;
export const useCreateParticipationMutation = () => {
	const user = useGetUser();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (participant: ParticipantMutationArgs | ParticipantMutationArgs[]) => {
			if (user === undefined) {
				return undefined;
			}

			const result = await supabase.from("participants").upsert(
				Array.isArray(participant)
					? participant.map((singleParticipant) => ({
							...singleParticipant,
							role: ParticipantRoleEnum.GUEST,
							status: ParticipantStatusEnum.PENDING,
						}))
					: {
							...participant,
							role: ParticipantRoleEnum.GUEST,
							status: ParticipantStatusEnum.PENDING,
						},
				{ ignoreDuplicates: true }
			);

			if (result.error) {
				throw new Error(result.error.message);
			}
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries([PARTICIPANT_QUERY_KEY]);
		},
		mutationKey: [CREATE_PARTICIPANT_MUTATION_KEY],
	});
};

type ParticipantUpdateMutationArgs = {
	id: string;
	participant: Partial<Omit<Participant, "id">>;
};
export const useUpdateParticipationMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id, participant }: ParticipantUpdateMutationArgs) => {
			const result = await supabase.from("participants").update(participant).eq("id", id).select();

			if (result.error) {
				throw new Error(`Error in update participant mutation: ${result.error.message}`);
			}
		},
		onSuccess: async () => {
			await Promise.all([await queryClient.invalidateQueries([PARTICIPANT_QUERY_KEY]), await queryClient.invalidateQueries([EVENTS_QUERY_KEY])]);
		},
		mutationKey: [UPDATE_PARTICIPANT_MUTATION_KEY],
	});
};

export const useDeleteParticipantMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			if (!id) {
				throw new Error(`Error in remove participant: participant id was undefined or empty`);
			}
			const result = await supabase.from("participants").delete().eq("id", id).select();

			if (result.error) {
				throw new Error(`Error in remove participant: ${result.error.message}`);
			}
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries([PARTICIPANT_QUERY_KEY]);
		},
		mutationKey: [DELETE_PARTICIPANT_MUTATION_KEY],
	});
};

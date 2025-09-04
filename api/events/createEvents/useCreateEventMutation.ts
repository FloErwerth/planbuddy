import { EVENTS_QUERY_KEY, CREATE_EVENT_MUTATION_KEY } from "@/api/events/constants";
import { createEventSupabaseQuery } from "@/api/events/createEvents/query";
import { AppEvent, Participant, ParticipantRoleEnum } from "@/api/events/types";
import { supabase } from "@/api/supabase";
import { ParticipantStatusEnum } from "@/api/types";
import { useGetUser } from "@/store/authentication";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type CreateEventMutationArgs = { event: AppEvent };

export const useCreateEventMutation = () => {
	const user = useGetUser();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ event }: CreateEventMutationArgs): Promise<AppEvent | undefined> => {
			const queryResult = await createEventSupabaseQuery(event, user.id);

			if (queryResult.error) {
				throw new Error(`Error in useCreateEventMutation: ${queryResult.error.message}`);
			}

			const insertedUsers: Participant[] = [
				{
					userId: user.id,
					eventId: queryResult.data.id,
					role: ParticipantRoleEnum.CREATOR,
					status: ParticipantStatusEnum.ACCEPTED,
				},
			];

			const participantResult = await supabase.from("participants").insert(insertedUsers);

			if (participantResult.error) {
				throw new Error(participantResult.error.message);
			}

			return queryResult.data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: [EVENTS_QUERY_KEY] });
		},
		mutationKey: [CREATE_EVENT_MUTATION_KEY],
	});
};

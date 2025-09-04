import { createEventSupabaseQuery } from "@/api/events/createEvents/query";
import { EVENTS_QUERY_KEY, CREATE_EVENT_MUTATION_KEY } from "@/api/events/constants";
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
			const createdEvent = queryResult.data;

			if (createdEvent === null) {
				throw new Error("Error in useCreateEventMutation: Data is null.");
			}

			const insertedUsers: Participant[] = [
				{
					userId: user.id,
					eventId: createdEvent.id,
					role: ParticipantRoleEnum.CREATOR,
					status: ParticipantStatusEnum.ACCEPTED,
				},
			];

			const participantResult = await supabase.from("participants").insert(insertedUsers);

			if (participantResult.error) {
				throw new Error(participantResult.error.message);
			}

			return createdEvent;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: [EVENTS_QUERY_KEY] });
		},
		mutationKey: [CREATE_EVENT_MUTATION_KEY],
	});
};

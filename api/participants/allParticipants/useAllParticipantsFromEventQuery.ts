import { allParticipantsFromEventSupabaseQuery } from "@/api/participants/allParticipants";
import { PARTICIPANT_QUERY_KEY } from "@/api/participants/constants";
import { eventFromParticipantsSchema } from "@/api/participants/types";
import { useQuery } from "@tanstack/react-query";

export const useAllParticipantsFromEventQuery = (eventId: string) => {
	return useQuery({
		queryFn: async () => {
			const result = await allParticipantsFromEventSupabaseQuery(eventId);

			return eventFromParticipantsSchema.parse(result.data);
		},
		queryKey: [PARTICIPANT_QUERY_KEY, eventId],
	});
};

import { useQuery } from "@tanstack/react-query";
import { allParticipantsFromEventSupabaseQuery } from "@/api/participants/allParticipants/query";

import { PARTICIPANT_QUERY_KEY } from "@/api/participants/constants";
import { eventFromParticipantsSchema } from "@/api/participants/types";

export const useAllParticipantsFromEventQuery = (eventId: string) => {
	return useQuery({
		queryFn: async () => {
			const result = await allParticipantsFromEventSupabaseQuery(eventId);

			return eventFromParticipantsSchema.parse(result.data);
		},
		queryKey: [PARTICIPANT_QUERY_KEY, eventId],
	});
};

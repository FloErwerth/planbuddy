import { PARTICIPANT_QUERY_KEY } from "@/api/participants/constants";
import { searchParticipantsByNameStatusSupabaseQuery } from "@/api/participants/searchParticipantsByNameStatus/query";
import { searchParticipantsByStatusNameSchema } from "@/api/participants/searchParticipantsByNameStatus/types";
import { ParticipantStatus } from "@/api/participants/types";
import { useQuery } from "@tanstack/react-query";

export const useSearchParticipantsByStatus = (eventId?: string, filters: ParticipantStatus[] = [], search = "") => {
	return useQuery({
		queryFn: async () => {
			if (!eventId) {
				return [];
			}

			const result = await searchParticipantsByNameStatusSupabaseQuery(eventId, search, filters);
			const parsedResult = searchParticipantsByStatusNameSchema.safeParse(result);

			if (parsedResult.error) {
				throw new Error(`Error in useSearchParticipantsByStatusName: ${parsedResult.error.message}`);
			}

			return parsedResult.data;
		},
		queryKey: [PARTICIPANT_QUERY_KEY, eventId, filters, search],
	});
};

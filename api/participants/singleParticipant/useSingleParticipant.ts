import { EVENTS_QUERY_KEY } from "@/api/events/constants";
import { singleParticipantSupabaseQuery } from "@/api/participants/singleParticipant/query";
import { singleParticipantSchema } from "@/api/participants/singleParticipant/types";
import { useQuery } from "@tanstack/react-query";

export const useSingleParticipantQuery = (eventId: string, userId: string) => {
	return useQuery({
		queryFn: async () => {
			const result = await singleParticipantSupabaseQuery(eventId, userId);

			const parsedEvent = singleParticipantSchema.safeParse(result.data);

			if (parsedEvent.error) {
				throw new Error(`Error in useSingleEventQuery: ${parsedEvent.error.message}`);
			}
			return parsedEvent.data;
		},

		queryKey: [EVENTS_QUERY_KEY, eventId],
	});
};

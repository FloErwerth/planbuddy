import { EVENTS_QUERY_KEY } from "@/api/events/constants";
import { eventSupabaseQuery } from "@/api/events/event/query";
import { appEventSchema } from "@/api/events/types";
import { useQuery } from "@tanstack/react-query";

export const useEventQuery = (eventId: string) => {
	return useQuery({
		queryFn: async () => {
			const event = await eventSupabaseQuery(eventId);

			const parsedEvent = appEventSchema.safeParse(event.data);

			if (parsedEvent.error) {
				throw new Error(`Error in useEventQuery: ${parsedEvent.error.message}`);
			}

			return parsedEvent.data;
		},
		queryKey: [EVENTS_QUERY_KEY, eventId],
	});
};

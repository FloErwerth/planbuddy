import { EVENTS_QUERY_KEY } from "@/api/events/constants";
import { eventSupabaseQuery } from "@/api/events/event/query";
import { eventSchema } from "@/api/events/types";
import { useGetUser } from "@/store/authentication";
import { useQuery } from "@tanstack/react-query";

export const useEventQuery = (eventId: string) => {
	const user = useGetUser();

	return useQuery({
		queryFn: async () => {
			const result = await eventSupabaseQuery(eventId, user.id);

			if (result.error) {
				throw new Error(`Error in useEventsQuery: ${result.error}`);
			}

			return eventSchema.parse(result.data);
		},
		queryKey: [EVENTS_QUERY_KEY, user.id],
	});
};

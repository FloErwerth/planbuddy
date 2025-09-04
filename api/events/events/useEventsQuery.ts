import { EVENTS_QUERY_KEY } from "@/api/events/constants";
import { eventsSupabaseQuery } from "@/api/events/events/query";
import { eventsSchema } from "@/api/events/events/schema";
import { useGetUser } from "@/store/authentication";
import { useQuery } from "@tanstack/react-query";

export const useEventsQuery = () => {
	const user = useGetUser();

	return useQuery({
		queryFn: async () => {
			if (!user) {
				return [];
			}
			const result = await eventsSupabaseQuery(user.id);

			if (result.error) {
				throw new Error(`Error in useEventsQuery: ${result.error}`);
			}

			return eventsSchema.parse(result);
		},
		queryKey: [EVENTS_QUERY_KEY, user.id],
	});
};

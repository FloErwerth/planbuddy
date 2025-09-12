import { EVENTS_QUERY_KEY } from "@/api/events/constants";
import { allEventsSupabaseQuery } from "@/api/events/allEvents/query";
import { eventsSchema } from "@/api/events/allEvents/types";
import { useGetUser } from "@/store/authentication";
import { useQuery } from "@tanstack/react-query";

export const useAllEventsQuery = () => {
	const user = useGetUser();

	return useQuery({
		queryFn: async () => {
			if (!user) {
				return [];
			}
			const result = await allEventsSupabaseQuery(user.id);

			if (result.error) {
				throw new Error(`Error in useEventsQuery: ${result.error}`);
			}

			return eventsSchema.parse(result);
		},
		queryKey: [EVENTS_QUERY_KEY, user.id],
	});
};

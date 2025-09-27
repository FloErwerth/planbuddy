import { EVENTS_QUERY_KEY } from "@/api/events/constants";
import { allEventsSupabaseQuery } from "@/api/events/allEvents/query";
import { useGetUser } from "@/store/authentication";
import { useQuery } from "@tanstack/react-query";
import { allEventsSchema } from "@/api/events/allEvents/types";

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

			const parseResult = allEventsSchema.safeParse(result.data);

			if (parseResult.error) {
				throw new Error(`Error in useEventsQuery: ${parseResult.error}`);
			}

			return parseResult.data;
		},
		queryKey: [EVENTS_QUERY_KEY, user.id],
	});
};

import { EVENTS_QUERY_KEY, PARTICIPANT_QUERY_KEY } from "@/api/events/constants";
import { appEventSchema, backendEventSchema, AppEvent, Participant, ParticipantQueryResponse } from "@/api/events/types";
import { supabase } from "@/api/supabase";
import { ParticipantStatus, StatusEnum } from "@/api/types";
import { useGetUser } from "@/store/authentication";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";

export const useEventsQuery = () => {
	const user = useGetUser();

	return useQuery({
		queryFn: async () => {
			if (!user) {
				return [];
			}
			const result = await supabase.from("participants").select(`role,status,events(*)`).eq("userId", user?.id).throwOnError();

			return result.data?.map((data) => ({
				...backendEventSchema.parse(data.events),
				role: data.role,
				status: data.status,
			}));
		},
		queryKey: [EVENTS_QUERY_KEY, user?.id],
	});
};

type SingleQueryResponse = {
	events: AppEvent;
	role: Participant["role"];
	status: Participant["status"];
	numberOfParticipants?: number;
};

export const useParticipantsQuery = (eventId?: string, filters: ParticipantStatus[] = [], search = "") => {
	return useQuery({
		queryFn: async (): Promise<ParticipantQueryResponse[]> => {
			if (!eventId) {
				return [];
			}

			const participantsAndUsersQuery = supabase.from("participants").select("*, users(*)");

			if (search) {
				participantsAndUsersQuery.or(`email.ilike.%${search}%, "firstName".ilike.%${search}%, "lastName".ilike.%${search}%`, { foreignTable: "users" });
			}

			for (let i = 0; i < filters.length; ++i) {
				participantsAndUsersQuery.eq("status", filters[i]);
			}

			participantsAndUsersQuery.eq("eventId", eventId);

			participantsAndUsersQuery.throwOnError();
			const result = await participantsAndUsersQuery;

			return (result.data ?? [])
				?.filter((data) => data.users !== null)
				.map(
					(data) =>
						({
							id: data.id,
							userId: data.users.id,
							role: data.role,
							status: data.status,
							eventId,
							email: data.users.email,
							lastName: data.users.lastName,
							firstName: data.users.firstName,
							pushToken: data.users.pushToken,
							pushChannels: data.users.pushChannels,
						}) satisfies ParticipantQueryResponse
				);
		},
		queryKey: [PARTICIPANT_QUERY_KEY, eventId, filters, search],
	});
};

export const useSingleEventQuery = (eventId: string) => {
	const user = useGetUser();

	return useQuery({
		queryFn: async () => {
			if (!eventId || !user) {
				return undefined;
			}

			const result: PostgrestSingleResponse<SingleQueryResponse> = await supabase
				.from("participants")
				.select(`role, status, events(*)`)
				.eq("events.id", eventId)
				.eq("userId", user.id)
				.filter("events", "not.is", "null")
				.single();

			const participants: PostgrestSingleResponse<Participant[]> = await supabase.from("participants").select(`eventId, role, status`).eq("eventId", eventId);

			if (result.error) {
				throw result.error;
			}

			if (!result.data?.events) {
				return undefined;
			}

			const parsedEvent = appEventSchema.parse(result.data?.events);

			return {
				...parsedEvent,
				participants: {
					accepted: participants.data?.filter((participant) => participant.status === StatusEnum.ACCEPTED).length,
					total: participants.data?.length,
					role: result.data.role,
					status: result.data.status,
				},
			};
		},
		queryKey: [EVENTS_QUERY_KEY, eventId],
	});
};

import { ParticipantStatus } from "@/api/participants/types";
import { supabase } from "@/api/supabase";

export const searchParticipantsByNameStatusSupabaseQuery = async (eventId: string, search: string, filters: ParticipantStatus[]) => {
	const participantsAndUsersQuery = supabase.from("participants").select("*, users(*)");

	if (search) {
		participantsAndUsersQuery.or(`email.ilike.%${search}%, "firstName".ilike.%${search}%, "lastName".ilike.%${search}%`, { foreignTable: "users" });
	}

	for (let i = 0; i < filters.length; ++i) {
		participantsAndUsersQuery.eq("status", filters[i]);
	}

	participantsAndUsersQuery.eq("eventId", eventId);

	participantsAndUsersQuery.throwOnError();

	return await participantsAndUsersQuery;
};

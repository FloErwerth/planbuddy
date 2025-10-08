import { supabase } from "@/api/supabase";

export const singleParticipantSupabaseQuery = async (eventId: string, userId: string) => {
	return await supabase
		.from("participants")
		.select("*, events(*)")
		.eq("events.id", eventId)
		.eq("userId", userId)
		.filter("events", "not.is", "null")
		.throwOnError()
		.single();
};

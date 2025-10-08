import { supabase } from "@/api/supabase";

export const allParticipantsFromEventSupabaseQuery = async (eventId: string) => {
	return await supabase.from("participants").select("*, users(*)").eq("eventId", eventId).throwOnError();
};
export const allParticipantsSupabaseQuery = async () => {
	return await supabase.from("participants").select("*").throwOnError();
};

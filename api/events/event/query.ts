import { supabase } from "@/api/supabase";

export const eventSupabaseQuery = async (eventId: string, userId: string) => {
	return await supabase.from("participants").select(`*,events(*)`).eq("userId", userId).eq("eventId", eventId).throwOnError();
};

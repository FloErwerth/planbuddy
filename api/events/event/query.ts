import { supabase } from "@/api/supabase";

export const eventSupabaseQuery = async (eventId: string) => {
	return await supabase.from("event").select(`*`).eq("id", eventId).throwOnError();
};

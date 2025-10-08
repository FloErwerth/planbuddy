import { supabase } from "@/api/supabase";

export const eventSupabaseQuery = async (eventId: string) => {
	return await supabase.from("events").select("*").eq("id", eventId).single().throwOnError();
};

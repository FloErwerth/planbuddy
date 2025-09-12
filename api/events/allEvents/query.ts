import { supabase } from "@/api/supabase";

export const allEventsSupabaseQuery = async (userId: string) => {
	return await supabase.from("participants").select(`*,events(*)`).eq("userId", userId).throwOnError();
};

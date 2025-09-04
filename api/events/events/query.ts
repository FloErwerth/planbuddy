import { supabase } from "@/api/supabase";

export const eventsSupabaseQuery = async (userId: string) => {
	return await supabase.from("participants").select(`role,status,events(*)`).eq("userId", userId).throwOnError();
};

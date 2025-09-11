import { supabase } from "@/api/supabase";

export const getUserSupabaseQuery = async (userId: string) => {
	return await supabase.from("users").select().eq("id", userId);
};

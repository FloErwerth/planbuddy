import { supabase } from "@/api/supabase";

export const deleteUserSupabaseQuery = async (userId: string) => {
	return await supabase.from("users").delete().eq("id", userId).select().single();
};

import { supabase } from "@/api/supabase";

export const removeFriendSupabaseQuery = async (friendId?: string) => {
	return await supabase.from("friends").delete().eq("id", friendId).throwOnError().select();
};

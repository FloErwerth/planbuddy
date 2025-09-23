import { BaseFriend } from "@/api/friends/types";
import { supabase } from "@/api/supabase";

export const updateFriendSupabaseQuery = async (updatedFriend: Partial<BaseFriend>) => {
	return await supabase.from("friends").update(updatedFriend).eq("id", updatedFriend.id).throwOnError().select();
};

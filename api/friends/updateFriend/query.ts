import { BaseFriend } from "@/api/friends/types";
import { supabase } from "@/api/supabase";

export const updateFriendSupabaseQuery = async (updatedFriend: BaseFriend) => {
	return await supabase.from("friends").update(updatedFriend).eq("id", updatedFriend.id).throwOnError().select();
};

import { SimpleFriend } from "@/api/friends/types";
import { supabase } from "@/api/supabase";

export const updateFriendSupabaseQuery = async (updatedFriend: SimpleFriend) => {
	return await supabase.from("friends").update(updatedFriend).eq("id", updatedFriend.id).throwOnError().select();
};

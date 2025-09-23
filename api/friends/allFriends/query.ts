import { supabase } from "@/api/supabase";

export const allFriendsSupabaseQuery = async (userId: string) => {
	return await supabase
		.from("friends")
		.select("*,requesterId(id,*),receiverId(id,*)")
		.or(`requesterId.eq.${userId},receiverId.eq.${userId}`)
		.throwOnError()
		.select();
};

import { supabase } from "@/api/supabase";

export const getFriendSupabaseQuery = async (friendId: string, userId: string) => {
	return await supabase
		.from("friends")
		.select("*,requesterId(id,*),receiverId(id,*)")
		.or(`requesterId.eq.${friendId},receiverId.eq.${friendId}`)
		.neq("requesterId.id", userId)
		.neq("receiverId.id", userId)
		.single();
};

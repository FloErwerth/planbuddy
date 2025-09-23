import { FriendRequestStatusEnum } from "@/api/friends/types";
import { supabase } from "@/api/supabase";

export const addFriendSupabaseQuery = async (userId: string, friendId: string) => {
	return await supabase
		.from("friends")
		.insert([
			{
				requesterId: userId,
				receiverId: friendId,
				status: FriendRequestStatusEnum.PENDING,
			},
		])
		.select();
};

import { QueryOptions, useQuery, UseQueryResult } from "@tanstack/react-query";
import { FRIENDS_QUERY_KEY } from "@/api/friends/constants";
import { supabase } from "@/api/supabase";
import { ParticipantStatus, User } from "@/api/types";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { SingleFriendQueryResponse, singleFriendSchema } from "@/api/friends/schema";
import { useGetUser } from "@/store/authentication";

type FriendDatabaseType = {
	id: string;
	acceptedAt: string;
	sendAt: string;
	fromUserId: User;
	toUserId: User;
	status: ParticipantStatus;
};

export const useDatabaseFriendQuery = (friendId?: string, options: QueryOptions = {}): UseQueryResult<SingleFriendQueryResponse | undefined> => {
	const user = useGetUser();

	return useQuery({
		queryFn: async () => {
			if (!user || !friendId) {
				return undefined;
			}

			const friend: PostgrestSingleResponse<FriendDatabaseType> = await supabase
				.from("friends")
				.select("id,requesterId(id,*),receiverId(id,*),status")
				.or(`requesterId.eq.${friendId},receiverId.eq.${friendId}`)
				.neq("requesterId.id", user.id)
				.neq("receiverId.id", user.id)
				.single();

			const data = friend.data;
			if (!data) {
				return undefined;
			}

			// user sent the request
			if (friend.data.fromUserId !== null) {
				return singleFriendSchema.parse({
					...data,
					firstName: data.toUserId.firstName,
					lastName: data.toUserId.lastName,
					email: data.toUserId.email,
					receiverId: user.id!,
					requesterId: data.fromUserId.id!,
				});
			}

			// user received the request
			if (friend.data.toUserId !== null) {
				return singleFriendSchema.parse({
					...data,
					firstName: data.toUserId.firstName,
					lastName: data.toUserId.lastName,
					email: data.toUserId.email,
					receiverId: data.toUserId.id!,
					requesterId: user.id!,
				});
			}

			return undefined;
		},
		queryKey: [FRIENDS_QUERY_KEY, user?.id, friendId],
		...options,
	});
};

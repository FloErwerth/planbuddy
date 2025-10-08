import { userSchema } from "@/api/user/types";
import z, { array, object, string } from "zod";

export type FriendsQueryResponse = z.infer<typeof friendsQuerySchema>;
export type SingleFriendQueryResponse = z.infer<typeof friendSchema>;

export const FriendRequestStatusEnum = { ACCEPTED: "ACCEPTED", PENDING: "PENDING", DECLINED: "DECLINED" } as const;
export const friendRequestStatusZodEnum = z.enum([FriendRequestStatusEnum.ACCEPTED, FriendRequestStatusEnum.PENDING, FriendRequestStatusEnum.DECLINED]);
export type FriendRequestStatus = (typeof FriendRequestStatusEnum)[keyof typeof FriendRequestStatusEnum];

const baseFriendSchema = object({
	id: string(),
	acceptedAt: string().nullable(),
	status: friendRequestStatusZodEnum,
	sendAt: string(),
});

export const friendSchema = baseFriendSchema.and(
	userSchema.transform((user) => {
		const userId = user.id;

		return { userId: user.id, ...user };
	}),
);

export const friendsQuerySchema = baseFriendSchema.and(
	object({
		requesterId: userSchema.nullable(),
		receiverId: userSchema.nullable(),
	}),
);

export const allFriendsQueryResponseSchema = array(friendsQuerySchema);

export type FriendsQueryResponseSchema = z.infer<typeof friendsQuerySchema>;
export type AllFriendsQueryResponseSchema = Array<FriendsQueryResponseSchema>;

export type BaseFriend = z.infer<typeof baseFriendSchema>;
export type Friend = z.infer<typeof friendSchema>;

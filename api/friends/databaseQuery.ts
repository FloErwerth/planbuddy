import { ParticipantStatus, User } from "@/api/types";

type FriendDatabaseType = {
	id: string;
	acceptedAt: string;
	sendAt: string;
	fromUserId: User;
	toUserId: User;
	status: ParticipantStatus;
};

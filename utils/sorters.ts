import { ParticipantStatus, StatusEnum } from "@/api/types";
import { SingleFriendQueryResponse } from "@/api/friends/schema";

export const sortFriendsToTop = (a: { status?: ParticipantStatus }, b: { status?: ParticipantStatus }) => {
	if (a.status === StatusEnum.ACCEPTED && b.status === StatusEnum.ACCEPTED) {
		return 0;
	}
	if (a.status === StatusEnum.ACCEPTED && b.status !== StatusEnum.ACCEPTED) {
		return -1;
	}
	return 1;
};

export const sortRelationshipToTop = (a: { status?: ParticipantStatus }, b: { status?: ParticipantStatus }) => {
	if (a.status !== undefined && b.status !== undefined) {
		return sortFriendsToTop(a, b);
	}
	if (a.status !== undefined && b.status === undefined) {
		return -1;
	}
	return 1;
};

export const sortByFirstName = (a: SingleFriendQueryResponse, b: SingleFriendQueryResponse) => {
	if (a.firstName && b.firstName) {
		return a.firstName?.localeCompare(b.firstName);
	}
	return 0;
};

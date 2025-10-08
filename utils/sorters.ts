import type { Friend } from "@/api/friends/types";
import { type ParticipantStatus, ParticipantStatusEnum } from "@/api/participants/types";

export const sortFriendsToTop = (a: { status?: ParticipantStatus }, b: { status?: ParticipantStatus }) => {
	if (a.status === ParticipantStatusEnum.ACCEPTED && b.status === ParticipantStatusEnum.ACCEPTED) {
		return 0;
	}
	if (a.status === ParticipantStatusEnum.ACCEPTED && b.status !== ParticipantStatusEnum.ACCEPTED) {
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

export const sortByFirstName = (a: Friend, b: Friend) => {
	if (a.firstName && b.firstName) {
		return a.firstName?.localeCompare(b.firstName);
	}
	return 0;
};

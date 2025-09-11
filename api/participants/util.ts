import { Participant, ParticipantRoleEnum, ParticipantStatusEnum } from "@/api/types";

/**
 * Defaults:
 * * ROLE: GUEST
 * * STATUS: PENDING
 */
export const getDefaultParticipant = (participant: Required<Participant>): Participant => {
	return {
		...participant,
		role: ParticipantRoleEnum.GUEST,
		status: ParticipantStatusEnum.PENDING,
	};
};

export const isParticipantWithIdAndUserId = (participant: Participant): participant is Required<Participant> => {
	return participant.id !== undefined && participant.userId !== undefined;
};

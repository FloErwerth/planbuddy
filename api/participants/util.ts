import { type Participant, ParticipantRoleEnum, ParticipantStatusEnum } from "@/api/participants/types";

/**
 * Defaults:
 * * ROLE: GUEST
 * * STATUS: PENDING
 */
export const getDefaultParticipant = (participant: Partial<Participant>): Partial<Participant> => {
	return {
		...participant,
		role: ParticipantRoleEnum.GUEST,
		status: ParticipantStatusEnum.PENDING,
	};
};

export const isParticipantWithIdAndUserId = (participant: Partial<Participant>): participant is Required<Participant> => {
	return participant.id !== undefined && participant.userId !== undefined;
};

import { Participant, ParticipantRoleEnum } from "@/api/events/types";
import { ParticipantStatusEnum } from "@/api/types";

/**
 * Defaults:
 * * ROLE: GUEST
 * * STATUS: PENDING
 */
export const getDefaultParticipant = (participant: Omit<Partial<Participant>, "id" | "userId"> & Required<Pick<Participant, "id" | "userId">>): Participant => {
	return {
		role: ParticipantRoleEnum.GUEST,
		status: ParticipantStatusEnum.PENDING,
		...participant,
	};
};

export const isParticipantWithIdAndUserId = (participant: Participant): participant is Required<Participant> => {
	return participant.id !== undefined && participant.userId !== undefined;
};

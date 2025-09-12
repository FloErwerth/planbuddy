import { participantSchema } from "@/api/participants/types";
import { userSchema } from "@/api/user/types";
import z from "zod";

export const singleParticipantSchema = participantSchema.and(z.object({ users: userSchema.omit({ id: true }) })).transform((participant) => ({
	id: participant.id,
	userId: participant.userId,
	eventId: participant.eventId,
	role: participant.role,
	status: participant.status,
	email: participant.users.email,
	firstName: participant.users.firstName,
	lastName: participant.users.lastName,
	pushToken: participant.users.pushToken,
	pushChannels: participant.users.pushChannels,
}));

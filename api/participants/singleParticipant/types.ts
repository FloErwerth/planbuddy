import { participantSchema, userSchema } from "@/api/types";
import z from "zod";

export const singleParticipantSchema = z
	.object({ data: participantSchema.and(z.object({ users: userSchema.omit({ id: true }) })) })
	.transform(({ data: participant }) => ({
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

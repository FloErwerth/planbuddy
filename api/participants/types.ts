import { userSchema } from "@/api/user/types";
import z from "zod";

export const ParticipantRoleEnum = { GUEST: "GUEST", ADMIN: "ADMIN", CREATOR: "CREATOR" } as const;
export const participantRoleZodEnum = z.enum([ParticipantRoleEnum.GUEST, ParticipantRoleEnum.ADMIN, ParticipantRoleEnum.CREATOR]);
export const ParticipantStatusEnum = { ACCEPTED: "ACCEPTED", PENDING: "PENDING", DECLINED: "DECLINED" } as const;
export const participantStatusZodEnum = z.enum([ParticipantStatusEnum.ACCEPTED, ParticipantStatusEnum.PENDING, ParticipantStatusEnum.DECLINED]);

export const participantSchema = z.object({
	id: z.string(),
	userId: z.string(),
	eventId: z.string(),
	role: z.enum([ParticipantRoleEnum.GUEST, ParticipantRoleEnum.CREATOR, ParticipantRoleEnum.ADMIN]),
	status: z.enum([ParticipantStatusEnum.ACCEPTED, ParticipantStatusEnum.PENDING, ParticipantStatusEnum.DECLINED]),
});

/**
 * Schema that represents an event got as foreign key by participants
 */
export const eventFromParticipantsSchema = z
	.object({
		data: z.array(participantSchema.and(z.object({ users: userSchema.omit({ id: true }) }))),
	})
	.transform(({ data }) =>
		data.map((participant) => ({
			id: participant.id,
			eventId: participant.eventId,
			role: participant.role,
			status: participant.status,
			email: participant.users.email,
			firstName: participant.users.firstName,
			lastName: participant.users.lastName,
			pushToken: participant.users.pushToken,
			pushChannels: participant.users.pushChannels,
		}))
	);

export type ParticipantRole = (typeof ParticipantRoleEnum)[keyof typeof ParticipantRoleEnum];
export type ParticipantStatus = (typeof ParticipantStatusEnum)[keyof typeof ParticipantStatusEnum];
export type Participant = z.infer<typeof participantSchema>;

import { zodNullToUndefined } from "@/utils/zodNullToUndefined";
import { z } from "zod";

export const appEventSchema = z.object({
	id: z.string(),
	creatorId: zodNullToUndefined(z.string().nullable()),
	createdAt: z.string(),
	name: z.string(),
	description: zodNullToUndefined(z.string().nullable()),
	location: z.string(),
	link: zodNullToUndefined(z.string().url().nullable()),
	startTime: z.string(),
	endTime: z.string(),
});

export const ParticipantRoleEnum = { GUEST: "GUEST", ADMIN: "ADMIN", CREATOR: "CREATOR" } as const;
export type ParticipantRole = (typeof ParticipantRoleEnum)[keyof typeof ParticipantRoleEnum];

export const ParticipantStatusEnum = { ACCEPTED: "ACCEPTED", PENDING: "PENDING", DECLINED: "DECLINED" } as const;
export type ParticipantStatus = (typeof ParticipantStatusEnum)[keyof typeof ParticipantStatusEnum];

export const participantSchema = z.object({
	id: z.string(),
	userId: z.string(),
	eventId: z.string(),
	role: z.enum([ParticipantRoleEnum.GUEST, ParticipantRoleEnum.CREATOR, ParticipantRoleEnum.ADMIN]),
	status: z.enum([ParticipantStatusEnum.ACCEPTED, ParticipantStatusEnum.PENDING, ParticipantStatusEnum.DECLINED]),
});

export type Participant = z.infer<typeof participantSchema>;

export type AppEvent = z.infer<typeof appEventSchema>;

export type ParticipantQueryResponse = Participant & User;

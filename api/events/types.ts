import { ParticipantStatus, User } from "@/api/types";
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

export type Participant = {
	id?: string;
	eventId?: string;
	userId?: string;
	role: ParticipantRole;
	status: ParticipantStatus;
};

export type AppEvent = z.infer<typeof appEventSchema>;

export type ParticipantQueryResponse = Participant & User;

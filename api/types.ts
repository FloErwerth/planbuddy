import { NotificationChannelEnumDefinition } from "@/providers/NotificationsProvider";
import { zodNullToUndefined } from "@/utils/zodNullToUndefined";
import { z } from "zod";

export const FriendRequestStatusEnum = { ACCEPTED: "ACCEPTED", PENDING: "PENDING", DECLINED: "DECLINED" } as const;
export const ParticipantRoleEnum = { GUEST: "GUEST", ADMIN: "ADMIN", CREATOR: "CREATOR" } as const;
export const ParticipantStatusEnum = { ACCEPTED: "ACCEPTED", PENDING: "PENDING", DECLINED: "DECLINED" } as const;
export const participantSchema = z.object({
	id: z.string(),
	userId: z.string(),
	eventId: z.string(),
	role: z.enum([ParticipantRoleEnum.GUEST, ParticipantRoleEnum.CREATOR, ParticipantRoleEnum.ADMIN]),
	status: z.enum([ParticipantStatusEnum.ACCEPTED, ParticipantStatusEnum.PENDING, ParticipantStatusEnum.DECLINED]),
});

export const userSchema = z.object({
	id: z.string().optional(),
	email: z.string().optional(),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	pushToken: z.string().nullable(),
	pushChannels: z.array(NotificationChannelEnumDefinition).nullable().default([]),
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

export const onboardingSchema = z.object({
	firstName: z
		.string({
			message: "Wir brauchen deinen Vornamen zur Anzeige in Events.",
		})
		.optional(),
	lastName: z
		.string({
			message: "Wir brauchen deinen Nachnamen zur Anzeige in Events.",
		})
		.optional(),
});

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

export type FriendRequestStatus = (typeof FriendRequestStatusEnum)[keyof typeof FriendRequestStatusEnum];
export type ParticipantRole = (typeof ParticipantRoleEnum)[keyof typeof ParticipantRoleEnum];
export type ParticipantStatus = (typeof ParticipantStatusEnum)[keyof typeof ParticipantStatusEnum];
export type AppEvent = z.infer<typeof appEventSchema>;
export type User = z.infer<typeof userSchema>;
export type OnboardingSchema = z.infer<typeof onboardingSchema>;
export type Participant = z.infer<typeof participantSchema>;

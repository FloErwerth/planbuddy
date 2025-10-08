import z, { object } from "zod";

export const NotificationChannelEnumDefinition = z.enum(["GUEST_INVITE", "GUEST_UPDATE", "GUEST_START", "HOST_INVITATION_ANSWERED"]);
export const NotificationChannelEnum = NotificationChannelEnumDefinition.Enum;
export type NotificationChannel = z.infer<typeof NotificationChannelEnumDefinition>;

import { zodNullToUndefined } from "@/utils/zodNullToUndefined";

export const userSchema = object({
	id: z.string(),
	createdAt: z.string(),
	email: z.string().email(),
	firstName: zodNullToUndefined(z.string().nullable()),
	lastName: zodNullToUndefined(z.string().nullable()),
	pushToken: zodNullToUndefined(z.string().nullable()),
	pushChannels: z.array(NotificationChannelEnumDefinition).nullable().catch([]),
});

export type User = z.infer<typeof userSchema>;

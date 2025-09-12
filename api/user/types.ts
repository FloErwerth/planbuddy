import { NotificationChannelEnumDefinition } from "@/providers/NotificationsProvider";
import z, { object } from "zod";

export const userSchema = object({
	id: z.string(),
	createdAt: z.string(),
	email: z.string().email(),
	firstName: z.string().nullable(),
	lastName: z.string().nullable(),
	pushToken: z.string().nullable(),
	pushChannels: z.array(NotificationChannelEnumDefinition),
});

export type User = z.infer<typeof userSchema>;

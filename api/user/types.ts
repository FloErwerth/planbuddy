import { NotificationChannelEnumDefinition } from "@/providers/NotificationsProvider";
import { zodNullToUndefined } from "@/utils/zodNullToUndefined";
import z, { object } from "zod";

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

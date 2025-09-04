import { NotificationChannelEnumDefinition } from "@/providers/NotificationsProvider";
import { z } from "zod";

export const userSchema = z.object({
	id: z.string().optional(),
	email: z.string().optional(),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	pushToken: z.string().nullable(),
	pushChannels: z.array(NotificationChannelEnumDefinition).nullable().default([]),
});

export type User = z.infer<typeof userSchema>;

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

export type OnboardingSchema = z.infer<typeof onboardingSchema>;

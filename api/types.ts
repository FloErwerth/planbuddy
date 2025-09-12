import { z } from "zod";

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

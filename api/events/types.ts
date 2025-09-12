import { participantSchema } from "@/api/participants/types";
import { zodNullToUndefined } from "@/utils/zodNullToUndefined";
import z from "zod";

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

export const eventSchema = participantSchema.and(appEventSchema.omit({ id: true }));
export const eventsSchema = z.array(eventSchema);

export type AppEvent = z.infer<typeof appEventSchema>;

import { appEventSchema } from "@/api/events/types";
import { participantSchema } from "@/api/participants/types";
import z from "zod";

export const eventsSchema = z.object({
	data: z.array(participantSchema.and(appEventSchema.omit({ id: true }))),
});

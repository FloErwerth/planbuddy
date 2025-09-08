import { appEventSchema, participantSchema } from "@/api/types";
import z from "zod";

export const eventsSchema = z.object({
	data: z.array(participantSchema.and(appEventSchema.omit({ id: true }))),
});

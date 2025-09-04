import { appEventSchema, participantSchema } from "@/api/events/types";
import z from "zod";

export const eventsSchema = z
	.object({
		data: z.array(z.object({ role: participantSchema.shape.role, status: participantSchema.shape.status }).and(appEventSchema)),
	})
	.passthrough();

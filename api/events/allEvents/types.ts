import { appEventSchema } from "@/api/events/types";
import { participantSchema } from "@/api/participants/types";
import z from "zod";

export const allEventsSchema = z
	.array(participantSchema.and(z.object({ events: appEventSchema })))
	.transform((events) => events.map((event) => ({ ...event, ...event.events })));

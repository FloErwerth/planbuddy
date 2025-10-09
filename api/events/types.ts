import z from "zod";
import { zodNullToUndefined } from "@/utils/zodNullToUndefined";

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

export const eventCreationSchema = appEventSchema.omit({ id: true, createdAt: true });

export const eventsSchema = z.array(appEventSchema);

export type AppEvent = z.infer<typeof appEventSchema>;

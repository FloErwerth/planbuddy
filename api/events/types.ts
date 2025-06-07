import { z } from 'zod';
/*
 * street:houseNr:zip:city
 * */
export type EventLocation = `${string}:${string}:${string}:${string}`;

export const eventSchema = z.object({
  id: z.string().optional(),
  creatorId: z.string().optional(),
  name: z.string(),
  description: z.string().optional(),
  location: z.string().optional(),
  imageToUpload: z.string().optional(),
});

export type Event = z.infer<typeof eventSchema> & { eventTime: string };

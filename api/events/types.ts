import { z } from 'zod';
/*
 * street:houseNr:zip:city
 * */
export type EventLocation = `${string}:${string}:${string}:${string}`;

export const eventSchema = z
  .object({
    id: z.string().optional(),
    creatorId: z.string().optional(),
    name: z.string(),
    description: z.string().optional(),
    location: z.string().optional(),
    imageToUpload: z.string().optional(),
    link: z.string().url().optional(),
  })
  .passthrough();

export type ParticipantRole = 'guest' | 'admin' | 'creator';
export type ParticipantStatus = 'accepted' | 'undecided' | 'declined';
export type Participant = {
  eventId?: string;
  userId?: string;
  role: ParticipantRole;
  status: ParticipantStatus;
};

export type Event = z.infer<typeof eventSchema> & { eventTime: string };

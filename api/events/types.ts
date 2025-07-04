import { z } from 'zod';
import { Status, User } from '@/api/types';
/*
 * street:houseNr:zip:city
 * */
export type EventLocation = `${string}:${string}:${string}:${string}`;

export const backendEventSchema = z.object({
  id: z.string(),
  creatorId: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  location: z.string(),
  locationDescription: z.string().nullable().optional(),
  imageToUpload: z.string().nullable().optional(),
  link: z.string().url().nullable().optional(),
  startTime: z.string(),
  endTime: z.string(),
});

export const appEventSchema = z
  .object({
    id: z.string().optional(),
    creatorId: z.string().optional(),
    name: z.string(),
    description: z.string().optional(),
    location: z.string(),
    locationDescription: z.string().optional(),
    imageToUpload: z.string().optional(),
    link: z.string().url().optional(),
    startTime: z.string(),
    endTime: z.string(),
  })
  .refine(
    (event) => {
      return parseInt(event.endTime) - 15 * 60 * 1000 >= parseInt(event.startTime);
    },
    {
      message: 'Das Ende des Events muss 15 Minuten nach dem Start des Events sein.',
      path: ['endTime'],
    }
  );

export const Role = z.enum(['GUEST', 'ADMIN', 'CREATOR']);
export type RoleType = z.infer<typeof Role>;

export type Participant = {
  id?: string;
  eventId?: string;
  userId?: string;
  role: RoleType;
  status: Status;
};

export type Event = z.infer<typeof appEventSchema>;
export type BackendEvent = z.infer<typeof backendEventSchema>;

export type ParticipantQueryResponse = Participant & User;

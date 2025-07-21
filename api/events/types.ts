import { z } from 'zod';
import { Status, User } from '@/api/types';
import { zodNullToUndefined } from '@/utils/zodNullToUndefined';

export const backendEventSchema = z.object({
    id: z.string(),
    creatorId: z.string(),
    name: z.string(),
    description: z.string().nullable().optional(),
    location: z.string(),
    link: z.string().url().nullable().optional(),
    startTime: z.string(),
    endTime: z.string(),
});

export const appEventSchema = z
    .object({
        id: zodNullToUndefined(z.string().nullable()),
        creatorId: zodNullToUndefined(z.string().nullable()),
        name: z.string(),
        description: zodNullToUndefined(z.string().nullable()),
        location: z.string(),
        link: zodNullToUndefined(z.string().url().nullable()),
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

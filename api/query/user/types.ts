import { z } from 'zod';

export const userDataSchema = z.object({
  id: z.string(),
  email: z.string(),
  eventIds: z.array(z.string()).optional().catch([]),
  firstName: z.string().optional().catch(''),
  lastName: z.string().optional().catch(''),
});

export type UserData = z.infer<typeof userDataSchema>;

import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().optional(),
  email: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  eventIds: z.array(z.string()).optional().catch([]),
  wasOnboarded: z.boolean().default(false),
});

export type User = z.infer<typeof userSchema>;

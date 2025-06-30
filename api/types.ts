import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().optional(),
  email: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const statusSchema = z.enum(['ACCEPTED', 'PENDING', 'DECLINED']);
export const StatusEnum = statusSchema.enum;
export type Status = z.infer<typeof statusSchema>;

export type User = z.infer<typeof userSchema>;

export const onboardingSchema = z.object({
  firstName: z
    .string({ message: 'Wir brauchen deinen Vornamen zur Anzeige in Events.' })
    .optional(),
  lastName: z
    .string({ message: 'Wir brauchen deinen Nachnamen zur Anzeige in Events.' })
    .optional(),
});

export type OnboardingSchema = z.infer<typeof onboardingSchema>;

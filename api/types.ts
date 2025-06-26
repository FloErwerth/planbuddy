import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().optional(),
  email: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  eventIds: z.array(z.string()).optional().catch([]),
});

export type User = z.infer<typeof userSchema>;

export const onboardingSchema = z.object({
  firstName: z
    .string({ message: 'Wir brauchen deinen Vornamen zur Anzeige in Events.' })
    .optional(),
  lastName: z
    .string({ message: 'Wir brauchen deinen Nachnamen zur Anzeige in Events.' })
    .optional(),
  phone: z
    .string()
    .regex(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/)
    .optional(),
});

export type OnboardingSchema = z.infer<typeof onboardingSchema>;

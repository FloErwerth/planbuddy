import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Bitte gib eine gültige E-Mail-Addresse ein.' })
    .email({ message: 'Bitte gib eine gültige E-Mail-Addresse ein.' }),
});
export type LoginSchema = z.infer<typeof loginSchema>;

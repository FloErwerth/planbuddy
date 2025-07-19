import { array, string, z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email({ message: 'Bitte gib eine gültige E-Mail-Addresse ein' }),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const tokenSchema = array(string()).refine((val) => {
    const combined = val.join('');
    const parsedInt = parseInt(combined);
    return val.length === 6 && !Number.isNaN(parsedInt);
});

export type TokenSchema = z.infer<typeof tokenSchema>;

import {z} from "zod";

export const loginSchema = z.object({
    email: z
        .string().min(1, { message: 'Bitte gib eine gültige E-Mail-Addresse ein.'})
        .email({ message: 'Bitte gib eine gültige E-Mail-Addresse ein.' }),
    password: z
        .string({ message: 'Ein Passwort ist für deinen Account notwendig.' })
        .min(5, { message: 'Bitte gib mindestens 5 Zeichen ein.' }),
});
export type LoginSchema = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    email: z
        .string().min(1, { message: 'Bitte gib eine gültige E-Mail-Addresse ein.'})
        .email({ message: 'Bitte gib eine gültige E-Mail-Addresse ein.' }),
    password: z
        .string({ message: 'Ein Passwort ist für deinen Account notwendig.' })
        .min(5, { message: 'Bitte gib mindestens 5 Zeichen ein.' }),
    passwordAgain: z.string({ message: 'Ein Passwort ist für deinen Account notwendig.' }).min(5, { message: 'Bitte gib mindestens 5 Zeichen ein.' }),
}).superRefine(({ passwordAgain, password }, ctx) => {
    if (password !== passwordAgain) {
        ctx.addIssue({
            code: "custom",
            message: "Die Passwörter müssen übereinstimmen.",
            path: ['passwordAgain']
        });
    }
    return password !== passwordAgain
});

export type RegisterSchema = z.infer<typeof registerSchema>;
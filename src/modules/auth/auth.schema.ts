import {z} from 'zod';

export const enrollmentNumberAuthSchema = z.object({
    enrollmentNumber: z.string().length(9)
});

export const studentLoginAuthSchema = z.object({
    email: z.string().email().endsWith("@jnu.ac.in"),
    password: z.string()
});

export const studentSignupAuthSchema = z.object({
    email: z.string().email().endsWith("@jnu.ac.in"),
    password: z.string(),
    enrollmentNumber: z.string().length(9)
});

export const studentMailVerifyAuthSchema = z.object({
    email: z.string().email().endsWith("@jnu.ac.in"),
    enrollmentNumber: z.string().length(9)
});
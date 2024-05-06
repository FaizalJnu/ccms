import {z} from 'zod';

export const enrollmentNumberAuthSchema = z.object({
    enrollmentNumber: z.string().length(9)
});

export const studentLoginAuthSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

export const studentSignupAuthSchema = z.object({
    email: z.string().email(),
    password: z.string(),
    enrollmentNumber: z.string().length(9)
});

export const studentMailVerifyAuthSchema = z.object({
    email: z.string().email(),
    enrollmentNumber: z.string().length(9)
});
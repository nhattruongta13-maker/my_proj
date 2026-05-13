import {z} from 'zod'

export const UserSchema = z.object({
    email: z.email().toLowerCase().trim(),
    password: z.string().trim().min(8).max(100)
})

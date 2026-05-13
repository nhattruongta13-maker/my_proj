import {z} from 'zod'

const UserSchema = z.object({
    email: z.email(),
    password: z.string().trim().min(8).max(100)
})

export type User = z.infer<typeof UserSchema>
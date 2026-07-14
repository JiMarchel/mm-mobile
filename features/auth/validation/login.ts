import z from "zod";

export const loginSchema = z.object({
    email: z.email("Not valid email format."),
    password: z.string().min(8, "Password must at least 8 characters.").max(255, "Password max 255 characters."),
    deviceName: z.string()
})
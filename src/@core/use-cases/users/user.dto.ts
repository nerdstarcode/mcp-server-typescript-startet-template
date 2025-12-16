import { z } from "zod/mini";

export const userSchema = z.object({
    name: z.string(),
    email: z.email(),
    address: z.string(),
    phone: z.string(),
})
export type userSchemaDTO = z.infer<typeof userSchema>;

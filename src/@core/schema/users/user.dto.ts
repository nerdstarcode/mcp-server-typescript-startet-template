import { z } from "zod/mini";

export const userSchema = z.object({
        name: z.string(),
        email: z.string(),
        address: z.string(),
        phone: z.string(),
})
export type userSchemaDTO = z.infer<typeof userSchema>;

export const editUserSchema = z.object({
    id: z.number(),
    name: z.union([z.string(), z.undefined()]),
    email: z.union([z.email(), z.undefined()]),
    address: z.union([z.string(), z.undefined()]),
    phone: z.union([z.string(), z.undefined()]),
});
export type editUserSchemaDTO = z.infer<typeof editUserSchema>;

export const deleteUserSchema = z.object({
    id: z.number(),
});
export type deleteUserSchemaDTO = z.infer<typeof deleteUserSchema>;

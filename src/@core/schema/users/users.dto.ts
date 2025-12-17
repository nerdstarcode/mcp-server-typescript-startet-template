import { z } from "zod";

export const userSchema = z.object({
  name: z.string(),
  email: z.email(),
  address: z.string(),
  phone: z.string(),
})
export type userSchemaDTO = z.infer<typeof userSchema>;

export const editUserSchema = z.object({
  id: z.number(),
  name: z.string().optional,
  email: z.email().optional,
  address: z.string().optional,
  phone: z.string().optional,
});
export type editUserSchemaDTO = z.infer<typeof editUserSchema>;

export const deleteUserSchema = z.object({
  id: z.number(),
});
export type deleteUserSchemaDTO = z.infer<typeof deleteUserSchema>;
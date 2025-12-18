import { z } from "zod";
/**
 * ⚠️ AVISO IMPORTANTE – MCP + ZOD
 *
 * Este schema é usado como `inputSchema` de tools do MCP Server.
 *
 * O MCP depende internamente da propriedade `_def` dos schemas Zod
 * para introspecção, validação e exposição das tools.
 *
 * ❌ NÃO usar `zod/mini`
 *    - `zod/mini` NÃO expõe `_def`
 *    - Isso causa erro em runtime no MCP:
 *      "Cannot read properties of undefined (reading 'def')"
 *
 * ✅ Use sempre:
 *    import { z } from "zod";
 *
 * ❌ Evite:
 *    import { z } from "zod/mini";
 *
 * Também atenção:
 * - Use `z.string().email()` em vez de `z.email()`
 */

export const userSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  email: z.string().email(),
  address: z.string(),
  phone: z.string(),
})
export type userSchemaDTO = z.infer<typeof userSchema>;

export const editUserSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
});
export type editUserSchemaDTO = z.infer<typeof editUserSchema>;

export const deleteUserSchema = z.object({
  id: z.number(),
});
export type deleteUserSchemaDTO = z.infer<typeof deleteUserSchema>;
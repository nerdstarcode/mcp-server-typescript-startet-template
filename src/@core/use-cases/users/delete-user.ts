import fs from "fs";
import path from "path";
import { deleteUserSchema, deleteUserSchemaDTO } from "../../schema/users/user.dto";

interface User extends Record<string, any> {
  id: number;
}

const usersFilePath = path.resolve(__dirname, "../../infrastructure/data/users.json");

export async function deleteUser(input: deleteUserSchemaDTO): Promise<{ id: number }> {
  // 1. Validação com Zod
  const parsed = deleteUserSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(`Invalid data: ${JSON.stringify(parsed.error.issues)}`);
  }

  // 2. Lê usuários existentes
  const fileData = fs.readFileSync(usersFilePath, "utf-8");
  const users: User[] = JSON.parse(fileData);

  // 3. Encontra o index do usuário
  const index = users.findIndex((user) => user.id === parsed.data.id);
  if (index === -1) {
    throw new Error(`User with id ${parsed.data.id} not found`);
  }

  // 4. Remove o usuário
  users.splice(index, 1);

  // 5. Reescreve o arquivo
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

  return { id: parsed.data.id };
}

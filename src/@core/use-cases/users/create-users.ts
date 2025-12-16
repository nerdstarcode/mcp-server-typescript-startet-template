import fs from "fs";
import path from "path";
import { userSchema, userSchemaDTO } from "./user.dto";

interface User extends userSchemaDTO {
  id: number;
}

const usersFilePath = path.resolve(__dirname, "../../infrastructure/data/users.json");

export async function createUser(input: userSchemaDTO): Promise<User> {
  // 1. Validação com Zod
  const parsed = userSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error(
      `Dados inválidos: ${JSON.stringify(parsed.error.issues)}`
    );
  }

  // 2. Lê usuários existentes
  const fileData = fs.readFileSync(usersFilePath, "utf-8");
  const users: User[] = JSON.parse(fileData);

  // 3. Gera ID incremental
  const lastId = users.length ? users[users.length - 1].id : 0;

  const newUser: User = {
    id: lastId + 1,
    ...parsed.data,
  };

  // 4. Salva
  users.push(newUser);
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

  return newUser;
}

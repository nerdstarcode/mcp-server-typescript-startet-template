import fs from "fs";
import path from "path";
import { editUserSchema, editUserSchemaDTO } from "../../schema/users/users.dto";

interface User extends Record<string, any> {
  id: number;
  name: string;
  email: string;
  address: string;
  phone: string;
}

const usersFilePath = path.resolve(__dirname, "../../infrastructure/data/users.json");

export async function editUser(input: editUserSchemaDTO): Promise<User> {
  const parsed = editUserSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(`Invalid data: ${JSON.stringify(parsed.error.issues)}`);
  }

  const fileData = fs.readFileSync(usersFilePath, "utf-8");
  const users: User[] = JSON.parse(fileData);

  const index = users.findIndex((user) => user.id === parsed.data.id);
  if (index === -1) {
    throw new Error(`User with id ${parsed.data.id} not found`);
  }

  const existing = users[index];
  const updates = parsed.data;

  const updated: User = { ...existing };
  if (typeof updates.name !== "undefined") updated.name = updates.name as string;
  if (typeof updates.email !== "undefined") updated.email = updates.email as string;
  if (typeof updates.address !== "undefined") updated.address = updates.address as string;
  if (typeof updates.phone !== "undefined") updated.phone = updates.phone as string;

  users[index] = updated;
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

  return updated;
}
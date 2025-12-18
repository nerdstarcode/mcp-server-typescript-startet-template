import fs from "fs";
import path from "path";
import { userSchema } from "../../schema/users/users.dto";

const usersFilePath = path.resolve(__dirname, "../../infrastructure/data/users.json");

export type User = {
  id: number;
  name: string;
  email: string;
  address: string;
  phone: string;
};

export async function listUsers(): Promise<User[]> {
  const fileData = fs.readFileSync(usersFilePath, "utf-8");
  const users: any[] = JSON.parse(fileData);

  const parsed = users.map((user) => {
    const result = userSchema.safeParse(user);
    return result.success ? result.data as User : user as User;
  });

  return parsed as User[];
}

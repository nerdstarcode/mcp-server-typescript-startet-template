import fs from "fs";
import path from "path";
import { userSchema } from "../../schema/users/users.dto.js";

const usersFilePath = path.resolve(__dirname, "../../infrastructure/data/users.json");

export type User = {
  id: number;
  name: string;
  email: string;
  address: string;
  phone: string;
};

export type UserFilter = Partial<User>;

export async function listUsers(filter?: UserFilter): Promise<User[]> {
  const fileData = fs.readFileSync(usersFilePath, "utf-8");
  const users: any[] = JSON.parse(fileData);

  const parsed = users.map((user) => {
    const result = userSchema.safeParse(user);
    return result.success ? result.data as User : user as User;
  });

  if (!filter || Object.keys(filter).length === 0) {
    return parsed as User[];
  }
  return (parsed as User[]).filter((user) => {
    return Object.entries(filter).every(([key, value]) => {
      if (value === undefined || value === null) return true;
      
      const userValue = user[key as keyof User];
      // For numeric fields (like id), use exact matching
      if (typeof value === "number") {
        return userValue === value;
      }
      
      // Case-insensitive string matching
      if (typeof userValue === "string" && typeof value === "string") {
        return userValue.toLowerCase().includes(value.toLowerCase());
      }
      
      return userValue === value;
    });
  });
}

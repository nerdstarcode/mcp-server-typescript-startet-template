import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { deleteUserSchema, editUserSchema, userSchema } from "../schema/users/users.dto.js";
import { createUser } from "../use-cases/users/create-users.js";
import { editUser } from "../use-cases/users/edit-users.js";
import { deleteUser } from "../use-cases/users/delete-users.js";

export function registerClientTools(server: McpServer) {
  server.registerTool(
    "create-user",
    {
      description: "Create a new user in the database",
      inputSchema: userSchema,
      annotations: {
        title: "Create User",
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true
      }
    },
    async (payload) => {
      console.time("Executed Function")
      try {
        console.group("create-user")
        const id = (await createUser(payload)).id
        return {
          content: [
            {
              type: "text",
              text: `User ${id} created successfully`
            }
          ]
        }
        console.groupEnd()
      } catch {
        console.group("create-user-error")
        return {
          content: [
            {
              type: "text",
              text: "Failed to save user"
            }
          ]
        }
        console.groupEnd()
      } finally {
        console.group("create-user-end")
        console.timeEnd("Executed Function")
        console.groupEnd()
      }
    },
  );

  server.registerTool(
    "edit-user",
    {
      description: "Edit an existing user",
      inputSchema: editUserSchema,
      annotations: {
        title: "Edit User",
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true
      }
    },
    async (payload) => {
      try {
        const updated = await editUser(payload);
        return {
          content: [
            { type: "text", text: `User ${updated.id} updated successfully` }
          ]
        };
      } catch (err) {
        return { content: [{ type: "text", text: `Failed to update user: ${String(err)}` }] };
      }
    }
  );

  server.registerTool(
    "delete-user",
    {
      description: "Delete a user by id",
      inputSchema: deleteUserSchema,
      annotations: {
        title: "Delete User",
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: true
      }
    },
    async (payload: any) => {
      try {
        const res = await deleteUser(payload);
        return { content: [{ type: "text", text: `User ${res.id} deleted successfully` }] };
      } catch (err) {
        return { content: [{ type: "text", text: `Failed to delete user: ${String(err)}` }] };
      }
    }
  );
}

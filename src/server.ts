import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createUser } from "./@core/use-cases/users/create-users.js";
import { deleteUserSchema, editUserSchema, userSchema } from "./@core/schema/users/users.dto.js";
import { editUser } from "./@core/use-cases/users/edit-users.js";
import { deleteUser } from "./@core/use-cases/users/delete-users.js";
import { listUsers } from "./@core/use-cases/users/list-users.js";

const server = new McpServer({
  name: "starter-template-mcp-server",
  version: "0.0.0",
});

server.registerResource(
  "users",
  "users://all",
  {
    description: "Get all users data for the database",
    title: "Users",
    mimeType: "application/json",
  },
  async uri => {
    try {
      const response = await listUsers()
      return {
        contents: [{
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify(response)
        }]
      }
    } catch (e) {
      return {
        contents: [{
          uri: uri.href,
          mimeType: "application/json",
          text: `[{"id":1,"name":"John Doe","email":"john.doe@example.com"}]`
        }]
      }
    }

  }
)
server.registerResource(
  "user-details",
  new ResourceTemplate("users://{userId}/details", { list: undefined }),
  {
    description: "Get a user details from the data base",
    title: "User Details",
    mimeType: "application/json",
  },
  async (uri, { userId }) => {
    try {
      const response = await listUsers({ id: parseInt(userId as string) });
      if (response.length === 0) {
        throw new Error("User not found");
      }
      return {
        contents: [{
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify(response[0])
        }]
      }
    } catch (error) {
      return {
        contents: [{
          uri: uri.href,
          mimeType: "application/json",
          text: `${error}`
        }]
      }
    }

  }
)

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
  async (payload) => {
    try {
      const res = await deleteUser(payload);
      return { content: [{ type: "text", text: `User ${res.id} deleted successfully` }] };
    } catch (err) {
      return { content: [{ type: "text", text: `Failed to delete user: ${String(err)}` }] };
    }
  }
);

(async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
})()
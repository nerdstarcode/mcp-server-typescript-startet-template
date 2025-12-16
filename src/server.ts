import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { userSchema } from "./@core/use-cases/users/user.dto";
import { createUser } from "./@core/use-cases/users/create-users";

const server = new McpServer({
  name: "starter-template-mcp-server",
  version: "0.0.0",
});

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

(async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
})()
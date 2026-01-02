import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { listUsers } from "../use-cases/users/list-users.js";

export function registerClientResources(server: McpServer) {
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
  );

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
  );
}
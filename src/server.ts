import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerClientResources } from "./@core/resources/client.resource.js";
import { registerClientTools } from "./@core/tools/client.tools.js";

const server = new McpServer({
  name: "starter-template-mcp-server",
  version: "0.0.0",
});

// Register resources
registerClientResources(server);
registerClientTools(server);

(async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
})();
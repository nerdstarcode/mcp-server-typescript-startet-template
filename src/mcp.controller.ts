import { Controller, Post, Get, Delete, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { registerClientResources } from './@core/resources/client.resource.js';
import { registerClientTools } from './@core/tools/client.tools.js';
//@ts-ignore
import { toFetchResponse } from 'fetch-to-node';

function getServer() {
  const server = new McpServer({
    name: 'mcp-server-typescript-starter',
    version: '1.0.0',
  });
  registerClientResources(server);
  registerClientTools(server);
  return server;
}

@Controller('mcp')
export class McpController {
  @Post()
  async handleMcp(@Req() req: Request, @Res() res: Response,): Promise<void> {
    try {
      const server = getServer();
      const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
      transport.onerror = console.error.bind(console);
      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
      res.on('close', () => {
        console.log('Request closed');
        transport.close();
        server.close();
      });
      const fetchRes = await toFetchResponse(res);
      res.status(fetchRes.status).json(fetchRes.body);
    } catch (e) {
      console.error(e);
      res.status(500).json({
        jsonrpc: '2.0',
        error: { code: -32603, message: 'Internal server error' },
        id: null,
      });
    }
  }

  @Get()
  async methodNotAllowedGet(@Res() res: Response): Promise<void> {
    res.status(405).json({
      jsonrpc: '2.0',
      error: { code: -32000, message: 'Method not allowed.' },
      id: null,
    });
  }

  @Delete()
  async methodNotAllowedDelete(@Res() res: Response): Promise<void> {
    res.status(405).json({
      jsonrpc: '2.0',
      error: { code: -32000, message: 'Method not allowed.' },
      id: null,
    });
  }
}

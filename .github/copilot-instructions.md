## Quick orientation for AI coding agents

This repository is a small Model Context Protocol (MCP) server implemented in TypeScript. The instructions below distill the minimal, concrete knowledge an agent needs to be immediately productive here.

### Big-picture architecture
- Entry point: `src/server.ts` — creates an `McpServer`, registers tools and connects using `StdioServerTransport`.
- Tools: server exposes named tools via `server.registerTool(name, options, handler)`; each tool accepts a payload validated by a Zod schema and returns an MCP `content` response array (see `src/server.ts`).
- Use-cases: Business logic lives under `src/@core/use-cases/` (e.g. `src/@core/use-cases/users/create-users.ts`). These functions are synchronous/async helpers that the tool handlers call.
- Schemas: Zod schemas live under `src/@core/schema/` (e.g. `src/@core/schema/users/user.dto.ts`) and are exported as both runtime validators and TypeScript types.
- Persistence: Simple file-based JSON storage under `src/@core/infrastructure/data/users.json` used by the example `createUser` use-case.

### Key patterns and conventions (do this project’s way)
- ES module imports are used even in TypeScript sources (see `src/server.ts` imports from `@modelcontextprotocol/sdk/.../mcp.js`). Keep import paths consistent with existing files.
- Tool registration contract: when registering tools follow the pattern in `src/server.ts`:
  - name: string (e.g. `create-user`)
  - options: { description, inputSchema, annotations }
  - handler: async (payload) => { return { content: [{ type: 'text', text: '...' }] } }
- Validation: Use Zod schemas from `src/@core/schema/...` and call `schema.safeParse(input)` as shown in `create-users.ts`. If validation fails, throw or return an appropriate MCP content response.
- Return shape: Handlers return an object with property `content` — an array of blocks. The examples use blocks like `{ type: 'text', text: '...' }`.
- Side effects: Use-cases may write to `src/@core/infrastructure/data/*.json`. Be careful with sync file writes (existing code uses `fs.readFileSync` / `fs.writeFileSync`).

### Scripts & developer workflows
- Run the server in dev (no build step):
  - `npm run server:dev` (uses `tsx src/server.ts`).
- Build (TypeScript -> JS):
  - `npm run server:build` (runs `tsc`, outputs compiled files to `build/`).
- Watch/inspect:
  - `npm run server:build:watch`
  - `npm run server:inspect` — sets `DANGEROUSLY_OMIT_AUTH=true` and runs the `@modelcontextprotocol/inspector` for development inspection.

### Integration points & external deps
- Uses `@modelcontextprotocol/sdk` for server primitives and `@modelcontextprotocol/inspector` for local inspection.
- `tsx` runs TypeScript files directly in dev.
- Zod (`zod`) used for schemas/validation.

### Concrete examples (copy/paste-friendly)
- Register a tool (see `src/server.ts`):
  - `server.registerTool('create-user', { description: 'Create a new user', inputSchema: userSchema }, async (payload) => { /* call createUser(payload) */ })`
- Example payload shape for `create-user` (from `src/@core/schema/users/user.dto.ts`):
  - { name: string, email: string, address: string, phone: string }

### Files to inspect for context
- `src/server.ts` — server + tool registration examples (primary reference)
- `src/@core/use-cases/users/create-users.ts` — how use-cases validate input and persist to JSON
- `src/@core/schema/users/user.dto.ts` — Zod schema + exported DTO type
- `src/@core/infrastructure/data/users.json` — sample data store used by create-users
- `package.json` — useful scripts: `server:dev`, `server:build`, `server:inspect`

### Safe-edit rules for an AI agent
1. Preserve existing tool names and input schemas unless intentionally changing an API; update both `src/server.ts` and any dependent use-cases.
2. If adding new persistent data, create/update a file under `src/@core/infrastructure/data/` and ensure the use-case reads/writes the same path.
3. Keep response `content` blocks consistent with the examples (type: `text`, `text: string`).
4. Avoid introducing async race conditions around file writes; follow the existing pattern (sync fs calls) or introduce a clear migration to async with tests.

### When you need to run or test locally
- Quick dev run: `npm run server:dev` (Windows PowerShell). This runs TypeScript directly and is the fastest feedback loop.
- Use the inspector only in development: `npm run server:inspect` (it sets `DANGEROUSLY_OMIT_AUTH=true`).

---
If anything here is unclear or you'd like more examples (e.g., adding a second tool, migrating the storage to async or a DB, or test harness examples), tell me which area and I will expand the doc. 

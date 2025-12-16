# Documentação: `server.ts`

## Visão Geral

O arquivo `server.ts` é o ponto de entrada principal do servidor **MCP (Model Context Protocol)**. Nesta versão, além de inicializar o servidor e configurar o transporte via **stdio**, o servidor também registra uma **Tool** chamada `create-user`, responsável por criar usuários a partir de um schema validado com **Zod**.

Esse servidor pode ser consumido por clientes MCP (como o Cursor, por exemplo) para executar ações estruturadas expostas pelo backend.

---

## Estrutura do Código

### Importações

```ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { userSchema } from "./@core/use-cases/users/user.dto";
import { createUser } from "./@core/use-cases/users/create-users";
```

**Explicação:**

* `McpServer`: Classe principal do servidor MCP, responsável por gerenciar tools, resources e prompts.
* `StdioServerTransport`: Define o transporte de comunicação via `stdin/stdout`, padrão em servidores MCP.
* `userSchema`: Schema de validação (Zod) que define o formato esperado para criação de usuários.
* `createUser`: Use case responsável por persistir o usuário (ex.: em arquivo JSON ou banco de dados).

---

### Criação do Servidor

```ts
const server = new McpServer({
  name: "starter-template-mcp-server",
  version: "0.0.0",
});
```

**Explicação:**

* Cria uma instância do servidor MCP.
* `name`: Nome do servidor (deve estar alinhado com o `package.json`).
* `version`: Versão atual do servidor.

---

### Registro da Tool: `create-user`

```ts
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
      openWorldHint: true,
    },
  },
  async (payload) => {
    ...
  }
);
```

**Explicação:**

* `registerTool`: Registra uma nova **Tool MCP** que pode ser chamada por clientes.
* `"create-user"`: Nome da tool (identificador usado pelo cliente).
* `description`: Descrição funcional da tool.
* `inputSchema`: Schema Zod que valida automaticamente o payload de entrada.

#### Annotations

As `annotations` ajudam o cliente MCP a entender o comportamento da tool:

* `readOnlyHint`: `false` → a tool altera estado.
* `destructiveHint`: `false` → não remove dados.
* `idempotentHint`: `false` → múltiplas execuções podem gerar efeitos diferentes.
* `openWorldHint`: `true` → aceita dados externos e dinâmicos.

---

### Implementação da Tool

```ts
async (payload) => {
  console.time("Executed Function");
  try {
    console.group("create-user");

    const id = (await createUser(payload)).id;

    return {
      content: [
        {
          type: "text",
          text: `User ${id} created successfully`,
        },
      ],
    };
  } catch {
    console.group("create-user-error");

    return {
      content: [
        {
          type: "text",
          text: "Failed to save user",
        },
      ],
    };
  } finally {
    console.group("create-user-end");
    console.timeEnd("Executed Function");
    console.groupEnd();
  }
}
```

**Explicação:**

* Recebe o `payload` já validado pelo `userSchema`.
* Executa o use case `createUser`.
* Retorna uma resposta no formato MCP (`content` com `type: "text"`).
* Utiliza `console.time` e `console.group` para facilitar debug e observabilidade.
* Garante logs e finalização mesmo em caso de erro (`finally`).

---

### Função Principal (IIFE)

```ts
(async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
})();
```

**Explicação:**

* Usa uma **IIFE assíncrona** para inicializar o servidor imediatamente.
* Cria o transporte stdio.
* Conecta o servidor MCP ao transporte, iniciando o loop de comunicação.

---

## Como Funciona (Fluxo)

1. O servidor MCP é inicializado.
2. A tool `create-user` é registrada no servidor.
3. O transporte `stdio` é configurado.
4. Um cliente MCP envia uma requisição para `create-user`.
5. O payload é validado via `userSchema`.
6. O use case `createUser` é executado.
7. O servidor retorna uma resposta estruturada ao cliente.

---

## Próximos Passos

Possíveis evoluções do servidor:

* Adicionar novas **Tools** (ex.: `list-users`, `update-user`, `delete-user`).
* Criar **Resources** para leitura de dados.
* Expor **Prompts** reutilizáveis.
* Implementar logs estruturados ou observabilidade.
* Adicionar tratamento de erros mais detalhado.

---

## Execução

Para rodar o servidor em modo desenvolvimento:

```bash
npm run server:dev
```

Para rodar com inspeção/debug:

```bash
npm run server:inspect
```
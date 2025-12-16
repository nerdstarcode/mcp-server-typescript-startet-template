# Documentação: `server.ts`

## Visão Geral

O arquivo `server.ts` é o ponto de entrada principal do servidor MCP (Model Context Protocol). Este arquivo configura e inicializa um servidor MCP que se comunica através de transporte stdio (standard input/output).

## Estrutura do Código

### Importações

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
```

**Explicação:**
- `McpServer`: Classe principal que representa o servidor MCP. É responsável por gerenciar recursos, ferramentas e prompts disponíveis para clientes MCP.
- `StdioServerTransport`: Implementa o transporte de comunicação usando entrada/saída padrão (stdio). Isso permite que o servidor se comunique através de stdin/stdout, que é o método padrão para servidores MCP.

### Criação do Servidor

```typescript
const server = new McpServer({
    name: "starter-template-mcp-server",
    version: "0.0.0",
});
```

**Explicação:**
- Cria uma nova instância do servidor MCP com configurações básicas:
  - `name`: Identificador único do servidor (deve corresponder ao nome no `package.json`)
  - `version`: Versão do servidor (atualmente "0.0.0", indicando que está em desenvolvimento inicial)

### Função Principal (IIFE)

```typescript
(async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
})()
```

**Explicação:**
- Utiliza uma **IIFE (Immediately Invoked Function Expression)** assíncrona para executar o código imediatamente
- `StdioServerTransport()`: Cria uma instância do transporte stdio
- `server.connect(transport)`: Conecta o servidor ao transporte, iniciando a comunicação
- A função é assíncrona porque `connect()` retorna uma Promise que precisa ser aguardada

## Como Funciona

1. **Inicialização**: Quando o arquivo é executado, o servidor MCP é criado com suas configurações básicas
2. **Transporte**: Um transporte stdio é instanciado para permitir comunicação via stdin/stdout
3. **Conexão**: O servidor se conecta ao transporte, ficando pronto para receber e processar requisições de clientes MCP

## Próximos Passos

Para tornar este servidor funcional, você precisará adicionar:
- **Recursos (Resources)**: Dados que o servidor pode fornecer aos clientes
- **Ferramentas (Tools)**: Funções que o servidor pode executar quando solicitado
- **Prompts**: Templates de prompts pré-configurados

## Exemplo de Uso

Este servidor pode ser executado usando:
```bash
npm run server:dev
```

Ou para inspecionar e debugar:
```bash
npm run server:inspect
```


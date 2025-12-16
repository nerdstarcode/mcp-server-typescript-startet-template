# Documentação: `package.json`

## Visão Geral

O arquivo `package.json` é o arquivo de configuração principal do projeto Node.js/TypeScript. Ele define metadados do projeto, dependências e scripts de execução para o servidor MCP.

## Estrutura do Arquivo

### Metadados do Projeto

```json
{
  "name": "starter-template-mcp-server",
  "version": "1.0.0",
  "main": "src/server.ts",
  "keywords": [],
  "author": "sthiven-melo",
  "license": "ISC"
}
```

**Explicação:**
- `name`: Nome do pacote/projeto (deve corresponder ao nome do servidor no `server.ts`)
- `version`: Versão atual do projeto (formato semver: major.minor.patch)
- `main`: Ponto de entrada principal do projeto quando executado
- `keywords`: Array de palavras-chave para publicação no npm (atualmente vazio)
- `author`: Nome do autor do projeto
- `license`: Tipo de licença (ISC é uma licença permissiva similar à MIT)

### Scripts NPM

```json
"scripts": {
  "server:build": "tsc",
  "server:build:watch": "tsc --watch",
  "server:dev": "tsx src/server.ts",
  "server:inspect": "set DANGEROUSLY_OMIT_AUTH=true && npx @modelcontextprotocol/inspector npm run server:dev"
}
```

**Explicação de cada script:**

1. **`server:build`**
   - Comando: `tsc`
   - Função: Compila o código TypeScript para JavaScript
   - Saída: Arquivos `.js` gerados no diretório `build/` (conforme `tsconfig.json`)

2. **`server:build:watch`**
   - Comando: `tsc --watch`
   - Função: Compila o TypeScript em modo watch, recompilando automaticamente quando arquivos são alterados
   - Uso: Útil durante o desenvolvimento para manter o código compilado atualizado

3. **`server:dev`**
   - Comando: `tsx src/server.ts`
   - Função: Executa o servidor diretamente usando `tsx` (TypeScript executor)
   - Vantagem: Não requer compilação prévia, executa TypeScript diretamente
   - Uso: Desenvolvimento rápido e iteração

4. **`server:inspect`**
   - Comando: `set DANGEROUSLY_OMIT_AUTH=true && npx @modelcontextprotocol/inspector npm run server:dev`
   - Função: Inicia o servidor com o Inspector MCP para debug e visualização
   - `DANGEROUSLY_OMIT_AUTH=true`: Desabilita autenticação (apenas para desenvolvimento)
   - `@modelcontextprotocol/inspector`: Ferramenta visual para inspecionar recursos, ferramentas e prompts do servidor
   - Uso: Debug e desenvolvimento, permite visualizar interações do servidor MCP

### Dependências (Dependencies)

```json
"dependencies": {
  "@modelcontextprotocol/sdk": "^1.25.0",
  "tsx": "^4.20.3",
  "typescript": "^5.8.3"
}
```

**Explicação:**

1. **`@modelcontextprotocol/sdk`** (^1.25.0)
   - SDK oficial do Model Context Protocol
   - Fornece classes e utilitários para criar servidores MCP
   - Versão: ^1.25.0 significa >=1.25.0 e <2.0.0 (permite atualizações de patch e minor)

2. **`tsx`** (^4.20.3)
   - Executor TypeScript para Node.js
   - Permite executar arquivos `.ts` diretamente sem compilação prévia
   - Essencial para o script `server:dev`

3. **`typescript`** (^5.8.3)
   - Compilador TypeScript
   - Necessário para compilar código TypeScript para JavaScript
   - Usado pelos scripts `server:build` e `server:build:watch`

### Dependências de Desenvolvimento (DevDependencies)

```json
"devDependencies": {
  "@modelcontextprotocol/inspector": "^0.15.0"
}
```

**Explicação:**

1. **`@modelcontextprotocol/inspector`** (^0.15.0)
   - Ferramenta de desenvolvimento para inspecionar servidores MCP
   - Fornece interface visual para testar recursos, ferramentas e prompts
   - Apenas necessário durante o desenvolvimento, não em produção

## Fluxo de Trabalho Recomendado

### Desenvolvimento
```bash
npm run server:dev
```
- Executa o servidor diretamente em TypeScript
- Ideal para desenvolvimento rápido

### Debug/Inspeção
```bash
npm run server:inspect
```
- Abre o Inspector MCP
- Permite visualizar e testar recursos do servidor

### Build para Produção
```bash
npm run server:build
```
- Compila TypeScript para JavaScript
- Gera arquivos otimizados no diretório `build/`

## Notas Importantes

- O projeto usa **ES Modules** (`.js` nas importações mesmo em arquivos `.ts`)
- A configuração do TypeScript está em `tsconfig.json`
- O servidor usa transporte **stdio** para comunicação
- O Inspector deve ser usado apenas em desenvolvimento (autenticação desabilitada)


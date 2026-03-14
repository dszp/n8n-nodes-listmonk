# CLAUDE.md - n8n-nodes-listmonk

## Project Overview

n8n community node for the Listmonk email & newsletter API. Published to npm as `@dszp/n8n-nodes-listmonk`. Licensed MIT. Author: David Szpunar. Forked from `@tosvenson/n8n-nodes-listmonk`.

- **Type**: Declarative n8n node (OpenAPI-generated properties with post-processing fixups)
- **Node API Version**: 1 (stable)
- **Package manager**: pnpm (9.1.4)
- **TypeScript target**: ES2019, strict mode enabled
- **Current version**: Check `package.json` for latest

## Repository Structure

```
credentials/
  listmonkApi.credentials.ts         # Base URL + API username/token (Basic Auth)
  logo.svg                           # Icon for credential dialog
nodes/listmonk/
  listmonk.node.ts                   # Main node entry (declarative, OpenAPI-generated)
  listmonk.node.json                 # Codex metadata (category: Marketing & Content)
  ListmonkOperationParser.ts         # Custom operation naming for n8n conventions
  fixupProperties.ts                 # Post-processing: response unwrap, null defaults, preSend filters
  openapi.json                       # Listmonk API spec (source for property generation)
  logo.svg                           # Node icon
test/
  listmonk.node.test.ts              # Node metadata and fixup tests
  listmonk.credentials.test.ts       # Credential tests
  campaigns.test.ts                  # Campaigns resource tests
  e2e/campaigns.e2e.test.ts          # E2E tests (require running Listmonk)
```

## Key Commands

```bash
pnpm install          # Install dependencies (Node >= 18.10)
pnpm run build        # TypeScript compile + copy icons via Gulp
pnpm run dev          # Watch mode (incremental TypeScript build)
pnpm test             # Jest + ts-jest
pnpm run lint         # ESLint with eslint-plugin-n8n-nodes-base
pnpm run lint:fix     # Auto-fix lint issues
pnpm run format       # Prettier formatting
```

Local dev with n8n: `make build && make link && make start`
Update OpenAPI spec: `make up-listmonk` (fetches YAML, converts to JSON)

## Architecture & Key Patterns

### OpenAPI-Driven Property Generation

Node properties are auto-generated from `openapi.json` using `@devlikeapro/n8n-openapi-node`. The pipeline is:

1. `N8NPropertiesBuilder` parses the OpenAPI spec with `ListmonkOperationParser`
2. `fixupProperties()` post-processes the result to fix systematic issues
3. The final `INodeProperties[]` is assigned to the node description

### fixupProperties.ts (Post-Processing)

Fixes three categories of issues from the auto-generated properties:

- **Null array defaults**: Replaces 33 fields with `"[\n  null\n]"` defaults → `"[]"`
- **Pagination defaults**: Sets `page=1`, `per_page=20` instead of `0`
- **Empty query param filtering**: Adds `preSend` hooks to delete empty array/string query params from requests (n8n always sends params regardless of value — `preSend` is the only way to skip them)
- **Response unwrapping**: Injects `postReceive` handlers on each operation to unwrap the `{data: ...}` API envelope:
  - Get Many → unwraps `data.results` or `data` array into individual items
  - Get/Create/Update → unwraps `data` object
  - Delete → returns `{success: true}`
  - Other → general unwrapper (auto-detects shape)

### Authentication (Basic Auth with API Token)

- Listmonk uses HTTP Basic Auth with an API username and token
- Created in Listmonk Admin > Users
- Base URL is configurable per-credential; requests go to `{baseUrl}/api`

### Resources & Operations

11 resources with CRUD and specialized operations: Subscribers, Lists, Campaigns, Templates, Transactional, Media, Bounces, Import, Settings, Maintenance, Public.

## Code Style & Conventions

### Formatting (`.prettierrc.js`)

- Tabs (width 2), semicolons, single quotes, trailing commas (all)
- Print width: 100, LF line endings, arrow parens: always

### Linting

- ESLint with `eslint-plugin-n8n-nodes-base`
- Must pass lint before publishing: `pnpm run lint`

### TypeScript

- Strict mode with all checks enabled
- `useUnknownInCatchVariables: false` (exception)
- `import type` for type-only imports
- Incremental compilation, declaration files, source maps

### Commits

- Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `test:`
- All changes must pass `pnpm build && pnpm test && pnpm lint`

## n8n Node Development Rules

Detailed n8n development standards are in `.claude/rules/` (auto-loaded when editing relevant files):

- `.claude/rules/n8n-code-standards.md` — data handling, file structure, verification guidelines
- `.claude/rules/n8n-credentials.md` — credential file structure, auth types
- `.claude/rules/n8n-http-helpers.md` — HTTP request helpers, request options, body types
- `.claude/rules/n8n-operations-naming.md` — CRUD vocabulary, operation naming, error messages
- `.claude/rules/n8n-ui-standards.md` — UI text case, terminology, field layout, progressive disclosure
- `.claude/rules/version-management.md` — package.json and codex nodeVersion must stay in sync

## Git Remotes

- `origin` → `dszp/n8n-nodes-listmonk` (push and fetch)
- `upstream` → `toSvenson/n8n-nodes-listmonk` (fetch only, push disabled)
- Always PR to `origin`, never to `upstream`
- Default `gh` repo set to `dszp/n8n-nodes-listmonk`

## CI/CD

- GitHub Actions: pnpm install, build, lint, and test on push/PR
- See `.github/workflows/` for workflow definitions

## Key Documentation Links

- Listmonk API Docs: https://listmonk.app/docs/apis/apis/
- n8n Node Development: https://docs.n8n.io/integrations/creating-nodes/overview/
- n8n Community Node Verification: https://docs.n8n.io/integrations/creating-nodes/build/reference/verification-guidelines/

# Repository Guidelines

## Project Structure & Module Organization
- Source: `nodes/listmonk/` (`listmonk.node.ts`, `ListmonkOperationParser.ts`, `openapi.json`, `logo.svg`).
- Credentials: `credentials/` (`listmonkApi.credentials.ts`, `logo.svg`).
- Tests: colocated `*.spec.ts` and `test/` directory.
- Build output: `dist/` (git-ignored; published via `files` in `package.json`).
- Config: `tsconfig.json`, `.eslintrc.js`, `jest.config.js`, `gulpfile.js`, `Makefile`.

## Build, Test, and Development Commands
- Install: `pnpm install` (Node >= 18.10).
- Build: `pnpm build` (TypeScript compile + copy icons via Gulp).
- Watch: `pnpm dev` (incremental TypeScript build).
- Test: `pnpm test` (Jest + ts-jest).
- Lint: `pnpm lint` | Fix: `pnpm lint:fix`.
- Format: `pnpm format`.
- Run in n8n (local link): `make build && make link && make start`.
- Update OpenAPI: use `make up-listmonk`.

## Coding Style & Naming Conventions
- Language: TypeScript, strict mode enabled.
- Formatting: Prettier (2-space indent).
- Linting: ESLint with `eslint-plugin-n8n-nodes-base`.
- File naming: `Foo.node.ts`, `Foo.node.json`, `fooApi.credentials.ts`.
- Class names: PascalCase (e.g., `Listmonk`).
- Use `import type` for type-only imports.

## Architecture Overview
- Node properties are generated from `nodes/listmonk/openapi.json` using `@devlikeapro/n8n-openapi-node`.
- Custom `ListmonkOperationParser` overrides default operation naming to follow n8n conventions.
- Gulp copies icons from `nodes/**` and `credentials/**` into `dist/` during build.

## Testing Guidelines
- Framework: Jest with ts-jest.
- Colocated specs: `nodes/**/*.spec.ts`.
- Integration tests: `test/` directory.
- Run: `pnpm test`.

## Commit & Pull Request Guidelines
- Commits: Conventional Commits (`feat:`, `fix:`, `chore:`).
- Ensure `pnpm build`, `pnpm lint`, and `pnpm test` pass.

## Security & Configuration
- Do not commit secrets.
- API credentials use HTTP Basic Auth via the `listmonkApi` credential type.
- Base URL is configured per-credential; requests go to `{baseUrl}/api`.

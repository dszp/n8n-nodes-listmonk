# Changelog

All notable changes to this project will be documented in this file.

## [0.0.2] - 2026-03-14

### Changed

- Test release to verify GitHub Actions OIDC trusted publishing to npm

## [0.0.1] - 2026-03-14

Initial release under `@dszp/n8n-nodes-listmonk`, forked from `@tosvenson/n8n-nodes-listmonk`.

### Changed

- Rebranded package from `@tosvenson/n8n-nodes-listmonk` to `@dszp/n8n-nodes-listmonk`
- Renamed node class to PascalCase `Listmonk` (was lowercase `listmonk`)
- Added `usableAsTool: true` for AI agent compatibility
- Added custom `ListmonkOperationParser` for n8n-compliant operation names:
  - List operations renamed to "Get Many"
  - Single-entity CRUD simplified to "Get", "Create", "Update", "Delete"
  - Action descriptions use proper singular/plural forms
- Fixed codex file: correct package reference, valid `Marketing & Content` category, synced version
- Updated credentials: API token auth (was Basic Auth), added icon, fixed documentation URL
- Updated all GitHub Actions workflows to use pnpm, bumped to Node 24 and actions v5
- Added CI workflow with lint, build, and test steps
- Added release-publish workflow with npm OIDC trusted publishing
- Disabled daily cron on update-listmonk-api workflow (manual dispatch only)
- Credited all upstream fork authors (loopion, front-matter, toSvenson)

### Added

- `fixupProperties.ts` post-processor that fixes auto-generated OpenAPI properties:
  - Response unwrapping: `postReceive` handlers unwrap `{data: ...}` envelope, returning individual items
  - Null array defaults: replaced 33 fields with `[null]` defaults → `[]`
  - Empty query param filtering: `preSend` hooks skip empty array/string params (prevents 400 errors)
  - Pagination defaults: `page=1`, `per_page=20` instead of `0`
- `LICENSE` file (MIT, with all upstream author attribution)
- `CLAUDE.md` project documentation
- `CHANGELOG.md`
- `TODO.md`
- Credits section in README with full fork chain
- `credentials/logo.svg` (copy for credentials icon)
- `openapi-types` dev dependency for TypeScript types

### Removed

- `AGENTS.md` (replaced by `CLAUDE.md`)
- `tslint.json` (deprecated; ESLint is used)
- `index.js` (empty, unused)
- `.pre-commit-config.yaml` (markdown TOC hook, not needed)
- `coverage/` directory (was committed to git; now gitignored)
- `"main": "index.js"` from package.json (n8n uses `n8n.nodes`/`n8n.credentials` arrays)

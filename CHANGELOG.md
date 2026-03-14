# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - 2026-03-13

Initial release under `@dszp/n8n-nodes-listmonk`, forked from `@tosvenson/n8n-nodes-listmonk`.

### Changed

- Rebranded package from `@tosvenson/n8n-nodes-listmonk` to `@dszp/n8n-nodes-listmonk`
- Reset version to 0.1.0 (clean semver)
- Renamed node class to PascalCase `Listmonk` (was lowercase `listmonk`)
- Added `usableAsTool: true` for AI agent compatibility
- Added custom `ListmonkOperationParser` for n8n-compliant operation names:
  - List operations renamed to "Get Many"
  - Single-entity CRUD simplified to "Get", "Create", "Update", "Delete"
  - Action descriptions use proper singular/plural forms
- Fixed codex file: correct package reference, valid `Marketing & Content` category, synced version
- Updated credentials: added icon, fixed documentation URL, use `import type`
- Updated all GitHub Actions workflows to use pnpm, bumped to Node 24 and actions v5
- Added CI workflow with lint, build, and test steps
- Added release-publish workflow with npm OIDC trusted publishing
- Disabled daily cron on update-listmonk-api workflow (manual dispatch only)

### Added

- `LICENSE` file (MIT, with original author attribution)
- `CHANGELOG.md`
- `TODO.md`
- Credits section in README
- `credentials/logo.svg` (copy for credentials icon)
- `openapi-types` dev dependency for TypeScript types

### Removed

- `tslint.json` (deprecated; ESLint is used)
- `index.js` (empty, unused)
- `.pre-commit-config.yaml` (markdown TOC hook, not needed)
- `coverage/` directory (was committed to git; now gitignored)
- `"main": "index.js"` from package.json (n8n uses `n8n.nodes`/`n8n.credentials` arrays)

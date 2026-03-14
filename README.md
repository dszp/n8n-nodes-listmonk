# @dszp/n8n-nodes-listmonk

n8n community node for the [Listmonk](https://listmonk.app/) email & newsletter API.

## Overview

This node integrates the Listmonk admin API into n8n, providing access to all major resources:

- **Subscribers** — create, get, update, delete, manage lists, blocklist, export, bounces
- **Lists** — create, get, update, delete
- **Campaigns** — create, get, update, delete, status management, preview, analytics, test send
- **Templates** — create, get, update, delete, preview, set default
- **Media** — upload, get, delete
- **Transactional** — send transactional emails
- **Import** — import subscribers, check status, view logs
- **Settings, Admin, Logs, Maintenance, Public** — full admin API coverage

![node-actions.png](node-actions.png)

## Installation

In your n8n instance, go to **Settings > Community Nodes** and install:

```
@dszp/n8n-nodes-listmonk
```

Or install via the CLI:

```bash
# Self-hosted n8n
cd ~/.n8n
npm install @dszp/n8n-nodes-listmonk

# Docker — add to your n8n environment
N8N_COMMUNITY_PACKAGES=@dszp/n8n-nodes-listmonk
```

## Configuration

1. In n8n, create a new **Listmonk API** credential
2. Enter your Listmonk base URL (e.g., `https://listmonk.example.com`) — no trailing slash
3. Enter your admin username and password (HTTP Basic Auth)

The node makes requests to the admin API at `{baseUrl}/api`.

## Compatibility

- Tested with Listmonk v6.0.0+
- Tested with n8n v2.11.3+
- Supports use as an AI agent tool (`usableAsTool: true`)

## Development

```bash
pnpm install          # Install dependencies
pnpm build            # TypeScript compile + copy icons
pnpm dev              # Watch mode
pnpm test             # Run tests
pnpm lint             # Lint check
pnpm lint:fix         # Auto-fix lint issues
make up-listmonk      # Convert OpenAPI YAML to JSON
```

### Local testing with n8n

```bash
make build && make link && make start
```

This builds, links the package globally, then starts n8n with the node available.

## Architecture

Node properties are auto-generated from the bundled [Listmonk OpenAPI spec](nodes/listmonk/openapi.json) using [`@devlikeapro/n8n-openapi-node`](https://github.com/nicobao/n8n-openapi-node). A custom `ListmonkOperationParser` maps the generated operation names to n8n conventions (Get, Create, Update, Delete, Get Many).

The OpenAPI spec has been enhanced beyond the upstream Listmonk spec with additional fields and endpoints not present in the official documentation.

## Credits

This node builds on the work of several upstream authors:

- Originally created by [Tobias Wiesing](https://hueske.digital) at [`loopion/n8n-nodes-listmonk`](https://github.com/loopion/n8n-nodes-listmonk)
- Forked and extended by [Martin Fenner](https://blog.front-matter.de) at [`front-matter/n8n-nodes-listmonk`](https://github.com/front-matter/n8n-nodes-listmonk)
- Forked and extended by [Sven Huijbrechts](https://dotsndots.be) at [`toSvenson/n8n-nodes-listmonk`](https://github.com/toSvenson/n8n-nodes-listmonk)
- Forked and rebranded by [David Szpunar](https://david.szpunar.com) as [`@dszp/n8n-nodes-listmonk`](https://github.com/dszp/n8n-nodes-listmonk)

## Resources

- [Listmonk Documentation](https://listmonk.app/docs/)
- [Listmonk API Reference](https://listmonk.app/docs/apis/apis/)
- [Changelog](CHANGELOG.md)
- [TODO](TODO.md)

## License

[MIT](LICENSE)

# n8n node for Listmonk API

## Overview

This node integrates the Listmonk API into n8n to manage lists, subscribers, campaigns, and related resources.

![node-actions.png](node-actions.png)

## Installation

Add the `@dszp/n8n-nodes-listmonk` package to your n8n installation:

![installation.png](installation.png)

## Configuration

Configure the base URL of your Listmonk instance (e.g., `https://listmonk.example.com`) and provide admin credentials (HTTP Basic Auth). Requests are made to the admin API under `/api`.

## Development

- Build: `pnpm build`
- Watch: `pnpm dev`
- Test: `pnpm test`
- Lint: `pnpm lint`
- Update OpenAPI: `make up-listmonk`

## Credits

Originally created by [Sven Huijbrechts](https://dotsndots.be) as [`@tosvenson/n8n-nodes-listmonk`](https://github.com/toSvenson/n8n-nodes-listmonk). Node properties are auto-generated from the [Listmonk OpenAPI spec](https://listmonk.app/docs/apis/apis/) using [`@devlikeapro/n8n-openapi-node`](https://github.com/nicobao/n8n-openapi-node).

## License

[MIT](LICENSE)

# TODO

## Near-term

- [ ] Consolidate duplicate smoke test (`nodes/listmonk/listmonk.spec.ts` overlaps with `test/listmonk.node.test.ts`)
- [ ] Add tests for non-Campaign resources (Subscribers, Lists, Templates)
- [ ] Review whether `gulpfile.js` icon copy could be replaced with a simpler `copyfiles` script
- [ ] Set up `@dszp` npm scope and configure OIDC trusted publishing for GitHub Actions

## Future

- [ ] Re-enable OpenAPI spec fetch in `update-listmonk-api.yml` if upstream spec improves
- [ ] Add Simplify toggle for operations returning many fields
- [ ] Add returnAll/limit pattern for Get Many operations
- [ ] Consider converting high-value resources to hand-written declarative definitions for better UX control
- [ ] Update `node-actions.png` screenshot to reflect current operation names
- [ ] Evaluate whether `js-yaml` and `yaml` dev dependencies are both needed (used by `make up-listmonk`)

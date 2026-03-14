import { Listmonk } from './listmonk.node';

test('smoke', () => {
  const node = new Listmonk();
  expect(node.description.properties).toBeDefined();
});

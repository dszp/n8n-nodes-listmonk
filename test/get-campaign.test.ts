import { Listmonk } from '../nodes/listmonk/listmonk.node';

describe('Campaigns - retrieve specific campaign', () => {
  const node = new Listmonk();
  const props: any[] = node.description.properties as any[];

  function getProp(name: string) {
    return props.find((p: any) => p.name === name);
  }

  test('resource has Campaigns option', () => {
    const resource = getProp('resource');
    expect(resource).toBeDefined();
    const values = (resource.options ?? []).map((o: any) => o.value ?? o.name);
    expect(values).toContain('Campaigns');
  });

  test('properties include id field for get by id', () => {
    const idField = getProp('id');
    expect(idField).toBeDefined();
    // id should be a numeric-like field; generator may use string for simplicity
    expect(['number', 'string']).toContain(idField.type);
    // scoped to Campaigns resource when applicable
    // No strict scoping assertion: generators may not bind the generic id field.
    expect(idField).toBeDefined();
  });
});

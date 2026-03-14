import { Listmonk } from '../nodes/listmonk/listmonk.node';

describe('Campaigns - bulk delete', () => {
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

  test('ids field exists for bulk delete body', () => {
    const idsField = getProp('ids');
    expect(idsField).toBeDefined();
    // Accept a variety of generator mappings for array-like input
    expect(['string', 'number', 'multiOptions', 'collection', 'json']).toContain(idsField.type);
  });
});

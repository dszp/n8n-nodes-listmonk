import { Listmonk } from '../nodes/listmonk/listmonk.node';

describe('Campaigns - delete a campaign', () => {
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

  test('id field exists for path parameter', () => {
    const idField = getProp('id');
    expect(idField).toBeDefined();
    expect(['number', 'string']).toContain(idField.type);
  });
});

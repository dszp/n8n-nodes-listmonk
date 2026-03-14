import { Listmonk } from '../nodes/listmonk/listmonk.node';

describe('Campaigns - send_at field type', () => {
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

  test('send_at exists as string for create/update', () => {
    const field = getProp('send_at');
    expect(field).toBeDefined();
    // After schema fix, generator should output a string type field
    expect(field.type).toBe('string');
  });
});

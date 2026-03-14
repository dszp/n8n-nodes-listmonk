import { Listmonk } from '../nodes/listmonk/listmonk.node';

describe('Campaigns - change status of a campaign', () => {
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

  test('status field exists (shape may vary)', () => {
    const statusField = getProp('status');
    expect(statusField).toBeDefined();
    // Basic shape checks: allow string or options depending on generator mapping
    expect(['string', 'options']).toContain(statusField.type);
    if (statusField.type === 'options') {
      expect(Array.isArray(statusField.options ?? [])).toBe(true);
    }
  });
});

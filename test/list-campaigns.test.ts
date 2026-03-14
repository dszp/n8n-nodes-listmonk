import { Listmonk } from '../nodes/listmonk/listmonk.node';

describe('Campaigns - retrieve all campaigns', () => {
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

  test('query parameter fields for listing exist', () => {
    const fieldNames = props.map((p: any) => p.name);
    const expected = [
      'status',
      'no_body',
      'page',
      'per_page',
      'tags',
      'order',
      'order_by',
      'query',
    ];
    const present = expected.every((f) => fieldNames.includes(f));
    expect(present).toBe(true);
  });
});

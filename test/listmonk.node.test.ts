import { Listmonk } from '../nodes/listmonk/listmonk.node';

describe('Listmonk node', () => {
  const node = new Listmonk();
  const props: any[] = node.description.properties as any[];

  function getProp(name: string) {
    return props.find((p: any) => p.name === name);
  }

  test('has basic metadata', () => {
    const d = node.description;
    expect(d.displayName).toBe('Listmonk');
    expect(d.name).toBe('listmonk');
    expect(d.icon).toBe('file:logo.svg');
    expect(d.usableAsTool).toBe(true);
    expect(Array.isArray(d.properties)).toBe(true);
  });

  test('requires listmonkApi credentials', () => {
    const creds = node.description.credentials ?? [];
    expect(creds.length).toBeGreaterThan(0);
    expect(creds[0].name).toBe('listmonkApi');
    expect(creds[0].required).toBe(true);
  });

  test('sets requestDefaults with baseURL from credentials', () => {
    const req = node.description.requestDefaults as any;
    expect(req).toBeDefined();
    expect(req.headers.Accept).toBe('application/json');
    expect(req.headers['Content-Type']).toBe('application/json');
    expect(req.baseURL).toBe('={{$credentials.baseUrl}}/api');
  });

  test('exposes all expected resources', () => {
    const resourceProp = getProp('resource');
    expect(resourceProp).toBeDefined();
    const resourceValues = (resourceProp.options ?? []).map((o: any) => o.value);
    const expected = [
      'Subscribers', 'Lists', 'Campaigns', 'Templates',
      'Transactional', 'Media', 'Bounces', 'Import',
    ];
    for (const r of expected) {
      expect(resourceValues).toContain(r);
    }
  });

  test('has operation properties for each resource', () => {
    const operations = props.filter(
      (p: any) => p.name === 'operation' && p.type === 'options',
    );
    expect(operations.length).toBeGreaterThan(0);
    // Each operation should be scoped to a resource
    for (const op of operations) {
      const resource = op.displayOptions?.show?.resource;
      expect(resource).toBeDefined();
      expect(Array.isArray(resource)).toBe(true);
    }
  });
});

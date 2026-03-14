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

  test('no properties have null array defaults', () => {
    const nullDefaults = props.filter(
      (p: any) => typeof p.default === 'string' && p.default.includes('null'),
    );
    expect(nullDefaults).toHaveLength(0);
  });

  test('page defaults to 1 and per_page defaults to 20', () => {
    const pageFields = props.filter((p: any) => p.name === 'page');
    const perPageFields = props.filter((p: any) => p.name === 'per_page');
    for (const f of pageFields) {
      expect(f.default).toBe(1);
    }
    for (const f of perPageFields) {
      expect(f.default).toBe(20);
    }
  });

  test('operation options have postReceive for response unwrapping', () => {
    const operations = props.filter(
      (p: any) => p.name === 'operation' && p.type === 'options',
    );
    for (const op of operations) {
      for (const option of op.options ?? []) {
        if (option.routing) {
          expect(option.routing.output).toBeDefined();
          expect(option.routing.output.postReceive).toBeDefined();
          expect(option.routing.output.postReceive.length).toBe(1);
          expect(typeof option.routing.output.postReceive[0]).toBe('function');
        }
      }
    }
  });
});

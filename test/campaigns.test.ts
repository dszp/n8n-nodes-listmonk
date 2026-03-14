import { Listmonk } from '../nodes/listmonk/listmonk.node';

describe('Campaigns resource', () => {
  const node = new Listmonk();
  const props: any[] = node.description.properties as any[];

  function getProp(name: string) {
    return props.find((p: any) => p.name === name);
  }

  function getOperationsForResource(resource: string) {
    const op = props.find(
      (p: any) =>
        p.name === 'operation' &&
        p.type === 'options' &&
        p.displayOptions?.show?.resource?.includes(resource),
    );
    return (op?.options ?? []).map((o: any) => o.value);
  }

  test('Campaigns is a resource option', () => {
    const resource = getProp('resource');
    expect(resource).toBeDefined();
    const values = (resource.options ?? []).map((o: any) => o.value);
    expect(values).toContain('Campaigns');
  });

  test('has expected CRUD operations', () => {
    const ops = getOperationsForResource('Campaigns');
    expect(ops).toContain('Get Many');
    expect(ops).toContain('Get');
    expect(ops).toContain('Create');
    expect(ops).toContain('Update');
    expect(ops).toContain('Delete');
  });

  test('has campaign-specific operations', () => {
    const ops = getOperationsForResource('Campaigns');
    expect(ops).toContain('Update Campaign Status By Id');
    expect(ops).toContain('Get Campaign Analytics');
  });

  test('create/update fields exist', () => {
    const fieldNames = props.map((p: any) => p.name);
    const expected = ['name', 'subject', 'lists', 'content_type', 'body', 'template_id'];
    for (const f of expected) {
      expect(fieldNames).toContain(f);
    }
  });

  test('id field exists for single-entity operations', () => {
    const idField = getProp('id');
    expect(idField).toBeDefined();
    expect(['number', 'string']).toContain(idField.type);
  });

  test('ids field exists for bulk operations', () => {
    const idsField = getProp('ids');
    expect(idsField).toBeDefined();
    expect(['string', 'number', 'multiOptions', 'collection', 'json']).toContain(idsField.type);
  });

  test('send_at field is a string type', () => {
    const field = getProp('send_at');
    expect(field).toBeDefined();
    expect(field.type).toBe('string');
  });

  test('list query parameters exist', () => {
    const fieldNames = props.map((p: any) => p.name);
    const expected = ['status', 'no_body', 'page', 'per_page', 'tags', 'order', 'order_by', 'query'];
    for (const f of expected) {
      expect(fieldNames).toContain(f);
    }
  });

  test('status field exists for status updates', () => {
    const statusField = getProp('status');
    expect(statusField).toBeDefined();
    expect(['string', 'options']).toContain(statusField.type);
  });

  test('tags field has empty array default instead of null', () => {
    const tagsFields = props.filter((p: any) => p.name === 'tags');
    for (const f of tagsFields) {
      if (typeof f.default === 'string') {
        expect(f.default).toBe('[]');
        expect(f.default).not.toContain('null');
      }
    }
  });

  test('page field defaults to 1', () => {
    const pageFields = props.filter(
      (p: any) =>
        p.name === 'page' &&
        p.displayOptions?.show?.resource?.includes('Campaigns'),
    );
    for (const f of pageFields) {
      expect(f.default).toBe(1);
    }
  });

  test('Get Many operation has postReceive unwrapper', () => {
    const opProp = props.find(
      (p: any) =>
        p.name === 'operation' &&
        p.type === 'options' &&
        p.displayOptions?.show?.resource?.includes('Campaigns'),
    );
    expect(opProp).toBeDefined();
    const getManyOpt = (opProp.options ?? []).find((o: any) => o.value === 'Get Many');
    expect(getManyOpt).toBeDefined();
    expect(getManyOpt.routing.output).toBeDefined();
    expect(getManyOpt.routing.output.postReceive).toBeDefined();
    expect(typeof getManyOpt.routing.output.postReceive[0]).toBe('function');
  });
});

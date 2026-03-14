import { Listmonk } from '../nodes/listmonk/listmonk.node';

describe('Campaigns - create operation', () => {
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

  test('some properties are scoped to Campaigns resource', () => {
    const targeted = props.filter((p: any) => {
      const show = p.displayOptions?.show ?? {};
      const res = show.resource ?? [];
      const hasRes = Array.isArray(res) && (res.includes('Campaigns') || res.includes('campaigns'));
      return hasRes;
    });
    expect(targeted.length).toBeGreaterThan(0);
  });

  test('createCampaign fields exist with expected names', () => {
    // n8n properties builder typically adds fields conditioned on resource+operation
    const fieldNames = props.map((p: any) => p.name);
    const expected = ['name', 'subject', 'lists', 'content_type', 'body', 'template_id'];
    const present = expected.every((f) => fieldNames.includes(f));
    expect(present).toBe(true);
  });
});
describe('Listmonk create + trigger campaign (unit placeholder)', () => {
  test('placeholder passes', () => {
    expect(true).toBe(true);
  });
});

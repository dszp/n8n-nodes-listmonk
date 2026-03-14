import { Listmonk } from '../nodes/listmonk/listmonk.node';

describe('listmonk node', () => {
	const node = new Listmonk();

	test('has basic metadata', () => {
		const d = node.description;
		expect(d.displayName).toBe('Listmonk');
		expect(d.name).toBe('listmonk');
		expect(d.icon).toBe('file:logo.svg');
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

	test('exposes resource and operation properties with expected tags', () => {
		const props: any[] = node.description.properties as any[];
		const resourceProp = props.find((p: any) => p.name === 'resource');
		const operationProp = props.find((p: any) => p.name === 'operation');
		expect(resourceProp).toBeDefined();
		expect(operationProp).toBeDefined();
		// resource options should include major Listmonk tags
		const resourceOptions = (resourceProp?.options ?? []).map((o: any) => o.value ?? o.name ?? o.id);
		expect(resourceOptions.length).toBeGreaterThan(0);
		const expectedResources = ['Subscribers', 'Lists', 'Campaigns', 'Templates', 'Transactional'];
		const normalized = resourceOptions.map((x: any) => String(x));
		const hasAnyExpected = expectedResources.some((r) => normalized.includes(r) || normalized.includes(r.toLowerCase()));
		expect(hasAnyExpected).toBe(true);
	});
});
describe('listmonk node placeholder', () => {
	test('smoke passes', () => {
		expect(true).toBe(true);
	});
});

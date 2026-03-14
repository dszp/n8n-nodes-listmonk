import type { INodeProperties } from 'n8n-workflow';

/**
 * Post-process generated properties to fix null defaults,
 * pagination defaults, and inject response unwrapping.
 */
export function fixupProperties(properties: INodeProperties[]): INodeProperties[] {
  fixNullDefaults(properties);
  fixPaginationDefaults(properties);
  skipEmptyQueryParams(properties);
  injectPostReceive(properties);
  return properties;
}

/** Replace null-containing array defaults with empty arrays. */
function fixNullDefaults(properties: INodeProperties[]): void {
  for (const prop of properties) {
    if (typeof prop.default === 'string' && prop.default.includes('null')) {
      prop.default = '[]';
    }
  }
}

/** Set sensible defaults for page/per_page fields. */
function fixPaginationDefaults(properties: INodeProperties[]): void {
  for (const prop of properties) {
    if (prop.name === 'page' && prop.default === 0) {
      prop.default = 1;
    }
    if (prop.name === 'per_page' && prop.default === 0) {
      prop.default = 20;
    }
  }
}

/**
 * Add preSend hooks to remove empty query params before the request is made.
 * n8n's routing always sends query params regardless of value — the only way
 * to conditionally skip them is via preSend deleting from requestOptions.qs.
 */
function skipEmptyQueryParams(properties: INodeProperties[]): void {
  for (const prop of properties) {
    const send = (prop as any).routing?.send;
    if (send?.type !== 'query' || !send.property) continue;

    const paramName: string = send.property;

    // JSON array fields (list_id, tags, status, ids, etc.)
    if (prop.type === 'json' && prop.default === '[]') {
      if (!send.preSend) send.preSend = [];
      send.preSend.push(makeArrayParamFilter(paramName));
    }

    // String fields with empty default
    if (prop.type === 'string' && prop.default === '') {
      if (!send.preSend) send.preSend = [];
      send.preSend.push(makeStringParamFilter(paramName));
    }
  }
}

/** Create a preSend that removes an array query param when empty. */
function makeArrayParamFilter(paramName: string) {
  return async function (
    this: any,
    requestOptions: any,
  ): Promise<any> {
    const val = requestOptions.qs?.[paramName];
    // Remove if empty array, "[]" string, null, or undefined
    if (
      val === undefined ||
      val === null ||
      val === '[]' ||
      (Array.isArray(val) && val.length === 0)
    ) {
      delete requestOptions.qs[paramName];
    }
    return requestOptions;
  };
}

/** Create a preSend that removes a string query param when empty. */
function makeStringParamFilter(paramName: string) {
  return async function (
    this: any,
    requestOptions: any,
  ): Promise<any> {
    if (!requestOptions.qs?.[paramName]) {
      delete requestOptions.qs[paramName];
    }
    return requestOptions;
  };
}

/** Inject postReceive handlers on operation options to unwrap API responses. */
function injectPostReceive(properties: INodeProperties[]): void {
  for (const prop of properties) {
    if (prop.name !== 'operation' || prop.type !== 'options' || !prop.options) continue;

    for (const option of prop.options) {
      const opt = option as any;
      if (!opt.routing) continue;

      if (!opt.routing.output) {
        opt.routing.output = {};
      }

      const value: string = opt.value;
      opt.routing.output.postReceive = [getUnwrapper(value)];
    }
  }
}

type PostReceiveFn = (
  this: any,
  items: any[],
  responseData: any,
) => Promise<any[]>;

function getUnwrapper(operationValue: string): PostReceiveFn {
  if (operationValue === 'Get Many') {
    return unwrapList;
  }
  if (operationValue.startsWith('Delete') || operationValue.startsWith('Stop')) {
    return unwrapDelete;
  }
  if (
    operationValue === 'Get' ||
    operationValue === 'Create' ||
    operationValue === 'Update'
  ) {
    return unwrapSingle;
  }
  // General unwrapper handles any shape safely
  return unwrapGeneral;
}

/** Unwrap list responses: data.results array or data array → individual items. */
const unwrapList: PostReceiveFn = async function (_items, responseData) {
  const body = responseData.body;
  const results = body?.data?.results ?? body?.data;
  if (Array.isArray(results)) {
    return results.map((item: any) => ({ json: item }));
  }
  // Single-item fallback
  return [{ json: body?.data ?? body }];
};

/** Unwrap single entity responses: data object. */
const unwrapSingle: PostReceiveFn = async function (_items, responseData) {
  const body = responseData.body;
  return [{ json: body?.data ?? body }];
};

/** Unwrap delete responses: return success indicator. */
const unwrapDelete: PostReceiveFn = async function (_items, responseData) {
  const body = responseData.body;
  return [{ json: { success: body?.data ?? true } }];
};

/** General unwrapper: handles any response shape safely. */
const unwrapGeneral: PostReceiveFn = async function (_items, responseData) {
  const body = responseData.body;
  const data = body?.data;
  if (data === undefined || data === null) return [{ json: body ?? {} }];
  if (typeof data === 'boolean') return [{ json: { success: data } }];
  if (Array.isArray(data)) {
    return data.map((item: any) => ({ json: item }));
  }
  if (data.results && Array.isArray(data.results)) {
    return data.results.map((item: any) => ({ json: item }));
  }
  return [{ json: data }];
};

import type { OpenAPIV3 } from 'openapi-types';
import {
  DefaultOperationParser,
  type OperationContext,
} from '@devlikeapro/n8n-openapi-node';

/** Convert a string to camelCase (avoids lodash runtime dependency). */
function camelCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .map((word, i) =>
      i === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    )
    .join('');
}

/**
 * Custom operation parser that produces n8n-compliant operation names.
 *
 * Naming rules applied:
 * - List operations (GET without ID param): "Get Many" with action "Get many <resource>s"
 * - Single-entity CRUD: "Get", "Create", "Update", "Delete" with action "<Verb> a <resource>"
 * - Other operations: cleaned-up startCase names without redundant resource prefix
 */
export class ListmonkOperationParser extends DefaultOperationParser {
  name(operation: OpenAPIV3.OperationObject, context: OperationContext): string {
    const defaultName = super.name(operation, context);
    const resource = this.extractResource(operation);

    // List operations: "Get <Resource>s" or "Get <Resource>" (plural collection endpoints)
    if (context.method === 'get' && this.isListOperation(context, defaultName, resource)) {
      return 'Get Many';
    }

    // Single-entity CRUD: strip the resource name and "By Id" suffix
    const simplified = this.simplifyCrudName(defaultName, resource);
    if (simplified) {
      return simplified;
    }

    // For non-CRUD operations, clean up but keep descriptive
    // Remove redundant resource prefix if present
    return this.cleanOperationName(defaultName, resource);
  }

  value(operation: OpenAPIV3.OperationObject, context: OperationContext): string {
    const name = this.name(operation, context);
    // Use camelCase for value (n8n convention)
    return camelCase(name);
  }

  action(operation: OpenAPIV3.OperationObject, context: OperationContext): string {
    const name = this.name(operation, context);
    const resource = this.extractResource(operation)?.toLowerCase() || '';

    if (name === 'Get Many') {
      return `Get many ${resource}s`;
    }
    if (name === 'Get') {
      return `Get a ${resource}`;
    }
    if (name === 'Create') {
      return `Create a ${resource}`;
    }
    if (name === 'Update') {
      return `Update a ${resource}`;
    }
    if (name === 'Delete') {
      return `Delete a ${resource}`;
    }

    // For other operations, use sentence case with resource context
    return operation.summary || name;
  }

  private extractResource(operation: OpenAPIV3.OperationObject): string | undefined {
    const tags = operation.tags;
    if (tags && tags.length > 0) {
      return tags[0];
    }
    return undefined;
  }

  private isListOperation(
    _context: OperationContext,
    defaultName: string,
    resource: string | undefined,
  ): boolean {
    if (!resource) return false;
    const nameLower = defaultName.toLowerCase();
    const resourceLower = resource.toLowerCase();

    // "Get Subscribers", "Get Lists", "Get Campaigns", "Get Bounces", etc.
    // Also matches "Get Templates", "Get Media", "Get Logs"
    // Does NOT match "Get Subscriber By Id" (has "by id")
    if (nameLower.includes('by id') || nameLower.includes('by query')) return false;

    // Matches patterns like "Get <Resources>" (plural) or exact "Get <Resource>"
    // for resources where the list endpoint uses singular (e.g., "Get Media")
    const getPattern = `get ${resourceLower}`;
    if (nameLower === getPattern || nameLower === getPattern + 's') {
      return true;
    }

    // Match specific list-like operation names
    const listPatterns = [
      'get public lists',
      'get import subscribers',
      'get import subscriber logs',
      'get running campaign stats',
    ];
    if (listPatterns.includes(nameLower)) return true;

    return false;
  }

  private simplifyCrudName(defaultName: string, resource: string | undefined): string | null {
    if (!resource) return null;
    const nameLower = defaultName.toLowerCase();
    const resourceLower = resource.toLowerCase();
    // Singular form of resource (strip trailing 's' if present for matching)
    const resourceSingular = resourceLower.endsWith('s')
      ? resourceLower.slice(0, -1)
      : resourceLower;

    // "Get <Resource> By Id" → "Get"
    if (
      nameLower.match(
        new RegExp(`^get ${resourceSingular}e?s?\\s+by\\s+id$`, 'i'),
      )
    ) {
      return 'Get';
    }

    // "Create <Resource>" → "Create"
    if (nameLower === `create ${resourceSingular}` || nameLower === `create ${resourceLower}`) {
      return 'Create';
    }

    // "Update <Resource> By Id" → "Update"
    if (
      nameLower.match(
        new RegExp(`^update ${resourceSingular}e?s?\\s+by\\s+id$`, 'i'),
      )
    ) {
      return 'Update';
    }

    // "Delete <Resource> By Id" → "Delete"
    if (
      nameLower.match(
        new RegExp(`^delete ${resourceSingular}e?s?\\s+by\\s+id$`, 'i'),
      )
    ) {
      return 'Delete';
    }

    return null;
  }

  private cleanOperationName(defaultName: string, resource: string | undefined): string {
    if (!resource) return defaultName;

    // Remove resource name prefix if it's redundant
    // e.g., "Subscriber Send Optin By Id" → "Send Optin By Id" (for Subscribers resource)
    const resourceSingular = resource.endsWith('s') ? resource.slice(0, -1) : resource;
    let cleaned = defaultName;

    if (cleaned.startsWith(resourceSingular + ' ')) {
      cleaned = cleaned.slice(resourceSingular.length + 1);
    }
    if (cleaned.startsWith(resource + ' ')) {
      cleaned = cleaned.slice(resource.length + 1);
    }

    // Clean up "By Id" suffix for operations that are clearly ID-based
    // but keep it if the operation name would be ambiguous without it
    return cleaned || defaultName;
  }
}

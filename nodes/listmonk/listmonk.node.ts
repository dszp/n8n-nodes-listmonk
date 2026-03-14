import type { INodeType, INodeTypeDescription } from 'n8n-workflow';
import {
  N8NPropertiesBuilder,
  type N8NPropertiesBuilderConfig,
} from '@devlikeapro/n8n-openapi-node';
import { ListmonkOperationParser } from './ListmonkOperationParser';
import { fixupProperties } from './fixupProperties';
import * as doc from './openapi.json';

const config: N8NPropertiesBuilderConfig = {
  operation: new ListmonkOperationParser(),
};
const parser = new N8NPropertiesBuilder(doc as any, config);
const properties = fixupProperties(parser.build());

// n8n loads the class by the filename stem (lowercase "listmonk"), so we
// need a lowercase export alias alongside the PascalCase class name.
export { Listmonk as listmonk };

export class Listmonk implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Listmonk',
    name: 'listmonk',
    icon: 'file:logo.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with Listmonk API',
    defaults: {
      name: 'Listmonk',
    },
    inputs: ['main'],
    outputs: ['main'],
    usableAsTool: true,
    credentials: [
      {
        name: 'listmonkApi',
        required: true,
      },
    ],
    requestDefaults: {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      baseURL: '={{$credentials.baseUrl}}/api',
    },
    properties,
  };
}

import type {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class listmonkApi implements ICredentialType {
  name = 'listmonkApi';
  displayName = 'Listmonk API';
  documentationUrl = 'https://listmonk.app/docs/apis/apis/';
  icon = 'file:logo.svg' as const;
  properties: INodeProperties[] = [
    {
      displayName: 'Base URL',
      name: 'baseUrl',
      type: 'string',
      default: '',
      placeholder: 'https://listmonk.example.com',
      required: true,
      description: 'Your Listmonk base URL (without trailing slash)',
    },
    {
      displayName: 'API Username',
      name: 'username',
      type: 'string',
      default: '',
      required: true,
      description: 'API user created in Listmonk under Admin > Users',
    },
    {
      displayName: 'API Token',
      name: 'password',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
      description: 'API token for the user, generated in Listmonk under Admin > Users',
    },
  ];

  // Listmonk accepts Basic Auth with api_user:token credentials
  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      auth: {
        username: '={{$credentials.username}}',
        password: '={{$credentials.password}}',
      },
    },
  };

  // Smoke test: fetch lists to validate credentials and base URL
  test: ICredentialTestRequest = {
    request: {
      url: '=/api/lists',
      baseURL: '={{$credentials.baseUrl}}',
      method: 'GET',
    },
  };
}

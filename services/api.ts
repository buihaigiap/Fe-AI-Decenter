import { API_BASE_URL } from '../config';
import { Organization, Repository, CreateOrganizationRequest, UpdateOrganizationRequest, OrganizationMember, AddMemberRequest, CreateRepositoryRequest } from '../types';

// Interface to match the structure of the API response for organizations
interface OrganizationsApiResponse {
  organizations: Organization[];
}

// Interface to match the structure of the API response for repositories
interface RepositoriesApiResponse {
  repositories: Repository[];
}

// Interface to match a potential nested structure for members API response
interface OrganizationMembersApiResponse {
  members: OrganizationMember[];
}


class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchWithAuth<T>(
  endpoint: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${token}`);
  if (options.method === 'POST' || options.method === 'PUT' || options.method === 'PATCH') {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Failed to read error response');
    console.error(`API Error: ${response.status} ${response.statusText}`, errorText);
    throw new ApiError(`Request failed with status ${response.status}`, response.status);
  }

  // Handle cases with no response body (e.g., 204 No Content)
  if (response.status === 204) {
    return null as T;
  }

  return response.json() as Promise<T>;
}


export const fetchOrganizations = async (token: string): Promise<Organization[]> => {
  const data = await fetchWithAuth<OrganizationsApiResponse>('/api/v1/organizations', token);
  // The API returns an object { organizations: [...] }, so we extract the array.
  // Provide a fallback to an empty array in case the response is malformed.
  return data?.organizations || [];
};

export const createOrganization = (data: CreateOrganizationRequest, token: string): Promise<Organization> => {
  return fetchWithAuth<Organization>('/api/v1/organizations', token, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateOrganization = (orgId: number, data: UpdateOrganizationRequest, token: string): Promise<Organization> => {
  return fetchWithAuth<Organization>(`/api/v1/organizations/${orgId}`, token, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteOrganization = (orgId: number, token: string): Promise<void> => {
  return fetchWithAuth<void>(`/api/v1/organizations/${orgId}`, token, {
    method: 'DELETE',
  });
};

export const fetchRepositories = async (namespace: string, token: string): Promise<Repository[]> => {
  // NOTE: This endpoint for GET is not in the provided OpenAPI spec, but is inferred from other endpoints.
  const data = await fetchWithAuth<RepositoriesApiResponse>(`/api/v1/repos/${namespace}`, token);
  return data?.repositories || [];
};

export const createRepository = (namespace: string, data: CreateRepositoryRequest, token: string): Promise<Repository> => {
  return fetchWithAuth<Repository>(`/api/v1/repos/${namespace}`, token, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const fetchOrganizationMembers = async (orgId: number, token: string): Promise<OrganizationMember[]> => {
  const data = await fetchWithAuth<OrganizationMembersApiResponse | OrganizationMember[]>(`/api/v1/organizations/${orgId}/members`, token);
  // Defensively handle both direct array response and nested object response
  if (Array.isArray(data)) {
    return data;
  }
  return data?.members || [];
};

export const addOrganizationMember = (orgId: number, data: AddMemberRequest, token: string): Promise<OrganizationMember> => {
  return fetchWithAuth<OrganizationMember>(`/api/v1/organizations/${orgId}/members`, token, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};
import { API_BASE_URL } from '../config';
import { Organization, Repository, CreateOrganizationRequest } from '../types';

// Interface to match the structure of the API response for organizations
interface OrganizationsApiResponse {
  organizations: Organization[];
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
  headers.set('Content-Type', 'application/json');

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

export const fetchRepositories = (orgId: number, token: string): Promise<Repository[]> => {
  return fetchWithAuth<Repository[]>(`/api/v1/orgs/${orgId}/repos`, token);
};
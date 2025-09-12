// Fix: Define AuthMode enum here to remove circular dependency.
export enum AuthMode {
  Login = 'LOGIN',
  Register = 'REGISTER',
}

export interface Organization {
  id: number;
  name: string;
  display_name: string;
  description: string | null;
  avatar_url: string | null;
  website_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateOrganizationRequest {
  name: string;
  display_name: string;
  description?: string | null;
  avatar_url?: string | null;
  website_url?: string | null;
}


export interface Repository {
  id: number;
  organization_id: number;
  name: string;
  description: string | null;
  visibility: 'public' | 'private';
}
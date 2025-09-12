// FIX: Removed incorrect import of 'AuthMode' from './pages/AuthPage' which caused a circular dependency.
export enum AuthMode {
  Login = 'login',
  Register = 'register',
}

export enum OrganizationRole {
  Admin = 'admin',
  Member = 'member',
}

export interface OrganizationMember {
  id: number;
  organization_id: number;
  user_id: number;
  role: string; 
  joined_at: string;
  username: string;
  email: string;
}

export interface AddMemberRequest {
  email: string;
  role: OrganizationRole;
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

export interface CreateRepositoryRequest {
  name: string;
  description?: string | null;
  visibility: 'public' | 'private';
}
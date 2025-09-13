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

export interface UpdateOrganizationRequest {
  display_name?: string;
  description?: string | null;
  avatar_url?: string | null;
  website_url?: string | null;
}


export interface Repository {
  id: number;
  organization_id: number;
  name: string;
  description: string | null;
  is_public: boolean;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface CreateRepositoryRequest {
  name: string;
  description?: string | null;
  is_public: boolean;
}

export interface RepositoryPermission {
  id: number;
  repository_id: number;
  permission: 'read' | 'write' | 'admin';
  granted_by: number;
  created_at: string;
  updated_at: string;
  user_id?: number | null;
  organization_id?: number | null;
}

export interface RepositoryDetailsResponse {
  repository: Repository;
  tags: string[];
  user_permissions: RepositoryPermission[];
  org_permissions: RepositoryPermission[];
}
// Fix: Replaced incorrect file content with proper type definitions.
export enum AuthMode {
  Login = 'login',
  Register = 'register',
}

export enum OrganizationRole {
  Owner = 'Owner',
  Admin = 'Admin',
  Member = 'Member',
}

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Organization {
  id: number;
  name: string;
  display_name: string;
  description: string | null;
  avatar_url: string | null;
  website_url: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateOrganizationRequest {
  name: string;
  display_name: string;
  description: string;
  avatar_url?: string;
  website_url?: string;
}

export interface UpdateOrganizationRequest {
  display_name: string;
  description: string;
  avatar_url?: string;
  website_url?: string;
}

export interface OrganizationMember {
  id: number; // This is the membership ID
  user_id: number; // This is the user's ID
  username: string;
  email: string;
  role: string;
}

export interface AddMemberRequest {
  email: string;
  role: OrganizationRole;
}

export interface Repository {
  id: number;
  name: string;
  description: string | null;
  is_public: boolean;
  organization?: {
    name: string;
  };
}

export interface CreateRepositoryRequest {
  name:string;
  description: string | null;
  is_public: boolean;
}

export interface ImageLayer {
  digest: string;
  size: string;
}

export interface ImageHistoryItem {
  command: string;
  details: string;
}

export interface ImageConfig {
  created: string;
  dockerVersion: string;
  osArch: string;
  labels: Record<string, string>;
}


export interface ImageTag {
  name: string;
  digest: string;
  osArch: string;
  size: string;
  pushedAt: string;
  // Detailed information for the tag detail view
  config: ImageConfig;
  layers: ImageLayer[];
  history: ImageHistoryItem[];
}

export interface Webhook {
  id: number;
  url: string;
  events: string[];
  lastDelivery?: {
    status: 'success' | 'failed';
    timestamp: string;
  };
}
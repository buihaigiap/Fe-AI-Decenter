import React, { useState } from 'react';
import { Organization, User } from '../../types';
import OrganizationList from './OrganizationList';
import CreateOrganizationForm from './CreateOrganizationForm';
import Button from '../Button';
import { PlusIcon } from '../icons/PlusIcon';
import OrganizationDetail from './OrganizationDetail';
import { BriefcaseIcon } from '../icons/BriefcaseIcon';

interface OrganizationsManagerProps {
  token: string;
  currentUser: User;
  organizations: Organization[];
  isLoading: boolean;
  error: string | null;
  onDataChange: () => void;
}

const OrganizationsManager: React.FC<OrganizationsManagerProps> = ({
  token,
  currentUser,
  organizations,
  isLoading,
  error,
  onDataChange,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  
  const handleCreationSuccess = () => {
    setShowCreateForm(false);
    onDataChange(); 
  }

  const handleDataChange = () => {
    setSelectedOrganization(null);
    onDataChange();
  };

  const handleSelectOrganization = (org: Organization) => {
    setSelectedOrganization(org);
    setShowCreateForm(false); // Hide create form when selecting an org
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-50">Organizations</h2>
          {!showCreateForm && (
              <Button onClick={() => { setShowCreateForm(true); setSelectedOrganization(null); }} fullWidth={false} className="whitespace-nowrap">
                  <PlusIcon className="w-5 h-5 -ml-1 mr-2" />
                  Create New
              </Button>
          )}
        </div>

        {isLoading && <div className="text-center py-8 text-slate-400">Loading organizations...</div>}
        {error && <div className="text-center py-8 text-red-500">{error}</div>}
        {!isLoading && !error && (
            <OrganizationList 
                organizations={organizations} 
                onSelectOrganization={handleSelectOrganization}
                selectedOrganizationId={selectedOrganization?.id ?? null}
            />
        )}
      </div>
      <div className="lg:col-span-2">
        {showCreateForm && (
            <CreateOrganizationForm 
                token={token} 
                onSuccess={handleCreationSuccess}
                onCancel={() => setShowCreateForm(false)}
            />
        )}

        {!showCreateForm && selectedOrganization && (
            <OrganizationDetail 
                key={selectedOrganization.id} // Re-mount component on org change
                token={token}
                currentUser={currentUser}
                organization={selectedOrganization} 
                onDataChange={handleDataChange}
            />
        )}

        {!showCreateForm && !selectedOrganization && (
            <div className="relative h-full flex items-center justify-center bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden min-h-[400px]">
                <div 
                    className="absolute inset-0 z-0 opacity-20"
                    style={{
                        background: `radial-gradient(circle at center, rgba(79, 70, 229, 0.5) 0%, transparent 70%)`,
                    }}
                />
                <div className="relative z-10 text-center p-6 flex flex-col items-center">
                    <BriefcaseIcon className="w-24 h-24 text-slate-500 animate-subtle-pulse" />
                    <h3 className="text-xl font-semibold text-slate-200 mt-6">Manage Your Organization</h3>
                    <p className="text-slate-400 mt-2 max-w-sm">Select an organization from the list to view its details, or create a new one to get started.</p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationsManager;
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

  // This will help animate the right column when its content changes
  const rightColumnKey = showCreateForm ? 'create' : selectedOrganization?.id ?? 'placeholder';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column - List of Orgs */}
      <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-slate-100">Your Organizations</h2>
          {!showCreateForm && (
              <Button onClick={() => { setShowCreateForm(true); setSelectedOrganization(null); }} fullWidth={false} className="whitespace-nowrap flex-shrink-0">
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

      {/* Right Column - Details / Create Form / Placeholder */}
      <div className="lg:col-span-8">
        <div key={rightColumnKey} className="animate-fade-in-up">
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
                 <div className="relative h-full flex items-center justify-center bg-slate-900/30 border border-slate-700/80 rounded-2xl overflow-hidden min-h-[400px] lg:min-h-[60vh]">
                    {/* Background Effects */}
                    <div className="absolute inset-0 z-0 animate-bg-grid-flow opacity-20" style={{ backgroundImage: `linear-gradient(rgba(203, 213, 225, 0.08) 1px, transparent 1px), linear-gradient(to right, rgba(203, 213, 225, 0.08) 1px, transparent 1px)`, backgroundSize: '2rem 2rem' }} />
                    <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/30" />
                    <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15)_0%,transparent_40%)]" />

                    {/* Content */}
                    <div className="relative z-10 text-center p-8 flex flex-col items-center">
                        <div className="p-5 bg-slate-800/50 rounded-full border border-slate-700 shadow-lg">
                            <BriefcaseIcon className="w-16 h-16 text-indigo-400 animate-subtle-pulse" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-100 mt-6">Manage Your Organization</h3>
                        <p className="text-slate-400 mt-2 max-w-sm">Select an organization from the list to view its details, or create a new one to get started.</p>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default OrganizationsManager;
// FIX: Create the OrganizationsManager component, which was missing. This component orchestrates the display of the organization list, details, and creation form.
import React, { useState, useEffect } from 'react';
import { Organization, User } from '../../types';
import OrganizationList from './OrganizationList';
import OrganizationDetail from './OrganizationDetail';
import CreateOrganizationForm from './CreateOrganizationForm';
import Button from '../Button';
import { PlusIcon } from '../icons/PlusIcon';
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
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Effect to select the first organization by default if one exists and none is selected.
  // Also deselect if the selected one is no longer in the list.
  useEffect(() => {
    if (organizations.length > 0 && !showCreateForm) {
      if (selectedOrganization) {
        // If selected org is no longer in the list, select the first one
        if (!organizations.find(o => o.id === selectedOrganization.id)) {
          setSelectedOrganization(organizations[0]);
        }
      } else {
        // If no org is selected, select the first one
        setSelectedOrganization(organizations[0]);
      }
    } else if (organizations.length === 0) {
      // If there are no orgs, ensure nothing is selected
      setSelectedOrganization(null);
    }
  }, [organizations, selectedOrganization, showCreateForm]);
  
  const handleSelectOrganization = (org: Organization) => {
    setSelectedOrganization(org);
    setShowCreateForm(false);
  };

  const handleShowCreateForm = () => {
    setSelectedOrganization(null);
    setShowCreateForm(true);
  };
  
  const handleCreationSuccess = () => {
    setShowCreateForm(false);
    onDataChange(); // This will trigger a refetch in the parent page
  };
  
  const handleCancelCreate = () => {
    setShowCreateForm(false);
    // If there are organizations, select the first one after cancelling
    if (organizations.length > 0) {
        setSelectedOrganization(organizations[0]);
    }
  };

  const renderContent = () => {
    if (showCreateForm) {
      return (
        <CreateOrganizationForm
          token={token}
          onSuccess={handleCreationSuccess}
          onCancel={handleCancelCreate}
        />
      );
    }
    if (selectedOrganization) {
      return (
        <OrganizationDetail
          key={selectedOrganization.id} // Re-mount when org changes
          token={token}
          currentUser={currentUser}
          organization={selectedOrganization}
          onDataChange={onDataChange}
        />
      );
    }
    return (
      <div className="h-full flex flex-col items-center justify-center text-center bg-slate-800/50 border border-slate-700/80 rounded-xl p-8">
        <BriefcaseIcon className="h-20 w-20 text-slate-600 mb-4" />
        <h3 className="text-xl font-bold text-slate-300">Select an Organization</h3>
        <p className="text-slate-400 mt-2 max-w-sm">
          Select an organization from the list to view its details, or create a new one to get started.
        </p>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-4">
        <Button onClick={handleShowCreateForm} fullWidth={true}>
            <PlusIcon className="w-5 h-5 -ml-1 mr-2" />
            Create New Organization
        </Button>
        {isLoading ? (
          <p className="text-slate-400 text-center py-4">Loading organizations...</p>
        ) : error ? (
          <p className="text-red-500 text-center py-4">{error}</p>
        ) : (
          <OrganizationList
            organizations={organizations}
            selectedOrganizationId={selectedOrganization?.id || null}
            onSelectOrganization={handleSelectOrganization}
          />
        )}
      </div>

      <div className="lg:col-span-2">
        {renderContent()}
      </div>
    </div>
  );
};

export default OrganizationsManager;

import React, { useState } from 'react';
import { Organization } from '../../types';
import OrganizationList from './OrganizationList';
import CreateOrganizationForm from './CreateOrganizationForm';
import Button from '../Button';
import { PlusIcon } from '../icons/PlusIcon';

interface OrganizationsManagerProps {
  token: string;
  organizations: Organization[];
  isLoading: boolean;
  error: string | null;
  onDataChange: () => void;
}

const OrganizationsManager: React.FC<OrganizationsManagerProps> = ({
  token,
  organizations,
  isLoading,
  error,
  onDataChange,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const handleCreationSuccess = () => {
    setShowCreateForm(false);
    onDataChange(); // Trigger a refetch in the parent component
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-50">Organizations</h2>
        {!showCreateForm && (
            <Button onClick={() => setShowCreateForm(true)} fullWidth={false}>
                <PlusIcon className="w-5 h-5 -ml-1 mr-2" />
                Create New Organization
            </Button>
        )}
      </div>

      {showCreateForm && (
        <CreateOrganizationForm 
            token={token} 
            onSuccess={handleCreationSuccess}
            onCancel={() => setShowCreateForm(false)}
        />
      )}

      {isLoading && <div className="text-center py-8 text-slate-400">Loading organizations...</div>}
      {error && <div className="text-center py-8 text-red-500">{error}</div>}
      {!isLoading && !error && <OrganizationList organizations={organizations} />}
    </div>
  );
};

export default OrganizationsManager;

import React, { useEffect } from 'react';
import { Organization } from '../../types';

interface OrganizationSelectorProps {
  organizations: Organization[];
  isLoading: boolean;
  error: string | null;
  selectedOrganizationId: number | null;
  onOrganizationSelect: (orgId: number | null) => void;
}

const OrganizationSelector: React.FC<OrganizationSelectorProps> = ({ 
  organizations, 
  isLoading, 
  error, 
  selectedOrganizationId,
  onOrganizationSelect 
}) => {

  useEffect(() => {
    // If there's no selection but there are organizations available, select the first one.
    if (selectedOrganizationId === null && organizations.length > 0) {
      onOrganizationSelect(organizations[0].id);
    }
  }, [organizations, selectedOrganizationId, onOrganizationSelect]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const orgId = Number(event.target.value);
    onOrganizationSelect(orgId || null);
  };
  
  const value = selectedOrganizationId ?? "";

  if (isLoading) {
    return (
       <select
        disabled
        className="block w-full max-w-xs px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-slate-400 focus:outline-none sm:text-sm"
       >
         <option>Loading Orgs...</option>
       </select>
    );
  }

  if (error) {
    return (
      <select
        disabled
        className="block w-full max-w-xs px-4 py-2 bg-red-900/50 border border-red-700 rounded-md text-red-300 focus:outline-none sm:text-sm"
       >
         <option>{error}</option>
       </select>
    );
  }

  return (
    <select
      value={value}
      onChange={handleChange}
      className="block w-full max-w-xs px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      aria-label="Select an organization"
    >
      {organizations.length === 0 ? (
        <option value="">No organizations found</option>
      ) : (
        organizations.map(org => (
          <option key={org.id} value={org.id}>
            {org.display_name}
          </option>
        ))
      )}
    </select>
  );
};

export default OrganizationSelector;
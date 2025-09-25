import React from 'react';
import { Organization } from '../../types';
import OrganizationListItem from './OrganizationListItem';
import { BriefcaseIcon } from '../icons/BriefcaseIcon';

interface OrganizationListProps {
  organizations: Organization[];
  selectedOrganizationId: number | null;
  onSelectOrganization: (organization: Organization) => void;
}

const OrganizationList: React.FC<OrganizationListProps> = ({ organizations, selectedOrganizationId, onSelectOrganization }) => {
  if (organizations.length === 0) {
    return (
      <div className="text-center py-10 px-4 bg-slate-800/50 border border-slate-700/80 rounded-xl">
        <BriefcaseIcon className="mx-auto h-12 w-12 text-slate-500" />
        <h3 className="mt-2 text-lg font-medium text-slate-300">No Organizations Found</h3>
        <p className="text-slate-400 mt-1">Get started by creating a new organization.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
        {organizations.map(org => (
            <OrganizationListItem 
                key={org.id} 
                organization={org} 
                isSelected={org.id === selectedOrganizationId}
                onSelect={() => onSelectOrganization(org)}
            />
        ))}
    </ul>
  );
};

export default OrganizationList;
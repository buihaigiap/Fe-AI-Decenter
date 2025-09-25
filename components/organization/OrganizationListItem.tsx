import React from 'react';
import { Organization } from '../../types';
import { AerugoIcon } from '../icons/DockerIcon';

interface OrganizationListItemProps {
  organization: Organization;
  isSelected: boolean;
  onSelect: () => void;
}

const OrganizationListItem: React.FC<OrganizationListItemProps> = ({ organization, isSelected, onSelect }) => {
  const baseClasses = "w-full text-left p-4 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-800 rounded-lg transform";
  const selectedClasses = "bg-indigo-900/40 shadow-lg shadow-indigo-950/50 scale-[1.03]";
  const hoverClasses = "hover:bg-slate-700/50 hover:scale-[1.03]";
  
  return (
    <li>
        <button
            onClick={onSelect}
            className={`${baseClasses} ${isSelected ? selectedClasses : hoverClasses}`}
        >
            <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                    {organization.avatar_url ? (
                        <img className="h-10 w-10 rounded-full object-cover" src={organization.avatar_url} alt={`${organization.display_name} avatar`} />
                    ) : (
                        <span className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600">
                            <AerugoIcon className="h-6 w-6 text-slate-400" />
                        </span>
                    )}
                </div>
                <div className="flex-1 text-left min-w-0">
                    <p className="text-md font-semibold text-slate-50 truncate">{organization.display_name}</p>
                    <p className="text-sm text-slate-400 truncate">@{organization.name}</p>
                </div>
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse-glow opacity-100"></div>
                )}
            </div>
        </button>
    </li>
  );
};

export default OrganizationListItem;
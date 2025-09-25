import React from 'react';
import { Organization } from '../../types';
import { AerugoIcon } from '../icons/DockerIcon';

interface OrganizationListItemProps {
  organization: Organization;
  isSelected: boolean;
  onSelect: () => void;
}

const OrganizationListItem: React.FC<OrganizationListItemProps> = ({ organization, isSelected, onSelect }) => {
  
  return (
    <li>
        <button
            onClick={onSelect}
            className={`relative group w-full text-left p-4 rounded-lg border transition-all duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
                ${isSelected 
                    ? 'border-indigo-500/60 bg-indigo-950/30 shadow-lg shadow-indigo-950/50 scale-[1.02]' 
                    : 'border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 hover:border-slate-600 hover:scale-[1.02]'
                }`
            }
        >
            {/* Glow effect for selected item */}
            {isSelected && <div className="absolute -inset-px rounded-lg bg-indigo-500/30 blur-lg animate-pulse -z-10"></div>}
            
            <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                    {organization.avatar_url ? (
                        <img className="h-10 w-10 rounded-full object-cover border-2 border-slate-600/50" src={organization.avatar_url} alt={`${organization.display_name} avatar`} />
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
                 {/* Indicator dot */}
                <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${isSelected ? 'bg-indigo-400 shadow-[0_0_8px_theme(colors.indigo.500)]' : 'bg-transparent'}`}></div>
            </div>
        </button>
    </li>
  );
};

export default OrganizationListItem;
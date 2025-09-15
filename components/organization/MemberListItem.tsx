import React from 'react';
import { OrganizationMember } from '../../types';

interface MemberListItemProps {
  member: OrganizationMember;
}

const MemberListItem: React.FC<MemberListItemProps> = ({ member }) => {
  
  const roleColors: { [key: string]: string } = {
    owner: 'bg-purple-900/70 text-purple-300',
    admin: 'bg-indigo-900/70 text-indigo-300',
    member: 'bg-slate-600/70 text-slate-300',
  };

  const roleClass = roleColors[member.role.toLowerCase()] || roleColors.member;

  // Capitalize the first letter of the role for display
  const displayRole = member.role.charAt(0).toUpperCase() + member.role.slice(1);

  return (
    <li className="p-4 flex items-center justify-between">
      <div className="flex-1">
        <p className="text-md font-semibold text-slate-100">{member.username}</p>
        <p className="text-sm text-slate-400">{member.email}</p>
      </div>
      <div className="flex items-center space-x-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${roleClass}`}>
          {displayRole}
        </span>
        {/* Placeholder for future actions */}
      </div>
    </li>
  );
};

export default MemberListItem;
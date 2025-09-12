import React from 'react';
import { OrganizationMember } from '../../types';

interface MemberListItemProps {
  member: OrganizationMember;
}

const MemberListItem: React.FC<MemberListItemProps> = ({ member }) => {
  
  const roleColors: { [key: string]: string } = {
    admin: 'bg-indigo-900/70 text-indigo-300',
    member: 'bg-slate-600/70 text-slate-300',
  };

  const roleClass = roleColors[member.role.toLowerCase()] || roleColors.member;

  return (
    <li className="p-4 flex items-center justify-between">
      <div className="flex-1">
        <p className="text-md font-semibold text-slate-100">{member.username}</p>
        <p className="text-sm text-slate-400">{member.email}</p>
      </div>
      <div className="flex items-center space-x-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${roleClass}`}>
          {member.role}
        </span>
        {/* Placeholder for future actions */}
      </div>
    </li>
  );
};

export default MemberListItem;
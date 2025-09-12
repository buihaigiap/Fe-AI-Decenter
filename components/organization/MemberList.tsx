import React from 'react';
import { OrganizationMember } from '../../types';
import MemberListItem from './MemberListItem';
import { UsersIcon } from '../icons/UsersIcon';

interface MemberListProps {
  members: OrganizationMember[];
}

const MemberList: React.FC<MemberListProps> = ({ members }) => {
  if (members.length === 0) {
    return (
      <div className="text-center py-10 px-4 border-2 border-dashed border-slate-700 rounded-lg">
        <UsersIcon className="mx-auto h-12 w-12 text-slate-500" />
        <h3 className="mt-2 text-lg font-medium text-slate-300">No Members Found</h3>
        <p className="text-slate-400 mt-1">This organization doesn't have any members yet.</p>
      </div>
    );
  }
  return (
    <div className="border border-slate-700 rounded-lg">
      <ul className="divide-y divide-slate-700">
        {members.map(member => (
          <MemberListItem key={member.id} member={member} />
        ))}
      </ul>
    </div>
  );
};

export default MemberList;
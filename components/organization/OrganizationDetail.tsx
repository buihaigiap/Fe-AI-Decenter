import React, { useState, useEffect, useCallback } from 'react';
import { Organization, OrganizationMember } from '../../types';
import { fetchOrganizationMembers } from '../../services/api';
import MemberList from './MemberList';
import Button from '../Button';
import { PlusIcon } from '../icons/PlusIcon';
import AddMemberForm from './AddMemberForm';

interface OrganizationDetailProps {
  token: string;
  organization: Organization;
}

const OrganizationDetail: React.FC<OrganizationDetailProps> = ({ token, organization }) => {
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const getMembers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const memberList = await fetchOrganizationMembers(organization.id, token);
      setMembers(memberList);
    } catch (err) {
      setError('Failed to load members.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [organization.id, token]);

  useEffect(() => {
    getMembers();
  }, [getMembers]);

  const handleSuccess = () => {
      setShowAddForm(false);
      getMembers(); // Refresh member list
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-6 space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-50">{organization.display_name}</h2>
        <p className="text-slate-400">Manage your organization's members.</p>
      </header>
      
      <div className="flex justify-end">
         {!showAddForm && (
            <Button onClick={() => setShowAddForm(true)} fullWidth={false}>
                <PlusIcon className="w-5 h-5 -ml-1 mr-2" />
                Add Member
            </Button>
         )}
      </div>

      {showAddForm && (
        <AddMemberForm 
            token={token}
            orgId={organization.id}
            onSuccess={handleSuccess}
            onCancel={() => setShowAddForm(false)}
        />
      )}

      <main>
        {isLoading ? (
          <div className="text-center py-8 text-slate-400">Loading members...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <MemberList members={members} />
        )}
      </main>
    </div>
  );
};

export default OrganizationDetail;
import React, { useState, useEffect, useCallback } from 'react';
import Button from '../components/Button';
import OrganizationSelector from '../components/organization/OrganizationSelector';
import RepositoryBrowser from '../components/repository/RepositoryBrowser';
import OrganizationsManager from '../components/organization/OrganizationsManager';
import { Organization, User } from '../types';
import { fetchOrganizations } from '../services/api';
import { AerugoIcon } from '../components/icons/DockerIcon';

interface DashboardPageProps {
  token: string;
  currentUser: User;
  onLogout: () => void;
}

type View = 'repositories' | 'organizations';

const DashboardPage: React.FC<DashboardPageProps> = ({ token, currentUser, onLogout }) => {
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);
  const [view, setView] = useState<View>('repositories');
  
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoadingOrgs, setIsLoadingOrgs] = useState(true);
  const [orgsError, setOrgsError] = useState<string | null>(null);

  const getOrganizations = useCallback(async () => {
    try {
      setIsLoadingOrgs(true);
      setOrgsError(null);
      const orgs = await fetchOrganizations(token);
      setOrganizations(Array.isArray(orgs) ? orgs : []);
    } catch (err) {
      setOrgsError('Failed to load organizations.');
      setOrganizations([]);
      console.error(err);
    } finally {
      setIsLoadingOrgs(false);
    }
  }, [token]);

  useEffect(() => {
    getOrganizations();
  }, [getOrganizations]);

  useEffect(() => {
    // This effect handles maintaining a valid selection if the list of orgs changes.
    // For example, if the currently selected organization is deleted.
    if (selectedOrgId && !organizations.some(o => o.id === selectedOrgId)) {
      // Fallback to the first organization in the list, or to "All" if no organizations are left.
      setSelectedOrgId(organizations.length > 0 ? organizations[0].id : null);
    }
  }, [organizations, selectedOrgId]);


  const NavLink: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        active
          ? 'bg-slate-700 text-white'
          : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
      }`}
    >
      {children}
    </button>
  );

  const selectedOrg = organizations.find(o => o.id === selectedOrgId);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      <header className="bg-slate-800/50 border-b border-slate-700 backdrop-blur-sm sticky top-0 z-10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
               <div className="flex items-center space-x-3">
                  <AerugoIcon className="h-7 w-7 text-blue-500" />
                  <h1 className="text-xl font-bold text-slate-50">Aerugo Registry</h1>
               </div>
              <div className="flex items-center space-x-4">
                  <NavLink active={view === 'repositories'} onClick={() => setView('repositories')}>
                    Repositories
                  </NavLink>
                  <NavLink active={view === 'organizations'} onClick={() => setView('organizations')}>
                    Organizations
                  </NavLink>
              </div>
            </div>
            <div className="flex items-center space-x-4">
               {view === 'repositories' && (
                 <OrganizationSelector 
                    organizations={organizations}
                    isLoading={isLoadingOrgs}
                    error={orgsError}
                    onOrganizationSelect={setSelectedOrgId} 
                    selectedOrganizationId={selectedOrgId}
                  />
               )}
               <p className="text-sm text-slate-300 hidden sm:block">Welcome, {currentUser.username}</p>
               <Button onClick={onLogout} variant="danger" fullWidth={false}>
                Logout
              </Button>
            </div>
          </div>
        </nav>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {view === 'repositories' ? (
            <RepositoryBrowser key={selectedOrgId ?? 'all'} token={token} organizationName={selectedOrg?.name} />
        ) : (
          <OrganizationsManager 
            token={token}
            currentUser={currentUser}
            organizations={organizations}
            isLoading={isLoadingOrgs}
            error={orgsError}
            onDataChange={getOrganizations}
          />
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
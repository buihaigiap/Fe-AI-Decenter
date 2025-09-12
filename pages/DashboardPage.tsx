
import React, { useState, useEffect, useCallback } from 'react';
import Button from '../components/Button';
import OrganizationSelector from '../components/organization/OrganizationSelector';
import RepositoryBrowser from '../components/repository/RepositoryBrowser';
import OrganizationsManager from '../components/organization/OrganizationsManager';
import { Organization } from '../types';
import { fetchOrganizations } from '../services/api';
import { AerugoIcon } from '../components/icons/DockerIcon';

interface DashboardPageProps {
  token: string;
  onLogout: () => void;
}

type View = 'repositories' | 'organizations';

const DashboardPage: React.FC<DashboardPageProps> = ({ token, onLogout }) => {
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
      const validOrgs = Array.isArray(orgs) ? orgs : [];
      setOrganizations(validOrgs);
      
      if (validOrgs.length > 0 && (!selectedOrgId || !validOrgs.some(o => o.id === selectedOrgId))) {
        setSelectedOrgId(validOrgs[0].id);
      } else if (validOrgs.length === 0) {
        setSelectedOrgId(null);
      }
    } catch (err) {
      setOrgsError('Failed to load organizations.');
      setOrganizations([]);
      console.error(err);
    } finally {
      setIsLoadingOrgs(false);
    }
  }, [token, selectedOrgId]);

  useEffect(() => {
    getOrganizations();
  }, [token]);

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
               <Button onClick={onLogout} variant="danger" fullWidth={false}>
                Logout
              </Button>
            </div>
          </div>
        </nav>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {view === 'repositories' ? (
            selectedOrgId ? (
              <RepositoryBrowser key={selectedOrgId} token={token} organizationId={selectedOrgId} />
            ) : (
              <div className="text-center py-20 px-4">
                <h2 className="text-2xl font-semibold text-slate-200 mb-4">Welcome to Aerugo</h2>
                <p className="text-slate-400 max-w-md mx-auto">
                  {isLoadingOrgs ? 'Loading organizations...' : 
                  <>
                    It looks like you don't have any organizations. Please select one from the dropdown, or {' '}
                    <button onClick={() => setView('organizations')} className="font-semibold text-blue-500 hover:text-blue-400 focus:outline-none rounded">
                      create one
                    </button>
                    {' '} to get started.
                  </>
                  }
                </p>
              </div>
            )
        ) : (
          <OrganizationsManager 
            token={token}
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
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchRepositories } from '../../services/api';
import { Repository } from '../../types';
import RepositoryList from './RepositoryList';
import CreateRepositoryForm from './CreateRepositoryForm';
import { SearchIcon } from '../icons/SearchIcon';
import Button from '../Button';
import { PlusIcon } from '../icons/PlusIcon';

interface RepositoryBrowserProps {
  token: string;
  organizationId: number;
}

const RepositoryBrowser: React.FC<RepositoryBrowserProps> = ({ token, organizationId }) => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const getRepositories = useCallback(async () => {
    if (!organizationId) return;
    try {
      setIsLoading(true);
      setError(null);
      const repos = await fetchRepositories(organizationId, token);
      setRepositories(Array.isArray(repos) ? repos : []);
    } catch (err) {
      setError('Failed to load repositories.');
      setRepositories([]);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [organizationId, token]);

  useEffect(() => {
    setSearchTerm(''); // Reset search on org change
    setShowCreateForm(false); // Hide form on org change
    getRepositories();
  }, [getRepositories]);

  const handleCreationSuccess = () => {
    setShowCreateForm(false);
    getRepositories(); // Refresh the list
  };

  const filteredRepositories = useMemo(() => {
    return repositories.filter(repo =>
      repo.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [repositories, searchTerm]);
  
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 shadow-lg">
      <header className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-slate-50">Repositories</h2>
        <div className="flex items-center gap-4 w-full md:w-auto">
          {!showCreateForm && (
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <SearchIcon className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search repositories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          )}
          <Button onClick={() => setShowCreateForm(true)} fullWidth={false} className="whitespace-nowrap flex-shrink-0">
              <PlusIcon className="w-5 h-5 -ml-1 mr-2" />
              Create Repository
          </Button>
        </div>
      </header>
      <main>
        {isLoading ? (
          <div className="text-center py-8 text-slate-400">Loading repositories...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : showCreateForm ? (
            <CreateRepositoryForm 
                token={token} 
                organizationId={organizationId} 
                onSuccess={handleCreationSuccess}
                onCancel={() => setShowCreateForm(false)}
            />
        ) : (
          <RepositoryList repositories={filteredRepositories} />
        )}
      </main>
    </div>
  );
};

export default RepositoryBrowser;

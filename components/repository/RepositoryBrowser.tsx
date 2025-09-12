import React, { useState, useEffect, useMemo } from 'react';
import { fetchRepositories } from '../../services/api';
import { Repository } from '../../types';
import RepositoryList from './RepositoryList';
import { SearchIcon } from '../icons/SearchIcon';

interface RepositoryBrowserProps {
  token: string;
  organizationId: number;
}

const RepositoryBrowser: React.FC<RepositoryBrowserProps> = ({ token, organizationId }) => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const getRepositories = async () => {
      if (!organizationId) return;
      try {
        setIsLoading(true);
        setError(null);
        setSearchTerm(''); // Reset search on org change
        const repos = await fetchRepositories(organizationId, token);
        
        // Ensure repos is an array before setting state
        setRepositories(Array.isArray(repos) ? repos : []);

      } catch (err) {
        setError('Failed to load repositories.');
        setRepositories([]); // Ensure state is an empty array on error
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    getRepositories();
  }, [organizationId, token]);

  const filteredRepositories = useMemo(() => {
    return repositories.filter(repo =>
      repo.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [repositories, searchTerm]);
  
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 shadow-lg">
      <header className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-slate-50">Repositories</h2>
        <div className="relative w-full md:w-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
             <SearchIcon className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search repositories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full md:w-64 pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </header>
      <main>
        {isLoading ? (
          <div className="text-center py-8 text-slate-400">Loading repositories...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <RepositoryList repositories={filteredRepositories} />
        )}
      </main>
    </div>
  );
};

export default RepositoryBrowser;
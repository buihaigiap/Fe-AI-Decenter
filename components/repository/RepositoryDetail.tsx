import React, { useState, useEffect } from 'react';
import { RepositoryDetailsResponse } from '../../types';
import { fetchRepositoryDetails } from '../../services/api';
import CommandSnippet from './CommandSnippet';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';
import { ClipboardIcon } from '../icons/ClipboardIcon';
import { CogIcon } from '../icons/CogIcon';
import RepositorySettings from './RepositorySettings';

interface RepositoryDetailProps {
  token: string;
  repositoryName: string;
  organizationName: string;
  onBack: () => void;
}

const REGISTRY_HOST = 'registry.example.com'; // Placeholder for your registry's hostname

const InlineCommandSnippet: React.FC<{ command: string }> = ({ command }) => {
    const [copyStatus, setCopyStatus] = useState('Copy');
  
    const handleCopy = () => {
      navigator.clipboard.writeText(command).then(() => {
        setCopyStatus('Copied!');
        setTimeout(() => setCopyStatus('Copy'), 2000);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
        setCopyStatus('Failed');
         setTimeout(() => setCopyStatus('Copy'), 2000);
      });
    };
  
    return (
      <div className="relative flex items-center w-full sm:w-auto sm:max-w-md">
          <input 
              type="text" 
              readOnly 
              value={command}
              className="bg-slate-900/70 text-slate-300 text-sm rounded-md pl-3 pr-10 py-1.5 w-full font-mono focus:outline-none"
          />
          <button
              onClick={handleCopy}
              title="Copy pull command"
              className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:bg-slate-700 hover:text-slate-100 transition-colors"
          >
              <ClipboardIcon className="w-4 h-4" />
              <span className="sr-only">{copyStatus}</span>
          </button>
      </div>
    );
  };


const RepositoryDetail: React.FC<RepositoryDetailProps> = ({ token, repositoryName, organizationName, onBack }) => {
    const [details, setDetails] = useState<RepositoryDetailsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'tags' | 'settings'>('tags');
  
    useEffect(() => {
      const getDetails = async () => {
        try {
          setIsLoading(true);
          setError(null);
          const data = await fetchRepositoryDetails(organizationName, repositoryName, token);
          setDetails(data);
        } catch (err) {
          setError('Failed to load repository details.');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      getDetails();
    }, [organizationName, repositoryName, token]);
  
    if (isLoading) {
      return (
        <div className="text-center py-20 animate-fade-in">
          <p className="text-slate-400">Loading details...</p>
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="text-center py-20 animate-fade-in">
          <p className="text-red-500">{error}</p>
          <button onClick={onBack} className="mt-4 text-sm text-blue-400 hover:underline">
            Back to list
          </button>
        </div>
      );
    }
  
    if (!details) {
      return (
        <div className="text-center py-20 animate-fade-in">
          <p className="text-slate-400">Repository details not found.</p>
           <button onClick={onBack} className="mt-4 text-sm text-blue-400 hover:underline">
            Back to list
          </button>
        </div>
      );
    }
  
    const { repository, tags } = details;
    const repositoryPath = `${REGISTRY_HOST}/${organizationName}/${repository.name}`;

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 animate-fade-in">
      <header className="mb-6">
        <button onClick={onBack} className="flex items-center text-sm text-blue-400 hover:text-blue-300 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1 -ml-1">
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to repositories
        </button>
        <h2 className="text-3xl font-bold text-slate-50">{repository.name}</h2>
        <p className="text-slate-400 mt-1">{repository.description || 'No description provided.'}</p>
      </header>
      
       <div className="border-b border-slate-700 mb-6">
          <nav className="flex space-x-4" aria-label="Tabs">
            <TabButton 
                label="Tags" 
                isActive={activeTab === 'tags'} 
                onClick={() => setActiveTab('tags')} 
            />
            <TabButton 
                label="Settings" 
                isActive={activeTab === 'settings'} 
                onClick={() => setActiveTab('settings')} 
            />
          </nav>
      </div>

      <main>
        {activeTab === 'tags' && (
             <div className="space-y-10">
                <div>
                  <h3 className="text-xl font-semibold text-slate-200 border-b border-slate-700 pb-2 mb-4">
                    Tags
                  </h3>
                  {tags && tags.length > 0 ? (
                    <div className="border border-slate-700 rounded-lg">
                        <ul className="divide-y divide-slate-700">
                        {tags.map(tag => (
                            <li key={tag} className="p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <span className="font-mono text-slate-300 text-md">{repository.name}:{tag}</span>
                            <InlineCommandSnippet command={`docker pull ${repositoryPath}:${tag}`} />
                            </li>
                        ))}
                        </ul>
                    </div>
                  ) : (
                    <p className="text-slate-400 text-sm">No tags found for this repository.</p>
                  )}
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-slate-200 border-b border-slate-700 pb-2 mb-4">
                    Push an image
                  </h3>
                  <div className="space-y-6">
                    <div>
                        <h4 className="text-md font-medium text-slate-300 mb-2">1. Log in to the registry</h4>
                        <CommandSnippet command={`docker login ${REGISTRY_HOST}`} />
                    </div>
                    <div>
                        <h4 className="text-md font-medium text-slate-300 mb-2">2. Tag your local image</h4>
                        <CommandSnippet command={`docker tag my-local-image:latest ${repositoryPath}:new-tag`} />
                    </div>
                    <div>
                        <h4 className="text-md font-medium text-slate-300 mb-2">3. Push the image</h4>
                         <CommandSnippet command={`docker push ${repositoryPath}:new-tag`} />
                    </div>
                  </div>
                </div>
            </div>
        )}
        {activeTab === 'settings' && (
            <RepositorySettings 
                token={token}
                organizationName={organizationName}
                repository={repository}
                onRepositoryDeleted={onBack}
            />
        )}
      </main>
    </div>
  );
};

// Internal tab button component for styling
const TabButton: React.FC<{label: string, isActive: boolean, onClick: () => void}> = ({ label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center px-3 py-3 font-medium text-sm border-b-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 rounded-t-md ${
        isActive
          ? 'border-blue-500 text-blue-400'
          : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'
      }`}
    >
        {label}
    </button>
);


export default RepositoryDetail;
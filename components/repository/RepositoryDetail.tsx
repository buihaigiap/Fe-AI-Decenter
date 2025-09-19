import React, { useState } from 'react';
import { Repository } from '../../types';
import CommandSnippet from './CommandSnippet';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';
import RepositorySettings from './RepositorySettings';
import RepositoryTags from './RepositoryTags';
import RepositoryUsage from './RepositoryUsage';
import RepositoryWebhooks from './RepositoryWebhooks';
import { TagIcon } from '../icons/TagIcon';
import { ChartBarIcon } from '../icons/ChartBarIcon';
import { RssIcon } from '../icons/RssIcon';
import { CogIcon } from '../icons/CogIcon';
import { CodeBracketIcon } from '../icons/CodeBracketIcon';

interface RepositoryDetailProps {
  token: string;
  repository: Repository;
  organizationName: string;
  onBack: () => void;
}

const REGISTRY_HOST = 'registry.example.com'; // Placeholder for your registry's hostname

const RepositoryDetail: React.FC<RepositoryDetailProps> = ({ token, repository, organizationName, onBack }) => {
    const [activeTab, setActiveTab] = useState<'tags' | 'usage' | 'webhooks' | 'instructions' | 'settings'>('tags');
  
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
          <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto" aria-label="Tabs">
            <TabButton 
                icon={<TagIcon className="w-5 h-5 mr-2 flex-shrink-0" />}
                label="Tags" 
                isActive={activeTab === 'tags'} 
                onClick={() => setActiveTab('tags')} 
            />
            <TabButton 
                icon={<ChartBarIcon className="w-5 h-5 mr-2 flex-shrink-0" />}
                label="Usage" 
                isActive={activeTab === 'usage'} 
                onClick={() => setActiveTab('usage')} 
            />
            <TabButton 
                icon={<RssIcon className="w-5 h-5 mr-2 flex-shrink-0" />}
                label="Webhooks" 
                isActive={activeTab === 'webhooks'} 
                onClick={() => setActiveTab('webhooks')} 
            />
            <TabButton 
                icon={<CodeBracketIcon className="w-5 h-5 mr-2 flex-shrink-0" />}
                label="Instructions" 
                isActive={activeTab === 'instructions'} 
                onClick={() => setActiveTab('instructions')} 
            />
            <TabButton 
                icon={<CogIcon className="w-5 h-5 mr-2 flex-shrink-0" />}
                label="Settings" 
                isActive={activeTab === 'settings'} 
                onClick={() => setActiveTab('settings')} 
            />
          </nav>
      </div>

      <main>
        {activeTab === 'tags' && (
            <RepositoryTags repositoryPath={repositoryPath} />
        )}
        {activeTab === 'usage' && (
            <RepositoryUsage />
        )}
        {activeTab === 'webhooks' && (
            <RepositoryWebhooks />
        )}
        {activeTab === 'instructions' && (
             <div className="space-y-10">
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
const TabButton: React.FC<{icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void}> = ({ icon, label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center px-2 sm:px-3 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 rounded-t-md ${
        isActive
          ? 'border-blue-500 text-blue-400'
          : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'
      }`}
    >
        {icon}
        {label}
    </button>
);


export default RepositoryDetail;

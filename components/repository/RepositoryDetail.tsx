import React from 'react';
import { Repository } from '../../types';
import CommandSnippet from './CommandSnippet';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';

interface RepositoryDetailProps {
  repository: Repository;
  organizationName: string;
  onBack: () => void;
}

const REGISTRY_HOST = 'registry.example.com'; // Placeholder for your registry's hostname

const RepositoryDetail: React.FC<RepositoryDetailProps> = ({ repository, organizationName, onBack }) => {
  const repositoryPath = `${REGISTRY_HOST}/${organizationName}/${repository.name}`;

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 animate-fade-in">
      <header className="mb-8">
        <button onClick={onBack} className="flex items-center text-sm text-blue-400 hover:text-blue-300 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1 -ml-1">
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to repositories
        </button>
        <h2 className="text-3xl font-bold text-slate-50">{repository.name}</h2>
        <p className="text-slate-400 mt-1">{repository.description || 'No description provided.'}</p>
      </header>
      
      <main className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold text-slate-200 border-b border-slate-700 pb-2 mb-4">
            Push your first image
          </h3>
          <div className="space-y-6">
            <div>
                <h4 className="text-md font-medium text-slate-300 mb-2">1. Log in to the registry</h4>
                <p className="text-sm text-slate-400 mb-2">You may be prompted for your username and password.</p>
                <CommandSnippet command={`docker login ${REGISTRY_HOST}`} />
            </div>
            <div>
                <h4 className="text-md font-medium text-slate-300 mb-2">2. Tag your local image</h4>
                <p className="text-sm text-slate-400 mb-2">Replace 'my-local-image:latest' with the name and tag of your image.</p>
                <CommandSnippet command={`docker tag my-local-image:latest ${repositoryPath}:latest`} />
            </div>
            <div>
                <h4 className="text-md font-medium text-slate-300 mb-2">3. Push the image</h4>
                 <CommandSnippet command={`docker push ${repositoryPath}:latest`} />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-slate-200 border-b border-slate-700 pb-2 mb-4">
            Pull an image
          </h3>
          <p className="text-sm text-slate-400 mb-2">Pull an existing image from this repository.</p>
          <CommandSnippet command={`docker pull ${repositoryPath}:latest`} />
        </div>
      </main>
    </div>
  );
};

export default RepositoryDetail;
import React from 'react';
import { Repository } from '../../types';
import { LockIcon } from '../icons/LockIcon';
import { GlobeIcon } from '../icons/GlobeIcon';

interface RepositoryListItemProps {
  repository: Repository;
}

const RepositoryListItem: React.FC<RepositoryListItemProps> = ({ repository }) => {
  const isPrivate = repository.visibility === 'private';

  return (
    <div className="bg-slate-800/50 hover:bg-slate-700/50 transition-colors duration-200 border border-slate-700 rounded-lg p-4 flex items-center justify-between">
      <div className="flex-1">
        <div className="flex items-center space-x-3">
            <a href="#" className="text-lg font-semibold text-blue-400 hover:underline">
              {repository.name}
            </a>
            <span 
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isPrivate 
                ? 'bg-yellow-900/50 text-yellow-300' 
                : 'bg-green-900/50 text-green-300'
              }`}
            >
              {isPrivate ? <LockIcon className="w-3 h-3 mr-1.5"/> : <GlobeIcon className="w-3 h-3 mr-1.5"/> }
              {repository.visibility}
            </span>
        </div>
        <p className="mt-1 text-sm text-slate-400">
          {repository.description || 'No description provided.'}
        </p>
      </div>
    </div>
  );
};

export default RepositoryListItem;

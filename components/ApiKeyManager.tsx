import React, { useState, useEffect, useCallback } from 'react';
import { fetchApiKeys, createApiKey, deleteApiKey } from '../services/api';
import { ApiKey, CreateApiKeyResponse } from '../types';
import Input from './Input';
import Button from './Button';
import Modal from './Modal';
import { TrashIcon } from './icons/TrashIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { KeyIcon } from './icons/KeyIcon';

interface ApiKeyManagerProps {
  token: string;
}

const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ token }) => {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newKeyName, setNewKeyName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<CreateApiKeyResponse | null>(null);
  
  const [keyToDelete, setKeyToDelete] = useState<ApiKey | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const getKeys = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const apiKeys = await fetchApiKeys(token);
      setKeys(apiKeys);
    } catch (err) {
      setError('Failed to load API keys.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    getKeys();
  }, [getKeys]);

  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newKeyName) {
      setError('Please provide a name for the API key.');
      return;
    }
    setIsCreating(true);
    setError(null);
    try {
      const newKey = await createApiKey({ name: newKeyName }, token);
      setNewlyCreatedKey(newKey);
      setNewKeyName('');
      getKeys(); // Refresh the list
    } catch (err) {
      setError('Failed to create API key.');
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!keyToDelete) return;

    setIsDeleting(true);
    setError(null);
    try {
      await deleteApiKey(keyToDelete.id, token);
      setKeyToDelete(null);
      getKeys(); // Refresh the list
    } catch (err) {
      setError('Failed to delete API key.');
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const renderKeyList = () => {
    if (isLoading) {
      return <p className="text-slate-400 text-center py-4">Loading keys...</p>;
    }
    if (keys.length === 0) {
      return (
        <div className="text-center py-10 px-4 border-2 border-dashed border-slate-700 rounded-lg">
          <KeyIcon className="mx-auto h-12 w-12 text-slate-500" />
          <h3 className="mt-2 text-lg font-medium text-slate-300">No API Keys Found</h3>
          <p className="text-slate-400 mt-1">Create an API key to get started with programmatic access.</p>
        </div>
      );
    }
    return (
      <div className="border border-slate-700 rounded-lg">
        <ul className="divide-y divide-slate-700">
          {keys.map(key => (
            <li key={key.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <p className="font-semibold text-slate-100">{key.name}</p>
                <p className="text-xs text-slate-400 mt-1">
                  Created on: {new Date(key.created_at).toLocaleDateString()}
                  <span className="mx-2">|</span>
                  Last used: {key.last_used_at ? new Date(key.last_used_at).toLocaleDateString() : 'Never'}
                </p>
              </div>
              <Button 
                variant="danger" 
                onClick={() => setKeyToDelete(key)}
                className="!w-auto !p-2"
                title={`Delete key ${key.name}`}
              >
                <TrashIcon className="w-4 h-4" />
              </Button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h3 className="text-xl font-semibold text-slate-100">API Keys</h3>
        <p className="text-slate-400 mt-1 mb-6">Manage API keys for programmatic access to the registry (e.g., for CI/CD pipelines).</p>
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h4 className="font-semibold text-slate-50 mb-4">Create New API Key</h4>
            <form onSubmit={handleCreateSubmit} className="flex flex-col sm:flex-row items-start gap-4">
                <div className="flex-grow w-full">
                    <Input
                        id="new-key-name"
                        label="Key Name"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        placeholder="e.g., ci-pipeline-key"
                        disabled={isCreating}
                    />
                </div>
                <div className="w-full sm:w-auto flex-shrink-0 pt-0 sm:pt-8">
                    <Button type="submit" isLoading={isCreating} fullWidth={true} className="sm:!w-auto">
                        Create Key
                    </Button>
                </div>
            </form>
        </div>
      </div>
      
      <div>
          {error && <p className="text-sm text-red-500 text-center mb-4">{error}</p>}
          {renderKeyList()}
      </div>

      {/* Modal for showing newly created key */}
      <Modal 
        isOpen={!!newlyCreatedKey} 
        onClose={() => setNewlyCreatedKey(null)}
        title="API Key Created"
      >
        <div className="space-y-4">
          <div className="bg-yellow-900/30 border border-yellow-700/50 text-yellow-200 text-sm rounded-lg p-4">
            <p>{newlyCreatedKey?.warning || "Your new API key has been created. Please copy it now. You will not be able to see it again."}</p>
          </div>
          {newlyCreatedKey && <NewKeyDisplay apiKey={newlyCreatedKey.api_key} />}
          <div className="flex justify-end pt-2">
            <Button onClick={() => setNewlyCreatedKey(null)}>
              Done
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal for confirming key deletion */}
      <Modal 
        isOpen={!!keyToDelete} 
        onClose={() => setKeyToDelete(null)}
        title="Delete API Key"
      >
        <div className="space-y-4">
            <p className="text-slate-300">
                Are you sure you want to delete the key <strong className="font-bold text-slate-100">{keyToDelete?.name}</strong>?
                This action is irreversible.
            </p>
            <div className="flex justify-end items-center space-x-4 pt-2">
                <Button onClick={() => setKeyToDelete(null)} className="bg-transparent hover:bg-slate-700 text-slate-300" disabled={isDeleting}>
                    Cancel
                </Button>
                <Button 
                    variant="danger" 
                    onClick={handleDelete}
                    isLoading={isDeleting}
                >
                    Delete Key
                </Button>
            </div>
        </div>
      </Modal>
    </div>
  );
};


const NewKeyDisplay: React.FC<{ apiKey: string }> = ({ apiKey }) => {
  const [copyStatus, setCopyStatus] = useState('Copy');

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey).then(() => {
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus('Copy'), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      setCopyStatus('Failed');
      setTimeout(() => setCopyStatus('Copy'), 2000);
    });
  };

  return (
    <div className="relative bg-slate-900/70 text-slate-300 rounded-md p-3 font-mono text-sm">
      <pre className="overflow-x-auto pr-20">
        <code>{apiKey}</code>
      </pre>
      <button
        onClick={handleCopy}
        title="Copy API Key"
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md text-slate-400 hover:bg-slate-700 hover:text-slate-100 transition-colors flex items-center"
        aria-label={copyStatus}
      >
        <ClipboardIcon className="w-5 h-5 mr-2" />
        {copyStatus}
      </button>
    </div>
  );
};

export default ApiKeyManager;
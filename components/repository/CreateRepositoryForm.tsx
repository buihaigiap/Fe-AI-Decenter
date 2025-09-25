import React, { useState } from 'react';
import { createRepository } from '../../services/api';
import { CreateRepositoryRequest, Repository } from '../../types';
import Input from '../Input';
import Button from '../Button';
import { GlobeIcon } from '../icons/GlobeIcon';
import { LockIcon } from '../icons/LockIcon';
import { ServerStackIcon } from '../icons/ServerStackIcon';

interface CreateRepositoryFormProps {
  token: string;
  organizationName: string;
  onSuccess: (newRepo: Repository) => void;
  onCancel: () => void;
}

// Define an interface for the form's internal state for better type safety
interface RepositoryFormState {
  name: string;
  description: string;
  visibility: 'public' | 'private';
}

const CreateRepositoryForm: React.FC<CreateRepositoryFormProps> = ({ token, organizationName, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<RepositoryFormState>({
    name: '',
    description: '',
    visibility: 'private',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVisibilityChange = (visibility: 'public' | 'private') => {
    setFormData(prev => ({ ...prev, visibility }));
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    if (!formData.name) {
      setError('Repository name is required.');
      return;
    }
    
    // Basic validation for repo name (URL-friendly)
    if (!/^[a-z0-9]+(?:[._-][a-z0-9]+)*$/.test(formData.name)) {
        setError('Name must be lowercase, alphanumeric, and can contain separators (-, _, .). It cannot start or end with a separator.');
        return;
    }

    setIsLoading(true);
    try {
      // Transform the form state into the required API payload
      const apiPayload: CreateRepositoryRequest = {
        name: formData.name,
        description: formData.description || null, // Send null if description is empty
        is_public: formData.visibility === 'public',
      };
      
      const newRepo = await createRepository(organizationName, apiPayload, token);
      onSuccess(newRepo);
    } catch (err) {
      setError('Failed to create repository. The name might already be taken.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 animate-fade-in-up">
        <div className="flex items-start gap-4 mb-8">
            <div className="flex-shrink-0 p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                <ServerStackIcon className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
                <h3 className="text-xl font-bold text-slate-50">Create New Repository</h3>
                <p className="text-slate-400 text-sm mt-1">Repositories are namespaces for your container images.</p>
            </div>
        </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                Repository Name
            </label>
            <div className="flex items-center">
                <span className="inline-flex items-center px-3 h-11 bg-slate-700 border border-r-0 border-slate-600 rounded-l-md text-slate-400 sm:text-sm">
                    {organizationName} /
                </span>
                <input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="my-awesome-app"
                    required
                    autoFocus
                    className="block w-full h-11 px-4 bg-slate-700 border border-slate-600 rounded-r-md text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out focus:shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                />
            </div>
            <p className="text-xs text-slate-400 mt-2 ml-1">Lowercase, numbers, and separators (-, _, .) only.</p>
        </div>

        <Input
          id="description"
          name="description"
          label="Description (Optional)"
          value={formData.description || ''}
          onChange={handleChange}
          placeholder="A brief description of this repository."
        />

        <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Visibility</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <VisibilityOption
                    id="visibility-public"
                    icon={<GlobeIcon className="w-5 h-5 mb-2"/>}
                    label="Public"
                    description="Anyone can see and pull this repository."
                    isSelected={formData.visibility === 'public'}
                    onSelect={() => handleVisibilityChange('public')}
                />
                <VisibilityOption
                    id="visibility-private"
                    icon={<LockIcon className="w-5 h-5 mb-2"/>}
                    label="Private"
                    description="You choose who can see and pull this repository."
                    isSelected={formData.visibility === 'private'}
                    onSelect={() => handleVisibilityChange('private')}
                />
            </div>
        </div>


        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        
        <div className="flex justify-between items-center mt-6 pt-5 border-t border-slate-700/60">
            <Button 
              type="button" 
              onClick={onCancel} 
              fullWidth={false}
              className="bg-transparent hover:bg-slate-700 border-slate-700 hover:border-slate-600 text-slate-300"
              disabled={isLoading}
            >
                Cancel
            </Button>
            <Button type="submit" isLoading={isLoading} fullWidth={false}>
                Create Repository
            </Button>
        </div>
      </form>
    </div>
  );
};


interface VisibilityOptionProps {
    id: string;
    icon: React.ReactNode;
    label: string;
    description: string;
    isSelected: boolean;
    onSelect: () => void;
}

const VisibilityOption: React.FC<VisibilityOptionProps> = ({ id, icon, label, description, isSelected, onSelect }) => {
    return (
         <label 
            htmlFor={id} 
            className={`relative flex flex-col text-center p-4 border rounded-lg cursor-pointer transition-all duration-200 
                ${isSelected 
                    ? 'bg-indigo-900/50 border-indigo-500 scale-105 shadow-lg' 
                    : 'bg-slate-700/80 border-slate-600 hover:border-slate-500'
                }`
            }
        >
            <input type="radio" id={id} name="visibility" checked={isSelected} onChange={onSelect} className="hidden" />
            <div className={`mx-auto ${isSelected ? 'text-indigo-300' : 'text-slate-400'}`}>{icon}</div>
            <span className="block text-md font-semibold text-slate-100">{label}</span>
            <span className="block text-xs text-slate-400 mt-1">{description}</span>
        </label>
    );
}

export default CreateRepositoryForm;


import React from 'react';
import { User } from '../types';
import { UserCircleIcon } from '../components/icons/UserCircleIcon';

interface ProfilePageProps {
  currentUser: User;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ currentUser }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-3xl font-bold text-slate-50">My Profile</h1>
        <p className="text-slate-400 mt-1">View and manage your account details.</p>
      </header>

      <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="flex-shrink-0">
            <span className="h-24 w-24 rounded-full bg-slate-700 flex items-center justify-center">
              <UserCircleIcon className="h-16 w-16 text-slate-400" />
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-100">{currentUser.username}</h2>
            <p className="text-slate-400">{currentUser.email}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg">
        <div className="p-6">
            <h3 className="text-xl font-semibold text-slate-100">Account Information</h3>
            <p className="text-slate-400 mt-1">These are your account details. Profile editing is not yet available.</p>
        </div>
        <div className="border-t border-slate-700">
            <dl className="divide-y divide-slate-700">
                <div className="px-6 py-4 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-slate-400">Username</dt>
                    <dd className="mt-1 text-sm text-slate-100 col-span-2 sm:mt-0">{currentUser.username}</dd>
                </div>
                <div className="px-6 py-4 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-slate-400">Email address</dt>
                    <dd className="mt-1 text-sm text-slate-100 col-span-2 sm:mt-0">{currentUser.email}</dd>
                </div>
                 <div className="px-6 py-4 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-slate-400">User ID</dt>
                    <dd className="mt-1 text-sm text-slate-100 col-span-2 sm:mt-0">{currentUser.id}</dd>
                </div>
            </dl>
        </div>
      </div>

       <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-slate-100">Security</h3>
            <p className="text-slate-400 mt-2">Changing your password is not yet supported through the UI.</p>
      </div>

    </div>
  );
};

export default ProfilePage;

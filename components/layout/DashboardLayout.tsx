import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Button from '../Button';
import { User } from '../../types';
import { AerugoIcon } from '../icons/DockerIcon';

interface DashboardLayoutProps {
  currentUser: User;
  onLogout: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ currentUser, onLogout }) => {
  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-slate-700 text-white'
        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
    }`;

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
                <NavLink to="/repositories" className={navLinkClasses}>
                  Repositories
                </NavLink>
                <NavLink to="/organizations" className={navLinkClasses}>
                  Organizations
                </NavLink>
                <NavLink to="/docs" className={navLinkClasses}>
                Docs
                </NavLink>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <p className="text-sm text-slate-300 hidden sm:block">Welcome, {currentUser.username}</p>
              <Button onClick={onLogout} variant="danger" fullWidth={false}>
                Logout
              </Button>
            </div>
          </div>
        </nav>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;


import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import { AuthMode } from '../types';
import { AerugoIcon } from '../components/icons/DockerIcon';

interface AuthPageProps {
  onLoginSuccess: (token: string) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [authMode, setAuthMode] = useState<AuthMode>(AuthMode.Login);

  const switchMode = (mode: AuthMode) => {
    setAuthMode(mode);
  };
  
  const handleRegisterSuccess = () => {
    setAuthMode(AuthMode.Login);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md mx-auto">
        <div className="flex justify-center mb-6">
          <AerugoIcon className="w-20 h-20 text-blue-500" />
        </div>
        <h1 className="text-3xl font-bold text-center text-slate-50 mb-2">
          Aerugo Registry
        </h1>
        <p className="text-center text-slate-400 mb-8">
          {authMode === AuthMode.Login ? 'Sign in to your account' : 'Create a new account'}
        </p>
        
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 shadow-2xl shadow-slate-950/50">
          {authMode === AuthMode.Login ? (
            <LoginForm onLoginSuccess={onLoginSuccess} />
          ) : (
            <RegisterForm onRegisterSuccess={handleRegisterSuccess} />
          )}
        </div>
        
        <div className="text-center mt-6">
          {authMode === AuthMode.Login ? (
            <p className="text-slate-400">
              Don't have an account?{' '}
              <button
                onClick={() => switchMode(AuthMode.Register)}
                className="font-semibold text-blue-500 hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p className="text-slate-400">
              Already have an account?{' '}
              <button
                onClick={() => switchMode(AuthMode.Login)}
                className="font-semibold text-blue-500 hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
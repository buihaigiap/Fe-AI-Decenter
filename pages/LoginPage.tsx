import React from 'react';
import { Link } from 'react-router-dom';
import { AerugoIcon } from '../components/icons/DockerIcon';
import LoginForm from '../components/LoginForm';

interface LoginPageProps {
  onLoginSuccess: (token: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-slate-100 font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <AerugoIcon className="w-12 h-12 text-indigo-400" />
          </Link>
        </div>

        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-lg p-8 shadow-2xl shadow-slate-950/50">
          <h2 className="text-2xl font-bold text-center text-slate-50 mb-2">
            Welcome Back
          </h2>
          <p className="text-center text-slate-400 mb-8">
            Sign in to manage your repositories.
          </p>
          <LoginForm onLoginSuccess={onLoginSuccess} />
        </div>
        <div className="text-center mt-6">
          <p className="text-slate-400">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-indigo-400 hover:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

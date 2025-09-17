import React, { useState, useEffect } from 'react';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import { User } from './types';
import { fetchCurrentUser } from './services/api';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      fetchCurrentUser(storedToken)
        .then(setCurrentUser)
        .catch(() => {
          // Invalid token, clear it
          localStorage.removeItem('authToken');
          setToken(null);
        })
        .finally(() => setIsLoadingUser(false));
    } else {
        setIsLoadingUser(false);
    }
  }, []);

  const handleLoginSuccess = async (newToken: string) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    try {
        const user = await fetchCurrentUser(newToken);
        setCurrentUser(user);
    } catch (error) {
        console.error("Failed to fetch current user after login", error);
        handleLogout(); // Log out if user fetch fails
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setCurrentUser(null);
  };

  if (isLoadingUser) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <p className="text-slate-400">Loading...</p>
        </div>
      );
  }

  return (
    <>
      {token && currentUser ? (
        <DashboardPage token={token} currentUser={currentUser} onLogout={handleLogout} />
      ) : (
        <AuthPage onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  );
};

export default App;
import React, { useState } from 'react';
import { Login } from './components/Login';
import { Chat } from './components/Chat';
import { AdminDashboard } from './components/AdminDashboard';
import { UserManagement } from './components/UserManagement';
import { DataManagement } from './components/DataManagement';
import { User } from './types';
import { dataStore } from './store/data';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<'chat' | 'admin' | 'users' | 'data'>('chat');

  const handleLogin = (username: string, password: string) => {
    const foundUser = dataStore.validateUser(username, password);
    if (foundUser) {
      setUser(foundUser);
    } else {
      alert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setActiveView('chat');
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-indigo-600">ERP AI Sentinel</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <button
                  onClick={() => setActiveView('chat')}
                  className={`${
                    activeView === 'chat'
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Chat
                </button>
                {user.role === 'admin' && (
                  <>
                    <button
                      onClick={() => setActiveView('admin')}
                      className={`${
                        activeView === 'admin'
                          ? 'border-indigo-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                    >
                      Admin Dashboard
                    </button>
                    <button
                      onClick={() => setActiveView('users')}
                      className={`${
                        activeView === 'users'
                          ? 'border-indigo-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                    >
                      User Management
                    </button>
                    <button
                      onClick={() => setActiveView('data')}
                      className={`${
                        activeView === 'data'
                          ? 'border-indigo-500 text-gray-900'
                
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                    >
                      Data Management
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-4">
                {user.department} | {user.role}
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {activeView === 'chat' && <Chat user={user} onLogout={handleLogout} />}
        {activeView === 'admin' && user.role === 'admin' && <AdminDashboard />}
        {activeView === 'users' && user.role === 'admin' && <UserManagement />}
        {activeView === 'data' && user.role === 'admin' && <DataManagement />}
      </main>
    </div>
  );
}

export default App;
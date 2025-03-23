import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Chat } from './components/Chat';
import { AdminDashboard } from './components/AdminDashboard';
import { UserManagement } from './components/UserManagement';
import { DataManagement } from './components/DataManagement';
import { User } from './types';
import { dataStore } from './store/data';
import { Sun, Moon, Menu, X } from "lucide-react";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<'chat' | 'admin' | 'users' | 'data'>('chat');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check for user preference in localStorage
    const savedTheme = localStorage.getItem("theme");

    // Check for system preference if no saved preference
    if (
      !savedTheme &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

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
    <div className="min-h-screen bg-background text-foreground">
      <nav className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span 
                  className="text-xl font-bold text-primary cursor-pointer"
                  onClick={() => setActiveView('chat')}
                >
                  Core Connect
                </span>
              </div>
              {/* Desktop menu */}
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <button
                  onClick={() => setActiveView('chat')}
                  className={`${
                    activeView === 'chat'
                      ? 'border-primary text-foreground'
                      : 'border-transparent text-muted-foreground hover:border-muted hover:text-foreground'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
                >
                  Chat
                </button>
                {user.role === 'admin' && (
                  <>
                    <button
                      onClick={() => setActiveView('admin')}
                      className={`${
                        activeView === 'admin'
                          ? 'border-primary text-foreground'
                          : 'border-transparent text-muted-foreground hover:border-muted hover:text-foreground'
                      } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
                    >
                      Admin Dashboard
                    </button>
                    <button
                      onClick={() => setActiveView('users')}
                      className={`${
                        activeView === 'users'
                          ? 'border-primary text-foreground'
                          : 'border-transparent text-muted-foreground hover:border-muted hover:text-foreground'
                      } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
                    >
                      User Management
                    </button>
                    <button
                      onClick={() => setActiveView('data')}
                      className={`${
                        activeView === 'data'
                          ? 'border-primary text-foreground'
                          : 'border-transparent text-muted-foreground hover:border-muted hover:text-foreground'
                      } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
                    >
                      Data Management
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center">
              {/* User info - hidden on smallest screens */}
              <span className="hidden sm:block text-sm text-muted-foreground mr-4">
                {user.department} | {user.role}
              </span>
              <button
                onClick={toggleDarkMode}
                className="p-1 rounded-full text-muted-foreground hover:text-foreground mr-2"
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button
                onClick={handleLogout}
                className="hidden sm:inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 transition-colors"
              >
                Logout
              </button>

              {/* Mobile menu button */}
              <div className="flex items-center sm:hidden ml-2">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                  aria-expanded="false"
                >
                  <span className="sr-only">Open main menu</span>
                  {mobileMenuOpen ? (
                    <X className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Menu className="block h-6 w-6" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        {mobileMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <button
                onClick={() => {
                  setActiveView("chat");
                  setMobileMenuOpen(false);
                }}
                className={`${
                  activeView === "chat"
                    ? "bg-primary/10 border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left`}
              >
                Chat
              </button>
              {user.role === "admin" && (
                <>
                  <button
                    onClick={() => {
                      setActiveView("admin");
                      setMobileMenuOpen(false);
                    }}
                    className={`${
                      activeView === "admin"
                        ? "bg-primary/10 border-primary text-foreground"
                        : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
                    } block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left`}
                  >
                    Admin Dashboard
                  </button>
                  <button
                    onClick={() => {
                      setActiveView("users");
                      setMobileMenuOpen(false);
                    }}
                    className={`${
                      activeView === "users"
                        ? "bg-primary/10 border-primary text-foreground"
                        : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
                    } block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left`}
                  >
                    User Management
                  </button>
                  <button
                    onClick={() => {
                      setActiveView("data");
                      setMobileMenuOpen(false);
                    }}
                    className={`${
                      activeView === "data"
                        ? "bg-primary/10 border-primary text-foreground"
                        : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
                    } block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left`}
                  >
                    Data Management
                  </button>
                </>
              )}
              <button
                onClick={handleLogout}
                className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                Logout
              </button>
            </div>
          </div>
        )}
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
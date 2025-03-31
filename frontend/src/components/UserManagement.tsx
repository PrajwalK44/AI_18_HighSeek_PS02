import React, { useState, useEffect } from 'react';
import { User, UserIcon, Trash2, Shield, AlertCircle } from 'lucide-react';
import { dataStore } from '../store/data';
import clsx from 'clsx';

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    department: 'HR',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://coreconnect-env-1.eba-wrysgphd.ap-south-1.elasticbeanstalk.com/api/users');
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setError('Failed to load users. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!newUser.username.trim() || !newUser.password.trim()) {
      setError('Username and password are required');
      return;
    }
    
    // Password strength validation
    if (newUser.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      const response = await fetch('http://coreconnect-env-1.eba-wrysgphd.ap-south-1.elasticbeanstalk.com/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error adding user');
      }
  
      // Reset form
      setNewUser({ username: '', password: '', department: 'HR', role: 'user' });
      
      // Show success message
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
      
      // Refresh user list
      fetchUsers();
    } catch (error) {
      setError(error.message || 'Error adding user');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteUser = async (username) => {
    if (username === 'admin') {
      setError('Cannot delete admin user');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete user: ${username}?`)) {
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await fetch(`http://coreconnect-env-1.eba-wrysgphd.ap-south-1.elasticbeanstalk.com/api/users/${username}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete user');
      }

      // Refresh user list
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-6 animate-fade-in">User Management</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}
      
      {isSuccess && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          User added successfully!
        </div>
      )}

      <div className="bg-card border border-border rounded-lg shadow-sm mb-6 animate-fade-in">
        <div className="p-4 sm:p-6">
          <form onSubmit={handleAddUser} className="space-y-6 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Add New User</h2>
            
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </div>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                  className="block w-full pl-10 pr-3 py-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="password"
                  value={newUser.password}
                  onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                  className="block w-full px-3 py-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                  placeholder="Minimum 8 characters"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters long</p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Department</label>
              <div className="relative">
                <select
                  value={newUser.department}
                  onChange={e => setNewUser({ ...newUser, department: e.target.value })}
                  className="block w-full px-3 py-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm appearance-none"
                >
                  <option>HR</option>
                  <option>Sales</option>
                  <option>Finance</option>
                  <option>IT</option>
                  <option>Marketing</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-4 w-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
              <div className="relative">
                <select
                  value={newUser.role}
                  onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                  className="block w-full px-3 py-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm appearance-none"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-4 w-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-white text-sm transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <UserIcon className="w-4 h-4 mr-2" />
              )}
              Add User
            </button>
          </form>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm animate-fade-in">
        <div className="border-b border-border p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4">Existing Users</h2>
          {isLoading && <p className="text-sm text-gray-500">Loading users...</p>}
          {users.length === 0 && !isLoading ? (
            <p className="text-sm text-gray-500">No users found</p>
          ) : (
            <div className="overflow-x-auto table-responsive">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {users.map((user) => (
                    <tr key={user.username} className="hover:bg-muted/50 transition-colors">
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                        {user.username}
                        {user.role === 'admin' && (
                          <Shield className="w-4 h-4 ml-1 inline-block text-blue-500" />
                        )}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {user.department}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        <span className={clsx(
                          'px-2 py-1 rounded-full text-xs',
                          user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        )}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleDeleteUser(user.username)}
                          className={clsx(
                            'text-destructive hover:text-destructive/80 transition-colors',
                            user.username === 'admin' && 'opacity-50 cursor-not-allowed'
                          )}
                          disabled={user.username === 'admin' || isLoading}
                          title={user.username === 'admin' ? 'Cannot delete admin user' : 'Delete user'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

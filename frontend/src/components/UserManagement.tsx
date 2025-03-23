import React, { useState } from 'react';
import { User, UserIcon, Trash2 } from 'lucide-react';
import { dataStore } from '../store/data';
import clsx from 'clsx';

export const UserManagement: React.FC = () => {
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    department: 'HR',
    role: 'user'
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      dataStore.addUser(newUser);
      setNewUser({ username: '', password: '', department: 'HR', role: 'user' });
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error adding user');
    }
  };

  const handleDeleteUser = async (username: string) => {
    if (username === 'admin') {
      alert('Cannot delete admin user');
      return;
    }

    try {
      // First delete from backend
      const response = await fetch(`http://localhost:5000/api/users/${username}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      // If backend delete successful, update local state
      dataStore.deleteUser(username);
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. Please try again.');
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-6 animate-fade-in">User Management</h1>

      <div className="bg-card border border-border rounded-lg shadow-sm mb-6 animate-fade-in">
        <div className="border-b border-border p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4">Add New User</h2>
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
        required
      />
    </div>
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
        onChange={e => setNewUser({ ...newUser, role: e.target.value as 'admin' | 'user' })}
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
  >
    <UserIcon className="w-4 h-4 mr-2" />
    Add User
  </button>
</form>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm animate-fade-in">
        <div className="border-b border-border p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4">Existing Users</h2>
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
                {dataStore.getUsers().map((user) => (
                  <tr key={user.username} className="hover:bg-muted/50 transition-colors">
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                      {user.username}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {user.department}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {user.role}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleDeleteUser(user.username)}
                        className={clsx(
                          'text-destructive hover:text-destructive/80 transition-colors',
                          user.username === 'admin' && 'opacity-50 cursor-not-allowed'
                        )}
                        disabled={user.username === 'admin'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
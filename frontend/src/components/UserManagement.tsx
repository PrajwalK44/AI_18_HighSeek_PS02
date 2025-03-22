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

  const handleDeleteUser = (username: string) => {
    if (username === 'admin') {
      alert('Cannot delete admin user');
      return;
    }
    dataStore.deleteUser(username);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">User Management</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Add New User</h2>
        <form onSubmit={handleAddUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={newUser.username}
                onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter username"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={newUser.password}
              onChange={e => setNewUser({ ...newUser, password: e.target.value })}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <select
              value={newUser.department}
              onChange={e => setNewUser({ ...newUser, department: e.target.value })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option>HR</option>
              <option>Sales</option>
              <option>Finance</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              value={newUser.role}
              onChange={e => setNewUser({ ...newUser, role: e.target.value as 'admin' | 'user' })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <UserIcon className="w-4 h-4 mr-2" />
            Add User
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Existing Users</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dataStore.getUsers().map((user) => (
                <tr key={user.username}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleDeleteUser(user.username)}
                      className={clsx(
                        'text-red-600 hover:text-red-900',
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
  );
};
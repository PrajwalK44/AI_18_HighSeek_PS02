import React, { useState } from "react";
import {
  User,
  UserIcon,
  Trash2,
  UserPlus,
  Shield,
  Building,
  UserCog,
} from "lucide-react";
import { dataStore } from "../store/data";
import clsx from "clsx";

export const UserManagement: React.FC = () => {
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    department: "HR",
    role: "user",
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      dataStore.addUser(newUser);
      setNewUser({
        username: "",
        password: "",
        department: "HR",
        role: "user",
      });
    } catch (error) {
      alert(error instanceof Error ? error.message : "Error adding user");
    }
  };

  const handleDeleteUser = (username: string) => {
    if (username === "admin") {
      alert("Cannot delete admin user");
      return;
    }
    dataStore.deleteUser(username);
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="bg-card rounded-lg shadow-chat-lg overflow-hidden">
        <div className="p-3 sm:p-6 border-b border-border">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            User Management
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Add, edit, or remove users from the system
          </p>
        </div>

        <div className="p-3 sm:p-6">
          <div className="mb-6 sm:mb-8 p-3 sm:p-5 bg-muted rounded-lg animate-slide-up">
            <h2 className="text-base sm:text-lg font-medium mb-3 sm:mb-4 text-foreground flex items-center">
              <UserPlus className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-primary" />
              Add New User
            </h2>
            <form onSubmit={handleAddUser} className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 text-foreground">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    </div>
                    <input
                      type="text"
                      value={newUser.username}
                      onChange={(e) =>
                        setNewUser({ ...newUser, username: e.target.value })
                      }
                      required
                      className="pl-8 sm:pl-10 w-full p-1.5 sm:p-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary focus:border-ring text-xs sm:text-sm"
                      placeholder="Enter username"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 text-foreground">
                    Password
                  </label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                    className="w-full p-1.5 sm:p-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary focus:border-ring text-xs sm:text-sm"
                    placeholder="Enter password"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 text-foreground">
                    Department
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    </div>
                    <select
                      value={newUser.department}
                      onChange={(e) =>
                        setNewUser({ ...newUser, department: e.target.value })
                      }
                      className="pl-8 sm:pl-10 w-full p-1.5 sm:p-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary focus:border-ring text-xs sm:text-sm"
                    >
                      <option value="HR">HR</option>
                      <option value="Sales">Sales</option>
                      <option value="Finance">Finance</option>
                      <option value="IT">IT</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 text-foreground">
                    Role
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    </div>
                    <select
                      value={newUser.role}
                      onChange={(e) =>
                        setNewUser({ ...newUser, role: e.target.value })
                      }
                      className="pl-8 sm:pl-10 w-full p-1.5 sm:p-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary focus:border-ring text-xs sm:text-sm"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-xs sm:text-sm"
                >
                  <UserPlus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Add User
                </button>
              </div>
            </form>
          </div>

          <h2 className="text-base sm:text-lg font-medium mb-3 sm:mb-4 text-foreground flex items-center">
            <UserCog className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-primary" />
            Existing Users
          </h2>
          <div className="overflow-x-auto rounded-lg border border-border animate-fade-in table-responsive">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted">
                <tr>
                  <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {dataStore.getUsers().map((user, index) => (
                  <tr
                    key={user.username}
                    className="hover:bg-muted/50 transition-colors animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-foreground">
                      <div className="flex items-center">
                        <UserIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-primary" />
                        {user.username}
                      </div>
                    </td>
                    <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-foreground">
                      {user.department}
                    </td>
                    <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                      <span
                        className={clsx(
                          "px-1.5 sm:px-2 py-0.5 sm:py-1 inline-flex text-[10px] sm:text-xs leading-5 font-semibold rounded-full",
                          user.role === "admin"
                            ? "bg-primary/10 text-primary"
                            : "bg-secondary/80 text-secondary-foreground"
                        )}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                      <button
                        onClick={() => handleDeleteUser(user.username)}
                        disabled={user.username === "admin"}
                        className={clsx(
                          "p-1 rounded-full transition-colors",
                          user.username === "admin"
                            ? "text-muted-foreground cursor-not-allowed"
                            : "text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        )}
                        title={
                          user.username === "admin"
                            ? "Cannot delete admin"
                            : "Delete user"
                        }
                      >
                        <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
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

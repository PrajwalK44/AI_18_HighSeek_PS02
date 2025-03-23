import React, { useState, useEffect } from "react";
import { Bot, Lock, User, Github, Mail, Sun, Moon } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";

interface LoginProps {
  onLogin: (username: string, password: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const {
    loginWithRedirect,
    isAuthenticated,
    isLoading,
    user: auth0User,
  } = useAuth0();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  // If user is authenticated with Auth0, try to use those credentials
  useEffect(() => {
    if (isAuthenticated && auth0User && !isLoading) {
      // Try to find a matching user in our system or create one
      // This is now handled in App.tsx
    }
  }, [isAuthenticated, isLoading, auth0User, onLogin]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  const handleAuth0Login = () => {
    loginWithRedirect();
  };

  // Show loading indicator while Auth0 is authenticating
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-2 sm:p-4 animated-gradient">
      <div className="bg-card text-card-foreground rounded-2xl shadow-chat-lg p-4 sm:p-8 w-full max-w-sm sm:max-w-md animate-fade-in">
        <div className="flex items-center justify-between mb-4 sm:mb-8">
          <div className="flex items-center">
            <div className="bg-primary/10 p-2 sm:p-3 rounded-full">
              <Bot className="w-6 h-6 sm:w-8 sm:h-8 text-primary animate-pulse-custom" />
            </div>
          </div>
          <button
            onClick={toggleDarkMode}
            className="icon-btn"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-center text-foreground mb-6 sm:mb-8 animate-slide-up">
          Core Connect
        </h1>

        {/* Auth0 Login Button */}
        <div className="mb-4 sm:mb-6 animate-slide-up delay-100">
          <button
            type="button"
            onClick={handleAuth0Login}
            disabled={isLoading}
            className="w-full flex items-center justify-center py-2 px-4 mb-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition duration-200 text-sm sm:text-base"
          >
            {isLoading ? "Loading..." : "Sign in with Auth0"}
          </button>
        </div>

        <div className="relative mb-4 sm:mb-6 animate-slide-up delay-200">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-card px-2 text-xs sm:text-sm text-muted-foreground">
              Or continue with username
            </span>
          </div>
        </div>

        {/* Regular Login Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 sm:space-y-6 animate-slide-up delay-300"
        >
          <div>
            <label className="block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-2">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-8 sm:pl-10 w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-ring text-sm"
                placeholder="Enter your username"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-8 sm:pl-10 w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-ring text-sm"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-1.5 sm:py-2 px-4 rounded-lg hover:bg-primary/90 transition duration-200 text-sm sm:text-base"
          >
            Sign In with Username
          </button>
        </form>

        <div className="mt-4 sm:mt-8 p-3 sm:p-4 bg-muted rounded-lg animate-scale-in text-xs sm:text-sm">
          <h3 className="text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-2">
            Demo Credentials
          </h3>
          <div className="text-xs sm:text-sm text-muted-foreground space-y-1">
            <p>
              <strong>Admin:</strong> admin / admin123
            </p>
            <p>
              <strong>HR:</strong> hr_user / password123
            </p>
            <p>
              <strong>Sales:</strong> sales_user / password123
            </p>
            <p>
              <strong>Finance:</strong> finance_user / password123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

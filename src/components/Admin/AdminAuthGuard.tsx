"use client";

import React, { useState, useEffect } from "react";
import { Lock, Eye, EyeOff, ShieldAlert } from "lucide-react";

const ADMIN_PASSWORD = "whopadmin-bryan&praise";
const AUTH_KEY = "admin_auth_timestamp";
const SESSION_DURATION = 12 * 60 * 60 * 1000; // 12 hours

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const storedTimestamp = localStorage.getItem(AUTH_KEY);
    if (storedTimestamp) {
      const timestamp = parseInt(storedTimestamp, 10);
      const now = new Date().getTime();
      if (now - timestamp < SESSION_DURATION) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem(AUTH_KEY);
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
    setIsChecking(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      const now = new Date().getTime();
      localStorage.setItem(AUTH_KEY, now.toString());
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Invalid administrative password.");
      setPassword("");
    }
  };

  if (isChecking) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900 dark:border-white"></div>
      </div>
    );
  }

  if (isAuthenticated === true) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-zinc-50 dark:bg-black/80 backdrop-blur-xl">
      <div className="w-full max-w-md p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xl animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-blue-200 dark:bg-blue-800 rounded-2xl flex items-center justify-center mb-6">
            <Lock className="text-blue-900 dark:text-blue-100" size={25} />
          </div>
          <h2 className="text-xl font-semibold mb-2 dark:text-white tracking-wide special-font">Restricted Access</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-8">
            Please enter your administrative password to access the waitlist management tools.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password..."
              className="w-full px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border-none rounded-lg focus:ring focus:ring-blue-800 dark:focus:ring-blue-200 transition-all outline-none text-zinc-900 dark:text-white"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-800 hover:text-blue-600 dark:hover:text-blue-200 transition-colors"
            >
              {showPassword ? <EyeOff size={18} strokeWidth={1.4} /> : <Eye size={18} strokeWidth={1.4} />}
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-rose-500 font-thin text-sm animate-in fade-in slide-in-from-top-1">
              <ShieldAlert size={16} strokeWidth={1.4} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 bg-blue-900 dark:bg-blue-800 text-white dark:text-black rounded-lg font-medium hover:opacity-90 transition-all active:scale-[0.98]"
          >
            Authenticate
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-zinc-400 dark:text-zinc-500 font-medium">
          Whop Admin Panel • Secure Session
        </p>
      </div>
    </div>
  );
}

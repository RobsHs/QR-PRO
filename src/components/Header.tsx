/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { QrCode, Sun, Moon, Laptop, Github } from 'lucide-react';

export function Header() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto');

  // Load theme preference on mount
  useEffect(() => {
    const saved = localStorage.getItem('qr_gen_theme') as 'light' | 'dark' | 'auto' | null;
    if (saved) {
      setTheme(saved);
      applyTheme(saved);
    } else {
      applyTheme('auto');
    }
  }, []);

  const applyTheme = (mode: 'light' | 'dark' | 'auto') => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (mode === 'light') {
      root.classList.add('light');
    } else if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      // Auto (System Theme)
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(systemPrefersDark ? 'dark' : 'light');
    }
  };

  const handleThemeChange = (mode: 'light' | 'dark' | 'auto') => {
    setTheme(mode);
    localStorage.setItem('qr_gen_theme', mode);
    applyTheme(mode);
  };

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/10 dark:shadow-indigo-500/10">
            <QrCode className="w-5 h-5" id="header-logo-icon" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight leading-none">
              QR Generator Pro
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-medium">
              Enterprise Grade • Production Ready
            </p>
          </div>
        </div>

        {/* Right: Theme Toggle Buttons */}
        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-inner">
            <button
              onClick={() => handleThemeChange('light')}
              className={`p-1.5 rounded-lg transition-all flex items-center gap-1 text-xs font-semibold ${
                theme === 'light'
                  ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-md border-zinc-200'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
              title="Light Mode"
              id="theme-light-btn"
            >
              <Sun className="w-4 h-4" />
              <span className="hidden sm:inline">Light</span>
            </button>
            <button
              onClick={() => handleThemeChange('dark')}
              className={`p-1.5 rounded-lg transition-all flex items-center gap-1 text-xs font-semibold ${
                theme === 'dark'
                  ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-md border-zinc-200'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
              title="Dark Mode"
              id="theme-dark-btn"
            >
              <Moon className="w-4 h-4" />
              <span className="hidden sm:inline">Dark</span>
            </button>
            <button
              onClick={() => handleThemeChange('auto')}
              className={`p-1.5 rounded-lg transition-all flex items-center gap-1 text-xs font-semibold ${
                theme === 'auto'
                  ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-md border-zinc-200'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
              title="Auto Theme"
              id="theme-auto-btn"
            >
              <Laptop className="w-4 h-4" />
              <span className="hidden sm:inline">Auto</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

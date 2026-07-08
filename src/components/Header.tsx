/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { QrCode, Sun, Moon, Laptop } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="border-b border-border bg-card/75 backdrop-blur-md sticky top-0 z-40 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/10 transition-colors duration-200">
            <QrCode className="w-5 h-5" id="header-logo-icon" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight leading-none transition-colors duration-200">
              QR Generator Pro
            </h1>
            <p className="text-xs text-muted-foreground mt-1 font-medium transition-colors duration-200">
              Enterprise Grade • Production Ready
            </p>
          </div>
        </div>

        {/* Right: Theme Toggle Buttons */}
        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-secondary rounded-xl border border-border shadow-inner transition-colors duration-200">
            <button
              onClick={() => setTheme('light')}
              className={`p-1.5 rounded-lg transition-all flex items-center gap-1 text-xs font-bold ${
                theme === 'light'
                  ? 'bg-card text-primary shadow-sm border border-border/40'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Light Mode"
              id="theme-light-btn"
            >
              <Sun className="w-4 h-4 text-amber-500" />
              <span className="hidden sm:inline">Light</span>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`p-1.5 rounded-lg transition-all flex items-center gap-1 text-xs font-bold ${
                theme === 'dark'
                  ? 'bg-card text-primary shadow-sm border border-border/40'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Dark Mode"
              id="theme-dark-btn"
            >
              <Moon className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">Dark</span>
            </button>
            <button
              onClick={() => setTheme('system')}
              className={`p-1.5 rounded-lg transition-all flex items-center gap-1 text-xs font-bold ${
                theme === 'system'
                  ? 'bg-card text-primary shadow-sm border border-border/40'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="System Theme"
              id="theme-auto-btn"
            >
              <Laptop className="w-4 h-4 text-blue-500" />
              <span className="hidden sm:inline">System</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

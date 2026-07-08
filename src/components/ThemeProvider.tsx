/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('qr_gen_theme') as Theme | null;
    return saved || 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('qr_gen_theme') as Theme | null;
    if (saved === 'dark') return 'dark';
    if (saved === 'light') return 'light';
    
    // System fallback
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Smooth transitions
    root.classList.add('transition-colors', 'duration-300', 'ease-in-out');

    const updateTheme = () => {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      root.classList.remove('light', 'dark');
      
      let resolved: 'light' | 'dark' = 'light';
      if (theme === 'dark') {
        root.classList.add('dark');
        resolved = 'dark';
      } else if (theme === 'light') {
        root.classList.add('light');
        resolved = 'light';
      } else {
        // system
        if (systemPrefersDark) {
          root.classList.add('dark');
          resolved = 'dark';
        } else {
          root.classList.add('light');
          resolved = 'light';
        }
      }
      setResolvedTheme(resolved);
    };

    updateTheme();

    // System theme change listener
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      if (theme === 'system') {
        updateTheme();
      }
    };

    // Support older and modern browsers for EventListener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemChange);
    } else {
      mediaQuery.addListener(handleSystemChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleSystemChange);
      } else {
        mediaQuery.removeListener(handleSystemChange);
      }
    };
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem('qr_gen_theme', newTheme);
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

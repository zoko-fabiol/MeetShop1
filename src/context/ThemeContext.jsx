import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext();

/**
 * Applique la classe 'dark' ou 'light' sur <html>, <body> et définit colorScheme.
 */
function applyClassToRoot(theme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const body = document.body;
  
  if (theme === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
    if (body) {
      body.classList.add('dark');
      body.classList.remove('light');
    }
    root.style.colorScheme = 'dark';
  } else {
    root.classList.remove('dark');
    root.classList.add('light');
    if (body) {
      body.classList.remove('dark');
      body.classList.add('light');
    }
    root.style.colorScheme = 'light';
  }
}

/**
 * Détecte la préférence système (dark ou light).
 */
function getSystemPreference() {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

export function ThemeProvider({ children }) {
  // Thème actif : 'light' ou 'dark' uniquement
  const [themeMode, setThemeModeState] = useState(() => {
    try {
      const saved = localStorage.getItem('meetshop_theme') || localStorage.getItem('meetshop_theme_mode');
      if (saved === 'light' || saved === 'dark') {
        return saved;
      }
    } catch (e) {}
    // Premier chargement : détection automatique du système
    return getSystemPreference();
  });

  // Appliquer le thème dès le premier rendu et à chaque changement d'état
  useEffect(() => {
    applyClassToRoot(themeMode);
  }, [themeMode]);

  // Écouter les changements système seulement si l'utilisateur n'a pas encore fait de choix manuel
  useEffect(() => {
    const hasManualChoice = localStorage.getItem('meetshop_theme');
    if (hasManualChoice) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = (e) => {
      const stillNoManual = !localStorage.getItem('meetshop_theme');
      if (stillNoManual) {
        const sysTheme = e.matches ? 'dark' : 'light';
        setThemeModeState(sysTheme);
        applyClassToRoot(sysTheme);
      }
    };

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
  }, []);

  // Définir manuellement le thème ('light' ou 'dark')
  const setThemeMode = useCallback((mode) => {
    const validMode = mode === 'dark' ? 'dark' : 'light';
    setThemeModeState(validMode);
    try {
      localStorage.setItem('meetshop_theme', validMode);
      localStorage.setItem('meetshop_theme_mode', validMode);
    } catch (e) {}
    applyClassToRoot(validMode);
  }, []);

  // Bascule instantanée entre Clair et Sombre
  const toggleTheme = useCallback(() => {
    setThemeMode(themeMode === 'dark' ? 'light' : 'dark');
  }, [themeMode, setThemeMode]);

  const value = {
    themeMode,
    resolvedTheme: themeMode,
    isDark: themeMode === 'dark',
    setThemeMode,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

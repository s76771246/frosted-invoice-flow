
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeOption } from '../types';
import { themeOptions } from '../data/mockData';

interface ThemeContextType {
  currentTheme: ThemeOption;
  setTheme: (themeId: string) => void;
  themeOptions: ThemeOption[];
}

const ThemeContext = createContext<ThemeContextType>({
  currentTheme: themeOptions[0],
  setTheme: () => {},
  themeOptions: themeOptions,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeOption>(themeOptions[0]);

  useEffect(() => {
    // Apply the theme to the document body
    document.body.classList.remove(
      ...themeOptions.map(option => option.class)
    );
    document.body.classList.add(currentTheme.class);

    // Store the current theme in localStorage
    localStorage.setItem('theme', currentTheme.id);
  }, [currentTheme]);

  // Load theme from localStorage on initial render
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      const theme = themeOptions.find(option => option.id === savedTheme);
      if (theme) {
        setCurrentTheme(theme);
      }
    }
  }, []);

  const setTheme = (themeId: string) => {
    const theme = themeOptions.find(option => option.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, themeOptions }}>
      {children}
    </ThemeContext.Provider>
  );
};

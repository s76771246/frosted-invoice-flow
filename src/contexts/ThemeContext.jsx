
import React, { createContext, useContext, useState, useEffect } from 'react';
import { themeOptions } from '../data/themeOptions';

const ThemeContext = createContext({
  currentTheme: themeOptions[0],
  setTheme: () => {},
  themeOptions: themeOptions,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(themeOptions[0]);

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

  const setTheme = (themeId) => {
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

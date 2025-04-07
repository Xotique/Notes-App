import { createContext, useContext, useState } from 'react';
import { Appearance } from 'react-native';

type Theme = {
  darkMode: boolean;
  toggleDarkMode: () => void;
  colors: {
    background: string;
    primaryText: string;
    secondaryText: string;
    border: string;
    accent: string;
    purple: string;
    purpleLight: string;
    purpleDark: string;
    error: string;
  };
};

const lightColors = {
  background: '#f8fafc',
  primaryText: '#0f172a',
  secondaryText: '#64748b',
  border: '#e2e8f0',
  accent: '#94a3b8',
  purple: '#6366f1',
  purpleLight: '#818cf8',
  purpleDark: '#4f46e5',
  error: '#ef4444'
};

const darkColors = {
  background: '#121212',
  primaryText: '#E0E0E0',
  secondaryText: '#B0B0B0',
  border: '#444444',
  accent: '#888888',
  purple: '#6366f1',
  purpleLight: '#818cf8',
  purpleDark: '#4f46e5',
  error: '#ef4444'
};

const ThemeContext = createContext<Theme>({
  darkMode: false,
  toggleDarkMode: () => {},
  colors: lightColors
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(Appearance.getColorScheme() === 'dark');

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeContext.Provider value={{
      darkMode,
      toggleDarkMode,
      colors: darkMode ? darkColors : lightColors
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

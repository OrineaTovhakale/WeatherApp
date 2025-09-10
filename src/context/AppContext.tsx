import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  units: 'metric' | 'imperial';
  setUnits: (u: 'metric' | 'imperial') => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
    localStorage.setItem('units', units);
  }, [theme, units]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    const savedUnits = localStorage.getItem('units') as 'metric' | 'imperial' || 'metric';
    setTheme(savedTheme);
    setUnits(savedUnits);
  }, []);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <AppContext.Provider value={{ theme, toggleTheme, units, setUnits }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
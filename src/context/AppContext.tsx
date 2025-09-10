import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface SavedLocation {
  name: string;
  lat: number;
  lon: number;
}

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  units: 'metric' | 'imperial';
  setUnits: (u: 'metric' | 'imperial') => void;
  savedLocations: SavedLocation[];
  addLocation: (loc: SavedLocation) => void;
  removeLocation: (name: string) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
    localStorage.setItem('units', units);
    localStorage.setItem('savedLocations', JSON.stringify(savedLocations));
  }, [theme, units, savedLocations]);

  useEffect(() => {
    const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    const savedUnits = (localStorage.getItem('units') as 'metric' | 'imperial') || 'metric';
    const savedLocs = JSON.parse(localStorage.getItem('savedLocations') || '[]');
    setTheme(savedTheme);
    setUnits(savedUnits);
    setSavedLocations(savedLocs);
  }, []);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const addLocation = (loc: SavedLocation) => {
    // avoid duplicates by name
    if (!savedLocations.some((l) => l.name.toLowerCase() === loc.name.toLowerCase())) {
      setSavedLocations([...savedLocations, loc]);
    }
  };

  const removeLocation = (name: string) => {
    setSavedLocations(savedLocations.filter((l) => l.name.toLowerCase() !== name.toLowerCase()));
  };

  return (
    <AppContext.Provider
      value={{ theme, toggleTheme, units, setUnits, savedLocations, addLocation, removeLocation }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;

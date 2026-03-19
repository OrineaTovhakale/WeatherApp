import { createContext, useState, useEffect, useContext } from 'react';
import type { ReactNode } from 'react';
import type { SavedLocation, Units } from '../types/weather';

// ─── Context shape ────────────────────────────────────
interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  units: Units;
  setUnits: (u: Units) => void;
  savedLocations: SavedLocation[];
  addLocation: (loc: SavedLocation) => void;
  removeLocation: (name: string) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

// ─── Custom hook for safe context access ─────────────
export const useAppContext = (): AppContextType => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
};

// ─── Provider ─────────────────────────────────────────
const AppProvider = ({ children }: { children: ReactNode }) => {
  // Initialise from localStorage immediately (avoids flash of wrong state)
  const [theme, setTheme] = useState<'light' | 'dark'>(
    () => (localStorage.getItem('wx_theme') as 'light' | 'dark') || 'dark'
  );
  const [units, setUnitsState] = useState<Units>(
    () => (localStorage.getItem('wx_units') as Units) || 'metric'
  );
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('wx_locations') || '[]') as SavedLocation[];
    } catch {
      return [];
    }
  });

  // Apply theme class to <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('wx_theme', theme);
  }, [theme]);

  // Persist units
  useEffect(() => {
    localStorage.setItem('wx_units', units);
  }, [units]);

  // Persist saved locations
  useEffect(() => {
    localStorage.setItem('wx_locations', JSON.stringify(savedLocations));
  }, [savedLocations]);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  const setUnits = (u: Units) => setUnitsState(u);

  const addLocation = (loc: SavedLocation) => {
    setSavedLocations(prev => {
      if (prev.some(l => l.name.toLowerCase() === loc.name.toLowerCase())) return prev;
      return [...prev, loc];
    });
  };

  const removeLocation = (name: string) => {
    setSavedLocations(prev =>
      prev.filter(l => l.name.toLowerCase() !== name.toLowerCase())
    );
  };

  return (
    <AppContext.Provider value={{ theme, toggleTheme, units, setUnits, savedLocations, addLocation, removeLocation }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
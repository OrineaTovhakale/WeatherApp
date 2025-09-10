import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { FiMoon, FiSun } from 'react-icons/fi';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(AppContext)!;

  return (
    <button onClick={toggleTheme} className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:shadow-md transition">
      {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
    </button>
  );
};

export default ThemeToggle;
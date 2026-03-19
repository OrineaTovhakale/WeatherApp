import React from 'react';
import { useAppContext } from '../context/AppContext';

interface ThemeToggleProps {
  textColor?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ textColor = '#fff' }) => {
  const { theme, toggleTheme } = useAppContext();

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(255,255,255,0.15)',
        border: '1px solid rgba(255,255,255,0.25)',
        borderRadius: '999px',
        padding: '8px 14px',
        color: textColor,
        fontFamily: 'var(--font-display)',
        fontSize: '0.82rem',
        fontWeight: 600,
        cursor: 'pointer',
        backdropFilter: 'blur(8px)',
        transition: 'all var(--transition)',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.25)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.15)'; }}
    >
      <span style={{ fontSize: '1rem' }}>{theme === 'light' ? '🌙' : '☀️'}</span>
      <span className="hide-mobile">{theme === 'light' ? 'Dark' : 'Light'}</span>
    </button>
  );
};

export default ThemeToggle;
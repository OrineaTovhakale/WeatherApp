import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  textColor?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading = false, textColor = '#fff' }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed && !isLoading) {
      onSearch(trimmed);
      setQuery('');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(255,255,255,0.15)',
        border: '1px solid rgba(255,255,255,0.25)',
        borderRadius: '999px',
        padding: '10px 16px',
        backdropFilter: 'blur(12px)',
        width: '100%',
        maxWidth: '480px',
        transition: 'border-color var(--transition), box-shadow var(--transition)',
      }}
      onFocus={() => {}}
    >
      {/* Search icon */}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={textColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.7 }}>
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>

      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search city or location..."
        disabled={isLoading}
        style={{
          flex: 1,
          background: 'none',
          border: 'none',
          outline: 'none',
          color: textColor,
          fontFamily: 'var(--font-display)',
          fontSize: '0.95rem',
          fontWeight: 400,
        }}
        aria-label="Search for a city"
      />

      <button
        type="submit"
        disabled={!query.trim() || isLoading}
        style={{
          background: 'rgba(255,255,255,0.2)',
          border: 'none',
          borderRadius: '999px',
          padding: '6px 14px',
          color: textColor,
          fontFamily: 'var(--font-display)',
          fontSize: '0.82rem',
          fontWeight: 600,
          cursor: query.trim() && !isLoading ? 'pointer' : 'not-allowed',
          opacity: query.trim() && !isLoading ? 1 : 0.5,
          transition: 'all var(--transition)',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => { if (query.trim() && !isLoading) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.3)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.2)'; }}
      >
        {isLoading ? '...' : 'Search'}
      </button>
    </form>
  );
};

export default SearchBar;
import React from 'react';
import type { SavedLocation } from '../types/weather';

interface LocationListProps {
  locations: SavedLocation[];
  onSelect: (loc: SavedLocation) => void;
  onDelete: (name: string) => void;
  currentLocationName?: string;
}

const LocationList: React.FC<LocationListProps> = ({
  locations,
  onSelect,
  onDelete,
  currentLocationName,
}) => {
  if (locations.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '1.5rem', opacity: 0.6, color: '#fff', fontSize: '0.875rem' }}>
        <p style={{ fontSize: '1.5rem', marginBottom: '8px' }}>📍</p>
        <p>No saved locations yet.</p>
        <p style={{ fontSize: '0.78rem', marginTop: '4px' }}>Search a city to save it.</p>
      </div>
    );
  }

  return (
    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {locations.map(loc => {
        const isActive = loc.name.toLowerCase() === currentLocationName?.toLowerCase();
        return (
          <li
            key={loc.name}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: '12px',
              background: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)',
              border: isActive ? '1px solid rgba(255,255,255,0.35)' : '1px solid rgba(255,255,255,0.1)',
              transition: 'all var(--transition)',
            }}
            onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLLIElement).style.background = 'rgba(255,255,255,0.14)'; }}
            onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLLIElement).style.background = 'rgba(255,255,255,0.08)'; }}
          >
            <button
              onClick={() => onSelect(loc)}
              style={{
                background: 'none', border: 'none', color: '#fff',
                fontFamily: 'var(--font-display)', fontSize: '0.95rem',
                fontWeight: isActive ? 600 : 400, cursor: 'pointer',
                textAlign: 'left', flex: 1,
                display: 'flex', alignItems: 'center', gap: '8px',
              }}
            >
              <span style={{ opacity: 0.7, fontSize: '0.85rem' }}>📍</span>
              <span>{loc.name}</span>
              {loc.country && (
                <span style={{ fontSize: '0.75rem', opacity: 0.6, fontWeight: 400 }}>{loc.country}</span>
              )}
              {isActive && (
                <span style={{ fontSize: '0.68rem', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '99px', marginLeft: '4px' }}>
                  Active
                </span>
              )}
            </button>
            <button
              onClick={() => onDelete(loc.name)}
              aria-label={`Remove ${loc.name}`}
              style={{
                background: 'none', border: 'none',
                color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
                fontSize: '1rem', padding: '4px', borderRadius: '6px',
                transition: 'color var(--transition)',
                flexShrink: 0,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,100,100,0.9)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.5)'; }}
            >
              ✕
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default LocationList;
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a6fa8 0%, #0a0e2e 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'var(--font-display)', gap: '16px', textAlign: 'center', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', opacity: 0.7 }}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <line x1="16" y1="13" x2="16" y2="21"/><line x1="8" y1="13" x2="8" y2="21"/>
          <line x1="12" y1="15" x2="12" y2="23"/>
          <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/>
        </svg>
      </div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Page Not Found</h1>
      <p style={{ opacity: 0.7, maxWidth: '300px', lineHeight: 1.6 }}>Looks like this page got lost in the clouds.</p>
      <button
        onClick={() => navigate('/')}
        style={{ marginTop: '8px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '999px', padding: '10px 24px', color: '#fff', fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', transition: 'all 220ms ease' }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.25)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.15)'; }}
      >
        Back to Home
      </button>
    </div>
  );
};

export default NotFound;
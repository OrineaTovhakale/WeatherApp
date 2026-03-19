import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading weather…', size = 40 }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '2rem', color: '#fff' }}>
      <div
        className="animate-spin"
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          border: '3px solid rgba(255,255,255,0.2)',
          borderTopColor: '#fff',
        }}
      />
      <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', opacity: 0.75, fontWeight: 400 }}>
        {message}
      </p>
    </div>
  );
};

export default LoadingSpinner;
import React, { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
}

const icons: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

const colors: Record<ToastType, string> = {
  success: 'rgba(22,163,74,0.95)',
  error:   'rgba(220,38,38,0.95)',
  warning: 'rgba(217,119,6,0.95)',
  info:    'rgba(99,102,241,0.95)',
};

const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose, duration = 4000 }) => {
  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);

  return (
    <div
      className="animate-slide-in"
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 18px',
        borderRadius: '12px',
        background: colors[type],
        color: '#fff',
        fontFamily: 'var(--font-display)',
        fontSize: '0.9rem',
        fontWeight: 500,
        maxWidth: '360px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <span style={{
        width: '24px', height: '24px', borderRadius: '50%',
        background: 'rgba(255,255,255,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, flexShrink: 0, fontSize: '0.8rem',
      }}>
        {icons[type]}
      </span>
      <span style={{ flex: 1, lineHeight: 1.4 }}>{message}</span>
      <button
        onClick={onClose}
        style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', cursor: 'pointer', flexShrink: 0 }}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;
import React from 'react';
import type { CurrentWeather, ForecastItem, Units } from '../types/weather';
import { getConditionIconSvg, formatDescription, getWindDirection } from '../utils/weatherHelpers';

// ─── Inline SVG weather icon ──────────────────────────
const WeatherIcon: React.FC<{ conditionId: number; isDaytime: boolean; size?: number }> = ({
  conditionId, isDaytime, size = 48,
}) => {
  const svg = getConditionIconSvg(conditionId, isDaytime);
  return (
    <div
      dangerouslySetInnerHTML={{ __html: svg }}
      style={{ width: size, height: size, flexShrink: 0 }}
    />
  );
};

// ─── Stat icons ───────────────────────────────────────
const HumidityIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
  </svg>
);

const WindIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/>
  </svg>
);

const PressureIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const VisibilityIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const ArrowUpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="19" x2="12" y2="5"/>
    <polyline points="5 12 12 5 19 12"/>
  </svg>
);

const ArrowDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <polyline points="19 12 12 19 5 12"/>
  </svg>
);

const RainDropIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
  </svg>
);

// ─── Current weather card ─────────────────────────────
interface CurrentWeatherCardProps {
  data: CurrentWeather;
  units: Units;
  isDaytime: boolean;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({ data, units, isDaytime }) => {
  const condition = data.weather[0];
  const unitLabel = units === 'metric' ? '°C' : '°F';
  const windUnit  = units === 'metric' ? 'm/s' : 'mph';

  const stats = [
    { label: 'Humidity',   value: `${data.main.humidity}%`,                                    icon: <HumidityIcon /> },
    { label: 'Wind',       value: `${Math.round(data.wind.speed)} ${windUnit} ${getWindDirection(data.wind.deg)}`, icon: <WindIcon /> },
    { label: 'Pressure',   value: `${data.main.pressure} hPa`,                                 icon: <PressureIcon /> },
    { label: 'Visibility', value: `${(data.visibility / 1000).toFixed(1)} km`,                 icon: <VisibilityIcon /> },
    { label: 'High',       value: `${Math.round(data.main.temp_max)}${unitLabel}`,              icon: <ArrowUpIcon /> },
    { label: 'Low',        value: `${Math.round(data.main.temp_min)}${unitLabel}`,              icon: <ArrowDownIcon /> },
  ];

  return (
    <div className="glass animate-fade-up" style={{ padding: '2rem', width: '100%', color: '#fff' }}>
      {/* Location + icon */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            {data.name}
          </h2>
          <p style={{ fontSize: '0.875rem', opacity: 0.75, marginTop: '4px' }}>{data.sys.country}</p>
        </div>
        <div style={{ opacity: 0.95, width: 56, height: 56 }}>
          <WeatherIcon conditionId={condition.id} isDaytime={isDaytime} size={56} />
        </div>
      </div>

      {/* Temperature hero */}
      <div style={{ marginBottom: '0.5rem' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(4rem, 12vw, 6rem)', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1 }}>
          {Math.round(data.main.temp)}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 400, opacity: 0.8, marginLeft: '4px' }}>
          {unitLabel}
        </span>
      </div>

      {/* Description */}
      <p style={{ fontSize: '1.1rem', opacity: 0.85, marginBottom: '1.75rem', fontWeight: 400 }}>
        {formatDescription(condition.description)} · Feels like {Math.round(data.main.feels_like)}{unitLabel}
      </p>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        {stats.map(({ label, value, icon }) => (
          <div key={label} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6px', opacity: 0.85 }}>
              {icon}
            </div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 500 }}>{value}</p>
            <p style={{ fontSize: '0.72rem', opacity: 0.65, marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Forecast card ────────────────────────────────────
interface ForecastCardProps {
  item: ForecastItem;
  type: 'hourly' | 'daily';
  units: Units;
  label: string;
}

export const ForecastCard: React.FC<ForecastCardProps> = ({ item, type, units, label }) => {
  const condition = item.weather[0];
  const unitLabel = units === 'metric' ? '°C' : '°F';

  return (
    <div
      className="glass animate-fade-up"
      style={{ padding: '1rem', textAlign: 'center', color: '#fff', minWidth: type === 'hourly' ? '110px' : '0', flexShrink: 0 }}
    >
      <p style={{ fontSize: '0.78rem', opacity: 0.7, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
        {label}
      </p>

      {/* Condition icon */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px', opacity: 0.9, width: 32, height: 32, margin: '0 auto 10px' }}>
        <WeatherIcon conditionId={condition.id} isDaytime={true} size={32} />
      </div>

      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>
        {Math.round(item.main.temp)}{unitLabel}
      </p>

      {/* Precipitation probability */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', opacity: 0.65, fontSize: '0.72rem' }}>
        <RainDropIcon />
        {Math.round(item.pop * 100)}%
      </div>
    </div>
  );
};
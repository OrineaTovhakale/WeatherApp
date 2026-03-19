import React from 'react';
import type { CurrentWeather, ForecastItem, Units } from '../types/weather';
import { getConditionIcon, formatDescription, getWindDirection } from '../utils/weatherHelpers';

interface CurrentWeatherCardProps {
  data: CurrentWeather;
  units: Units;
  isDaytime: boolean;
}

/** Large hero card for current weather */
export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({ data, units, isDaytime }) => {
  const condition = data.weather[0];
  const icon = getConditionIcon(condition.id, isDaytime);
  const unitLabel = units === 'metric' ? '°C' : '°F';
  const windUnit = units === 'metric' ? 'm/s' : 'mph';

  return (
    <div
      className="glass animate-fade-up"
      style={{ padding: '2rem', width: '100%', color: '#fff' }}
    >
      {/* Location */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            {data.name}
          </h2>
          <p style={{ fontSize: '0.875rem', opacity: 0.75, marginTop: '4px' }}>{data.sys.country}</p>
        </div>
        <span style={{ fontSize: '3rem', lineHeight: 1 }} role="img" aria-label={condition.description}>
          {icon}
        </span>
      </div>

      {/* Temperature — hero element */}
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
        {[
          { label: 'Humidity', value: `${data.main.humidity}%`, icon: '💧' },
          { label: 'Wind', value: `${Math.round(data.wind.speed)} ${windUnit} ${getWindDirection(data.wind.deg)}`, icon: '💨' },
          { label: 'Pressure', value: `${data.main.pressure} hPa`, icon: '🔵' },
          { label: 'Visibility', value: `${(data.visibility / 1000).toFixed(1)} km`, icon: '👁️' },
          { label: 'High', value: `${Math.round(data.main.temp_max)}${unitLabel}`, icon: '↑' },
          { label: 'Low', value: `${Math.round(data.main.temp_min)}${unitLabel}`, icon: '↓' },
        ].map(({ label, value, icon: statIcon }) => (
          <div
            key={label}
            style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}
          >
            <p style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{statIcon}</p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 500 }}>{value}</p>
            <p style={{ fontSize: '0.72rem', opacity: 0.65, marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Forecast Card ────────────────────────────────────

interface ForecastCardProps {
  item: ForecastItem;
  type: 'hourly' | 'daily';
  units: Units;
  label: string;
}

/** Compact card for hourly/daily forecast items */
export const ForecastCard: React.FC<ForecastCardProps> = ({ item, type, units, label }) => {
  const condition = item.weather[0];
  const icon = getConditionIcon(condition.id, true);
  const unitLabel = units === 'metric' ? '°C' : '°F';

  return (
    <div
      className="glass animate-fade-up"
      style={{ padding: '1rem', textAlign: 'center', color: '#fff', minWidth: type === 'hourly' ? '110px' : '0', flexShrink: 0 }}
    >
      <p style={{ fontSize: '0.78rem', opacity: 0.7, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
        {label}
      </p>
      <p style={{ fontSize: '1.6rem', marginBottom: '8px' }} role="img" aria-label={condition.description}>
        {icon}
      </p>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>
        {Math.round(item.main.temp)}{unitLabel}
      </p>
      <p style={{ fontSize: '0.72rem', opacity: 0.65 }}>
        {Math.round(item.pop * 100)}% 🌧
      </p>
    </div>
  );
};
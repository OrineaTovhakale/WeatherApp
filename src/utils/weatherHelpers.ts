import type { WeatherConditionCategory } from '../types/weather';

/**
 * Maps OpenWeatherMap condition ID to internal category.
 * Reference: https://openweathermap.org/weather-conditions
 */
export const getConditionCategory = (
  conditionId: number,
  isDaytime: boolean
): WeatherConditionCategory => {
  if (conditionId >= 200 && conditionId < 300) return 'stormy';
  if (conditionId >= 300 && conditionId < 600) return 'rainy';
  if (conditionId >= 600 && conditionId < 700) return 'snowy';
  if (conditionId >= 700 && conditionId < 800) return 'foggy';
  if (conditionId === 800) return isDaytime ? 'clear-day' : 'clear-night';
  if (conditionId > 800) return 'cloudy';
  return 'cloudy';
};

/** Returns CSS gradient variables for each weather condition */
export const getConditionTheme = (category: WeatherConditionCategory, isDark: boolean) => {
  const themes: Record<WeatherConditionCategory, { dark: string; light: string; accent: string }> = {
    'clear-day': {
      dark:  'linear-gradient(135deg, #1a6fa8 0%, #f5a623 60%, #f76b1c 100%)',
      light: 'linear-gradient(135deg, #56a0d3 0%, #f9c35e 60%, #f99b3e 100%)',
      accent: '#f5a623',
    },
    'clear-night': {
      dark:  'linear-gradient(135deg, #0a0e2e 0%, #1a1f5e 50%, #2d1b69 100%)',
      light: 'linear-gradient(135deg, #2c3a8c 0%, #4a3faa 50%, #6b52c0 100%)',
      accent: '#a78bfa',
    },
    cloudy: {
      dark:  'linear-gradient(135deg, #4a5568 0%, #718096 50%, #a0aec0 100%)',
      light: 'linear-gradient(135deg, #6b7a99 0%, #8e9ab5 50%, #b8c4d6 100%)',
      accent: '#e2e8f0',
    },
    rainy: {
      dark:  'linear-gradient(135deg, #1a202c 0%, #2d3748 40%, #2b6cb0 100%)',
      light: 'linear-gradient(135deg, #2c3a5a 0%, #3d5480 40%, #4a7cc9 100%)',
      accent: '#63b3ed',
    },
    stormy: {
      dark:  'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
      light: 'linear-gradient(135deg, #2a2a4a 0%, #243050 40%, #1e4880 100%)',
      accent: '#ffd700',
    },
    snowy: {
      dark:  'linear-gradient(135deg, #9fa8da 0%, #c5cae9 40%, #e8eaf6 100%)',
      light: 'linear-gradient(135deg, #c5cae9 0%, #dde1f5 40%, #f0f2fc 100%)',
      accent: '#5c6bc0',
    },
    foggy: {
      dark:  'linear-gradient(135deg, #2d3436 0%, #636e72 50%, #b2bec3 100%)',
      light: 'linear-gradient(135deg, #636e72 0%, #8e9aa0 50%, #c8d3d8 100%)',
      accent: '#dfe6e9',
    },
    windy: {
      dark:  'linear-gradient(135deg, #005f73 0%, #0083b0 50%, #00b4db 100%)',
      light: 'linear-gradient(135deg, #0077a8 0%, #0099cc 50%, #22c1e8 100%)',
      accent: '#90e0ef',
    },
  };
  const t = themes[category];
  return { bg: isDark ? t.dark : t.light, accent: t.accent };
};

/**
 * Returns an SVG icon string for each weather condition.
 * All icons are inline SVG — no emoji, no external dependencies.
 */
export const getConditionIconSvg = (conditionId: number, isDaytime: boolean): string => {
  // Thunderstorm
  if (conditionId >= 200 && conditionId < 300) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"/>
      <polyline points="13 11 9 17 15 17 11 23"/>
    </svg>`;
  }
  // Drizzle
  if (conditionId >= 300 && conditionId < 400) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <line x1="8" y1="19" x2="8" y2="21"/><line x1="8" y1="13" x2="8" y2="15"/>
      <line x1="16" y1="19" x2="16" y2="21"/><line x1="16" y1="13" x2="16" y2="15"/>
      <line x1="12" y1="21" x2="12" y2="23"/><line x1="12" y1="15" x2="12" y2="17"/>
      <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/>
    </svg>`;
  }
  // Rain
  if (conditionId >= 500 && conditionId < 600) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <line x1="16" y1="13" x2="16" y2="21"/><line x1="8" y1="13" x2="8" y2="21"/>
      <line x1="12" y1="15" x2="12" y2="23"/>
      <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/>
    </svg>`;
  }
  // Snow
  if (conditionId >= 600 && conditionId < 700) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <line x1="12" y1="2" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
      <line x1="2" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="19.07" y2="4.93"/>
      <circle cx="12" cy="12" r="1" fill="currentColor"/>
    </svg>`;
  }
  // Atmosphere (fog, mist, haze)
  if (conditionId >= 700 && conditionId < 800) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <line x1="3" y1="8" x2="21" y2="8"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="16" x2="21" y2="16"/>
    </svg>`;
  }
  // Clear day
  if (conditionId === 800 && isDaytime) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>`;
  }
  // Clear night
  if (conditionId === 800 && !isDaytime) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>`;
  }
  // Few clouds
  if (conditionId === 801) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="9" cy="13" r="0"/>
      <path d="M12 3a4 4 0 0 1 3.46 6A5 5 0 0 1 14 19H7a5 5 0 0 1-.78-9.93A4 4 0 0 1 12 3z"/>
      <line x1="17" y1="5" x2="17" y2="3"/><line x1="20.66" y1="6.34" x2="19.25" y2="7.75"/>
      <line x1="22" y1="10" x2="20" y2="10"/>
    </svg>`;
  }
  // Cloudy (802-804)
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z"/>
  </svg>`;
};

/** Checks if current time is daytime based on sunrise/sunset */
export const getIsDaytime = (dt: number, sunrise: number, sunset: number): boolean => {
  return dt > sunrise && dt < sunset;
};

/** Formats a unix timestamp to readable time string */
export const formatTime = (unix: number, timezone: number): string => {
  const date = new Date((unix + timezone) * 1000);
  return date.toUTCString().slice(17, 22);
};

/** Formats unix timestamp to short day label */
export const formatDay = (unix: number): string => {
  return new Date(unix * 1000).toLocaleDateString('en-US', { weekday: 'short' });
};

/** Formats unix timestamp to hour label */
export const formatHour = (unix: number): string => {
  return new Date(unix * 1000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
};

/** Converts wind degrees to cardinal direction */
export const getWindDirection = (deg: number): string => {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
};

/** Returns a human-readable label for condition description */
export const formatDescription = (description: string): string => {
  return description.charAt(0).toUpperCase() + description.slice(1);
};
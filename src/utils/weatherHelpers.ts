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
export const getConditionTheme = (category: WeatherConditionCategory) => {
  const themes: Record<WeatherConditionCategory, { bg: string; accent: string; glass: string; text: string }> = {
    'clear-day': {
      bg: 'linear-gradient(135deg, #1a6fa8 0%, #f5a623 60%, #f76b1c 100%)',
      accent: '#f5a623',
      glass: 'rgba(255,255,255,0.15)',
      text: '#fff',
    },
    'clear-night': {
      bg: 'linear-gradient(135deg, #0a0e2e 0%, #1a1f5e 50%, #2d1b69 100%)',
      accent: '#a78bfa',
      glass: 'rgba(255,255,255,0.08)',
      text: '#fff',
    },
    cloudy: {
      bg: 'linear-gradient(135deg, #4a5568 0%, #718096 50%, #a0aec0 100%)',
      accent: '#e2e8f0',
      glass: 'rgba(255,255,255,0.12)',
      text: '#fff',
    },
    rainy: {
      bg: 'linear-gradient(135deg, #1a202c 0%, #2d3748 40%, #2b6cb0 100%)',
      accent: '#63b3ed',
      glass: 'rgba(255,255,255,0.1)',
      text: '#fff',
    },
    stormy: {
      bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
      accent: '#ffd700',
      glass: 'rgba(255,255,255,0.08)',
      text: '#fff',
    },
    snowy: {
      bg: 'linear-gradient(135deg, #e8eaf6 0%, #c5cae9 40%, #9fa8da 100%)',
      accent: '#5c6bc0',
      glass: 'rgba(255,255,255,0.3)',
      text: '#1a1a2e',
    },
    foggy: {
      bg: 'linear-gradient(135deg, #b2bec3 0%, #636e72 50%, #2d3436 100%)',
      accent: '#dfe6e9',
      glass: 'rgba(255,255,255,0.12)',
      text: '#fff',
    },
    windy: {
      bg: 'linear-gradient(135deg, #00b4db 0%, #0083b0 50%, #005f73 100%)',
      accent: '#90e0ef',
      glass: 'rgba(255,255,255,0.12)',
      text: '#fff',
    },
  };
  return themes[category];
};

/** Returns emoji icon for weather condition */
export const getConditionIcon = (conditionId: number, isDaytime: boolean): string => {
  if (conditionId >= 200 && conditionId < 300) return '⛈️';
  if (conditionId >= 300 && conditionId < 400) return '🌦️';
  if (conditionId >= 400 && conditionId < 500) return '🌧️';
  if (conditionId >= 500 && conditionId < 600) return '🌧️';
  if (conditionId >= 600 && conditionId < 700) return '❄️';
  if (conditionId >= 700 && conditionId < 800) return '🌫️';
  if (conditionId === 800) return isDaytime ? '☀️' : '🌙';
  if (conditionId === 801) return isDaytime ? '🌤️' : '🌙';
  if (conditionId === 802) return '⛅';
  if (conditionId >= 803) return '☁️';
  return '🌡️';
};

/** Returns a human-readable label for condition description */
export const formatDescription = (description: string): string => {
  return description.charAt(0).toUpperCase() + description.slice(1);
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

/** Checks if current time is daytime based on sunrise/sunset */
export const getIsDaytime = (dt: number, sunrise: number, sunset: number): boolean => {
  return dt > sunrise && dt < sunset;
};
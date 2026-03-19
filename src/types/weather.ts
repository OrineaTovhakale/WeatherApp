// ─── Core weather condition ──────────────────────────
export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface MainWeatherData {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}

export interface WindData {
  speed: number;
  deg: number;
  gust?: number;
}

export interface SysData {
  country: string;
  sunrise: number;
  sunset: number;
}

// ─── Current weather response ─────────────────────────
export interface CurrentWeather {
  id: number;
  name: string;
  coord: { lat: number; lon: number };
  weather: WeatherCondition[];
  main: MainWeatherData;
  wind: WindData;
  sys: SysData;
  visibility: number;
  dt: number;
  timezone: number;
}

// ─── Forecast list item ───────────────────────────────
export interface ForecastItem {
  dt: number;
  main: MainWeatherData;
  weather: WeatherCondition[];
  wind: WindData;
  dt_txt: string;
  pop: number; // probability of precipitation
}

// ─── Forecast response ────────────────────────────────
export interface ForecastResponse {
  list: ForecastItem[];
  city: {
    name: string;
    country: string;
    sunrise: number;
    sunset: number;
  };
}

// ─── Saved location ───────────────────────────────────
export interface SavedLocation {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

// ─── Units ────────────────────────────────────────────
export type Units = 'metric' | 'imperial';

// ─── Weather condition category (for theming) ─────────
export type WeatherConditionCategory =
  | 'clear-day'
  | 'clear-night'
  | 'cloudy'
  | 'rainy'
  | 'stormy'
  | 'snowy'
  | 'foggy'
  | 'windy';

// ─── Forecast view type ───────────────────────────────
export type ForecastType = 'hourly' | 'daily';
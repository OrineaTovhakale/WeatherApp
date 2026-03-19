import axios, { AxiosError } from 'axios';
import type { CurrentWeather, ForecastResponse, Units, SavedLocation } from '../types/weather';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY as string;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

// ─── Cache helpers ────────────────────────────────────
const CACHE_TTL = 3_600_000; // 1 hour in ms

const makeCacheKey = (url: string): string => `wx_cache_${btoa(url)}`;

const getFromCache = <T>(key: string): T | null => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw) as { data: T; timestamp: number };
    if (Date.now() - timestamp < CACHE_TTL) return data;
    localStorage.removeItem(key); // expired — clean up
    return null;
  } catch {
    return null;
  }
};

const setInCache = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    // localStorage may be full — silently ignore
  }
};

// ─── Error helper ─────────────────────────────────────
const handleApiError = (err: unknown): never => {
  if (err instanceof AxiosError) {
    const status = err.response?.status;
    if (status === 401) throw new Error('Invalid API key. Please check your configuration.');
    if (status === 404) throw new Error('Location not found. Please try a different search.');
    if (status === 429) throw new Error('Too many requests. Please wait a moment and try again.');
    throw new Error(err.response?.data?.message ?? 'Weather data unavailable. Please try again.');
  }
  throw new Error('An unexpected error occurred.');
};

// ─── Current weather ──────────────────────────────────
export const getCurrentWeather = async (
  lat: number,
  lon: number,
  units: Units = 'metric'
): Promise<CurrentWeather> => {
  // Units are part of the cache key — changing units busts the cache automatically
  const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`;
  const cached = getFromCache<CurrentWeather>(makeCacheKey(url));
  if (cached) return cached;

  try {
    const res = await axios.get<CurrentWeather>(url);
    setInCache(makeCacheKey(url), res.data);
    return res.data;
  } catch (err) {
    return handleApiError(err);
  }
};

// ─── Forecast ─────────────────────────────────────────
/**
 * Hourly: returns 8 x 3-hour intervals (24h ahead).
 * Daily: returns 5 items, one per day (we pick midday readings from the 3h forecast).
 */
export const getForecast = async (
  lat: number,
  lon: number,
  units: Units = 'metric',
  type: 'hourly' | 'daily' = 'hourly'
): Promise<ForecastResponse> => {
  // Always fetch 40 items (5 days of 3h data) so we can derive daily from it
  const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&cnt=40&units=${units}&appid=${API_KEY}`;
  const cached = getFromCache<ForecastResponse>(makeCacheKey(url));
  const raw = cached ?? await (async () => {
    try {
      const res = await axios.get<ForecastResponse>(url);
      setInCache(makeCacheKey(url), res.data);
      return res.data;
    } catch (err) {
      return handleApiError(err);
    }
  })();

  if (type === 'hourly') {
    // Return first 8 items (next 24h in 3h steps)
    return { ...raw, list: raw.list.slice(0, 8) };
  }

  // Daily: pick one reading per calendar day (prefer midday ~12:00)
  const dailyMap = new Map<string, typeof raw.list[0]>();
  for (const item of raw.list) {
    const day = item.dt_txt.slice(0, 10); // "2025-01-15"
    const existing = dailyMap.get(day);
    if (!existing) {
      dailyMap.set(day, item);
    } else {
      // Prefer the entry closest to 12:00
      const existingHour = parseInt(existing.dt_txt.slice(11, 13));
      const thisHour = parseInt(item.dt_txt.slice(11, 13));
      if (Math.abs(thisHour - 12) < Math.abs(existingHour - 12)) {
        dailyMap.set(day, item);
      }
    }
  }

  return { ...raw, list: Array.from(dailyMap.values()).slice(0, 5) };
};

// ─── Geocoding ────────────────────────────────────────
export const getLocationByName = async (city: string): Promise<SavedLocation> => {
  const url = `${GEO_URL}/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`;
  const cached = getFromCache<SavedLocation>(makeCacheKey(url));
  if (cached) return cached;

  try {
    const res = await axios.get<Array<{ name: string; country: string; lat: number; lon: number }>>(url);
    if (!res.data.length) throw new Error('Location not found. Please try a different search.');
    const { name, country, lat, lon } = res.data[0];
    const location: SavedLocation = { name, country, lat, lon };
    setInCache(makeCacheKey(url), location);
    return location;
  } catch (err) {
    return handleApiError(err);
  }
};

// ─── Reverse geocoding (coords → name) ───────────────
export const getLocationByCoords = async (lat: number, lon: number): Promise<SavedLocation> => {
  const url = `${GEO_URL}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`;
  const cached = getFromCache<SavedLocation>(makeCacheKey(url));
  if (cached) return cached;

  try {
    const res = await axios.get<Array<{ name: string; country: string; lat: number; lon: number }>>(url);
    if (!res.data.length) return { name: 'Your Location', country: '', lat, lon };
    const { name, country } = res.data[0];
    const location: SavedLocation = { name, country, lat, lon };
    setInCache(makeCacheKey(url), location);
    return location;
  } catch {
    return { name: 'Your Location', country: '', lat, lon };
  }
};
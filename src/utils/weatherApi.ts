import axios from 'axios';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// ---- Cache Helpers ----
const cacheKey = (url: string) => btoa(url); // Encode to unique key

const getCached = (key: string) => {
  const cached = localStorage.getItem(key);
  if (cached) {
    try {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < 3600000) {
        // 1 hour validity
        return data;
      }
    } catch (e) {
      console.error('Cache parse error:', e);
    }
  }
  return null;
};

const setCached = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
};

// ---- API Calls with Caching ----
export const getCurrentWeather = async (
  lat: number,
  lon: number,
  units: 'metric' | 'imperial' = 'metric'
) => {
  const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`;
  const key = cacheKey(url);

  const cache = getCached(key);
  if (cache) return cache;

  const res = await axios.get(url);
  setCached(key, res.data);
  return res.data;
};

export const getForecast = async (
  lat: number,
  lon: number,
  units: 'metric' | 'imperial' = 'metric',
  type: 'hourly' | 'daily' = 'hourly'
) => {
  const cnt = type === 'hourly' ? 8 : 5; // 8 hours or 5 days
  const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&cnt=${cnt}&units=${units}&appid=${API_KEY}`;
  const key = cacheKey(url);

  const cache = getCached(key);
  if (cache) return cache;

  const res = await axios.get(url);
  setCached(key, res.data);
  return res.data;
};

export const getLocationByName = async (city: string) => {
  const url = `${BASE_URL}/weather?q=${city}&appid=${API_KEY}`;
  const key = cacheKey(url);

  const cache = getCached(key);
  if (cache) {
    return { lat: cache.coord.lat, lon: cache.coord.lon };
  }

  const res = await axios.get(url);
  setCached(key, res.data);
  return { lat: res.data.coord.lat, lon: res.data.coord.lon };
};

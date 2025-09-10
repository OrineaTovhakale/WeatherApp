import axios from 'axios';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const cacheKey = (url: string) => btoa(url);

const getCached = (key: string) => {
  const cached = localStorage.getItem(key);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < 3600000) return data; // 1 hour
  }
  return null;
};

const setCached = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
};

export const getCurrentWeather = async (lat: number, lon: number, units: 'metric' | 'imperial' = 'metric') => {
  const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`;
  const cache = getCached(cacheKey(url));
  if (cache) return cache;
  const res = await axios.get(url);
  setCached(cacheKey(url), res.data);
  return res.data;
};

export const getForecast = async (lat: number, lon: number, units: 'metric' | 'imperial' = 'metric', type: 'hourly' | 'daily' = 'hourly') => {
  const cnt = type === 'hourly' ? 8 : 5;
  const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&cnt=${cnt}&units=${units}&appid=${API_KEY}`;
  const cache = getCached(cacheKey(url));
  if (cache) return cache;
  const res = await axios.get(url);
  setCached(cacheKey(url), res.data);
  return res.data;
};

export const getLocationByName = async (city: string) => {
  const url = `${BASE_URL}/weather?q=${city}&appid=${API_KEY}`;
  const cache = getCached(cacheKey(url));
  if (cache) return { lat: cache.coord.lat, lon: cache.coord.lon };
  const res = await axios.get(url);
  setCached(cacheKey(url), res.data);
  return { lat: res.data.coord.lat, lon: res.data.coord.lon };
};
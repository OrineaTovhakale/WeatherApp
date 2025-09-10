import axios from 'axios';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const getCurrentWeather = async (lat: number, lon: number, units: 'metric' | 'imperial' = 'metric') => {
  const res = await axios.get(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`);
  return res.data;
};

export const getForecast = async (lat: number, lon: number, units: 'metric' | 'imperial' = 'metric', type: 'hourly' | 'daily' = 'hourly') => {
  const cnt = type === 'hourly' ? 8 : 5; // 8 hours or 5 days
  const res = await axios.get(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&cnt=${cnt}&units=${units}&appid=${API_KEY}`);
  return res.data;
};

export const getLocationByName = async (city: string) => {
  const res = await axios.get(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}`);
  return { lat: res.data.coord.lat, lon: res.data.coord.lon };
};
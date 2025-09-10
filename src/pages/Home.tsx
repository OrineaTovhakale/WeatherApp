import { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import WeatherCard from '../components/WeatherCard';
import { getCurrentWeather, getForecast, getLocationByName } from '../utils/weatherApi';
import ThemeToggle from '../components/ThemeToggle';

const Home = () => {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [searchedLocation, setSearchedLocation] = useState<string>('');
  const [currentWeather, setCurrentWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any>(null);
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [forecastType, setForecastType] = useState<'hourly' | 'daily'>('hourly');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        (err) => console.error('Geolocation error:', err),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      if (location) {
        try {
          const weather = await getCurrentWeather(location.lat, location.lon, units);
          setCurrentWeather(weather);

          const fore = await getForecast(location.lat, location.lon, units, forecastType);
          setForecast(fore);
        } catch (err) {
          console.error('Weather fetch error:', err);
        }
      }
    };
    fetchWeather();
  }, [location, units, forecastType]);

  const handleSearch = async (query: string) => {
    try {
      const loc = await getLocationByName(query);
      setLocation(loc);
      setSearchedLocation(query);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-start p-4">
      {/* Header with ThemeToggle */}
      <div className="flex justify-end w-full max-w-3xl">
        <ThemeToggle />
      </div>

      <h1 className="text-4xl font-bold text-white dark:text-gray-200 mb-8">
        Weather Dashboard
      </h1>

      <SearchBar onSearch={handleSearch} />

      {location && (
        <p className="text-white dark:text-gray-300 mt-4">
          Current Location: Lat {location.lat}, Lon {location.lon}
        </p>
      )}

      {searchedLocation && (
        <p className="text-white dark:text-gray-400 mt-2">
          Searched: {searchedLocation}
        </p>
      )}

      {/* Weather data display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 w-full max-w-5xl">
        {currentWeather && (
          <WeatherCard
            data={currentWeather}
            type="current"
            units={units === 'metric' ? 'C' : 'F'}
          />
        )}
        {forecast &&
          forecast.list.map((item: any, idx: number) => (
            <WeatherCard
              key={idx}
              data={item}
              type={forecastType}
              units={units === 'metric' ? 'C' : 'F'}
            />
          ))}
      </div>

      {/* Controls */}
      <div className="mt-8 flex space-x-4">
        <button
          onClick={() => setForecastType('hourly')}
          className="px-4 py-2 bg-blue-500 dark:bg-blue-700 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-800"
        >
          Hourly
        </button>
        <button
          onClick={() => setForecastType('daily')}
          className="px-4 py-2 bg-blue-500 dark:bg-blue-700 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-800"
        >
          Daily
        </button>
        <button
          onClick={() => setUnits(units === 'metric' ? 'imperial' : 'metric')}
          className="px-4 py-2 bg-green-500 dark:bg-green-700 text-white rounded hover:bg-green-600 dark:hover:bg-green-800"
        >
          Switch to {units === 'metric' ? 'F' : 'C'}
        </button>
      </div>
    </div>
  );
};

export default Home;

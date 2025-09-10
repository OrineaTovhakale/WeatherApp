import { useEffect, useState } from 'react';
import { useContext } from 'react';
import SearchBar from '../components/SearchBar';
import WeatherCard from '../components/WeatherCard';
import LocationList from '../components/LocationList';
import ThemeToggle from '../components/ThemeToggle';
import { AppContext } from '../context/AppContext';
import { getCurrentWeather, getForecast, getLocationByName } from '../utils/weatherApi';

const Home = () => {
  const { units, setUnits } = useContext(AppContext)!;
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [locationName, setLocationName] = useState<string>('');
  const [searchedLocation, setSearchedLocation] = useState<string>('');
  const [currentWeather, setCurrentWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any>(null);
  const [forecastType, setForecastType] = useState<'hourly' | 'daily'>('hourly');
  const [savedLocations, setSavedLocations] = useState<string[]>([]);

  useEffect(() => {
    // Load saved locations
    const saved = JSON.parse(localStorage.getItem('locations') || '[]');
    setSavedLocations(saved);

    // Request geolocation
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
          setLocationName(weather.name); // Set name from API response
          const fore = await getForecast(location.lat, location.lon, units, forecastType);
          setForecast(fore);

          // Alert simulation for severe weather
          if (weather.main.temp < 0 || weather.main.temp > 40) {
            if (Notification.permission === 'granted') {
              new Notification('Severe Weather Alert', { body: `Extreme temperature in ${weather.name}!` });
            }
          }
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
      addLocation(query);
    } catch (err) {
      console.error('Search error:', err);
      // TODO: Show user notification
    }
  };

  const addLocation = (loc: string) => {
    if (!savedLocations.includes(loc)) {
      const newList = [...savedLocations, loc];
      setSavedLocations(newList);
      localStorage.setItem('locations', JSON.stringify(newList));
    }
  };

  const deleteLocation = (loc: string) => {
    const newList = savedLocations.filter((l) => l !== loc);
    setSavedLocations(newList);
    localStorage.setItem('locations', JSON.stringify(newList));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 dark:from-gray-900 dark:to-gray-700 flex flex-col items-center justify-center p-4">
      <div className="flex justify-end w-full max-w-3xl">
        <ThemeToggle />
      </div>
      <h1 className="text-4xl font-bold text-white mb-8">Weather Dashboard</h1>
      <SearchBar onSearch={handleSearch} />
      {locationName && <p className="text-white mt-4">Current Location: {locationName}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {currentWeather && <WeatherCard data={currentWeather} type="current" units={units === 'metric' ? 'C' : 'F'} />}
        {forecast && forecast.list.map((item: any, idx: number) => (
          <WeatherCard key={idx} data={item} type={forecastType} units={units === 'metric' ? 'C' : 'F'} />
        ))}
      </div>
      <div className="mt-8 flex space-x-4">
        <button onClick={() => setForecastType('hourly')} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Hourly</button>
        <button onClick={() => setForecastType('daily')} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Daily</button>
        <button onClick={() => setUnits(units === 'metric' ? 'imperial' : 'metric')} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Switch to {units === 'metric' ? 'F' : 'C'}
        </button>
      </div>
      <div className="mt-8 w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Saved Locations</h2>
        <LocationList locations={savedLocations} onSelect={handleSearch} onDelete={deleteLocation} />
      </div>
    </div>
  );
};

export default Home;
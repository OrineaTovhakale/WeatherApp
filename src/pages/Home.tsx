import { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';

const Home = () => {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [searchedLocation, setSearchedLocation] = useState<string>('');

  useEffect(() => {
    // Request geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        (err) => console.error('Geolocation error:', err),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const handleSearch = (query: string) => {
    setSearchedLocation(query);
    // TODO: Fetch weather for searched location
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 dark:from-gray-900 dark:to-gray-700 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-white mb-8">Weather Dashboard</h1>
      <SearchBar onSearch={handleSearch} />
      {location && <p className="text-white mt-4">Current Location: Lat {location.lat}, Lon {location.lon}</p>}
      {searchedLocation && <p className="text-white mt-4">Searched: {searchedLocation}</p>}
      {/* TODO: Weather display */}
    </div>
  );
};

export default Home;
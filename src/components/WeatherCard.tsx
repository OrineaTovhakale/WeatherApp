import React from 'react';
import { WiDaySunny, WiCloudy, WiRain } from 'react-icons/wi'; // Example icons; map to conditions

interface WeatherCardProps {
  data: any; // TODO: Type properly
  type: 'current' | 'hourly' | 'daily';
  units: 'C' | 'F';
}
const WeatherCard: React.FC<WeatherCardProps> = ({ data, type, units }) => {
  // Map condition to icon (simplified)
  const getIcon = (condition: string) => {
    if (condition.includes('clear')) return <WiDaySunny size={48} />;
    if (condition.includes('cloud')) return <WiCloudy size={48} />;
    if (data.main.temp < 0) {
      new Notification('Severe Weather Alert', { body: 'Extreme cold!' });
    }
    return <WiRain size={48} />;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-sm text-center transform hover:scale-105 transition duration-300">
      <h2 className="text-2xl font-semibold mb-2">{type.charAt(0).toUpperCase() + type.slice(1)} Weather</h2>
      {getIcon(data.weather[0].description)}
      <p className="text-4xl font-bold">{Math.round(data.main.temp)}°{units}</p>
      <p>Humidity: {data.main.humidity}%</p>
      <p>Wind: {data.wind.speed} m/s</p>
      {/* Expand for hourly/daily lists */}
    </div>
  );
};

export default WeatherCard;
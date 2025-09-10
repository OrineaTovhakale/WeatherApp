import { WiDaySunny, WiCloudy, WiRain } from 'react-icons/wi';

interface WeatherCardProps {
  data: any; // TODO: Type properly
  type: 'current' | 'hourly' | 'daily';
  units: 'C' | 'F';
}

const WeatherCard: React.FC<WeatherCardProps> = ({ data, type, units }) => {
  // Map condition to icon (simplified)
  const getIcon = (condition: string) => {
    if (condition.includes('clear')) return <WiDaySunny size={48} className="sm:w-16 sm:h-16" />;
    if (condition.includes('cloud')) return <WiCloudy size={48} className="sm:w-16 sm:h-16" />;
    return <WiRain size={48} className="sm:w-16 sm:h-16" />;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full text-center transform hover:scale-105 active:scale-95 transition duration-300 sm:max-w-sm">
      <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white sm:text-2xl">
        {type.charAt(0).toUpperCase() + type.slice(1)} Weather
      </h2>
      {getIcon(data.weather[0].description)}
      <p className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">{Math.round(data.main.temp)}°{units}</p>
      <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">Humidity: {data.main.humidity}%</p>
      <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">Wind: {data.wind.speed} m/s</p>
    </div>
  );
};

export default WeatherCard;
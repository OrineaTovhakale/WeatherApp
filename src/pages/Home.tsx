import React, { useEffect, useState, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import SearchBar from '../components/SearchBar';
import ThemeToggle from '../components/ThemeToggle';
import { CurrentWeatherCard, ForecastCard } from '../components/WeatherCard';
import LocationList from '../components/LocationList';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';
import type { ToastType } from '../components/Toast';
import type { CurrentWeather, ForecastResponse, ForecastType, SavedLocation } from '../types/weather';
import { getCurrentWeather, getForecast, getLocationByName, getLocationByCoords } from '../utils/weatherApi';
import { getConditionCategory, getConditionTheme, getIsDaytime, formatDay, formatHour } from '../utils/weatherHelpers';

interface ToastState { message: string; type: ToastType; id: number; }

const isSevereWeather = (weather: CurrentWeather): boolean => {
  const id = weather.weather[0].id;
  const temp = weather.main.temp;
  return id < 300 || temp > 40 || temp < -10;
};

const Home: React.FC = () => {
  const { units, setUnits, savedLocations, addLocation, removeLocation } = useAppContext();
  const [activeLocation, setActiveLocation] = useState<SavedLocation | null>(null);
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [forecastType, setForecastType] = useState<ForecastType>('hourly');
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [isLocationsOpen, setIsLocationsOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (message: string, type: ToastType = 'info') =>
    setToast({ message, type, id: Date.now() });

  const fetchWeatherForLocation = useCallback(async (loc: SavedLocation) => {
    setIsLoadingWeather(true);
    try {
      const [weather, fore] = await Promise.all([
        getCurrentWeather(loc.lat, loc.lon, units),
        getForecast(loc.lat, loc.lon, units, forecastType),
      ]);
      setCurrentWeather(weather);
      setForecast(fore);
      setActiveLocation(loc);
      if (isSevereWeather(weather)) {
        const msg = `Severe weather alert for ${weather.name}: ${weather.weather[0].description}`;
        showToast(msg, 'warning');
        if (Notification.permission === 'granted') {
          new Notification('Weather Alert', { body: msg });
        }
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to load weather.', 'error');
    } finally {
      setIsLoadingWeather(false);
    }
  }, [units, forecastType]);

  useEffect(() => {
    if (!navigator.geolocation) {
      showToast('Geolocation not supported. Search for a city to get started.', 'info');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const loc = await getLocationByCoords(pos.coords.latitude, pos.coords.longitude);
        fetchWeatherForLocation(loc);
      },
      () => showToast('Location access denied. Search for a city to get started.', 'info'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeLocation) fetchWeatherForLocation(activeLocation);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [units, forecastType]);

  const handleSearch = async (query: string) => {
    setIsLoadingSearch(true);
    try {
      const loc = await getLocationByName(query);
      addLocation(loc);
      fetchWeatherForLocation(loc);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Location not found.', 'error');
    } finally {
      setIsLoadingSearch(false);
    }
  };

  const isDaytime = currentWeather
    ? getIsDaytime(currentWeather.dt, currentWeather.sys.sunrise, currentWeather.sys.sunset)
    : true;
  const conditionCategory = currentWeather
    ? getConditionCategory(currentWeather.weather[0].id, isDaytime)
    : 'clear-day';
  const theme = getConditionTheme(conditionCategory);
  const getForecastLabel = (item: { dt: number }) =>
    forecastType === 'hourly' ? formatHour(item.dt) : formatDay(item.dt);

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, transition: 'background var(--transition-slow)', fontFamily: 'var(--font-display)', position: 'relative', overflow: 'hidden' }}>
      {/* Atmospheric bg circles */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', bottom: '-30%', left: '-15%', width: '800px', height: '800px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto', padding: 'clamp(1rem, 4vw, 2rem)' }}>

        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>🌤</span>
            <h1 style={{ color: '#fff', fontSize: 'clamp(1rem, 3vw, 1.3rem)', fontWeight: 700, letterSpacing: '-0.01em' }}>Weather</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* Units toggle */}
            <button onClick={() => setUnits(units === 'metric' ? 'imperial' : 'metric')}
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '999px', padding: '8px 14px', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', transition: 'all var(--transition)', backdropFilter: 'blur(8px)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.25)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.15)'; }}
              title="Toggle temperature units"
            >
              °{units === 'metric' ? 'C → °F' : 'F → °C'}
            </button>

            {/* Saved locations */}
            <button onClick={() => setIsLocationsOpen(o => !o)}
              style={{ background: isLocationsOpen ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '999px', padding: '8px 14px', color: '#fff', fontFamily: 'var(--font-display)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', transition: 'all var(--transition)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', gap: '6px' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.25)'; }}
              onMouseLeave={e => { if (!isLocationsOpen) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.15)'; }}
            >
              📍 <span className="hide-mobile">Saved</span>
              {savedLocations.length > 0 && (
                <span style={{ background: 'rgba(255,255,255,0.3)', borderRadius: '999px', padding: '1px 7px', fontSize: '0.75rem' }}>{savedLocations.length}</span>
              )}
            </button>

            <ThemeToggle />
          </div>
        </div>

        {/* Search */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <SearchBar onSearch={handleSearch} isLoading={isLoadingSearch} />
        </div>

        {/* Saved locations panel */}
        {isLocationsOpen && (
          <div className="glass animate-fade-up" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700 }}>Saved Locations</h3>
              {activeLocation && (
                <button
                  onClick={() => { addLocation(activeLocation); showToast(`${activeLocation.name} saved!`, 'success'); }}
                  style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '999px', padding: '5px 12px', color: '#fff', fontFamily: 'var(--font-display)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', transition: 'all var(--transition)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.25)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.15)'; }}
                >
                  + Save current
                </button>
              )}
            </div>
            <LocationList locations={savedLocations} onSelect={(loc) => { fetchWeatherForLocation(loc); setIsLocationsOpen(false); }} onDelete={removeLocation} currentLocationName={activeLocation?.name} />
          </div>
        )}

        {/* Main weather content */}
        {isLoadingWeather ? (
          <div className="glass" style={{ padding: '3rem', display: 'flex', justifyContent: 'center' }}>
            <LoadingSpinner message="Fetching weather data…" />
          </div>
        ) : currentWeather ? (
          <>
            <CurrentWeatherCard data={currentWeather} units={units} isDaytime={isDaytime} />

            {/* Forecast toggle */}
            <div style={{ display: 'flex', gap: '8px', margin: '1.25rem 0 1rem', justifyContent: 'center' }}>
              {(['hourly', 'daily'] as ForecastType[]).map(type => (
                <button key={type} onClick={() => setForecastType(type)}
                  style={{ padding: '8px 24px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.25)', background: forecastType === type ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)', color: '#fff', fontFamily: 'var(--font-display)', fontSize: '0.875rem', fontWeight: forecastType === type ? 700 : 400, cursor: 'pointer', transition: 'all var(--transition)' }}
                  onMouseEnter={e => { if (forecastType !== type) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.18)'; }}
                  onMouseLeave={e => { if (forecastType !== type) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.1)'; }}
                >
                  {type === 'hourly' ? '⏱ Hourly' : '📅 Daily'}
                </button>
              ))}
            </div>

            {/* Forecast cards */}
            {forecast && (
              <div className="stagger" style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
                {forecast.list.map(item => (
                  <div key={item.dt} style={{ scrollSnapAlign: 'start', flexShrink: 0, width: forecastType === 'daily' ? 'calc(20% - 8px)' : '110px', minWidth: forecastType === 'daily' ? '100px' : '110px' }}>
                    <ForecastCard item={item} type={forecastType} units={units} label={getForecastLabel(item)} />
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="glass" style={{ padding: '4rem 2rem', textAlign: 'center', color: '#fff' }}>
            <p style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌍</p>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>No weather data yet</h2>
            <p style={{ opacity: 0.7, fontSize: '0.9rem', lineHeight: 1.6 }}>Allow location access or search for a city above to get started.</p>
          </div>
        )}
      </div>

      {toast && <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Home;
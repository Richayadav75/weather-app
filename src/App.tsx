import { useEffect } from 'react';
import { useWeather } from './hooks/useWeather';
import { useGeolocation } from './hooks/useGeolocation';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import SearchHistory from './components/SearchHistory';
import WeatherAlerts from './components/WeatherAlerts';
import { getWeatherInfo } from './utils/weatherCodes';
import './App.css';

export default function App() {
  const { weather, loading, error, unit, history, loadWeather, clearHistory, toggleUnit } = useWeather();
  const { locating, geoError, getLocation } = useGeolocation();

  const theme = weather ? getWeatherInfo(weather.current.weatherCode).theme : 'clear';
  const isNight = weather ? weather.current.isDay === 0 : false;

  // Load last searched location on startup
  useEffect(() => {
    if (history.length > 0 && !weather) {
      loadWeather(history[0]);
    }
  }, []);

  return (
    <div className={`app theme-${theme} ${isNight ? 'night' : 'day'}`}>
      <div className="app-bg" aria-hidden="true">
        <div className="bg-orb orb1" />
        <div className="bg-orb orb2" />
        <div className="bg-orb orb3" />
      </div>

      <div className="app-content">
        {/* Header */}
        <header className="app-header">
          <div className="app-logo">
            <span className="logo-icon">🌤</span>
            <h1 className="logo-text">WeatherNow</h1>
          </div>
          <button
            className="unit-toggle"
            onClick={toggleUnit}
            title="Toggle temperature unit"
          >
            {unit === 'celsius' ? '°C → °F' : '°F → °C'}
          </button>
        </header>

        {/* Search */}
        <div className="search-section">
          <SearchBar
            onSelect={loadWeather}
            onGeolocate={() => getLocation(loadWeather)}
            locating={locating}
          />
          {geoError && <p className="geo-error">⚠️ {geoError}</p>}
        </div>

        {/* Error */}
        {error && (
          <div className="error-card">
            <span>⚠️</span>
            <p>{error}</p>
            <button onClick={() => weather && loadWeather(weather.location)}>Retry</button>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="loading-wrap">
            <div className="spinner" />
            <p className="loading-text">Fetching weather data...</p>
          </div>
        )}

        {/* Weather content */}
        {!loading && weather && (
          <div className="weather-grid">
            <WeatherAlerts weather={weather} />
            <CurrentWeather weather={weather} unit={unit} />
            <HourlyForecast weather={weather} unit={unit} />
            <DailyForecast weather={weather} unit={unit} />
          </div>
        )}

        {/* Empty state */}
        {!loading && !weather && !error && (
          <div className="empty-state">
            <span className="empty-icon">🌍</span>
            <h2>Search for any city</h2>
            <p>Get real-time weather, hourly and 7-day forecasts for anywhere in the world.</p>
          </div>
        )}

        {/* Recent searches */}
        <SearchHistory
          history={history}
          onSelect={loadWeather}
          onClear={clearHistory}
        />

        <footer className="app-footer">
          <p>Powered by <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer">Open-Meteo</a> · Free &amp; Open Source</p>
        </footer>
      </div>
    </div>
  );
}

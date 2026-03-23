import { useState, useCallback } from 'react';
import type { WeatherData, GeoLocation, TemperatureUnit } from '../types/weather';
import { fetchWeather } from '../services/weatherApi';

const HISTORY_KEY = 'weather_search_history';
const MAX_HISTORY = 8;

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<TemperatureUnit>('celsius');
  const [history, setHistory] = useState<GeoLocation[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    } catch {
      return [];
    }
  });

  const loadWeather = useCallback(async (location: GeoLocation) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeather(location);
      setWeather(data);
      setHistory(prev => {
        const filtered = prev.filter(h => h.id !== location.id || h.name !== location.name);
        const updated = [location, ...filtered].slice(0, MAX_HISTORY);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load weather');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  }, []);

  const toggleUnit = useCallback(() => {
    setUnit(u => u === 'celsius' ? 'fahrenheit' : 'celsius');
  }, []);

  return { weather, loading, error, unit, history, loadWeather, clearHistory, toggleUnit };
}

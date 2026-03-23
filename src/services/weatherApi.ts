import type { GeoLocation, WeatherData } from '../types/weather';

const GEO_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

export async function searchLocations(query: string): Promise<GeoLocation[]> {
  if (!query.trim()) return [];
  const url = `${GEO_API}?name=${encodeURIComponent(query)}&count=6&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to search locations');
  const data = await res.json();
  return data.results ?? [];
}

export async function fetchWeather(location: GeoLocation): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current: [
      'temperature_2m',
      'apparent_temperature',
      'relative_humidity_2m',
      'wind_speed_10m',
      'wind_direction_10m',
      'surface_pressure',
      'visibility',
      'uv_index',
      'weather_code',
      'is_day',
      'precipitation',
      'cloud_cover',
    ].join(','),
    hourly: [
      'temperature_2m',
      'weather_code',
      'precipitation_probability',
      'wind_speed_10m',
      'relative_humidity_2m',
      'is_day',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'sunrise',
      'sunset',
      'precipitation_sum',
      'wind_speed_10m_max',
      'uv_index_max',
    ].join(','),
    timezone: 'auto',
    forecast_days: '7',
    hourly_forecast_hours: '24',
  });

  const res = await fetch(`${WEATHER_API}?${params}`);
  if (!res.ok) throw new Error('Failed to fetch weather data');
  const d = await res.json();

  return {
    location,
    timezone: d.timezone,
    current: {
      temperature: d.current.temperature_2m,
      feelsLike: d.current.apparent_temperature,
      humidity: d.current.relative_humidity_2m,
      windSpeed: d.current.wind_speed_10m,
      windDirection: d.current.wind_direction_10m,
      pressure: d.current.surface_pressure,
      visibility: d.current.visibility / 1000, // convert m to km
      uvIndex: d.current.uv_index,
      weatherCode: d.current.weather_code,
      isDay: d.current.is_day,
      precipitation: d.current.precipitation,
      cloudCover: d.current.cloud_cover,
    },
    hourly: {
      time: d.hourly.time,
      temperature: d.hourly.temperature_2m,
      weatherCode: d.hourly.weather_code,
      precipitation: d.hourly.precipitation_probability,
      windSpeed: d.hourly.wind_speed_10m,
      humidity: d.hourly.relative_humidity_2m,
      isDay: d.hourly.is_day,
    },
    daily: {
      time: d.daily.time,
      weatherCode: d.daily.weather_code,
      maxTemp: d.daily.temperature_2m_max,
      minTemp: d.daily.temperature_2m_min,
      sunrise: d.daily.sunrise,
      sunset: d.daily.sunset,
      precipitationSum: d.daily.precipitation_sum,
      windSpeedMax: d.daily.wind_speed_10m_max,
      uvIndexMax: d.daily.uv_index_max,
    },
  };
}

export async function reverseGeocode(lat: number, lon: number): Promise<GeoLocation | null> {
  try {
    // Open-Meteo geocoding doesn't support reverse geocoding natively,
    // so we'll use the nominatim API as a fallback
    const nominatim = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
    const res = await fetch(nominatim, { headers: { 'Accept-Language': 'en' } });
    if (!res.ok) return null;
    const data = await res.json();
    const city = data.address?.city || data.address?.town || data.address?.village || data.address?.county || 'Unknown';
    const country = data.address?.country || '';
    const country_code = (data.address?.country_code || '').toUpperCase();
    return { id: -1, name: city, latitude: lat, longitude: lon, country, country_code };
  } catch {
    return null;
  }
}

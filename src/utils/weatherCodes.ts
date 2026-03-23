export interface WeatherInfo {
  label: string;
  icon: string;
  theme: 'clear' | 'cloudy' | 'rainy' | 'snowy' | 'stormy' | 'foggy';
}

const weatherCodeMap: Record<number, WeatherInfo> = {
  0:  { label: 'Clear Sky',            icon: '☀️',  theme: 'clear' },
  1:  { label: 'Mainly Clear',         icon: '🌤️',  theme: 'clear' },
  2:  { label: 'Partly Cloudy',        icon: '⛅',  theme: 'cloudy' },
  3:  { label: 'Overcast',             icon: '☁️',  theme: 'cloudy' },
  45: { label: 'Foggy',                icon: '🌫️',  theme: 'foggy' },
  48: { label: 'Icy Fog',              icon: '🌫️',  theme: 'foggy' },
  51: { label: 'Light Drizzle',        icon: '🌦️',  theme: 'rainy' },
  53: { label: 'Drizzle',              icon: '🌦️',  theme: 'rainy' },
  55: { label: 'Heavy Drizzle',        icon: '🌧️',  theme: 'rainy' },
  61: { label: 'Light Rain',           icon: '🌧️',  theme: 'rainy' },
  63: { label: 'Rain',                 icon: '🌧️',  theme: 'rainy' },
  65: { label: 'Heavy Rain',           icon: '🌧️',  theme: 'rainy' },
  71: { label: 'Light Snow',           icon: '🌨️',  theme: 'snowy' },
  73: { label: 'Snow',                 icon: '❄️',  theme: 'snowy' },
  75: { label: 'Heavy Snow',           icon: '❄️',  theme: 'snowy' },
  77: { label: 'Snow Grains',          icon: '🌨️',  theme: 'snowy' },
  80: { label: 'Light Showers',        icon: '🌦️',  theme: 'rainy' },
  81: { label: 'Showers',              icon: '🌧️',  theme: 'rainy' },
  82: { label: 'Heavy Showers',        icon: '⛈️',  theme: 'rainy' },
  85: { label: 'Snow Showers',         icon: '🌨️',  theme: 'snowy' },
  86: { label: 'Heavy Snow Showers',   icon: '❄️',  theme: 'snowy' },
  95: { label: 'Thunderstorm',         icon: '⛈️',  theme: 'stormy' },
  96: { label: 'Thunderstorm w/ Hail', icon: '⛈️',  theme: 'stormy' },
  99: { label: 'Severe Thunderstorm',  icon: '🌩️',  theme: 'stormy' },
};

export function getWeatherInfo(code: number): WeatherInfo {
  return weatherCodeMap[code] ?? { label: 'Unknown', icon: '🌡️', theme: 'clear' };
}

export function getWindDirection(degrees: number): string {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return dirs[Math.round(degrees / 22.5) % 16];
}

export function getUVLabel(uv: number): { label: string; color: string } {
  if (uv <= 2)  return { label: 'Low',       color: '#4ade80' };
  if (uv <= 5)  return { label: 'Moderate',  color: '#facc15' };
  if (uv <= 7)  return { label: 'High',      color: '#fb923c' };
  if (uv <= 10) return { label: 'Very High', color: '#f87171' };
  return              { label: 'Extreme',   color: '#c084fc' };
}

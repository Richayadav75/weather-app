import type { WeatherData, TemperatureUnit } from '../types/weather';
import { getWeatherInfo, getWindDirection, getUVLabel } from '../utils/weatherCodes';
import { formatTemp, formatDate } from '../utils/formatters';

interface Props {
  weather: WeatherData;
  unit: TemperatureUnit;
}

export default function CurrentWeather({ weather, unit }: Props) {
  const { current, location, daily } = weather;
  const info = getWeatherInfo(current.weatherCode);
  const windDir = getWindDirection(current.windDirection);
  const uvInfo = getUVLabel(current.uvIndex);
  const today = new Date().toISOString().split('T')[0];
  const todayIdx = daily.time.findIndex(t => t === today);
  const sunrise = todayIdx >= 0 ? daily.sunrise[todayIdx] : null;
  const sunset  = todayIdx >= 0 ? daily.sunset[todayIdx]  : null;

  function formatSunTime(iso: string | null): string {
    if (!iso) return '--';
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div className="current-weather">
      <div className="cw-header">
        <div className="cw-location">
          <h2 className="cw-city">{location.name}</h2>
          <p className="cw-country">
            {getFlagEmoji(location.country_code)} {location.admin1 ? `${location.admin1}, ` : ''}{location.country}
          </p>
          <p className="cw-date">{formatDate(today)}</p>
        </div>
        <div className="cw-icon-wrap">
          <span className="cw-icon" role="img" aria-label={info.label}>{info.icon}</span>
        </div>
      </div>

      <div className="cw-temp-row">
        <span className="cw-temp">{formatTemp(current.temperature, unit)}</span>
        <div className="cw-meta">
          <span className="cw-condition">{info.label}</span>
          <span className="cw-feels">Feels like {formatTemp(current.feelsLike, unit)}</span>
        </div>
      </div>

      <div className="cw-details">
        <DetailCard icon="💧" label="Humidity"    value={`${current.humidity}%`} />
        <DetailCard icon="💨" label="Wind"        value={`${current.windSpeed} km/h ${windDir}`} />
        <DetailCard icon="🌡️" label="Pressure"   value={`${Math.round(current.pressure)} hPa`} />
        <DetailCard icon="👁️" label="Visibility"  value={`${current.visibility.toFixed(1)} km`} />
        <DetailCard icon="☁️" label="Cloud Cover" value={`${current.cloudCover}%`} />
        <DetailCard
          icon="🔆"
          label="UV Index"
          value={`${current.uvIndex.toFixed(1)} — ${uvInfo.label}`}
          valueStyle={{ color: uvInfo.color }}
        />
        <DetailCard icon="🌅" label="Sunrise"     value={formatSunTime(sunrise)} />
        <DetailCard icon="🌇" label="Sunset"      value={formatSunTime(sunset)} />
      </div>
    </div>
  );
}

function DetailCard({ icon, label, value, valueStyle }: { icon: string; label: string; value: string; valueStyle?: React.CSSProperties }) {
  return (
    <div className="detail-card">
      <span className="detail-icon">{icon}</span>
      <span className="detail-label">{label}</span>
      <span className="detail-value" style={valueStyle}>{value}</span>
    </div>
  );
}

function getFlagEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '🌍';
  const codePoints = countryCode.toUpperCase().split('').map(c => 127397 + c.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

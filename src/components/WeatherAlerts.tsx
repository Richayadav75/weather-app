import type { WeatherData } from '../types/weather';
import { getWeatherInfo } from '../utils/weatherCodes';
import { getUVLabel } from '../utils/weatherCodes';

interface Props {
  weather: WeatherData;
}

interface Alert {
  icon: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'danger';
}

export default function WeatherAlerts({ weather }: Props) {
  const alerts: Alert[] = buildAlerts(weather);
  if (alerts.length === 0) return null;

  return (
    <div className="section-card alerts-card">
      <h3 className="section-title">⚠️ Weather Alerts</h3>
      <div className="alerts-list">
        {alerts.map((a, i) => (
          <div key={i} className={`alert-item alert-${a.severity}`}>
            <span className="alert-icon">{a.icon}</span>
            <div className="alert-content">
              <strong>{a.title}</strong>
              <p>{a.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function buildAlerts(weather: WeatherData): Alert[] {
  const alerts: Alert[] = [];
  const { current } = weather;
  const info = getWeatherInfo(current.weatherCode);

  if (info.theme === 'stormy') {
    alerts.push({ icon: '⛈️', title: 'Thunderstorm Warning', message: 'Severe thunderstorm conditions. Avoid outdoor activities and stay indoors.', severity: 'danger' });
  }

  if (current.windSpeed > 60) {
    alerts.push({ icon: '🌬️', title: 'High Wind Warning', message: `Wind speeds of ${Math.round(current.windSpeed)} km/h. Secure loose objects and avoid driving high-profile vehicles.`, severity: 'danger' });
  } else if (current.windSpeed > 40) {
    alerts.push({ icon: '💨', title: 'Wind Advisory', message: `Wind speeds of ${Math.round(current.windSpeed)} km/h. Exercise caution outdoors.`, severity: 'warning' });
  }

  if (current.uvIndex >= 8) {
    const uvInfo = getUVLabel(current.uvIndex);
    alerts.push({ icon: '☀️', title: `UV Index: ${uvInfo.label}`, message: `UV index is ${current.uvIndex.toFixed(1)}. Apply SPF 30+ sunscreen, wear protective clothing and limit sun exposure.`, severity: current.uvIndex >= 11 ? 'danger' : 'warning' });
  }

  if (info.theme === 'snowy') {
    alerts.push({ icon: '❄️', title: 'Winter Weather Advisory', message: 'Snow or icy conditions expected. Drive carefully and allow extra travel time.', severity: 'warning' });
  }

  if (current.visibility < 1) {
    alerts.push({ icon: '🌫️', title: 'Low Visibility', message: `Visibility is only ${current.visibility.toFixed(1)} km. Exercise extreme caution while driving.`, severity: 'danger' });
  } else if (current.visibility < 3) {
    alerts.push({ icon: '🌫️', title: 'Reduced Visibility', message: `Visibility is ${current.visibility.toFixed(1)} km. Drive with caution.`, severity: 'warning' });
  }

  if (current.temperature >= 38) {
    alerts.push({ icon: '🌡️', title: 'Extreme Heat', message: `Temperature is ${Math.round(current.temperature)}°C. Stay hydrated, avoid prolonged sun exposure.`, severity: 'danger' });
  } else if (current.temperature <= -10) {
    alerts.push({ icon: '🥶', title: 'Extreme Cold', message: `Temperature is ${Math.round(current.temperature)}°C. Dress in layers and minimize time outdoors.`, severity: 'danger' });
  }

  if (alerts.length === 0 && (info.theme === 'rainy' || info.theme === 'stormy')) {
    alerts.push({ icon: '☂️', title: 'Rain Expected', message: 'Carry an umbrella and watch for slippery surfaces.', severity: 'info' });
  }

  return alerts;
}

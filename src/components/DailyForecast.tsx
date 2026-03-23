import type { WeatherData, TemperatureUnit } from '../types/weather';
import { getWeatherInfo } from '../utils/weatherCodes';
import { formatTemp, formatDay, isToday } from '../utils/formatters';

interface Props {
  weather: WeatherData;
  unit: TemperatureUnit;
}

export default function DailyForecast({ weather, unit }: Props) {
  const { daily } = weather;

  // Compute range for bar widths
  const allMin = Math.min(...daily.minTemp);
  const allMax = Math.max(...daily.maxTemp);
  const range = allMax - allMin || 1;

  return (
    <div className="section-card">
      <h3 className="section-title">📅 7-Day Forecast</h3>
      <div className="daily-list">
        {daily.time.map((date, i) => {
          const info = getWeatherInfo(daily.weatherCode[i]);
          const barLeft = ((daily.minTemp[i] - allMin) / range) * 100;
          const barWidth = ((daily.maxTemp[i] - daily.minTemp[i]) / range) * 100;
          const todayLabel = isToday(date);

          return (
            <div key={date} className={`daily-row ${todayLabel ? 'today' : ''}`}>
              <span className="daily-day">{todayLabel ? 'Today' : formatDay(date, true)}</span>
              <span className="daily-icon" title={info.label}>{info.icon}</span>
              <span className="daily-condition">{info.label}</span>
              {daily.precipitationSum[i] > 0 && (
                <span className="daily-precip">💧{daily.precipitationSum[i].toFixed(1)}mm</span>
              )}
              <div className="daily-temp-bar-wrap">
                <span className="daily-min">{formatTemp(daily.minTemp[i], unit)}</span>
                <div className="daily-bar-track">
                  <div
                    className="daily-bar-fill"
                    style={{ left: `${barLeft}%`, width: `${Math.max(barWidth, 8)}%` }}
                  />
                </div>
                <span className="daily-max">{formatTemp(daily.maxTemp[i], unit)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

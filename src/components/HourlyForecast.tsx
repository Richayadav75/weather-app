import { useRef } from 'react';
import type { WeatherData, TemperatureUnit } from '../types/weather';
import { getWeatherInfo } from '../utils/weatherCodes';
import { formatTemp, formatHour } from '../utils/formatters';

interface Props {
  weather: WeatherData;
  unit: TemperatureUnit;
}

export default function HourlyForecast({ weather, unit }: Props) {
  const { hourly } = weather;
  const scrollRef = useRef<HTMLDivElement>(null);

  const now = new Date();
  const currentHour = now.getHours();

  // Show next 24 hours starting from current hour
  const slots = hourly.time
    .map((t, i) => ({ time: t, i }))
    .filter(({ time }) => new Date(time) >= now)
    .slice(0, 24);

  function scroll(dir: 'left' | 'right') {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'right' ? 200 : -200, behavior: 'smooth' });
    }
  }

  return (
    <div className="section-card">
      <div className="section-header">
        <h3 className="section-title">⏱ Hourly Forecast</h3>
        <div className="scroll-btns">
          <button className="scroll-btn" onClick={() => scroll('left')} aria-label="Scroll left">‹</button>
          <button className="scroll-btn" onClick={() => scroll('right')} aria-label="Scroll right">›</button>
        </div>
      </div>
      <div className="hourly-scroll" ref={scrollRef}>
        {slots.map(({ time, i }) => {
          const info = getWeatherInfo(hourly.weatherCode[i]);
          const isNow = new Date(time).getHours() === currentHour;
          return (
            <div key={time} className={`hourly-card ${isNow ? 'now' : ''}`}>
              <span className="hourly-time">{isNow ? 'Now' : formatHour(time)}</span>
              <span className="hourly-icon" title={info.label}>{info.icon}</span>
              <span className="hourly-temp">{formatTemp(hourly.temperature[i], unit)}</span>
              {hourly.precipitation[i] > 0 && (
                <span className="hourly-precip">💧{hourly.precipitation[i]}%</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

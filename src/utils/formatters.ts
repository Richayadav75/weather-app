import type { TemperatureUnit } from '../types/weather';

export function toFahrenheit(celsius: number): number {
  return Math.round(celsius * 9 / 5 + 32);
}

export function formatTemp(celsius: number, unit: TemperatureUnit): string {
  const val = unit === 'fahrenheit' ? toFahrenheit(celsius) : Math.round(celsius);
  return `${val}°${unit === 'fahrenheit' ? 'F' : 'C'}`;
}

export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function formatHour(isoString: string): string {
  const date = new Date(isoString);
  const h = date.getHours();
  if (h === 0) return '12 AM';
  if (h === 12) return '12 PM';
  return h > 12 ? `${h - 12} PM` : `${h} AM`;
}

export function formatDay(isoString: string, short = false): string {
  const date = new Date(isoString + 'T12:00:00');
  if (short) return date.toLocaleDateString([], { weekday: 'short' });
  return date.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
}

export function formatDate(isoString: string): string {
  const date = new Date(isoString + 'T12:00:00');
  return date.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

export function isToday(isoString: string): boolean {
  const date = new Date(isoString + 'T12:00:00');
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

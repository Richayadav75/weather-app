export interface GeoLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code: string;
  admin1?: string;
}

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  weatherCode: number;
  isDay: number;
  precipitation: number;
  cloudCover: number;
}

export interface HourlyForecast {
  time: string[];
  temperature: number[];
  weatherCode: number[];
  precipitation: number[];
  windSpeed: number[];
  humidity: number[];
  isDay: number[];
}

export interface DailyForecast {
  time: string[];
  weatherCode: number[];
  maxTemp: number[];
  minTemp: number[];
  sunrise: string[];
  sunset: string[];
  precipitationSum: number[];
  windSpeedMax: number[];
  uvIndexMax: number[];
}

export interface WeatherData {
  location: GeoLocation;
  current: CurrentWeather;
  hourly: HourlyForecast;
  daily: DailyForecast;
  timezone: string;
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';

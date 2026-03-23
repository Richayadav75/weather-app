# WeatherNow 🌤

A real-time weather app built with React, TypeScript, and Vite. Get current conditions, hourly forecasts, and 7-day outlooks for any city in the world — no API key needed.

**Live demo:** https://weather-app-location-chi.vercel.app/

---

## Features

- **Current conditions** — temperature, feels-like, humidity, wind speed/direction, UV index, pressure, visibility, cloud cover, precipitation
- **Hourly forecast** — scrollable 24-hour timeline with temperature, weather icons, and rain probability
- **7-day forecast** — daily high/low, sunrise/sunset, max wind, UV index, and precipitation totals
- **Weather alerts** — displays active alerts when available for a location
- **City search** — instant search with autocomplete powered by Open-Meteo geocoding
- **Geolocation** — one-click detect current location via browser API (with Nominatim reverse geocoding)
- **Search history** — up to 8 recent searches persisted in `localStorage`
- **°C / °F toggle** — switch temperature units globally
- **Dynamic theming** — background and color palette adapt to weather condition (clear, cloudy, rainy, snowy, etc.) and time of day (day/night)

---

## Tech Stack

| | |
|---|---|
| Framework | React 19 |
| Language | TypeScript 5.9 |
| Build Tool | Vite 8 |
| Styling | Plain CSS with CSS custom properties |
| Weather API | [Open-Meteo](https://open-meteo.com/) (free, no key required) |
| Geocoding | Open-Meteo Geocoding API + Nominatim (reverse geocode) |
| Linting | ESLint + typescript-eslint |
| Deployment | Vercel |

---

## Project Structure

```
src/
├── components/
│   ├── CurrentWeather.tsx   # Main weather card
│   ├── HourlyForecast.tsx   # 24-hour scrollable strip
│   ├── DailyForecast.tsx    # 7-day forecast list
│   ├── SearchBar.tsx        # Search input with autocomplete
│   ├── SearchHistory.tsx    # Recent searches panel
│   └── WeatherAlerts.tsx    # Alert banners
├── hooks/
│   ├── useWeather.ts        # Weather data fetching + state + history
│   └── useGeolocation.ts    # Browser geolocation wrapper
├── services/
│   └── weatherApi.ts        # Open-Meteo API calls
├── types/
│   └── weather.ts           # TypeScript interfaces
└── utils/
    ├── formatters.ts        # Date, time, unit conversion helpers
    └── weatherCodes.ts      # WMO weather code → label, icon, theme
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# → http://localhost:5173

# Type-check + build for production
npm run build

# Preview production build
npm run preview
```

---

## APIs Used

| API | Purpose | Docs |
|-----|---------|------|
| Open-Meteo Forecast | Current, hourly, daily weather | [open-meteo.com/en/docs](https://open-meteo.com/en/docs) |
| Open-Meteo Geocoding | City search by name | [open-meteo.com/en/docs/geocoding-api](https://open-meteo.com/en/docs/geocoding-api) |
| Nominatim (OSM) | Reverse geocoding (coords → city name) | [nominatim.org](https://nominatim.org/) |

All APIs are free and require no authentication.

---

## Deployment

Deployed to Vercel. Any push to `main` triggers an automatic redeploy.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Richayadav75/weather-app)

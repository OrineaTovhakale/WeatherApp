# Weather App

![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5-646cff?style=flat-square&logo=vite)
![OpenWeatherMap](https://img.shields.io/badge/OpenWeatherMap-API-orange?style=flat-square)

A real-time weather application built with React and TypeScript. Displays current conditions, hourly and daily forecasts, supports multiple saved locations, offline caching, weather alerts, and condition-aware visual theming.

---

## Features

- **Real-time weather** — temperature, humidity, wind speed, pressure, visibility, feels-like
- **Hourly forecast** — next 24 hours in 3-hour intervals
- **Daily forecast** — 5-day outlook with one midday reading per day
- **Auto location detection** — requests geolocation permission on load
- **City search** — search any city worldwide using OpenWeatherMap Geocoding API
- **Multiple saved locations** — save, switch between, and delete locations (persisted in localStorage)
- **Condition-aware backgrounds** — UI theme changes based on weather (sunny, rainy, stormy, snowy, foggy, night)
- **Units toggle** — switch between Celsius and Fahrenheit; cache is invalidated automatically on switch
- **Weather alerts** — toast notification + browser push notification for severe conditions
- **Offline access** — service worker caches API responses and static assets
- **Theme toggle** — light and dark mode, persisted across sessions
- **Responsive** — works at 320px, 480px, 768px, 1024px, 1200px

---

## Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Frontend     | React 19, TypeScript                |
| Build tool   | Vite                                |
| Styling      | CSS custom properties, glassmorphism |
| Routing      | React Router v6                     |
| HTTP         | Axios                               |
| Weather data | OpenWeatherMap API (v2.5)           |
| Offline      | Service Worker (Cache API)          |
| Storage      | localStorage                        |

---

## Requirements

- Node.js v14 or higher
- An OpenWeatherMap API key (free tier works)

---

## Installation

```bash
git clone https://github.com/OrineaTovhakale/WeatherApp.git
cd WeatherApp
npm install
```

Copy the environment variable template:

```bash
cp .env.example .env
```

Open `.env` and add your OpenWeatherMap API key:

```
VITE_WEATHER_API_KEY=your_api_key_here
```

> `.env` is excluded from version control via `.gitignore`. Never commit your API key.

---

## Running the App

```bash
npm run dev
```

Opens at `http://localhost:5173`

---

## Environment Variables

| Variable               | Description                        |
|------------------------|------------------------------------|
| `VITE_WEATHER_API_KEY` | Your OpenWeatherMap API key        |

Get a free key at [openweathermap.org/api](https://openweathermap.org/api)

---

## Project Structure

```
src/
├── components/
│   ├── LoadingSpinner.tsx    Loading indicator shown during API calls
│   ├── LocationList.tsx      Saved locations list with select and delete
│   ├── SearchBar.tsx         City search input with loading state
│   ├── ThemeToggle.tsx       Light/dark mode toggle button
│   ├── Toast.tsx             User notifications (success/error/warning/info)
│   └── WeatherCard.tsx       CurrentWeatherCard and ForecastCard components
│
├── context/
│   └── AppContext.tsx        Global state: theme, units, saved locations
│
├── pages/
│   ├── Home.tsx              Main weather dashboard page
│   └── NotFound.tsx          404 page
│
├── types/
│   └── weather.ts            TypeScript interfaces for all weather data
│
├── utils/
│   ├── weatherApi.ts         API calls with caching and typed responses
│   └── weatherHelpers.ts     Condition mapping, formatting, theming helpers
│
├── App.tsx                   Route definitions
├── index.css                 Design tokens, glass utility, animations
└── main.tsx                  App entry point, service worker registration
```

---

## Design Decisions

### Condition-Aware Theming
The background gradient changes based on the current weather condition ID returned by OpenWeatherMap (e.g. deep navy for clear night, warm amber for sunny day, dark blue-green for rain, near-white for snow). This gives the app an immersive feel that instantly communicates the weather at a glance.

### Cache Invalidation on Unit Change
Weather data is cached in localStorage keyed by the full API URL, which includes the `units` parameter. Switching between Celsius and Fahrenheit automatically busts the cache because the URL changes, so stale data in the wrong units is never shown.

### Daily Forecast
The OpenWeatherMap free tier does not have a dedicated daily forecast endpoint. The `/forecast` endpoint returns 3-hour intervals over 5 days. This app fetches all 40 items and picks the reading closest to 12:00 for each calendar day, giving a true 5-day daily forecast.

### Service Worker
The service worker uses a network-first strategy for API calls (always tries to fetch fresh data, falls back to cached if offline) and a cache-first strategy for static assets (fast load from cache, updates in background).

### No `useEffect` Outside Components
The original codebase called `useEffect` at module level in `main.tsx`, which is invalid in React — hooks must only be called inside function components or custom hooks. Service worker registration is now done at module level using the standard `window.addEventListener('load', ...)` pattern.

---

## Git Workflow

- `main` — stable, production-ready code
- `develop` — integration branch, all features merge here first
- `feature/*` — individual feature branches

---

## License

MIT

## Author

Orinea Tovhakale
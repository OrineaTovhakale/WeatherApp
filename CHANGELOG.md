# Changelog

## [2.0.0] — 2025

### Added
- `src/types/weather.ts` — full TypeScript interfaces replacing all `any` types
- `src/utils/weatherHelpers.ts` — condition mapping, theming, formatting, icon helpers
- `src/components/Toast.tsx` — user notifications for errors, warnings, success, info
- `src/components/LoadingSpinner.tsx` — loading indicator during API calls
- `src/pages/NotFound.tsx` — 404 page
- `.env.example` — safe API key template for contributors
- `README.md` — full project documentation with badges, structure, design decisions
- `CHANGELOG.md` — version history
- Condition-aware background gradients (8 weather themes: clear-day, clear-night, cloudy, rainy, stormy, snowy, foggy, windy)
- Reverse geocoding — coordinates are resolved to city name on auto-detect
- Real daily forecast — picks midday reading per calendar day from 3h forecast data
- Cache invalidation on unit change — units are part of the cache key so switching °C/°F always fetches fresh data
- Severe weather alerts via toast and browser Notification API
- `useAppContext()` custom hook for safe AppContext access with meaningful error
- Service worker install/activate/fetch event handlers for real offline caching
- Network-first strategy for API calls, cache-first for static assets in service worker
- Staggered animation on forecast cards

### Changed
- `main.tsx` — removed `useEffect` called at module level (invalid React hook usage); service worker now registered via `window.addEventListener('load', ...)` at module scope
- `AppContext.tsx` — state initialised directly from `localStorage` to avoid flash of wrong theme/units; uses `useContext` hook exported as `useAppContext`; localStorage keys prefixed with `wx_` to avoid collisions
- `weatherApi.ts` — all responses properly typed; `handleApiError` helper with status-specific messages; `encodeURIComponent` on search queries; `getLocationByName` now uses Geocoding API and returns full `SavedLocation` with country
- `WeatherCard.tsx` — split into `CurrentWeatherCard` and `ForecastCard`; all `any` types replaced; shows feels-like, pressure, visibility, wind direction, high/low, precipitation probability
- `SearchBar.tsx` — accepts `isLoading` prop; button disabled while searching
- `ThemeToggle.tsx` — uses `useAppContext()` hook; accepts `textColor` prop
- `LocationList.tsx` — uses typed `SavedLocation`; shows active location indicator; empty state
- `AppContext.tsx` — `savedLocations` managed entirely in context; removed duplicate state from `Home.tsx`
- `App.tsx` — added NotFound route; removed TODO comment

### Fixed
- `useEffect` called outside React component in `main.tsx` — this silently failed
- `.gitignore` missing `.env` — API key was exposed on GitHub
- `getForecast` daily mode now returns actual one-per-day data instead of 3-hour intervals
- `getLocationByName` previously lost the city name after resolving coords; now returns full `SavedLocation`
- Units cache invalidation — stale data in wrong units no longer shown after toggle
- Error messages now shown to user via Toast instead of silently logged to console

### Removed
- All `// TODO` comments from submitted code
- `any` types throughout — replaced with proper interfaces
- Duplicate `savedLocations` state in `Home.tsx` (was out of sync with AppContext)
# Skyline — Weather App

A clean, single-page weather app that shows current conditions for any city, styled with a sky gradient that shifts with the local time of day (dawn / day / dusk / night).

## Features

- Search weather by city name
- Shows temperature, "feels like", condition, humidity, wind, UV index, and air quality (US EPA index)
- Sky background gradient changes based on the searched city's local time
- **Recent searches** — last 5 cities shown as chips, saved across visits (localStorage)
- **Smart caching** — searching the same city again within 5 minutes reuses the cached result instead of calling the API again
- Loading and error states for a smooth experience
- Responsive layout, works on mobile

## Tech stack

- HTML, CSS, vanilla JavaScript (no frameworks/build step)
- [WeatherAPI.com](https://www.weatherapi.com/) — current weather + air quality data
- Google Fonts (Fraunces, Inter, JetBrains Mono)

## Project structure

```
├── index.html          # markup
├── style.css            # styling, sky gradients, layout
├── script.js            # API calls, caching, search history, rendering
├── config.example.js    # template for your API key (safe to commit)
├── config.js             # your real key — git-ignored, not committed
└── .gitignore
```

## Live demo

[weather-app-eight-rho-24.vercel.app](https://weather-app-eight-rho-24.vercel.app/)
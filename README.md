# Carte des Incendies de Foret

Interactive map of forest fires in France, built with React 19, Leaflet, and Tailwind CSS v4.

## Data

The data pipeline attempts to fetch real fire data from the BDIFF (Base de Donnees sur les Incendies de Forets en France) dataset on data.gouv.fr. If no usable CSV with coordinates is available, it generates realistic demo data: 5000 fire events across 13 fire-prone departments (2019-2024), with seasonal distribution and log-normal surface areas.

## Commands

```bash
node scripts/fetch-data.mjs   # Fetch or generate fire data
npm run dev                    # Vite dev server (http://localhost:5173/carte-incendies/)
npm run build                  # tsc -b && vite build
npm run lint                   # ESLint
npm run preview                # Preview built dist/
```

## Architecture

Single-page app with full-screen Leaflet map. CircleMarkers are sized by surface area (log scale) and colored by severity (yellow < 1ha, orange 1-10ha, red 10-100ha, dark red > 100ha). Filters for year, minimum surface, and cause. Stats bar shows totals and most affected department.

## Deployment

GitHub Pages via `.github/workflows/deploy.yml`. Data refresh via `.github/workflows/update-data.yml` (annual cron, January 15).

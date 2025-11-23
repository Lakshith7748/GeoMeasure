# GeoMeasure India

A Field Digitization Web Application to draw polygons, measure area & perimeter, and estimate property tax.
(India-wide view)

## Quick start — run the app

1. Clone the repository - (in your terminal)

```bash
git clone <your-repo-url>
```

2. Install dependencies

```bash
npm install leaflet
npm install @turf/turf
```
3. Run the index.html file 

Relevant files:
- Main entry: [`src/index.html`](src/index.html)  
- App initializer: [`src/app.js`](src/app.js)  
- Project config: [`config.js`](config.js)  
- Package metadata: [`package.json`](package.json)

## Configure tile provider / API keys

- Tile server configuration is in [`map_config`](config.js). Update the `TILE_SERVER` value to point to your tile server (for example Mapbox or other provider). Example (replace YOUR_TOKEN):

```js
// example config for Mapbox
export const map_config = {
  TILE_SERVER: "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=YOUR_TOKEN"
};
```

- Geocoding / reverse-geocoding currently use OpenStreetMap's Nominatim in:
  - forward search: [`src/functions/searchbar.js`](src/functions/searchbar.js)  
  - reverse lookup: [`src/functions/classifylocation.js`](src/functions/classifylocation.js)

If you switch to a provider that requires an API key (e.g., Google, Mapbox Geocoding), replace the fetch URLs in those files with the provider endpoints and add your key (keep keys out of source control; use environment variables or a secure secret store for production).

## How measurements & tax are calculated

Measurements come from Turf.js calls in [`src/functions/updatepolygonInfo.js`](src/functions/updatepolygonInfo.js):

- Area: computed with Turf's `turf.area(geojson)`. This returns area in square meters (m²). Denote area as $A$ (m²).

- Perimeter: computed with Turf's `turf.length(geojson, { units: "meters" })`. This returns perimeter length in meters (m). Denote perimeter as $P$ (m).

- Location classification and rate:
  - Centroid is computed in [`src/functions/classifylocation.js`](src/functions/classifylocation.js) and reverse-geocoded with Nominatim to classify the centroid location as `urban`, `semi-urban`, or `rural`.
  - Rates per m² are defined in that file as `location_rates` (urban: 15, semi-urban: 10, rural: 5).

- Property tax formula used in the UI:
$$
\text{Tax} = A \times r
$$
where $A$ is area in m² and $r$ is the rate (currency units per m²). The app rounds the displayed results (see [`updatePolygonInfo`](src/functions/updatepolygonInfo.js)).

## Where code lives (key symbols & files)

- UI initialization and map: [`src/app.js`](src/app.js)  
- Search / forward geocoding: [`initSearchBar`](src/functions/searchbar.js) in [`src/functions/searchbar.js`](src/functions/searchbar.js)  
- Fly-to and place marker: [`flyToLocation`](src/functions/flytolocation.js) in [`src/functions/flytolocation.js`](src/functions/flytolocation.js)  
- Classify centroid & rate lookup: [`classifyLocation`](src/functions/classifylocation.js) in [`src/functions/classifylocation.js`](src/functions/classifylocation.js)  
- Update measurements & UI: [`updatePolygonInfo`](src/functions/updatepolygonInfo.js) in [`src/functions/updatepolygonInfo.js`](src/functions/updatepolygonInfo.js)  
- Tile server configuration: [`map_config`](config.js) in [`config.js`](config.js)

## Libraries & services used

- Leaflet (map rendering) — included via CDN in [`src/index.html`](src/index.html)  
- Leaflet.Draw (drawing UI) — [`src/index.html`](src/index.html)  
- Leaflet.Editable (optional editing) — [`src/index.html`](src/index.html)  
- Turf.js (geospatial calculations: area, length, centroid) — [`src/index.html`](src/index.html) and used in [`src/functions/updatepolygonInfo.js`](src/functions/updatepolygonInfo.js) and [`src/functions/classifylocation.js`](src/functions/classifylocation.js)  
- OpenStreetMap Nominatim (forward/reverse geocoding) — used in [`src/functions/searchbar.js`](src/functions/searchbar.js) and [`src/functions/classifylocation.js`](src/functions/classifylocation.js)

## Notes & best practices

- Do not hit Nominatim excessively; for production use consider a paid geocoding service or deploy your own instance and follow usage policies.
- Keep any API keys out of source control. Use environment-specific configuration (e.g., a server endpoint that injects keys) if you must use keys.
- The app expects to be served from the project root so module imports (e.g., `../config.js`) resolve correctly.

## GeoJSON 

After drawing a polygon on the map, users can download the digitized boundary as a GeoJSON file using the “Download GeoJSON” button next to the search bar.

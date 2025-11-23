
export function flyToLocation(place) {
  const lat = parseFloat(place.lat);
  const lon = parseFloat(place.lon);

  map.flyTo([lat, lon], 13, {
    duration: 2.2,
    easeLinearity: 0.2,
  });

  L.marker([lat, lon]).addTo(map);
}
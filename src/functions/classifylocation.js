const location_rates = { "urban": 15, "semi-urban": 10, "rural": 5 };

export async function classifyLocation(polygonLayer) {

  const geojson = polygonLayer.toGeoJSON()
  const centroid = turf.centroid(geojson)

  const [lon,lat]= centroid.geometry.coordinates

  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
  );
  const data = await res.json()
  const addr = data.address;

  let locationType;

  if (addr.city || addr.town || addr.municipality || addr.suburb) {
    locationType = "urban"
  }
  else if (addr.village || addr.hamlet) {
    locationType = "rural"

  }
  else{
    locationType = "semi-urban"
  }
  const rate= location_rates[locationType]
  return {locationType,rate}

}



import { classifyLocation } from "./classifylocation.js";


export function updatePolygonInfo(drawnItems) {
  const layers = drawnItems.getLayers();
  if (layers.length === 0) return

  const layer=layers[0];

  const geojson=layer.toGeoJSON()

  const area=turf.area(geojson)
  const roundedArea=Math.round(area*100)/100

  const perimeter=turf.length(geojson,{ units:"meters"})
  const roundedPerimeter=Math.round(perimeter*100)/100

  classifyLocation(layer).then(({ locationType, rate }) => {
    document.getElementById("Location-info").innerHTML =
      `<p><strong>Area: ${roundedArea}</strong> m²</p>
      <p><strong>Perimeter: ${roundedPerimeter}</strong> m</p>
      <p><strong>Location Type: ${locationType}</strong></p>
      <p><strong>Rate: ${rate} per m²</strong></p>
      <p><strong>Property Tax: ${Math.round(roundedArea * rate)}</strong></p>`;
  });
}


import { initSearchBar } from "./functions/searchbar.js";
import { updatePolygonInfo } from "./functions/updatepolygonInfo.js";
import "./functions/flytolocation.js";
import "./functions/classifylocation.js";
import { map_config } from "../config.js";
const India_centre = [22.0, 78.0]
const india_wide = 5

const map = L.map("map", {
  zoomControl: true,
  scrollWheelZoom: true,
  smoothWheelZoom: true,
  smoothWheelZoomSpeed: 1.5,
  fadeAnimation: true,
  zoomAnimation: true,
  minZoom: 5.3,
  maxZoom: 18,
}).setView(India_centre, india_wide)

window.map = map; 

L.tileLayer(map_config.TILE_SERVER, {
  maxZoom: 18,
  attribution: "© OpenStreetMap contributors"
}).addTo(map)

const drawnItems = new L.FeatureGroup()
map.addLayer(drawnItems)

const drawControl = new L.Control.Draw({
  draw: {
    polyline: false,
    circle: false,
    rectangle: false,
    marker: false,
    circlemarker: false,

    polygon: {
      allowIntersection: false,
      showArea: true,
      showLength: true,
      drawError: { color: "#e74c3c", message: "Invalid polygon" }
    }
  },
  edit: {
    featureGroup: drawnItems,
    remove: true ,
    edit: true
  }
});
map.addControl(drawControl);

map.on(L.Draw.Event.CREATED, async function (e) {
  drawnItems.clearLayers()
  drawnItems.addLayer(e.layer)

  e.layer.editing.enable()

  e.layer.on("edit", () => updatePolygonInfo(drawnItems))

  updatePolygonInfo(drawnItems)
})

map.on(L.Draw.Event.DELETED, function () {
  document.getElementById("Location-info").innerHTML = ``
})


map.on('draw:deleted', () => {
  document.getElementById("Location-info").innerHTML = ``
})

document.getElementById("download-geojson").addEventListener("click", () => {
  const layers = drawnItems.getLayers();
  if (layers.length === 0) {
    alert("No polygon drawn!");
    return;
  }

  const layer = layers[0];
  const geojson = layer.toGeoJSON();

  const blob = new Blob([JSON.stringify(geojson, null, 2)], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "property.geojson";
  a.click();
  URL.revokeObjectURL(url);
});

initSearchBar()


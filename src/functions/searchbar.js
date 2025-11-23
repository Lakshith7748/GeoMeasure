
import { flyToLocation } from "./flytolocation.js";

export function initSearchBar() {
  const input = document.getElementById("search-input")
  const suggestionsBox = document.getElementById("suggestions")

  let debounceTimer;

  input.addEventListener("input", () => {
    clearTimeout(debounceTimer)
    const query = input.value.trim()

    if (query.length < 3) {
      suggestionsBox.style.display = "none"
      return
    }

    debounceTimer = setTimeout(() => {
      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&countrycodes=in&addressdetails=1&limit=5`
      )
        .then(res => res.json())
        .then(data => showSuggestions(data, input, suggestionsBox))
        .catch(() => (suggestionsBox.style.display = "none"))
    }, 300);
  });
}

function showSuggestions(data, input, suggestionsBox) {
  suggestionsBox.innerHTML = "";

  if (!data.length) {
    suggestionsBox.style.display = "none"
    return;
  }
  suggestionsBox.style.display = "block"
  data.forEach(item => {
    const el = document.createElement("div")
    el.className = "suggestion-item"
    el.textContent = item.display_name

    el.onclick = () => {
      flyToLocation(item)
      suggestionsBox.style.display = "none"
      input.value = item.display_name;
    };

    suggestionsBox.appendChild(el)
  });
}

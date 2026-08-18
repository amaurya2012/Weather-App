// ---- Config -----------------------------------------------------
const API_KEY = "ada40e7cf0314863a4f80605261808";
const API_URL = "https://api.weatherapi.com/v1/current.json";

// ---- Elements -----------------------------------------------------
const form = document.getElementById("searchForm");
const input = document.getElementById("cityInput");
const hint = document.getElementById("hint");
const card = document.getElementById("card");
const errorCard = document.getElementById("errorCard");
const errorText = document.getElementById("errorText");
const loadingCard = document.getElementById("loadingCard");
const sky = document.getElementById("sky");

const cityName = document.getElementById("cityName");
const placeMeta = document.getElementById("placeMeta");
const conditionIcon = document.getElementById("conditionIcon");
const tempNumber = document.getElementById("tempNumber");
const conditionText = document.getElementById("conditionText");
const feelsLike = document.getElementById("feelsLike");
const statHumidity = document.getElementById("statHumidity");
const statWind = document.getElementById("statWind");
const statUv = document.getElementById("statUv");
const statAqi = document.getElementById("statAqi");

// ---- AQI label lookup (US EPA index, 1-6) --------------------------
const AQI_LABELS = {
  1: "Good",
  2: "Moderate",
  3: "Unhealthy (SG)",
  4: "Unhealthy",
  5: "Very unhealthy",
  6: "Hazardous",
};

// ---- Sky gradients by local hour -----------------------------------
function skyForHour(hour) {
  if (hour >= 5 && hour < 8)   return ["#2b3a67", "#f2a65a", "#f7c98e"]; // dawn
  if (hour >= 8 && hour < 17)  return ["#4a90c2", "#7fb3d5", "#eaf6fb"]; // day
  if (hour >= 17 && hour < 20) return ["#2b1f4a", "#d97c7c", "#f2a65a"]; // dusk
  return ["#0b0f2e", "#1b1f3b", "#2b3a67"];                              // night
}

function setSky(hour) {
  const [a, b, c] = skyForHour(hour);
  sky.style.background = `linear-gradient(160deg, ${a} 0%, ${b} 55%, ${c} 100%)`;
}

// ---- UI state helpers -----------------------------------------------
function showLoading() {
  card.hidden = true;
  errorCard.hidden = true;
  loadingCard.hidden = false;
  hint.hidden = true;
}

function showError(message) {
  loadingCard.hidden = true;
  card.hidden = true;
  errorCard.hidden = false;
  hint.hidden = true;
  errorText.textContent = message;
}

function showCard() {
  loadingCard.hidden = true;
  errorCard.hidden = true;
  card.hidden = false;
  hint.hidden = true;
}

// ---- Render weather data ---------------------------------------------
function render(data) {
  const loc = data.location;
  const cur = data.current;

  cityName.textContent = `${loc.name}, ${loc.country}`;
  placeMeta.textContent = new Date(loc.localtime.replace(" ", "T"))
    .toLocaleString(undefined, { weekday: "long", hour: "2-digit", minute: "2-digit" });

  conditionIcon.src = cur.condition.icon.startsWith("//")
    ? `https:${cur.condition.icon}`
    : cur.condition.icon;
  conditionIcon.alt = cur.condition.text;

  tempNumber.textContent = Math.round(cur.temp_c);
  conditionText.textContent = cur.condition.text;
  feelsLike.textContent = `Feels like ${Math.round(cur.feelslike_c)}°C`;

  statHumidity.textContent = `${cur.humidity}%`;
  statWind.textContent = `${cur.wind_kph} kph ${cur.wind_dir}`;
  statUv.textContent = cur.uv;

  const epaIndex = cur.air_quality ? cur.air_quality["us-epa-index"] : null;
  statAqi.textContent = epaIndex ? AQI_LABELS[epaIndex] || "—" : "—";

  const hour = new Date(loc.localtime.replace(" ", "T")).getHours();
  setSky(hour);

  showCard();
}

// ---- Fetch weather ------------------------------------------------
async function getWeather(city) {
  showLoading();
  try {
    const url = `${API_URL}?key=${API_KEY}&q=${encodeURIComponent(city)}&aqi=yes`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.error) {
      showError(data.error.message || "Couldn't find that place. Check the spelling and try again.");
      return;
    }

    render(data);
  } catch (err) {
    showError("Something went wrong reaching the sky. Check your connection and try again.");
  }
}

// ---- Events ------------------------------------------------------
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = input.value.trim();
  if (!city) return;
  getWeather(city);
});

// Set an initial dusk-toned sky before any search
setSky(new Date().getHours());
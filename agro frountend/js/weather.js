// ===== AgroTECH Smart Weather & Agricultural Advisory Engine =====

const WEATHER_CODE_MAP = {
  0: { label: "Clear Sky ☀️", icon: "☀️", hi: "साफ आसमान" },
  1: { label: "Mainly Clear 🌤️", icon: "🌤️", hi: "मुख्य रूप से साफ" },
  2: { label: "Partly Cloudy ⛅", icon: "⛅", hi: "आंशिक रूप से बादल" },
  3: { label: "Overcast ☁️", icon: "☁️", hi: "घने बादल" },
  45: { label: "Foggy 🌫️", icon: "🌫️", hi: "कोहरा" },
  48: { label: "Depositing Rime Fog 🌫️", icon: "🌫️", hi: "सघन कोहरा" },
  51: { label: "Light Drizzle 🌦️", icon: "🌦️", hi: "हल्की बूंदाबांदी" },
  53: { label: "Moderate Drizzle 🌦️", icon: "🌦️", hi: "मध्यम बूंदाबांदी" },
  55: { label: "Heavy Drizzle 🌧️", icon: "🌧️", hi: "तेज बूंदाबांदी" },
  61: { label: "Light Rain 🌧️", icon: "🌧️", hi: "हल्की बारिश" },
  63: { label: "Moderate Rain 🌧️", icon: "🌧️", hi: "मध्यम बारिश" },
  65: { label: "Heavy Rain ⛈️", icon: "⛈️", hi: "भारी बारिश" },
  71: { label: "Light Snow ❄️", icon: "❄️", hi: "हल्की बर्फबारी" },
  73: { label: "Moderate Snow ❄️", icon: "❄️", hi: "मध्यम बर्फबारी" },
  75: { label: "Heavy Snow ❄️", icon: "❄️", hi: "भारी बर्फबारी" },
  80: { label: "Rain Showers 🌦️", icon: "🌦️", hi: "वर्षा की बौछारें" },
  81: { label: "Moderate Rain Showers 🌧️", icon: "🌧️", hi: "मध्यम बौछारें" },
  82: { label: "Violent Showers ⛈️", icon: "⛈️", hi: "मूसलाधार बारिश" },
  95: { label: "Thunderstorm ⚡⛈️", icon: "⛈️", hi: "गरज के साथ तूफान" }
};

function getWeatherMeta(code) {
  return WEATHER_CODE_MAP[code] || { label: "Partly Cloudy 🌤️", icon: "🌤️", hi: "आंशिक बादल" };
}

function generateKrishiAdvisory(temp, rain, wind, humidity) {
  const isHi = typeof AgroI18n !== 'undefined' && AgroI18n.currentLang === 'hi';
  
  if (rain > 1.0) {
    return isHi 
      ? "🌧️ <b>बारिश का अलर्ट:</b> खेतों में जल निकासी (drainage) सुनिश्चित करें। कीटनाशक छिड़काव व यूरिया छिड़काव 2 दिन के लिए स्थगित रखें।"
      : "🌧️ <b>Rain Advisory:</b> Postpone pesticide spraying and urea broadcasting. Check field drainage channels to prevent waterlogging.";
  } else if (wind > 18) {
    return isHi
      ? "💨 <b>तेज हवा की चेतावनी:</b> हवा की गति अधिक है, ड्रोन व स्प्रेयर द्वारा कीटनाशक का छिड़काव न करें ताकि दवा का बिखराव न हो।"
      : "💨 <b>High Wind Warning:</b> Avoid drone spraying or chemical drift. Secure light polytunnel covers and nursery nets.";
  } else if (temp > 35) {
    return isHi
      ? "☀️ <b>गर्मी का अलर्ट:</b> वाष्पीकरण से बचने हेतु फसलों की सिंचाई केवल सुबह या शाम के समय ड्रिप अथवा स्प्रिंकलर से करें।"
      : "☀️ <b>High Temperature Alert:</b> Irrigate crops during early morning or evening hours to reduce evaporation losses.";
  } else {
    return isHi
      ? "🌾 <b>अनुकूल कृषि मौसम:</b> खेत की जुताई, बुवाई, उर्वरक प्रयोग और हार्वेस्टिंग के लिए आज मौसम अत्यंत उपयुक्त है।"
      : "🌾 <b>Optimal Agricultural Conditions:</b> Excellent weather for tractor ploughing, soil preparation, seeding, and harvesting operations.";
  }
}

async function loadWeather(customCity = null) {
  const cityInput = document.getElementById("weatherCity");
  let city = customCity || (cityInput ? cityInput.value.trim() : "") || "Indore";

  if (cityInput && customCity) {
    cityInput.value = customCity;
  }

  // Update active pill button
  document.querySelectorAll('.weather-quick-pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.city === city);
  });

  const loading = document.getElementById("weatherLoading");
  const errorBox = document.getElementById("weatherError");
  const weatherCard = document.getElementById("weatherCard");

  if (loading) loading.style.display = "block";
  if (errorBox) errorBox.style.display = "none";
  if (weatherCard) weatherCard.style.opacity = "0.6";

  try {
    let weatherData = null;

    // 1. Try FastAPI backend endpoint first
    try {
      const apiBase = (typeof getApiBase === 'function') ? getApiBase() : 'http://127.0.0.1:8000/api';
      const response = await fetch(`${apiBase}/weather?city=${encodeURIComponent(city)}`, { signal: AbortSignal.timeout(3000) });
      if (response.ok) {
        const json = await response.json();
        if (json.success) weatherData = json;
      }
    } catch (_) {}

    // 2. Fallback directly to Open-Meteo client-side if backend unavailable
    if (!weatherData) {
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
      if (!geoRes.ok) throw new Error("Could not find location");
      const geoJson = await geoRes.json();
      if (!geoJson.results || geoJson.results.length === 0) throw new Error(`City '${city}' not found.`);

      const loc = geoJson.results[0];
      const forecastRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m&timezone=auto`);
      if (!forecastRes.ok) throw new Error("Could not fetch forecast");
      const forecastJson = await forecastRes.json();
      const curr = forecastJson.current;
      const meta = getWeatherMeta(curr.weather_code);

      weatherData = {
        success: true,
        location: `${loc.name}, ${loc.country_code || loc.country || 'IN'}`,
        temperature: curr.temperature_2m,
        feels_like: curr.apparent_temperature,
        humidity: curr.relative_humidity_2m,
        wind_speed: curr.wind_speed_10m,
        precipitation: curr.precipitation,
        rain: curr.rain,
        condition: meta.label,
        weather_code: curr.weather_code
      };
    }

    // Render Data into DOM
    const meta = getWeatherMeta(weatherData.weather_code);
    const isHi = typeof AgroI18n !== 'undefined' && AgroI18n.currentLang === 'hi';

    const setElem = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.innerText = val;
    };

    setElem("weatherLocation", weatherData.location);
    setElem("weatherTemperature", Math.round(weatherData.temperature));
    setElem("weatherFeelsLike", Math.round(weatherData.feels_like));
    setElem("weatherHumidity", (weatherData.humidity || 0) + "%");
    setElem("weatherWind", (weatherData.wind_speed || 0) + " km/h");
    setElem("weatherRain", (weatherData.rain || 0) + " mm");
    setElem("weatherPrecipitation", (weatherData.precipitation || 0) + " mm");
    setElem("weatherCondition", isHi ? meta.hi : weatherData.condition);
    setElem("weatherIcon", meta.icon);

    // Render Smart Farming Advisory
    const advisoryBox = document.getElementById("weatherAdvisory");
    if (advisoryBox) {
      advisoryBox.innerHTML = generateKrishiAdvisory(
        weatherData.temperature,
        weatherData.rain || 0,
        weatherData.wind_speed || 0,
        weatherData.humidity || 0
      );
    }

    // Render Time Stamp
    const timeEl = document.getElementById("weatherUpdateTime");
    if (timeEl) {
      timeEl.innerText = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    }

    if (loading) loading.style.display = "none";
    if (weatherCard) {
      weatherCard.style.display = "block";
      weatherCard.style.opacity = "1";
    }

  } catch (error) {
    console.warn("[AgroTech Weather Error]:", error);
    if (loading) loading.style.display = "none";
    if (errorBox) {
      errorBox.innerHTML = `⚠️ Unable to load weather for "${city}". Please verify city name.`;
      errorBox.style.display = "block";
    }
    if (weatherCard) weatherCard.style.opacity = "1";
  }
}

function setWeatherCity(city) {
  loadWeather(city);
}

async function loadGPSWeather() {
  const loading = document.getElementById("weatherLoading");
  if (loading) loading.style.display = "block";

  try {
    if (typeof AgroLocation !== 'undefined') {
      const loc = await AgroLocation.detectGPS();
      if (loc && loc.name) {
        const cityName = loc.name.split(',')[0].replace('📍', '').trim();
        loadWeather(cityName);
        return;
      }
    }
    loadWeather("Indore");
  } catch (_) {
    loadWeather("Indore");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  loadWeather();
});
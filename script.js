const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');

async function checkWeather(city) {
    if (!city) return alert("Please enter a city name");

    try {
        // Step 1: City-യുടെ പേര് കൊടുത്ത് അതിന്റെ അക്ഷാംശം (Latitude, Longitude) കണ്ടുപിടിക്കുന്നു (Geocoding)
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("Place is incorrect.");
        }

        // City-യുടെ ശരിക്കുള്ള പേരും ലൊക്കേഷനും എടുക്കുന്നു
        const locationName = geoData.results[0].name;
        const countryName = geoData.results[0].country || "";
        const lat = geoData.results[0].latitude;
        const lon = geoData.results[0].longitude;

        // Step 2: കിട്ടിയ ലൊക്കേഷൻ വെച്ച് Weather Data എടുക്കുന്നു
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,rain,weather_code,wind_speed_10m&timezone=auto`;
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        // UI-യിലെ കാര്യങ്ങൾ അപ്ഡേറ്റ് ചെയ്യുന്നു
        document.getElementById('location').innerText = `${locationName}, ${countryName}`;
        document.getElementById('temperature').innerText = Math.round(weatherData.current.temperature_2m);
        document.getElementById('humidity').innerText = `${weatherData.current.relative_humidity_2m}%`;
        document.getElementById('wind').innerText = `${Math.round(weatherData.current.wind_speed_10m)} km/h`;

        // Weather code വെച്ച് അന്തരീക്ഷം എങ്ങനെയുണ്ടെന്ന് ഡിസ്ക്രിപ്ഷൻ കൊടുക്കുന്നു
        const code = weatherData.current.weather_code;
        let description = "Clear Sky";
        
        if (code >= 1 && code <= 3) description = "Partly Cloudy";
        else if (code >= 45 && code <= 48) description = "Foggy";
        else if (code >= 51 && code <= 67) description = "Raining";
        else if (code >= 71 && code <= 77) description = "Snowing";
        else if (code >= 80 && code <= 82) description = "Heavy Rain";
        else if (code >= 95) description = "Thunderstorm";

        document.getElementById('description').innerText = description;

        // Weather അനുസരിച്ച് ബാക്ക്ഗ്രൗണ്ട് മാറ്റുന്നു
        if (code >= 51) { // Mazha ഉള്ളപ്പോൾ
            document.body.style.background = "linear-gradient(135deg, #3a6073, #3a7bd5)";
        } else if (code === 0 || code === 1) { // Nalla Veyil/Clear sky ഉള്ളപ്പോൾ
            document.body.style.background = "linear-gradient(135deg, #f7b733, #fc4a1a)";
        } else { // Meghാവൃതം ആകുമ്പോൾ
            document.body.style.background = "linear-gradient(135deg, #bdc3c7, #2c3e50)";
        }

    } catch (error) {
        alert(error.message);
    }
}

// Search Button click ചെയ്യുമ്പോൾ
searchBtn.addEventListener('click', () => {
    checkWeather(cityInput.value.trim());
});

// Keyboard-ലെ Enter പ്രസ് ചെയ്യുമ്പോൾ
cityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        checkWeather(cityInput.value.trim());
    }
});
const apiKey = "aa3fe608031bee46c5ed14d61b17cb35";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search-btn");

async function checkWeather(city) {
    
    if (!city.trim()) {
        alert("Please enter a city name!");
        return;
    }

    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    
    if (response.status == 404) {
        alert("Invalid City Name!");
    } else if (response.status == 401) {
        alert("API Key is not active yet. Please wait for 1-2 hours.");
    } else {
        var data = await response.json();
        console.log(data); 

       
        if (data && data.main && data.weather) {
            document.querySelector("#location").innerHTML = data.name || "N/A";
            document.querySelector("#temperature").innerHTML = data.main.temp ? Math.round(data.main.temp) : "--";
            document.querySelector("#humidity").innerHTML = data.main.humidity ? data.main.humidity + "%" : "--%";
            document.querySelector("#wind").innerHTML = data.wind && data.wind.speed ? data.wind.speed + " km/h" : "-- km/h";
            document.querySelector("#description").innerHTML = data.weather[0] && data.weather[0].description ? data.weather[0].description : "";
        } else {
            alert("Error fetching weather data!");
        }
    }
}

searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});


searchBox.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        checkWeather(searchBox.value);
    }
});

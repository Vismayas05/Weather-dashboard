const apiKey = "aa3fe608031bee46c5ed14d61b17cb35";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search-btn");

async function checkWeather(city) {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    
    if(response.status == 404) {
        alert("Invalid City Name!");
    } else {
        var data = await response.json();

        document.querySelector("#location").innerHTML = data.name;
        document.querySelector("#temperature").innerHTML = Math.round(data.main.temp);
        document.querySelector("#humidity").innerHTML = data.main.humidity + "%";
        document.querySelector("#wind").innerHTML = data.wind.speed + " km/h";
        document.querySelector("#description").innerHTML = data.weather[0].description;
    }
}

searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});

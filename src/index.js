function showPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;

  console.log(position.coords.latitude);
  console.log(position.coords.longitude);
  let apiKey = "eb9542c65e739e0fb25ade97c749e2aa";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const axios = require("axios/dist/browser/axios.cjs");
  axios
    .get(apiUrl)
    .then(showTemperature)
    .catch((error) => {
      console.error("Axios Error:", error);
    });
}

function showTemperature(response) {
  let data = response.data;
  let cityDisplay = document.getElementById("cityDisplay");
  cityDisplay.innerHTML = `${data.name}<br>${data.dt}<br>${data.weather[0].description}`;
  let temperature = Math.round(data.main.temp);
  let currentTemperature = document.querySelector(".sun-cloud");
  currentTemperature.innerHTML = `${temperature} °C`;
  let details = document.querySelector("h4");
  details.innerHTML = `Precipitation: ${data.clouds.all}%<br>Humidity: ${data.main.humidity}%<br>Wind: ${data.wind.speed} km/h`;
}
function fetchWeatherByCity(city) {
  let apiKey = "eb9542c65e739e0fb25ade97c749e2aa"; // Replace with your OpenWeatherMap API key
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  let axios = require("axios/dist/browser/axios.cjs");
  axios
    .get(apiUrl)
    .then(showTemperature)
    .catch((error) => {
      console.error("Axios Error:", error);
    });
}
navigator.geolocation.getCurrentPosition(showPosition);

document.getElementById("searchButton").addEventListener("click", function () {
  let cityInput = document.getElementById("cityInput");
  let city = cityInput.value.trim();
  if (city !== "") {
    fetchWeatherByCity(city);
  }
});

document.getElementById("currentButton").addEventListener("click", function () {
  showPosition();
});

let searchButton = document.getElementById("searchButton");
let currentButton = document.getElementById("currentButton");

searchButton.addEventListener("click", function () {
  let cityInput = document.getElementById("cityInput");
  let cityName = cityInput.value.trim();
  if (cityName !== "") {
    fetchWeatherByCity(cityName);
  }
});

currentButton.addEventListener("click", function () {
  navigator.geolocation.getCurrentPosition(showPosition);
});

//

let currentDate = new Date();
let dayOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
][currentDate.getDay()];
let hours = currentDate.getHours();
let minutes = currentDate.getMinutes();
let formattedTime = `${hours < 10 ? "0" : ""}${hours}:${
  minutes < 10 ? "0" : ""
}${minutes}`;
let datetimeBr = document.getElementById("datetime");
datetimeBr.textContent = `${dayOfWeek}, ${formattedTime}`;

let apiKey = "eb9542c65e739e0fb25ade97c749e2aa";
const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");
const currentButton = document.getElementById("currentButton");
const cityDisplay = document.getElementById("cityDisplay");
const descriptionElement = document.getElementById("description");
const temperatureElement = document.getElementById("temperature");
const humidityElement = document.getElementById("humidity");
const speedElement = document.getElementById("speed");
const datetimeTextElement = document.getElementById("datetimeText");

function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  let day = days[date.getDay()];
  return `${day}, ${hours}:${minutes}`;
}

function displayWeatherData(data) {
  cityDisplay.textContent = data.name;
  descriptionElement.textContent = data.weather[0].description;
  temperatureElement.textContent = Math.round(data.main.temp);
  humidityElement.textContent = data.main.humidity;
  speedElement.textContent = Math.round(data.wind.speed);
  datetimeTextElement.textContent = formatDate(data.dt * 1000);

  const dayOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ][new Date(data.dt * 1000).getDay()];
}
searchButton.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city !== "") {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    axios
      .get(apiUrl)
      .then((response) => {
        const dayOfWeek = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ][new Date(response.data.dt * 1000).getDay()];

        const currentDate = new Date();
        const hours = currentDate.getHours();
        const minutes = currentDate.getMinutes();
        const formattedTime = `${hours < 10 ? "0" : ""}${hours}:${
          minutes < 10 ? "0" : ""
        }${minutes}`;

        displayWeatherData(response.data, false);
        datetimeTextElement.textContent = `${dayOfWeek}, ${formattedTime}`;
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
      });
  }
});

function displayWeatherData(data, isCurrent) {
  cityDisplay.textContent = data.name;
  descriptionElement.textContent = data.weather[0].description;
  temperatureElement.textContent = Math.round(data.main.temp);
  humidityElement.textContent = data.main.humidity;
  speedElement.textContent = Math.round(data.wind.speed);

  if (!isCurrent) {
    datetimeTextElement.textContent = formatDate(data.dt * 1000);
  }
}

currentButton.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition((position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    axios
      .get(apiUrl)
      .then((response) => {
        const dayOfWeek = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ][new Date(response.data.dt * 1000).getDay()];

        const currentDate = new Date();
        const hours = currentDate.getHours();
        const minutes = currentDate.getMinutes();
        const formattedTime = `${hours < 10 ? "0" : ""}${hours}:${
          minutes < 10 ? "0" : ""
        }${minutes}`;

        displayWeatherData(response.data, true);
        datetimeTextElement.textContent = `${dayOfWeek}, ${formattedTime}`;
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
      });
  });
});

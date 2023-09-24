let currentUnit = "Celsius";

// Function to format the date and time
function formatDate(timestamp, timezoneOffset) {
  let date = new Date(timestamp * 1000 + timezoneOffset * 1000);
  let hours = date.getUTCHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getUTCMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  let day = days[date.getUTCDay()];
  return `${day}, ${hours}:${minutes}`;
}
// Function to fetch weather data by city name
function searchCity(city) {
  let apiKey = "eb9542c65e739e0fb25ade97c749e2aa";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  axios
    .get(apiUrl)
    .then(showTemperature)
    .catch((error) => {
      console.error("Error fetching weather data:", error);
    });
}

// Function to display weather data
function showTemperature(response) {
  console.log(response);
  let f = document.querySelector("#deg-far");
  let c = document.querySelector("#deg-cel");
  let cel = Math.round(response.data.main.temp);
  let timezoneOffset = response.data.timezone;
  let description = response.data.weather[0].description;
  let capitalizedDescription =
    description.charAt(0).toUpperCase() + description.slice(1);
  let h2Element = document.querySelector("h2");
  let temperatureElement = document.querySelector("#temperature");

  if (h2Element) {
    h2Element.innerHTML = response.data.name;
    document
      .querySelector("#icon")
      .setAttribute(
        "src",
        `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
      );
    document.querySelector("#cityName").innerHTML = response.data.name;
    document.querySelector("#descriptionText").innerHTML =
      capitalizedDescription;
    document
      .querySelector("#icon")
      .setAttribute("alt", response.data.weather[0].description);
    document.querySelector("#humidity").innerHTML = Math.round(
      response.data.main.humidity
    );
    document.querySelector("#speed").innerHTML = Math.round(
      response.data.wind.speed * 3.6
    );
    let far = Math.round((cel * 9) / 5 + 32);
    if (currentUnit === "Celsius") {
      temperatureElement.innerHTML = `${cel}°C`;
    } else {
      temperatureElement.innerHTML = `${far}°F`;
    }
    f.addEventListener("click", function () {
      c.classList.remove("active");
      f.classList.add("active");

      let far = Math.round((cel * 9) / 5 + 32);
      document.querySelector("#temperature").innerHTML = `${far}°F`;
      currentUnit = "Fahrenheit";
    });
    c.addEventListener("click", function () {
      f.classList.remove("active");
      c.classList.add("active");

      document.querySelector("#temperature").innerHTML = `${cel}°C`;
      currentUnit = "Celsius";
    });

    // Update the date and time
    function updateDateTime() {
      const dateTimeText = document.querySelector("#datetimeText");
      const currentTimestamp = Date.now() / 1000;
      dateTimeText.innerHTML = formatDate(currentTimestamp, timezoneOffset);
    }
    updateDateTime();
    setInterval(updateDateTime, 60000);
  }
}
// Function to fetch weather data by geolocation
function searchPos(position) {
  let apiKey = "eb9542c65e739e0fb25ade97c749e2aa";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;

  axios
    .get(apiUrl)
    .then(showTemperature)
    .catch((error) => {
      console.error("Error fetching weather data:", error);
    });
}
document.addEventListener("DOMContentLoaded", function () {
  let form = document.querySelector(".input-city");
  let cityInput = document.querySelector("#cityInput");
  let h2 = document.querySelector("h2");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    let city = cityInput.value;
    if (city) {
      h2.innerHTML = city;
      searchCity(city);
    }
  });

  let currentButton = document.querySelector("#currentButton");
  currentButton.addEventListener("click", function (event) {
    event.preventDefault();
    navigator.geolocation.getCurrentPosition(searchPos);
  });

  let searchButton = document.querySelector("#searchButton");
  searchButton.addEventListener("click", function (event) {
    event.preventDefault();
    let city = cityInput.value;
    if (city) {
      h2.innerHTML = city;
      searchCity(city);
    }
  });
});

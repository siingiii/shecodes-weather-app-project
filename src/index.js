let currentUnit = "Celsius";
//let timezoneOffset = 0;//
//let timezoneOffset = response.data.timezone;//
// Function to format the date and time
function formatDate(timestamp, timezoneOffset) {
  let localTimestamp = timestamp + timezoneOffset;
  let date = new Date(timestamp * 1000 + timezoneOffset * 1000);
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  let day = days[date.getUTCDay()];
  let hours = date.getUTCHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getUTCMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${day}, ${hours}:${minutes}`;
}
// Function to fetch weather data by city name

// Function to display weather data
function showTemperature(response) {
  console.log(response);
  let f = document.querySelector("#deg-far");
  let c = document.querySelector("#deg-cel");
  let cel = Math.round(response.data.main.temp);
  timezoneOffset = response.data.timezone;
  let description = response.data.weather[0].description;
  let capitalizedDescription =
    description.charAt(0).toUpperCase() + description.slice(1);
  let h2Element = document.querySelector("h2");
  let temperatureElement = document.querySelector("#temperature");

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  if (typeof timezoneOffset === "undefined") {
    timezoneOffset = 0;
  }
  const currentUTCDay = new Date().getUTCDay();
  const day = days[currentUTCDay];
  const datetimeTextElement = document.querySelector("#datetimeText");
  datetimeTextElement.innerHTML = day;
  const timestamp = response.data.dt; // API provides the timestamp in local time

  const localTimestamp = timestamp + timezoneOffset;
  const date = new Date(localTimestamp * 1000);
  //const day = days[date.getUTCDay()];//

  // Update the day element in your HTML
  //const datetimeTextElement = document.querySelector("#datetimeText");
  datetimeTextElement.innerHTML = day;

  console.log("Timestamp:", timestamp);
  console.log("Timezone Offset:", timezoneOffset);

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

      updateDateTime(timezoneOffset);
      setInterval(() => updateDateTime(timezoneOffset), 60000);
    });
  }
}

function forecastTemp(response) {
  console.log(response.data.daily);
  let forecast = response.data.daily;
  let forecastElt = document.querySelector("#forcast");
  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    console.log(forecastDay);
    if (index > 0 && index < 6) {
      if (forecastDay.dt && response.data.timezone_offset) {
        let day = formatDate(forecastDay.dt);
        let iconCode = forecastDay.weather[0].icon;
        let description = forecastDay.weather[0].description;
        let maxTemp = Math.round(forecastDay.temp.max);
        let minTemp = Math.round(forecastDay.temp.min);
        let localTimestamp =
          forecastDay.dt + response.data.timezone_offset * 1000;
        forecastHTML += `
      <div class= "col-2">
      <div class= "tempweekly-date">${formatDate(forecastDay.dt)}</div>
          <img src="http://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png" alt="${forecastDay.weather[0].description}" width="45" />
      <div class="tempweekly-temp">
       <span class="tempweekly-temp-max">${Math.round(
         forecastDay.temp.max
       )}°</span>
        <span class="tempweekly-temp-min">${Math.round(
          forecastDay.temp.min
        )}°</span>
      </div>
    </div>`;
      } else {
        // Handle the case where timestamp or timezoneOffset is not available
        console.error(
          "Invalid timestamp or timezoneOffset for forecast day:",
          forecastDay
        );
      }
    }
  });

  forecastHTML += `</div>`;
  forecastElt.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "eb9542c65e739e0fb25ade97c749e2aa";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=current,minutely,hourly&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(forecastTemp);
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

  function searchCity(city) {
    let apiKey = "eb9542c65e739e0fb25ade97c749e2aa";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    axios
      .get(apiUrl)
      .then(function (response) {
        if (response.data && response.data.timezone) {
          let timezoneOffset = response.data.timezone;
          let coordinates = {
            lat: response.data.coord.lat,
            lon: response.data.coord.lon,
          };
          showTemperature(response);
          getForecast(coordinates);

          updateDateTime(timezoneOffset);
          setInterval(() => updateDateTime(timezoneOffset), 60000);
        } else {
          console.error("Invalid timezone data:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
      });
  } // Update the date and time
  function updateDateTime(timezoneOffset) {
    const dateTimeText = document.querySelector("#datetimeText");
    const currentTimestamp = Math.floor(Date.now() / 1000);

    const localTimestamp = currentTimestamp + timezoneOffset;

    const date = new Date(localTimestamp * 1000);
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const day = days[date.getUTCDay()];
    let hours = date.getUTCHours();
    if (hours < 10) {
      hours = `0${hours}`;
    }
    let minutes = date.getUTCMinutes();
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }

    dateTimeText.innerHTML = `${day}, ${hours}:${minutes}`;
  }

  updateDateTime(timezoneOffset);
  setInterval(() => updateDateTime(timezoneOffset), 60000);
});

// Mapping of state names to abbreviations for US states
const stateAbbreviations = {
  Alabama: "AL",
  Alaska: "AK",
  Arizona: "AZ",
  Arkansas: "AR",
  California: "CA",
  Colorado: "CO",
  Connecticut: "CT",
  Delaware: "DE",
  Florida: "FL",
  Georgia: "GA",
  Hawaii: "HI",
  Idaho: "ID",
  Illinois: "IL",
  Indiana: "IN",
  Iowa: "IA",
  Kansas: "KS",
  Kentucky: "KY",
  Louisiana: "LA",
  Maine: "ME",
  Maryland: "MD",
  Massachusetts: "MA",
  Michigan: "MI",
  Minnesota: "MN",
  Mississippi: "MS",
  Missouri: "MO",
  Montana: "MT",
  Nebraska: "NE",
  Nevada: "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  Ohio: "OH",
  Oklahoma: "OK",
  Oregon: "OR",
  Pennsylvania: "PA",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  Tennessee: "TN",
  Texas: "TX",
  Utah: "UT",
  Vermont: "VT",
  Virginia: "VA",
  Washington: "WA",
  "West Virginia": "WV",
  Wisconsin: "WI",
  Wyoming: "WY",
};

async function getWeather() {
  const apiKey = "0564f2df0ce992ef9a9305c79039e747"; // Your OpenWeatherMap API key
  const location = document.getElementById("city").value.trim();

  if (!location) {
    document.getElementById(
      "weather-info"
    ).innerHTML = `<p>Please enter a valid location.</p>`;
    return;
  }

  // Parse the location input to determine if it includes a city and state
  const locationParts = location.split(",");
  let city, stateAbbr, geocodeUrl;

  if (locationParts.length === 2) {
    // If input includes a comma, assume it's a US city/state combination
    city = locationParts[0].trim();
    stateAbbr = locationParts[1].trim().toUpperCase();

    if (Object.values(stateAbbreviations).includes(stateAbbr)) {
      // US location with valid state abbreviation
      geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city},${stateAbbr},US&limit=1&appid=${apiKey}`;
    } else {
      document.getElementById(
        "weather-info"
      ).innerHTML = `<p>Invalid US state abbreviation. Please check the input.</p>`;
      return;
    }
  } else {
    // Otherwise, treat it as a global city search
    city = location;
    geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
  }

  try {
    const geocodeResponse = await fetch(geocodeUrl);
    const geocodeData = await geocodeResponse.json();

    if (geocodeData.length === 0) {
      document.getElementById(
        "weather-info"
      ).innerHTML = `<p>Location not found. Please check the spelling or try another location.</p>`;
      return;
    }

    const { name, state, country, lat, lon } = geocodeData[0];

    // For US locations, verify state abbreviation and build location string
    let locationString = `${name}, ${country}`;
    if (country === "US" && state) {
      const stateAbbr = stateAbbreviations[state];
      if (stateAbbr) {
        locationString = `${name}, ${stateAbbr} - ${country}`;
      }
    }

    // Use the latitude and longitude to get the weather data
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    if (weatherData.cod === 200) {
      // Capitalize the first letter of each word in the description
      const description = weatherData.weather[0].description
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      // Wind speed is already in mph when using imperial units
      const windSpeed = weatherData.wind.speed.toFixed(2);

      const weatherInfo = `
        <h2>Weather in ${locationString}</h2>
        <p>Temperature: ${weatherData.main.temp}°F</p>
        <p>Description: ${description}</p>
        <p>Humidity: ${weatherData.main.humidity}%</p>
        <p>Wind Speed: ${windSpeed} mph</p>
      `;
      document.getElementById("weather-info").innerHTML = weatherInfo;

      // Set background image based on weather description
      setWeatherBackground(description.toLowerCase());
    } else {
      document.getElementById(
        "weather-info"
      ).innerHTML = `<p>${weatherData.message}</p>`;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    document.getElementById(
      "weather-info"
    ).innerHTML = `<p>Failed to fetch weather data</p>`;
  }
}

function setWeatherBackground(description) {
  let backgroundUrl;

  switch (description) {
    case "clear sky":
      backgroundUrl = "url(images/clear_sky.jpg)";
      break;
    case "few clouds":
    case "scattered clouds":
      backgroundUrl = "url(images/few_clouds.jpg)";
      break;
    case "broken clouds":
      backgroundUrl = "url(images/broken_clouds.jpg)";
      break;
    case "overcast clouds":
      backgroundUrl = "url(images/overcast_clouds.jpg)";
      break;
    case "shower rain":
    case "rain":
    case "moderate rain":
      backgroundUrl = "url(images/rain.jpg)";
      break;
    case "light rain":
      backgroundUrl = "url(images/light_rain.jpg)";
      break;
    case "heavy rain":
      backgroundUrl = "url(images/heavy_rain.jpg)";
      break;
    case "thunderstorm":
      backgroundUrl = "url(images/thunderstorm.jpg)";
      break;
    case "snow":
      backgroundUrl = "url(images/snow.jpg)";
      break;
    case "blizzard":
      backgroundUrl = "url(images/blizzard.jpg)";
      break;
    case "mist":
      backgroundUrl = "url(images/mist.jpg)";
      break;
    default:
      backgroundUrl = "url(images/default.jpg)";
      break;
  }

  document.body.style.backgroundImage = backgroundUrl;
}

document.getElementById("city").addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    getWeather();
  }
});

document
  .getElementById("get-weather-btn")
  .addEventListener("click", getWeather);

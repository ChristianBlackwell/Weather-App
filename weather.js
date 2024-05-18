// Mapping of state names to abbreviations
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
  const cityState = document.getElementById("city").value.trim();
  const [city, stateAbbr] = cityState.split(",").map((str) => str.trim());

  if (!city || !stateAbbr || stateAbbr.length !== 2) {
    document.getElementById(
      "weather-info"
    ).innerHTML = `<p>Please enter a valid city and state abbreviation (e.g., Houston, TX).</p>`;
    return;
  }

  // Use the OpenWeatherMap Geocoding API to get city data
  const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city},${stateAbbr},US&limit=1&appid=${apiKey}`;

  try {
    const geocodeResponse = await fetch(geocodeUrl);
    const geocodeData = await geocodeResponse.json();

    if (geocodeData.length === 0) {
      document.getElementById(
        "weather-info"
      ).innerHTML = `<p>City not found. Please check the spelling or try another city.</p>`;
      return;
    }

    const { name, state, country, lat, lon } = geocodeData[0];

    if (stateAbbreviations[state] !== stateAbbr.toUpperCase()) {
      document.getElementById(
        "weather-info"
      ).innerHTML = `<p>City not found in the specified state. Please check the spelling or try another city.</p>`;
      return;
    }

    // Use the latitude and longitude to get the weather data
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    if (weatherData.cod === 200) {
      // Capitalize first letter of each word in the description
      const description = weatherData.weather[0].description
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      // Wind speed is already in mph when using imperial units
      const windSpeed = weatherData.wind.speed.toFixed(2);

      const weatherInfo = `
              <h2>Weather in ${name}, ${stateAbbr.toUpperCase()} - ${country}</h2>
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

  // Preload the background image for smoother transitions
  const img = new Image();
  img.src = backgroundUrl.slice(4, -1).replace(/"/g, ""); // Remove url() around the image path
  img.onload = () => {
    document.body.style.backgroundImage = backgroundUrl;
  };
}

// Add event listener to trigger getWeather on Enter key press
document.getElementById("city").addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    getWeather();
  }
});

const axios = require("axios");
const {
  updateDailySummary,
  getWeatherSummary,
  getHistoricalDataByCity,
} = require("../services/weatherService");
require("dotenv").config();

const alertThresholds = { temperature: 35 };
const cities = ["Hyderabad", "Bangalore", "Chennai", "Mumbai", "Delhi"];
const apiKey = process.env.OPENWEATHER_API_KEY;

let consecutiveBreaches = {};

/**
 * Fetches the current weather data for a city.
 */
const getCurrentWeatherHandler = async (req, res) => {
  try {
    const { city } = req.params;
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    const { main, weather, wind, visibility, name } = response.data;

    const currentWeather = {
      city: name,
      temperature: main.temp,
      humidity: main.humidity,
      wind_speed: wind.speed,
      visibility,
      weather: weather[0].description,
      min_temp: main.temp_min,
      max_temp: main.temp_max,
    };

    res.status(200).json(currentWeather);
  } catch (error) {
    console.error(
      `Error fetching current weather for ${city}: ${error.message}`
    );
    res.status(500).json({ error: "Failed to fetch current weather data." });
  }
};

/**
 * Checks if an alert needs to be triggered based on temperature thresholds.
 */
const checkForAlerts = async (city) => {
  const summary = await getWeatherSummary(city);
  if (summary && summary.max_temp > alertThresholds.temperature) {
    consecutiveBreaches[city] = (consecutiveBreaches[city] || 0) + 1;
    if (consecutiveBreaches[city] >= 2) {
      console.log(
        `ALERT: High temperature in ${city} for two consecutive updates!`
      );
      return true;
    }
  } else {
    consecutiveBreaches[city] = 0;
  }
  return false;
};

const triggerAlert = async (req, res) => {
  try {
    const { city } = req.params;
    const alert = await checkForAlerts(city);
    res.status(200).json({ alertTriggered: alert });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Fetches and updates weather data for a specific city.
 */
const fetchWeatherForCity = async (city) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    const { main, weather, wind, visibility } = response.data;
    await updateDailySummary(
      city,
      main.temp,
      main.humidity,
      wind.speed,
      visibility,
      weather[0].main
    );
    console.log(
      `Weather updated for ${city}: ${main.temp}°C ${weather[0].main} ${main.humidity}% ${wind.speed}m/s ${visibility}m`
    );
  } catch (error) {
    console.error(`Failed to fetch weather for ${city}: ${error.message}`);
  }
};

const getSummaryByCity = async (req, res) => {
  try {
    const summary = await getWeatherSummary(req.params.city);
    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getHistoricalDataHandler = async (req, res) => {
  try {
    const { city } = req.params;
    const { startDate } = req.query;

    const data = await getHistoricalDataByCity(city, startDate);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const startWeatherPolling = () => {
  const intervalMs = process.env.WEATHER_INTERVAL_MS || 300000;
  console.log(`Starting weather polling every ${intervalMs}ms...`);

  setInterval(() => {
    cities.forEach((city) => fetchWeatherForCity(city));
  }, intervalMs);
};

module.exports = {
  getSummaryByCity,
  triggerAlert,
  getHistoricalDataHandler,
  getCurrentWeatherHandler,
  startWeatherPolling,
};

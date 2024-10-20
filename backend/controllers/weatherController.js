const axios = require("axios");
const {
  saveWeatherSummary,
  getWeatherSummary,
  getDailySummary,
} = require("../services/weatherService");
require("dotenv").config();
const alertThresholds = {
  temperature: 35,
};
const checkForAlerts = async (city) => {
  const summary = await getDailySummary(city);
  if (summary && summary.max_temp > alertThresholds.temperature) {
    console.log(`ALERT: High temperature in ${city}!`);
    return true;
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

const fetchWeatherData = async (req, res) => {
  try {
    const city = req.params.city;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    const { main, weather } = response.data;
    const summary = {
      city,
      temp: main.temp,
      max_temp: main.temp_max,
      min_temp: main.temp_min,
      dominant_weather: weather[0].main,
    };

    await saveWeatherSummary(summary);
    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSummaryByCity = async (req, res) => {
  try {
    const summaries = await getWeatherSummary(req.params.city);
    res.status(200).json(summaries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { fetchWeatherData, getSummaryByCity, triggerAlert };

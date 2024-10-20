const express = require("express");
const {
  getSummaryByCity,
  triggerAlert,
  getHistoricalDataHandler,
  getCurrentWeatherHandler, // New handler for current weather
} = require("../controllers/weatherController");

const router = express.Router();

// Route to get the daily weather summary for a specific city
router.get("/summary/:city", getSummaryByCity);

// Route to trigger an alert based on temperature thresholds for a city
router.get("/alert/:city", triggerAlert);

// Route to fetch historical weather data for a city with an optional start date
router.get("/history/:city", getHistoricalDataHandler);

// Route to get the current weather for a city
router.get("/current/:city", getCurrentWeatherHandler);

module.exports = router;

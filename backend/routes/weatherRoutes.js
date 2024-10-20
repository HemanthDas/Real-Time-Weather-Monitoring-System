const express = require("express");
const {
  fetchWeatherData,
  getSummaryByCity,
  triggerAlert,
} = require("../controllers/weatherController");
const router = express.Router();

router.get("/weather/:city", fetchWeatherData);
router.get("/summary/:city", getSummaryByCity);
router.get("/alert/:city", triggerAlert);

module.exports = router;

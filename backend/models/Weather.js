const mongoose = require("mongoose");

const weatherSchema = new mongoose.Schema({
  city: String,
  temp: Number,
  max_temp: Number,
  min_temp: Number,
  dominant_weather: String,
  summary_date: { type: Date, default: Date.now },
  alertTriggered: { type: Boolean, default: false },
});

const Weather = mongoose.model("Weather", weatherSchema);
module.exports = Weather;

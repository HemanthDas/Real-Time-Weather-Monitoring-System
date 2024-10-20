const mongoose = require("mongoose");

const WeatherSummarySchema = new mongoose.Schema({
  city: { type: String, required: true },
  summary_date: { type: Date, required: true },
  count: { type: Number, default: 0 },
  avg_temp: { type: Number, default: 0 },
  min_temp: { type: Number, default: 0 }, // Default value added
  max_temp: { type: Number, default: 0 }, // Default value added
  total_temp: { type: Number, default: 0 }, // Total temperature
  total_humidity: { type: Number, default: 0 }, // Total humidity
  total_wind_speed: { type: Number, default: 0 }, // Total wind speed
  total_visibility: { type: Number, default: 0 }, // Total visibility
  avg_humidity: { type: Number, default: 0 }, // Average humidity
  avg_wind_speed: { type: Number, default: 0 }, // Average wind speed
  avg_visibility: { type: Number, default: 0 }, // Average visibility
  humidity: {
    type: Number,
    default: 0,
    validate: {
      validator: (value) => value >= 0, // Only allow non-negative values
      message: "Humidity must be a non-negative number.",
    },
  },
  wind_speed: {
    type: Number,
    default: 0,
    validate: {
      validator: (value) => value >= 0, // Only allow non-negative values
      message: "Wind speed must be a non-negative number.",
    },
  },
  visibility: {
    type: Number,
    default: 0,
    validate: {
      validator: (value) => value >= 0, // Only allow non-negative values
      message: "Visibility must be a non-negative number.",
    },
  },
  dominant_weather: { type: String },
  weather_conditions: [{ type: String }],
  alertTriggered: { type: Boolean, default: false },
});

module.exports = mongoose.model("WeatherSummary", WeatherSummarySchema);

const Weather = require("../models/Weather");

const saveWeatherSummary = async (summary) => {
  const newSummary = new Weather(summary);
  return await newSummary.save();
};

const getWeatherSummary = async (city) => {
  return await Weather.find({ city }).sort({ summary_date: -1 });
};
const getDailySummary = async (city) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of the day

  const summary = await Weather.aggregate([
    { $match: { city, summary_date: { $gte: today } } },
    {
      $group: {
        _id: "$city",
        avg_temp: { $avg: "$temp" },
        max_temp: { $max: "$max_temp" },
        min_temp: { $min: "$min_temp" },
        dominant_weather: { $first: "$dominant_weather" },
      },
    },
  ]);

  return summary[0];
};

module.exports = { saveWeatherSummary, getWeatherSummary, getDailySummary };

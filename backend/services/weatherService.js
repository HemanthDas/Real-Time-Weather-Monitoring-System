const WeatherSummary = require("../models/WeatherSummary");
const alertThresholds = { temperature: 35 };

/**
 * Fetches the historical weather data for a city within a specified date range.
 * @param {string} city - The city for which to retrieve historical data.
 * @param {Date} startDate - The start date for the data retrieval.
 * @returns {Promise<Array>} - Array of weather summaries within the date range.
 */
const getHistoricalDataByCity = async (city, startDate) => {
  try {
    const start = new Date(startDate);
    const end = new Date(); // Default to today's date

    const summaries = await WeatherSummary.find({
      city,
      summary_date: { $gte: start, $lte: end },
    }).sort({ summary_date: -1 });

    return summaries;
  } catch (error) {
    console.error(
      `Error fetching historical data for ${city}: ${error.message}`
    );
    throw new Error("Failed to retrieve historical data.");
  }
};

/**
 * Fetches the weather summary for the given city on the current day.
 * @param {string} city - The city for which the weather summary is needed.
 * @returns {Promise<Object|null>} - Returns the summary object or null if no data found.
 */
const getWeatherSummary = async (city) => {
  const today = getStartOfDay();
  try {
    const summary = await WeatherSummary.findOne({
      city,
      summary_date: today,
    });

    if (!summary) return null;

    return {
      city: summary.city,
      date: summary.summary_date,
      avg_temp: summary.avg_temp.toFixed(2),
      max_temp: summary.max_temp,
      min_temp: summary.min_temp,
      avg_humidity: summary.avg_humidity.toFixed(2), // Changed to avg_humidity
      avg_wind_speed: summary.avg_wind_speed.toFixed(2), // Changed to avg_wind_speed
      avg_visibility: summary.avg_visibility.toFixed(2), // Changed to avg_visibility
      dominant_weather: summary.dominant_weather,
      alertTriggered: summary.alertTriggered,
    };
  } catch (error) {
    console.error(
      `Error fetching weather summary for ${city}: ${error.message}`
    );
    throw new Error("Failed to retrieve weather summary.");
  }
};

/**
 * Calculates the start of the current day (00:00:00).
 * @returns {Date} - A date object representing the start of the current day.
 */
const getStartOfDay = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

/**
 * Determines the most frequent weather condition from an array of conditions.
 * @param {string[]} weatherArray - Array of weather conditions.
 * @returns {string} - The dominant weather condition.
 */
const getDominantWeather = (weatherArray) => {
  const counts = {};
  weatherArray.forEach((weather) => {
    counts[weather] = (counts[weather] || 0) + 1;
  });
  return Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b));
};

/**
 * Updates the daily weather summary with new data.
 * @param {string} city - The city for which the weather data is being recorded.
 * @param {number} temp - The current temperature.
 * @param {number} humidity - The current humidity.
 * @param {number} windSpeed - The current wind speed.
 * @param {number} visibility - The current visibility.
 * @param {string} weather - The current weather condition (e.g., "Clouds").
 */
const updateDailySummary = async (
  city,
  temp,
  humidity,
  windSpeed,
  visibility,
  weather
) => {
  const today = getStartOfDay();
  try {
    // Find the existing summary or create a new one with initial values
    let summary = await WeatherSummary.findOne({ city, summary_date: today });
    if (summary) {
      // Manually update min and max temperatures
      summary.min_temp = Math.min(summary.min_temp, temp);
      summary.max_temp = Math.max(summary.max_temp, temp);
      summary.humidity = humidity;
      summary.wind_speed = windSpeed;
      summary.visibility = visibility;
      summary.count += 1;

      // Initialize total values if they are undefined
      summary.total_temp = summary.total_temp || 0;
      summary.total_humidity = summary.total_humidity || 0;
      summary.total_wind_speed = summary.total_wind_speed || 0;
      summary.total_visibility = summary.total_visibility || 0;

      // Update total values
      summary.total_temp += temp;
      summary.total_humidity += humidity;
      summary.total_wind_speed += windSpeed;
      summary.total_visibility += visibility;

      // Calculate averages only if count > 0
      if (summary.count > 0) {
        summary.avg_temp = summary.total_temp / summary.count;
        summary.avg_humidity = summary.total_humidity / summary.count;
        summary.avg_wind_speed = summary.total_wind_speed / summary.count;
        summary.avg_visibility = summary.total_visibility / summary.count;
      }

      // Update dominant weather condition
      summary.dominant_weather = getDominantWeather([
        ...summary.weather_conditions,
        weather,
      ]);

      // Check if alert should be triggered
      summary.alertTriggered = temp > alertThresholds.temperature;
      if (summary.alertTriggered) {
        console.log(
          `Alert: Temperature exceeded ${alertThresholds.temperature}°C in ${city}`
        );
      }
    } else {
      // Create a new summary if none exists
      summary = new WeatherSummary({
        city,
        summary_date: today,
        min_temp: temp,
        max_temp: temp,
        avg_temp: temp,
        total_temp: temp, // Initialize total values for averaging
        total_humidity: humidity, // Initialize total values for averaging
        total_wind_speed: windSpeed, // Initialize total values for averaging
        total_visibility: visibility, // Initialize total values for averaging
        avg_humidity: humidity, // Initialize average
        avg_wind_speed: windSpeed, // Initialize average
        avg_visibility: visibility, // Initialize average
        count: 1,
        weather_conditions: [weather],
        dominant_weather: weather,
        alertTriggered: temp > alertThresholds.temperature,
      });
    }

    await summary.save();
  } catch (error) {
    console.error(`Error updating summary for ${city}: ${error.message}`);
  }
};

module.exports = {
  getWeatherSummary,
  updateDailySummary,
  getHistoricalDataByCity,
};

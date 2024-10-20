import React, { useEffect, useState } from "react";
import {
  getCurrentWeather,
  getWeatherSummary,
  getHistoricalData,
  CurrentWeather,
  WeatherSummary,
  HistoricalData,
  getAlertStatus,
} from "../api/weatherApi";

type DashboardProps = {
  city: string;
};

const Dashboard: React.FC<DashboardProps> = ({ city }) => {
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(
    null
  );
  const [weatherSummary, setWeatherSummary] = useState<WeatherSummary | null>(
    null
  );
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [alertTriggered, setAlertTriggered] = useState<boolean>(false);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        const current = await getCurrentWeather(city);
        const summary = await getWeatherSummary(city);
        const historical = await getHistoricalData(city, "2024-10-19");
        const alertTriggered = await getAlertStatus(city);

        setCurrentWeather(current);
        setWeatherSummary(summary);
        setHistoricalData(historical);
        setAlertTriggered(alertTriggered.alertTriggered);
      } catch (err) {
        setError("Failed to fetch weather data. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [city]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="mt-6 p-6 bg-slate-700 rounded shadow-lg">
      <div className="flex flex-wrap -mx-2">
        {/* Current Weather Section */}
        <div className="w-full md:w-1/2 lg:w-1/3 px-2 mb-4">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Current Weather
          </h2>
          {currentWeather && (
            <div className="bg-slate-600 p-4 rounded shadow">
              <p>Temperature: {currentWeather.temperature} °C</p>
              <p>Humidity: {currentWeather.humidity}%</p>
              <p>Wind Speed: {currentWeather.wind_speed} m/s</p>
              <p>Visibility: {currentWeather.visibility} m</p>
              <p>Weather: {currentWeather.weather}</p>
              <p>Min Temp: {currentWeather.min_temp} °C</p>
              <p>Max Temp: {currentWeather.max_temp} °C</p>
            </div>
          )}
        </div>

        {/* Weather Summary Section */}
        <div className="w-full md:w-1/2 lg:w-1/3 px-2 mb-4">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Weather Summary
          </h2>
          {weatherSummary && (
            <div className="bg-slate-600 p-4 rounded shadow">
              <p>
                Average Temperature:{" "}
                {typeof weatherSummary.avg_temp === "number"
                  ? weatherSummary.avg_temp.toFixed(2)
                  : "N/A"}{" "}
                °C
              </p>
              <p>Min Temperature: {weatherSummary.min_temp} °C</p>
              <p>Max Temperature: {weatherSummary.max_temp} °C</p>
              <p>
                Average Humidity:{" "}
                {typeof weatherSummary.avg_humidity === "number"
                  ? weatherSummary.avg_humidity.toFixed(2)
                  : "N/A"}
                %
              </p>
              <p>
                Average Wind Speed:{" "}
                {typeof weatherSummary.avg_wind_speed === "number"
                  ? weatherSummary.avg_wind_speed.toFixed(2)
                  : "N/A"}{" "}
                m/s
              </p>
              <p>Dominant Weather: {weatherSummary.dominant_weather}</p>
              <p>
                Alert Triggered: {weatherSummary.alertTriggered ? "Yes" : "No"}
              </p>
            </div>
          )}
        </div>

        {/* Historical Data Section */}
        <div className="w-full lg:w-1/3 px-2 mb-4">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Historical Data
          </h2>
          {historicalData.length > 0 ? (
            <ul className="space-y-2">
              {historicalData.map((data) => (
                <li key={data._id} className="bg-slate-600 p-4 rounded shadow">
                  <p>
                    Date: {new Date(data.summary_date).toLocaleDateString()}
                  </p>
                  <p>Avg Temp: {data.avg_temp.toFixed(2)} °C</p>
                  <p>Min Temp: {data.min_temp} °C</p>
                  <p>Max Temp: {data.max_temp} °C</p>
                  <p>Humidity: {data.humidity}%</p>
                  <p>Wind Speed: {data.wind_speed} m/s</p>
                  <p>
                    Weather Conditions: {data.weather_conditions.join(", ")}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No historical data available.</p>
          )}
        </div>
        {alertTriggered && (
          <div className="text-red-700">
            Alert Triggered, Now the temperature is 35 degrees
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

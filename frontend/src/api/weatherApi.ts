export interface HistoricalData {
  _id: string;
  city: string;
  summary_date: string;
  count: number;
  avg_temp: number;
  min_temp: number;
  max_temp: number;
  total_temp: number;
  total_humidity: number;
  total_wind_speed: number;
  total_visibility: number;
  avg_humidity: number;
  avg_wind_speed: number;
  avg_visibility: number;
  humidity: number;
  wind_speed: number;
  visibility: number;
  dominant_weather: string;
  weather_conditions: string[];
  alertTriggered: boolean;
}

export interface CurrentWeather {
  city: string;
  temperature: number;
  humidity: number;
  wind_speed: number;
  visibility: number;
  weather: string;
  min_temp: number;
  max_temp: number;
}

export interface WeatherSummary {
  city: string;
  date: string;
  avg_temp: number | null;
  max_temp: number;
  min_temp: number;
  avg_humidity: number | null;
  avg_wind_speed: number | null;
  avg_visibility: string;
  dominant_weather: string;
  alertTriggered: boolean;
}

export interface AlertStatus {
  alertTriggered: boolean;
}

const BASE_URL = "http://localhost:3000/api";

export const getHistoricalData = async (
  city: string,
  startDate: string
): Promise<HistoricalData[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/history/${city}?startDate=${startDate}`
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch historical data:", error);
    throw error; // Rethrow the error for further handling
  }
};

export const getCurrentWeather = async (
  city: string
): Promise<CurrentWeather> => {
  try {
    const response = await fetch(`${BASE_URL}/current/${city}`);

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch current weather:", error);
    throw error;
  }
};

export const getWeatherSummary = async (
  city: string
): Promise<WeatherSummary> => {
  try {
    const response = await fetch(`${BASE_URL}/summary/${city}`);

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch weather summary:", error);
    throw error;
  }
};

export const getAlertStatus = async (city: string): Promise<AlertStatus> => {
  try {
    const response = await fetch(`${BASE_URL}/alert/${city}`);

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch alert status:", error);
    throw error;
  }
};

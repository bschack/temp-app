import { WeatherEndpointResponse } from "@/types/index.types";

async function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error("Geolocation is not supported by this browser."));
    }
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

export default async function GetWeatherEndpoints(): Promise<WeatherEndpointResponse> {
  try {
    const position = await getCurrentPosition();
    console.log(position);
    const response = await fetch(`https://api.weather.gov/points/${position.coords.latitude},${position.coords.longitude}`, { headers: { Accept: "application/geo+json" } });

    if (!response.ok) {
      throw new Error("Failed to fetch weather endpoints.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting weather endpoints:", error);
    throw error;
  }
}